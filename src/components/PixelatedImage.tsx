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
    
    // Use direct src since we now encode logos as base64 data URIs
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      setImgElement(img);
      if (onLoad) onLoad();
    };
    img.onerror = () => {
      console.error('Failed to load image', src.substring(0, 50));
    }
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

    // Add a blur filter BEFORE drawing to the offscreen canvas to obscure solid blocks (like Microsoft logo)
    if (pixelSize > 2) {
      offscreenCtx.filter = `blur(${Math.min(pixelSize, 8)}px)`;
    }
    
    // Draw the image scaled down
    offscreenCtx.drawImage(imgElement, 0, 0, scaledWidth, scaledHeight);

    // Turn off smoothing to keep the sharp pixel edges
    ctx.imageSmoothingEnabled = false;
    ctx.filter = 'none';

    // Draw the scaled-down image back to the main canvas, scaling it up
    ctx.drawImage(offscreen, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

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
