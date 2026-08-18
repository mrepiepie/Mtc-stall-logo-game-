"use client";

import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({ value, fontSize = 80 }: { value: number, fontSize?: number }) {
  const padding = 15;
  const height = fontSize + padding;

  return (
    <div
      style={{ fontSize }}
      className="flex space-x-3 overflow-hidden rounded-none bg-[#f4f0e6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1 leading-none font-black"
    >
      <Digit place={10} value={value} height={height} />
      <Digit place={1} value={value} height={height} />
    </div>
  );
}

function Digit({ place, value, height }: { place: number; value: number, height: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

function Number({ mv, number, height }: { mv: MotionValue; number: number, height: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
