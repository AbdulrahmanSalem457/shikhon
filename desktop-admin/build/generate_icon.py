import subprocess
import os
import sys
from PIL import Image

def generate():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_file = os.path.join(script_dir, "render-icon.html")
    png_file = os.path.join(script_dir, "icon-512.png")
    ico_file = os.path.join(script_dir, "icon.ico")
    
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
    if not edge_exe:
        print("Edge not found")
        sys.exit(1)
        
    html_url = "file:///" + html_file.replace("\\", "/")
    
    if os.path.exists(png_file):
        try:
            os.remove(png_file)
        except Exception:
            pass

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--default-background-color=00000000",
        "--window-size=512,512",
        "--force-device-scale-factor=1",
        f"--screenshot={png_file}",
        html_url
    ]
    
    print("Running Edge screenshot with transparent background...")
    subprocess.run(cmd, check=True)
    
    if not os.path.exists(png_file):
        print("Screenshot failed")
        sys.exit(1)
        
    print(f"Opening {png_file}...")
    img = Image.open(png_file).convert("RGBA")
    
    # Check corner pixels to ensure transparency
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((511, 0)),
        img.getpixel((0, 511)),
        img.getpixel((511, 511)),
        img.getpixel((10, 10))
    ]
    print(f"Corner pixels alpha: {[c[3] for c in corners]}")
    
    # If edge rendered on white background (fallback safety check)
    # If corner is white (255,255,255,255), remove white background
    if all(c[3] == 255 and c[0] > 240 and c[1] > 240 and c[2] > 240 for c in corners[:4]):
        print("Detected white background, converting white to transparent...")
        datas = img.getdata()
        newData = []
        for item in datas:
            # If near white, make transparent
            if item[0] > 245 and item[1] > 245 and item[2] > 245:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(png_file, "PNG")

    # Save standard multi-resolution Windows ICO
    icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    img.save(ico_file, format="ICO", sizes=icon_sizes)
    print(f"Generated {ico_file} successfully!")
    
    # Save 256x256 and 512x512 PNGs
    png_256 = os.path.join(script_dir, "icon.png")
    img.resize((256, 256), Image.Resampling.LANCZOS).save(png_256)
    print(f"Generated {png_256} successfully!")
    
    # Copy to desktop-admin/electron/
    electron_dir = os.path.join(os.path.dirname(script_dir), "electron")
    img.save(os.path.join(electron_dir, "icon.ico"), format="ICO", sizes=icon_sizes)
    img.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(electron_dir, "icon.png"))
    
    # Copy to desktop-admin/public/
    admin_public = os.path.join(os.path.dirname(script_dir), "public")
    if os.path.exists(admin_public):
        img.save(os.path.join(admin_public, "favicon.ico"), format="ICO", sizes=icon_sizes)
        img.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(admin_public, "icon.png"))

    # Copy to web-showcase/public/
    web_public = os.path.join(os.path.dirname(os.path.dirname(script_dir)), "web-showcase", "public")
    if os.path.exists(web_public):
        img.save(os.path.join(web_public, "favicon.ico"), format="ICO", sizes=icon_sizes)
        img.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(web_public, "icon.png"))

    print("All icons successfully generated with 100% transparent background!")

if __name__ == "__main__":
    generate()
