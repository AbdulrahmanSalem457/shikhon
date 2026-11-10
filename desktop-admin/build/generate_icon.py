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
    
    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=512,512",
        "--force-device-scale-factor=1",
        f"--screenshot={png_file}",
        html_url
    ]
    
    print("Running Edge screenshot...")
    subprocess.run(cmd, check=True)
    
    if not os.path.exists(png_file):
        print("Screenshot failed")
        sys.exit(1)
        
    print(f"Opening {png_file}...")
    img = Image.open(png_file).convert("RGBA")
    
    # Save standard icon.ico with all Windows sizes
    icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    img.save(ico_file, format="ICO", sizes=icon_sizes)
    print(f"Generated {ico_file} successfully!")
    
    # Also save 256x256 PNG for Electron Linux/Window icon
    png_256 = os.path.join(script_dir, "icon.png")
    img.resize((256, 256), Image.Resampling.LANCZOS).save(png_256)
    print(f"Generated {png_256} successfully!")
    
    # Also copy to electron/ directory
    electron_dir = os.path.join(os.path.dirname(script_dir), "electron")
    electron_ico = os.path.join(electron_dir, "icon.ico")
    electron_png = os.path.join(electron_dir, "icon.png")
    img.save(electron_ico, format="ICO", sizes=icon_sizes)
    img.resize((256, 256), Image.Resampling.LANCZOS).save(electron_png)
    print("Copied icons to electron/ directory!")

if __name__ == "__main__":
    generate()
