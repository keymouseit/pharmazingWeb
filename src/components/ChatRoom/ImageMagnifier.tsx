"use client";

import Image from "next/image";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Lottie from "lottie-react";
import animationShow from "@/assets/animations/text-show.json";
import animationHide from "@/assets/animations/text-hide.json";
import { I, P } from "@/assets/svg";
import { Fade } from "react-awesome-reveal";

const ImageMagnifier = ({
  src,
  width,
  height,
  alt,
  zoomLevel = 1.5,
  caption,
  showText,
  toggleText,
  onMouseEnter,
  onMouseLeave,
  iconAnimDirection,
  iconDuration,
  showTextAnimation,
  hideTextAnimation,
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
  zoomLevel?: number;
  caption: string;
  showText: boolean;
  toggleText: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  iconAnimDirection: "fadeIn" | "fadeOut";
  iconDuration: {
    duration: number;
  };
  showTextAnimation: boolean;
  hideTextAnimation: boolean;
}) => {
  const [[x, y], setXY] = useState<number[]>([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState<number[]>([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: x, y: y });
  const [backgroundPosition, setBackgroundPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width:0, height: 0 });
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  
  useLayoutEffect(() => {
    if (targetRef.current) {
      const { width, height } = targetRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = 1080 / 1920;
      const maxWidth: number = dimensions.width * 0.4;

      let calculatedImageWidth: number = maxWidth * 0.8;
      let calculatedImageHeight: number = calculatedImageWidth / aspectRatio;

      setImageWidth(calculatedImageWidth);
      setImageHeight(calculatedImageHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dimensions]);

  return (
    <div className="flex justify-around items-center w-full" ref={targetRef}>
      <div className="flex w-[40%] justify-center overflow-hidden">
        <Image
          src={src}
          width={imageWidth}
          height={imageHeight}
          style={{ cursor: "pointer" }}
          onLoad={(e) => {
            const elem = e.currentTarget;
            const { width, height } = elem.getBoundingClientRect();
            setSize([width, height]);
          }}
          onMouseEnter={() => {
            setShowMagnifier(true);
          }}
          onMouseMove={(e) => {
            onMouseEnter();
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            setXY([x, y]);
            let newPX = pointerPosition.x;
            let newPY = pointerPosition.y;
            if (
              x + (imgWidth * 0.4) / 2 <= imgWidth &&
              x - (imgWidth * 0.4) / 2 >= -5
            ) {
              newPX = x - (imgWidth * 0.4) / 2;
            } else {
              if (!(x + (imgWidth * 0.4) / 2 <= imgWidth)) {
                newPX = imgWidth * 0.6;
              }
              if (!(x - (imgWidth * 0.4) / 2 >= -5)) {
                newPX = 0;
              }
            }
            if (
              y + (imgHeight * 0.4) / 2 <= imgHeight &&
              y - (imgHeight * 0.4) / 2 >= -5
            ) {
              newPY = y - (imgHeight * 0.4) / 2;
            } else {
              if (!(y + (imgHeight * 0.4) / 2 <= imgHeight)) {
                newPY = imgHeight * 0.6;
              }
              if (!(y - (imgHeight * 0.4) / 2 >= -5)) {
                newPY = -1;
              }
            }
            setPointerPosition({ x: newPX, y: newPY });
            let newBX = backgroundPosition.x;
            let newBY = backgroundPosition.y;
            if (
              x * zoomLevel + imgWidth * 0.8 >= imgWidth * 1.5 + 15 &&
              x * zoomLevel + imgWidth * 0.7 <= imgWidth * 2 - 12
            ) {
              newBX = -x * zoomLevel + (imgWidth * 1.5) / 2;
            }
            if (
              y * zoomLevel + imgHeight * 0.8 >= imgHeight * 1.5 + 10 &&
              y * zoomLevel + imgHeight * 0.7 <= imgHeight * 2 - 10
            ) {
              newBY = -y * zoomLevel + (imgHeight * 1.5) / 2;
            }
            setBackgroundPosition({ x: newBX, y: newBY });
          }}
          onMouseLeave={() => {
            onMouseLeave();
            setShowMagnifier(false);
          }}
          alt={`${alt ? alt : "img"}`}
        />
        <div
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            pointerEvents: "none",
            height: `${imgHeight * 0.4}px`,
            width: `${imgWidth * 0.4}px`,
            top: `${pointerPosition.y}px`,
            left: `${pointerPosition.x + dimensions.width * 0.2 - imgWidth * 0.5}px`,
            opacity: 0.4,
            border: "1px solid lightgray",
            backgroundColor: "white",
            backgroundImage: 'url("/assets/img/blue.png")',
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <Fade
          reverse={iconAnimDirection === "fadeOut"}
          duration={iconDuration.duration}
        >
          {caption && (
            <div
              className="w-fit absolute z-10 bottom-[-0px] left-[35.7%] cursor-pointer flex flex-col justify-center items-center"
              onClick={toggleText}
            >
              {showTextAnimation && (
                <div className="w-[40px] -mr-[3px]">
                  <Lottie
                    animationData={animationShow}
                    autoPlay={true}
                    loop={false}
                  />
                </div>
              )}
              {hideTextAnimation && (
                <div className="w-[40px] -mr-[3px]">
                  <Lottie
                    animationData={animationHide}
                    autoPlay={true}
                    loop={false}
                  />
                </div>
              )}
              {showText
                ? !hideTextAnimation &&
                  !showTextAnimation && (
                    <div style={{zIndex:100}} className="w-[33.8px] flex justify-center items-center ml-[3px]">
                      <P />
                    </div>
                  )
                : !showTextAnimation && (
                    <div className="w-[33.8px] flex justify-center items-center ml-[3px]">
                      <I />
                    </div>
                  )}
            </div>
          )}
        </Fade>
      </div>
      <div
        style={{
          height: `${imgHeight}px`,
          width: "60%",
          position: "relative",
        }}
        className="flex relative justify-center items-center w-[60%]"
      >
        <div
          style={{
            display: showMagnifier ? "" : "none",
            pointerEvents: "none",
            height: `${imgHeight * 2}px`,
            width: `${imgWidth * 2}px`,
            opacity: 1,
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${
              imgHeight * zoomLevel
            }px`,
            backgroundPositionX: `${backgroundPosition.x}px`,
            backgroundPositionY: `${backgroundPosition.y}px`,
          }}
          className="-top-[30%]"
        ></div>
      </div>
    </div>
  );
};

export default ImageMagnifier;
