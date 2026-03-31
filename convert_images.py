from PIL import Image
import os

def convert_image(src, dest):
    try:
        if not os.path.exists(src):
            print(f"File not found: {src}")
            return False
        with Image.open(src) as img:
            img = img.convert('RGBA')
            img.save(dest, 'PNG')
            print(f"Successfully converted {src} to {dest}")
            return True
    except Exception as e:
        print(f"Failed to convert {src}: {e}")
        return False

# Source is the same for all (the uploaded image)
src_img = "public/app_logo.jpg"
convert_image(src_img, "assets/logo.png")
convert_image(src_img, "assets/icon.png")
convert_image(src_img, "assets/icon-only.png") # Some tools look for this
convert_image(src_img, "assets/splash.png")
convert_image(src_img, "assets/splash-dark.png") # Good to have
