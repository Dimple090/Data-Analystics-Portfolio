import os
from PIL import Image, ImageEnhance

def process_profile_photo():
    input_path = r"C:\Users\HP\Downloads\Photo_optimized_1000.jpg"
    output_path = r"c:\Users\HP\OneDrive\Desktop\Data Analyst Portfolio\photo.png"
    
    if not os.path.exists(input_path):
        print(f"Error: Input photo not found at {input_path}")
        return
        
    print(f"Loading image from {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    
    # Process pixels to make the white background transparent
    print("Removing white background...")
    pixels = img.load()
    width, height = img.size
    
    # We will use a simple threshold to make near-white pixels transparent.
    # Since the background is clean white, a threshold of 245 works beautifully.
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r > 245 and g > 245 and b > 245:
                pixels[x, y] = (0, 0, 0, 0)
                
    # Crop the image slightly from the sides to focus on the portrait
    # The original size is large, let's crop 10% from left/right if needed or keep it centered.
    # Dimple is already centered, so we can keep it as is.
    
    # Apply warm desaturation
    print("Applying styling filters (warm desaturation)...")
    # 1. Reduce saturation to 20% (semi-monochrome executive style)
    color_enhancer = ImageEnhance.Color(img)
    img = color_enhancer.enhance(0.25)
    
    # 2. Boost contrast slightly for dramatic lighting
    contrast_enhancer = ImageEnhance.Contrast(img)
    img = contrast_enhancer.enhance(1.15)
    
    # 3. Tone down brightness slightly to blend into dark backgrounds
    brightness_enhancer = ImageEnhance.Brightness(img)
    img = brightness_enhancer.enhance(0.95)
    
    # Save output
    img.save(output_path, "PNG")
    print(f"Success! Processed image saved to {output_path}")

if __name__ == "__main__":
    process_profile_photo()
