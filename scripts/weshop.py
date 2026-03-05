"""
WeShopAI Virtual Try-On - Python Wrapper

Usage:
    pip install gradio-client requests

    from weshop_tryon import WeShopTryOn

    client = WeShopTryOn()
    result_path = client.try_on(
        garment_path="garment.jpg",
        person_path="person.jpg",
        output_path="result.jpg",  # optional
    )

CLI:
    python weshop_tryon.py garment.jpg person.jpg -o result.jpg
    python weshop_tryon.py --info
"""

import sys
import json
import time
from pathlib import Path


def _require(package: str, install_name: str | None = None):
    import importlib
    try:
        return importlib.import_module(package)
    except ImportError:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", install_name or package, "-q"])
        return importlib.import_module(package)


def _guess_mime(path: Path) -> str:
    return {
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png":  "image/png",
        ".webp": "image/webp",
        ".gif":  "image/gif",
    }.get(path.suffix.lower(), "image/png")


def _make_image_data(path: Path) -> dict:
    """
    Build the ImageData dict the updated API expects.
    
    The API schema requires:
      { path, url, size, orig_name, mime_type, is_stream, meta }
    Either `path` (local file) or `url` must be provided.
    """
    return {
        "path":      str(path),
        "url":       None,
        "size":      path.stat().st_size,
        "orig_name": path.name,
        "mime_type": _guess_mime(path),
        "is_stream": False,
        "meta":      {"_type": "gradio.FileData"},
    }


class WeShopTryOn:
    SPACE    = "WeShopAI/WeShopAI-Virtual-Try-On"
    ENDPOINT = "/generate_image"

    def __init__(self, hf_token: str | None = None, verbose: bool = True):
        self.verbose   = verbose
        self.hf_token  = hf_token
        self._client   = None

    def _log(self, msg: str):
        if self.verbose:
            print(msg)

    def _get_client(self):
        if self._client is None:
            Client = _require("gradio_client", "gradio-client").Client
            self._log(f"⏳ Connecting to {self.SPACE} ...")
            kwargs = {"hf_token": self.hf_token} if self.hf_token else {}
            self._client = Client(self.SPACE, **kwargs)
            self._log("✅ Connected.")
        return self._client

    def print_api_info(self):
        """Print the live API schema for the Space."""
        client = self._get_client()
        print("\n=== API Info ===")
        try:
            info = client.view_api(return_format="dict")
            print(json.dumps(info, indent=2, default=str))
        except Exception as e:
            print(f"Could not fetch structured API info: {e}")
            client.view_api()

    def try_on(
        self,
        garment_path: str | Path,
        person_path:  str | Path,
        output_path:  str | Path | None = None,
        max_retries:  int   = 3,
        retry_delay:  float = 10.0,
    ) -> Path:
        """
        Run virtual try-on.

        Args:
            garment_path:  Path to the garment image  → sent as `main_image`.
            person_path:   Path to the person image   → sent as `background_image`.
            output_path:   Where to save the result (default: result_<timestamp>.png).
            max_retries:   How many times to retry if the model is busy.
            retry_delay:   Seconds between retries.

        Returns:
            Path to the saved result image.
        """
        garment = Path(garment_path)
        person  = Path(person_path)

        if not garment.exists():
            raise FileNotFoundError(f"Garment image not found: {garment}")
        if not person.exists():
            raise FileNotFoundError(f"Person image not found: {person}")

        if output_path is None:
            output_path = Path(f"result_{int(time.time())}.png")
        output_path = Path(output_path)

        client = self._get_client()

        # Build ImageData dicts matching the updated API schema:
        #   main_image       = person  (the model/person to dress)
        #   background_image = garment (the clothing item — labelled "Background reference image" in the API)
        main_image_data       = _make_image_data(person)
        background_image_data = _make_image_data(garment)

        self._log(f"\n📤 main_image (person)          → {person.name}")
        self._log(f"📤 background_image (garment)   → {garment.name}")

        for attempt in range(1, max_retries + 1):
            self._log(f"\n🚀 Attempt {attempt}/{max_retries} ...")
            try:
                result = client.predict(
                    main_image=main_image_data,
                    background_image=background_image_data,
                    api_name=self.ENDPOINT,
                )
                self._log(f"\n📦 Raw result type : {type(result)}")
                self._log(f"📦 Raw result value: {result}")
                return self._save_result(result, output_path)

            except Exception as e:
                self._log(f"⚠️  Error on attempt {attempt}: {e}")
                if attempt < max_retries:
                    self._log(f"⏳ Waiting {retry_delay}s before retry ...")
                    time.sleep(retry_delay)
                else:
                    raise

    def _save_result(self, result, output_path: Path) -> Path:
        """Extract the image URL/path from the result dict and save it."""
        requests = _require("requests")

        # The API returns an ImageData dict; for outputs `path` is always provided
        # (a local temp file written by the gradio client).
        image_source = None

        if isinstance(result, dict):
            # Prefer the local temp path the client already downloaded
            image_source = result.get("path") or result.get("url")
        elif isinstance(result, str):
            image_source = result
        elif isinstance(result, (list, tuple)) and result:
            first = result[0]
            if isinstance(first, dict):
                image_source = first.get("path") or first.get("url")
            elif isinstance(first, str):
                image_source = first

        if not image_source:
            raise ValueError(
                f"Cannot extract image from result: {result!r}\n"
                "Run .print_api_info() to inspect the current API schema."
            )

        self._log(f"📥 Image source: {image_source}")

        if image_source.startswith("http"):
            self._log("⬇️  Downloading from URL ...")
            resp = requests.get(image_source, timeout=60)
            resp.raise_for_status()
            output_path.write_bytes(resp.content)
        else:
            import shutil
            src = Path(image_source)
            if not src.exists():
                raise FileNotFoundError(f"Local result file not found: {src}")
            shutil.copy(src, output_path)

        self._log(f"🎉 Saved → {output_path.resolve()}")
        return output_path


# ------------------------------------------------------------------
# CLI
# ------------------------------------------------------------------

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="WeShopAI Virtual Try-On CLI")
    parser.add_argument("garment", nargs="?", help="Path to garment image (main_image)")
    parser.add_argument("person",  nargs="?", help="Path to person image (background_image)")
    parser.add_argument("-o", "--output", help="Output path (default: result_<ts>.png)")
    parser.add_argument("--token", help="Hugging Face token (if Space is private)")
    parser.add_argument("--info",  action="store_true", help="Print live API info and exit")
    args = parser.parse_args()

    tryon = WeShopTryOn(hf_token=args.token)

    if args.info or (not args.garment and not args.person):
        tryon.print_api_info()
        sys.exit(0)

    if not args.garment or not args.person:
        parser.error("Both garment and person image paths are required.")

    result = tryon.try_on(
        garment_path=args.garment,
        person_path=args.person,
        output_path=args.output,
    )
    print(f"\n✅ Done! Result saved to: {result}")