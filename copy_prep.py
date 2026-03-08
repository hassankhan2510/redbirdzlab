import shutil
import os
from PIL import Image

# 1. Copy generated images
brain_dir = r"C:\Users\hassan\.gemini\antigravity\brain\b31827c1-b376-4435-aebc-b48745375ae7"
target_dir = r"d:\gen ai\redbirds"

images = {
    "reading_writing_art_1772910457780.png": "img_reading.png",
    "listening_speaking_art_1772910473948.png": "img_listening.png",
    "seeing_the_world_art_1772910491649.png": "img_vision.png"
}

for src_name, dst_name in images.items():
    src_path = os.path.join(brain_dir, src_name)
    dst_path = os.path.join(target_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dst_path)
        print(f"Copied {dst_name}")
    else:
        print(f"Error: Could not find {src_path}")

# 2. Crop logo to square
logo_path = os.path.join(target_dir, "logo.jpg")
logo_square_path = os.path.join(target_dir, "logo_square.jpg")

if os.path.exists(logo_path):
    img = Image.open(logo_path)
    width, height = img.size
    
    # Calculate a center square crop
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    
    img_cropped = img.crop((left, top, right, bottom))
    img_cropped.save(logo_square_path)
    print(f"Cropped logo to square: {min_dim}x{min_dim}")
else:
    print("Error: Could not find logo.jpg")
