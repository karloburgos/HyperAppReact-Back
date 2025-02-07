import { useEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement>() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const elementRef = useRef<T>(null);
  const frameRef = useRef<number>();
  const observerRef = useRef<ResizeObserver>();
  const lastSize = useRef<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateSize = (width: number, height: number) => {
      if (width !== lastSize.current.width || height !== lastSize.current.height) {
        lastSize.current = { width, height };
        setSize({ width, height });
      }
    };

    let isUpdating = false;

    observerRef.current = new ResizeObserver((entries) => {
      if (isUpdating) return;
      isUpdating = true;

      const entry = entries[0];
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (entry) {
          const { width, height } = entry.contentRect;
          updateSize(width, height);
        }
        isUpdating = false;
      });
    });

    // Initial size
    const { width, height } = element.getBoundingClientRect();
    updateSize(width, height);

    observerRef.current.observe(element);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref: elementRef, ...size };
}