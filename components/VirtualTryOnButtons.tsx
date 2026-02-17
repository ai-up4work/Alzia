"use client";

import { useState } from "react";
import {
  Download,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Info,
  Loader2,
  Smartphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Convert base64 data URL to a File object for native sharing
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// Copy image to clipboard using Clipboard API
async function copyImageToClipboard(base64: string): Promise<void> {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  const blob = new Blob([u8arr], { type: mime });
  await navigator.clipboard.write([
    new ClipboardItem({ [mime]: blob }),
  ]);
}

// ─── Split Button ─────────────────────────────────────────────────────────────

interface SplitActionButtonProps {
  label: string;
  filename: string;
  imageBase64?: string;
  onDownload: () => void;
  variant?: "primary" | "outline";
}

function SplitActionButton({
  label,
  filename,
  imageBase64,
  onDownload,
  variant = "primary",
}: SplitActionButtonProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const canNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;
  const canClipboard =
    typeof navigator !== "undefined" && !!navigator.clipboard?.write;

  // Native share — works on mobile, shares actual image file
  const handleNativeShare = async () => {
    if (!imageBase64) return;
    setSharing(true);
    try {
      const file = base64ToFile(imageBase64, filename);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Virtual Try-On",
          text: "Check out my virtual try-on result!",
          files: [file],
        });
      } else {
        // canShare said no — fall back to sharing without files
        await navigator.share({
          title: "My Virtual Try-On",
          text: "Check out my virtual try-on result!",
        });
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setSharing(false);
    }
  };

  // Copy image bytes to clipboard — paste into any app
  const handleCopyImage = async () => {
    if (!imageBase64) return;
    try {
      await copyImageToClipboard(imageBase64);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isPrimary = variant === "primary";

  return (
    <div
      className={`inline-flex rounded-full border overflow-hidden shadow-sm ${
        isPrimary
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-900 border-gray-300"
      }`}
    >
      {/* Left half — Download */}
      <button
        onClick={onDownload}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${
          isPrimary ? "hover:bg-gray-800" : "hover:bg-gray-50"
        }`}
      >
        <Download className="w-4 h-4" />
        {label}
      </button>

      {/* Divider */}
      <div
        className={`w-px self-stretch ${
          isPrimary ? "bg-white/20" : "bg-gray-300"
        }`}
      />

      {/* Right half — Share */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors outline-none focus:outline-none ${
              isPrimary ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            {sharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            Share
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-gray-800">Share {label}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Image is shared directly — never uploaded
            </p>
          </div>
          <DropdownMenuSeparator />

          {/* Native share — mobile only, shares actual image */}
          {canNativeShare && (
            <DropdownMenuItem
              onClick={handleNativeShare}
              className="cursor-pointer"
              disabled={sharing}
            >
              <Smartphone className="w-4 h-4 mr-2 text-purple-600" />
              <div>
                <p className="text-sm">Share Image…</p>
                <p className="text-xs text-gray-400">
                  Opens your device share sheet
                </p>
              </div>
            </DropdownMenuItem>
          )}

          {/* Copy image to clipboard */}
          {canClipboard && (
            <DropdownMenuItem
              onClick={handleCopyImage}
              className="cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-600">Image Copied!</p>
                    <p className="text-xs text-gray-400">Paste into any app</p>
                  </div>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm">Copy Image</p>
                    <p className="text-xs text-gray-400">
                      Paste into WhatsApp, Instagram…
                    </p>
                  </div>
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Fallback if neither is available */}
          {!canNativeShare && !canClipboard && (
            <div className="px-3 py-2 text-xs text-gray-500">
              Download the image and share it manually from your device.
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Nudge to download first then share */}
          <div className="px-3 py-2 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Download the image first, then share from your camera roll for the best experience on all platforms.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface VirtualTryOnButtonsProps {
  onDownloadResult: () => void;
  onDownloadComparison?: () => void;
  hasComparison?: boolean;
  onReset: () => void;
  resultImageBase64?: string;
  comparisonImageBase64?: string;
}

export function VirtualTryOnButtons({
  onDownloadResult,
  onDownloadComparison,
  hasComparison = false,
  onReset,
  resultImageBase64,
  comparisonImageBase64,
}: VirtualTryOnButtonsProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <SplitActionButton
          label="Download Result"
          filename="virtual-tryon-result.png"
          imageBase64={resultImageBase64}
          onDownload={onDownloadResult}
          variant="primary"
        />

        {hasComparison && onDownloadComparison && (
          <SplitActionButton
            label="Comparison"
            filename="virtual-tryon-comparison.png"
            imageBase64={comparisonImageBase64}
            onDownload={onDownloadComparison}
            variant="outline"
          />
        )}

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Try Another
        </button>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">
              Important: Download Your Result
            </p>
            <p className="text-xs text-amber-700">
              We don't store your images for privacy. Please download your
              result before leaving this page or starting a new try-on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}