import os
import sys
import numpy as np
from PIL import Image

input_path = r'C:/Users/Eng Abdullrahman/.gemini/antigravity/brain/c6c3d1c5-4740-436a-81aa-7d0272ac68d5/.user_uploaded/media_1794331907431_a5447127.jpg'

def try_rembg():
    try:
        from rembg import remove
        print("Using rembg for neural background removal...")
        with open(input_path, 'rb') as f:
            input_bytes = f.read()
        output_bytes = remove(input_bytes)
        with open('desktop-admin/build/rembg_out.png', 'wb') as f:
            f.write(output_bytes)
        print("rembg succeeded!")
        return True
    except Exception as e:
        print("rembg failed:", e)
        return False

def try_opencv():
    import cv2
    print("Using OpenCV advanced matting...")
    img = cv2.imread(input_path)
    h, w = img.shape[:2]
    
    # Convert to HSV and Lab
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    
    # Background is dark grey with low saturation and L < ~80
    # Orange parts: H: [8, 30], S: [70, 255], V: [100, 255]
    orange_mask = cv2.inRange(hsv, np.array([5, 80, 100]), np.array([30, 255, 255]))
    
    # Chrome / silver parts: high value (bright reflections) V > 100, or in Lab L > 95
    chrome_mask = cv2.inRange(lab, np.array([95, 115, 115]), np.array([255, 140, 140]))
    
    # Also in text "AUTO SPARE PARTS": values > 90
    combined = cv2.bitwise_or(orange_mask, chrome_mask)
    
    # Morphological clean up
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel)
    
    # Save test mask
    cv2.imwrite('desktop-admin/build/opencv_mask.png', cleaned)
    print("OpenCV mask generated.")

if __name__ == '__main__':
    if not try_rembg():
        try_opencv()
