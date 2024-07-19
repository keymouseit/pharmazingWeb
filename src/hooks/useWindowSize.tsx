"use client";

import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({
        width,
        height: window.innerHeight,
        isMobile: width < 576,
        isTablet: width >= 576 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
