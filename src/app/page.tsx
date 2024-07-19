"use client";

import { NextPage } from "next";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { useParallax } from "react-scroll-parallax";
import { useScrollDetector } from "@/hooks";
import {
  Clients,
  Footer,
  Header,
  Hero,
  Slider,
  Testimonial,
} from "@/components";

type Props = {};

const Home: NextPage<Props> = (props: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | string>("100vh");
  const [marginTop, setMarginTop] = useState<number>(0);

  const { scrollPosition } = useScrollDetector(divRef);

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      if (navbarRef.current) {
        setMarginTop(navbarRef.current.clientHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      setHeight((prev) =>
        marginTop > window.innerHeight ? prev : window.innerHeight - marginTop
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [marginTop]);

  // const leftParallax = useParallax<HTMLDivElement>({
  //   translateX: [-10, 0],
  //   translateY: [0, -50],
  //   rotate: [0, -30],
  // });

  // const rightParallax = useParallax<HTMLDivElement>({
  //   translateX: [-10, 0],
  //   translateY: [0, -100],
  //   rotate: [10, 50],
  // });

  return (
    <div
      ref={divRef}
      className="overflow-y-auto overflow-x-hidden bg-[#ffffff]"
      style={{ height, marginTop }}
    >
      <Header ref={navbarRef} scrollPosition={scrollPosition} />
      <Hero divRef={divRef} />
      <div className="relative">
        <Slider />
        {/* <div
          ref={leftParallax.ref}
          className="hidden lg:block absolute w-1/4 -bottom-[15%] -left-8"
        > */}
          {/* <Image
            src="/assets/img/icons/cloud-1.png"
            alt="cloud-1"
            width={675}
            height={675}
          />
        </div> */}
        {/* <div
          ref={rightParallax.ref}
          className="hidden lg:block absolute w-1/4 top-[25%] -right-8"
        > */}
          {/* <Image
            src="/assets/img/icons/cloud-2.png"
            alt="cloud-2"
            width={768}
            height={768}
          />
        </div> */}
      </div>
      <Clients />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
