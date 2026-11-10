import os
import cv2
import numpy as np
from PIL import Image

input_path = r'C:/Users/Eng Abdullrahman/.gemini/antigravity/brain/c6c3d1c5-4740-436a-81aa-7d0272ac68d5/.user_uploaded/media_1794331907431_a5447127.jpg'

def build_assets():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(os.path.dirname(script_dir))
    
    img = cv2.imread(input_path)
    h, w, c = img.shape
    
    # 1. Background plate interpolation
    tl = img[5, 5].astype(np.float32)
    tr = img[5, w-6].astype(np.float32)
    bl = img[h-6, 5].astype(np.float32)
    br = img[h-6, w-6].astype(np.float32)

    y_coords = np.linspace(0, 1, h)[:, None, None]
    x_coords = np.linspace(0, 1, w)[None, :, None]

    top = tl * (1 - x_coords) + tr * x_coords
    bottom = bl * (1 - x_coords) + br * x_coords
    bg_plate = top * (1 - y_coords) + bottom * y_coords

    diff = np.linalg.norm(img.astype(np.float32) - bg_plate, axis=2)
    b, g, r = cv2.split(img.astype(np.float32))
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    metric = diff + sat * 0.85

    t_low = 36.0
    t_high = 56.0
    alpha = np.clip((metric - t_low) / (t_high - t_low), 0.0, 1.0)

    # Connected components to remove specs
    bin_mask = (alpha > 0.1).astype(np.uint8)
    nb_components, output, stats, _ = cv2.connectedComponentsWithStats(bin_mask, connectivity=8)
    sizes = stats[1:, -1]
    nb_components = nb_components - 1

    cleaned_mask = np.zeros_like(bin_mask)
    for i in range(nb_components):
        if sizes[i] >= 25:
            cleaned_mask[output == i + 1] = 1

    alpha = alpha * cleaned_mask

    # Color unmixing
    alpha_3d = alpha[:, :, None]
    fg = np.where(alpha_3d > 0.02, np.clip((img.astype(np.float32) - bg_plate * (1.0 - alpha_3d)) / np.maximum(alpha_3d, 0.15), 0, 255), 0)

    out_rgba = np.dstack([fg.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    
    pil_full = Image.fromarray(cv2.cvtColor(out_rgba, cv2.COLOR_BGRA2RGBA))
    bbox = pil_full.getbbox()
    
    # Crop to content with small breathing padding (16px)
    pad = 16
    crop_box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
    logo_full = pil_full.crop(crop_box)
    
    # Symbol only (Car + Gear + Piston, above the text)
    # The gap between symbol and text is around Y=238 in original image
    symbol_box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), 242)
    logo_symbol = pil_full.crop(symbol_box)
    
    # Save base transparent PNGs
    full_png = os.path.join(script_dir, "shikhon_logo.png")
    symbol_png = os.path.join(script_dir, "shikhon_symbol.png")
    logo_full.save(full_png, "PNG")
    logo_symbol.save(symbol_png, "PNG")
    print(f"Saved {full_png} ({logo_full.size}) and {symbol_png} ({logo_symbol.size})")

    # Generate 512x512 square icons with the full logo and symbol
    # For Windows App icon and Shortcut: use full logo centered in 512x512
    max_d = max(logo_full.width, logo_full.height)
    square_canvas = Image.new("RGBA", (max_d + 30, max_d + 30), (0, 0, 0, 0))
    offset = ((max_d + 30 - logo_full.width) // 2, (max_d + 30 - logo_full.height) // 2)
    square_canvas.paste(logo_full, offset)
    icon_512 = square_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    icon_256 = square_canvas.resize((256, 256), Image.Resampling.LANCZOS)
    
    ico_path = os.path.join(script_dir, "icon.ico")
    icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    icon_512.save(ico_path, format="ICO", sizes=icon_sizes)
    icon_512.save(os.path.join(script_dir, "icon.png"), "PNG")
    print(f"Saved {ico_path} successfully!")

    # Destinations to update
    dests = [
        os.path.join(root_dir, "desktop-admin", "electron"),
        os.path.join(root_dir, "desktop-admin", "public"),
        os.path.join(root_dir, "desktop-admin", "src", "renderer", "assets"),
        os.path.join(root_dir, "web-showcase", "public"),
        os.path.join(root_dir, "web-showcase", "src", "assets"),
    ]

    for d in dests:
        os.makedirs(d, exist_ok=True)
        # copy files
        logo_full.save(os.path.join(d, "shikhon-logo.png"), "PNG")
        logo_symbol.save(os.path.join(d, "shikhon-symbol.png"), "PNG")
        icon_512.save(os.path.join(d, "icon.png"), "PNG")
        icon_512.save(os.path.join(d, "favicon.ico"), format="ICO", sizes=icon_sizes)
        if os.path.basename(d) == "electron":
            icon_512.save(os.path.join(d, "icon.ico"), format="ICO", sizes=icon_sizes)
            
    print("All asset directories updated with new transparent logo & icons!")

if __name__ == '__main__':
    build_assets()
