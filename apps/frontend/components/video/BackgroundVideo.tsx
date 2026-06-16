'use client';

import { useEffect, useRef, useCallback } from 'react';

interface BackgroundVideoProps {
  src: string;
  className?: string;
  shiftDown?: boolean;
}

export default function BackgroundVideo({ src, className = '', shiftDown = false }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const fadingOutRef = useRef(false);

  const animateOpacity = useCallback((target: number, duration: number, onComplete?: () => void) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start = performance.now();
    const from = opacityRef.current;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = from + (target - from) * progress;
      opacityRef.current = value;
      if (videoRef.current) videoRef.current.style.opacity = String(value);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else if (onComplete) {
        onComplete();
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      video.play().catch(() => {});
      animateOpacity(1, 500);
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        animateOpacity(0, 500);
      }
    };

    const onEnded = () => {
      fadingOutRef.current = false;
      opacityRef.current = 0;
      if (video) video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        animateOpacity(1, 500);
      }, 100);
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [src, animateOpacity]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      autoPlay
      playsInline
      preload="auto"
      className={`absolute inset-0 h-full w-full object-cover ${shiftDown ? 'translate-y-[17%]' : 'object-bottom'} ${className}`}
      style={{ opacity: 0 }}
    />
  );
}
