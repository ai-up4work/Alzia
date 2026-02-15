"""
WeShopAI Virtual Try-On API Script
Uses Gradio Client to interact with the WeShopAI Virtual Try-On Space
"""

from gradio_client import Client, handle_file
from PIL import Image
import os
import shutil

def virtual_tryon(garment_image_path, person_image_path, output_path="result.png"):
    """
    Perform virtual try-on using WeShopAI Space
    
    Args:
        garment_image_path: Path to the garment/clothing image
        person_image_path: Path to the person/model image
        output_path: Path to save the result image (default: result.png)
    
    Returns:
        Path to the generated result image
    """
    
    print("Connecting to WeShopAI Virtual Try-On Space...")
    
    # Initialize the Gradio client
    client = Client("WeShopAI/WeShopAI-Virtual-Try-On")
    
    print("Uploading images and generating result...")
    print(f"Garment: {garment_image_path}")
    print(f"Person: {person_image_path}")
    
    try:
        # Call the prediction API
        # The WeShopAI space expects the garment image first, then the person image
        result = client.predict(
            main_image=handle_file(garment_image_path),  # Garment image
            background_image=handle_file(person_image_path),  # Person image
            api_name="/generate_image"
        )
        
        print(f"✅ Generation successful!")
        
        # The result is a tuple, the first element contains the output
        # It could be either a file path string or a dict with 'path' key
        if isinstance(result, tuple) and len(result) > 0:
            output_data = result[0]
            
            # Handle different return formats
            if isinstance(output_data, dict) and 'path' in output_data:
                temp_image_path = output_data['path']
            elif isinstance(output_data, str):
                temp_image_path = output_data
            else:
                temp_image_path = output_data
            
            # Copy/move the result to the desired output path
            if temp_image_path and os.path.exists(temp_image_path):
                # Open and save the image to ensure it's saved in the right format
                img = Image.open(temp_image_path)
                img.save(output_path)
                print(f"Result saved to: {output_path}")
                return output_path
            else:
                print(f"❌ Temporary file not found: {temp_image_path}")
                return None
        else:
            print("❌ Unexpected result format")
            print(f"Result: {result}")
            return None
            
    except Exception as e:
        print(f"❌ Error during generation: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def batch_virtual_tryon(garment_paths, person_paths, output_dir="outputs"):
    """
    Perform virtual try-on for multiple combinations
    
    Args:
        garment_paths: List of garment image paths
        person_paths: List of person image paths
        output_dir: Directory to save results
    
    Returns:
        List of generated image paths
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    
    for i, garment in enumerate(garment_paths):
        for j, person in enumerate(person_paths):
            output_name = f"result_g{i+1}_p{j+1}.png"
            output_path = os.path.join(output_dir, output_name)
            
            print(f"\n{'='*50}")
            print(f"Processing combination {len(results)+1}: Garment {i+1} x Person {j+1}")
            print(f"{'='*50}")
            
            result = virtual_tryon(garment, person, output_path)
            
            if result:
                results.append(result)
            
    return results


# Example usage
if __name__ == "__main__":
    
    # Example 1: Single try-on
    print("Example 1: Single Virtual Try-On")
    print("-" * 50)
    
    # Replace these with your actual image paths
    garment_img = r"E:\Business\up4work\Alzia\public\tryon\arabic-attire-women-muslim-womens-embroidery-beads-abaya-green_eea6155b-ce48-42b8-a2dd-697cd9d08d77_800x.jpg"
    person_img = r"E:\Business\up4work\Alzia\public\tryon\1_0e063bd5-b164-4100-a568-634918f8a1a3.webp"
    
    # Check if example files exist
    if os.path.exists(garment_img) and os.path.exists(person_img):
        result = virtual_tryon(
            garment_image_path=garment_img,
            person_image_path=person_img,
            output_path="single_result.png"
        )
    else:
        print("⚠️  Please update the image paths in the script with your actual files")
        print("Example paths:")
        print(f"  garment_img = 'clothing.jpg'")
        print(f"  person_img = 'model.jpg'")
    
    
    # Example 2: Batch processing (commented out by default)
    """
    print("\n\nExample 2: Batch Virtual Try-On")
    print("-" * 50)
    
    garments = [
        "garment1.jpg",
        "garment2.jpg",
    ]
    
    people = [
        "person1.jpg",
        "person2.jpg",
    ]
    
    results = batch_virtual_tryon(garments, people, output_dir="batch_results")
    
    print(f"\n✅ Batch processing complete! Generated {len(results)} images")
    """
    
    print("\n" + "="*50)
    print("Script completed!")
    print("="*50)