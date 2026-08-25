'use client';
import { useEffect, useRef, useState } from 'react';

interface PixelatedImageProps {
  src: string;
  pixelSize: number; // e.g., 20 means very blocky, 1 means clear
  className?: string;
  onLoad?: () => void;
}

export function PixelatedImage({ src, pixelSize, className, onLoad }: PixelatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    setImgElement(null);
    const img = new Image();
    // ALWAYS attach handlers before setting src to prevent cache race conditions!
    img.onload = () => {
      setImgElement(img);
      if (onLoad) onLoad();
    };
    img.onerror = () => {
      console.error('Failed to load image', src.substring(0, 50));
    }
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (!imgElement) {
      // CLEAR THE CANVAS ENTIRELY to prevent ghosting!
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Set canvas dimensions
    const width = imgElement.width || 300;
    const height = imgElement.height || 300;
    canvas.width = width;
    canvas.height = height;
    
    // Fill main canvas with white to prevent transparent pixels blending into black
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    if (pixelSize <= 1) {
      // Draw normal
      ctx.imageSmoothingEnabled = true;
      ctx.filter = 'none';
      ctx.drawImage(imgElement, 0, 0, width, height);
      return;
    }

    const blocksTarget = Math.max(4, Math.floor(150 / pixelSize));
    
    const ratio = width / height;
    let scaledWidth = blocksTarget;
    let scaledHeight = blocksTarget;
    
    if (ratio > 1) {
      scaledHeight = Math.max(1, Math.round(blocksTarget / ratio));
    } else {
      scaledWidth = Math.max(1, Math.round(blocksTarget * ratio));
    }

    // Create an offscreen canvas to scale down
    const offscreen = document.createElement('canvas');
    offscreen.width = scaledWidth;
    offscreen.height = scaledHeight;
    const offscreenCtx = offscreen.getContext('2d');
    if (!offscreenCtx) return;

    // Fill offscreen canvas with white for the same reason
    offscreenCtx.fillStyle = '#FFFFFF';
    offscreenCtx.fillRect(0, 0, scaledWidth, scaledHeight);

    // Draw the image scaled down
    offscreenCtx.drawImage(imgElement, 0, 0, scaledWidth, scaledHeight);

    // Turn off smoothing to keep the sharp pixel edges
    ctx.imageSmoothingEnabled = false;
    ctx.filter = 'none';

    // Draw the scaled-down image back to the main canvas, scaling it up
    ctx.drawImage(offscreen, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

    // Draw grid overlay to enforce the "pixelated" look even on solid square logos
    if (pixelSize > 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Very light grid
      const blockWidth = width / scaledWidth;
      const blockHeight = height / scaledHeight;
      
      for (let x = 0; x < width; x += blockWidth) {
        ctx.fillRect(x, 0, 1, height);
      }
      for (let y = 0; y < height; y += blockHeight) {
        ctx.fillRect(0, y, width, 1);
      }
    }

  }, [imgElement, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`max-w-full h-auto object-contain bg-white rounded-xl shadow-lg border-2 border-slate-200 ${className || ''}`}
      style={{
        imageRendering: 'pixelated', // Hint for CSS scaling
      }}
    />
  );
}
