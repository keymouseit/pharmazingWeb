"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRef, MutableRefObject } from "react";
import { useParallax } from "react-scroll-parallax";
import { Fade, Slide } from "react-awesome-reveal";
import lottie from "lottie-web";
import animation from "@/assets/animations/bigLoading.json";
import { useWindowSize } from "@/hooks";
// import { useAppSelector } from "@/redux";

const SCROLL_FACTOR: number = 3;

type Props = {
  divRef?: MutableRefObject<HTMLDivElement | null>;
};

const Hero: React.FC<Props> = ({ divRef }: Props) => {
  const { isMobile } = useWindowSize();

  const leftAnimation = useRef<HTMLDivElement>(null);
  const rightAnimation = useRef<HTMLDivElement>(null);

  const leftParallax = useParallax<HTMLDivElement>({
    translateX: [-10, 0],
    translateY: [0, -50],
  });

  const rightParallax = useParallax<HTMLDivElement>({
    translateX: [-10, 0],
    translateY: [0, -100],
  });

  // const { user } = useAppSelector((state) => state.users);
  // const [isAuthUser, setIsAuthUser] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const anim1 = lottie.loadAnimation({
      container: leftAnimation.current!,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animation,
    });
    const anim2 = lottie.loadAnimation({
      container: rightAnimation.current!,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animation,
    });
    const animateBodymovin = (scrollFactor: number) => {
      if (divRef && divRef.current) {
        const scrollPosition = divRef.current.scrollTop + 10;
        const documentHeight =
          divRef.current.scrollHeight - divRef.current.clientHeight;
        const scrollFraction = scrollPosition / documentHeight;
        const frame1 = Math.min(
          anim1.totalFrames * scrollFraction * scrollFactor,
          anim1.totalFrames
        );
        const frame2 = Math.min(
          anim2.totalFrames * scrollFraction * scrollFactor,
          anim2.totalFrames
        );
        anim1.goToAndStop(frame1 + 10, true);
        anim2.goToAndStop(frame2 + 10, true);
      }
    };
    animateBodymovin(SCROLL_FACTOR);
    const handleScroll = () => {
      animateBodymovin(SCROLL_FACTOR);
    };
    if (divRef && divRef.current) {
      divRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (divRef && divRef.current) {
        anim1.destroy();
        anim2.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        divRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [divRef]);

  if (isMobile) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <div className="fixed z-40 top-0 left-0 right-0 bg-white px-4 lg:px-2 xl:px-4">
          <div className="flex justify-between items-center w-full py-3 border-b-2 border-b-gray-200">
            <Slide direction="down" triggerOnce={true}>
              <div className="flex justify-center items-center gap-x-1 lg:gap-x-[2px] xl:gap-x-1">
                <div className="w-4 md:w-6 lg:w-8">
                  <Link
                    href="https://www.pharmazing.de"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/img/pharmazingRound.png"
                      width={1300}
                      height={1300}
                      alt="pharmazing"
                      className="rounded-full"
                    />
                  </Link>
                </div>
                <div className="w-16 md:w-24 lg:w-28">
                  <Link
                    href="https://www.pharmazing.de"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/img/pharmazingOrig.png"
                      width={1600}
                      height={533}
                      alt="pharmazing"
                    />
                  </Link>
                </div>
              </div>
            </Slide>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center px-4">
          <div className="text-center z-10">
            <h1 className="text-[#534BA2] mx-10 text-[36px] md:text-[40px] lg:text-[60px] font-fontBold flex justify-center items-center flex-wrap lg:flex-nowrap space-y-0 space-x-2 lg:space-x-4 leading-[45px] lg:leading-relaxed">
              <Fade direction="up" duration={600} triggerOnce={true}>
                pharmazing
              </Fade>
              <Fade direction="up" duration={800} triggerOnce={true}>
                App
              </Fade>
            </h1>
            <Fade direction="up" duration={800} delay={500} triggerOnce={true}>
              <p className="text-primary mx-[1px] lg:mx-0 text-[24px] lg:text-[26px] font-fontBold mt-6 lg:mt-0">
              #1 AI App für Medizin u. Pharmazie
              </p>
            </Fade>
          </div>
          <div className="flex justify-center items-center gap-x-3 w-full md:w-fit" style={{ textAlign: 'center' }}>
            <p className="text-primary mx-[1px] lg:mx-0 text-[20px] lg:text-[22px] mt-6 lg:mt-0">
                  Für Zugriff auf unsere Web-Version mit erweiterten Features, suche auf deinem Laptop nach pharmazing.ai. Um zur Handy-App zu gelangen, klicke auf ,,Jetzt gratis herunterladen!“
            </p>
          </div>
          <div className="mt-8 lg:mt-6 z-10 w-full md:w-fit">
            <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
              <div className="flex justify-center items-center gap-x-3 w-full md:w-fit">
                <Link
                  href="https://pharmazing-app.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[90%] md:w-full"
                >
                  <button
                    type="button"
                    className="text-white bg-secondary hover:bg-[#158c78] rounded-xl lg:rounded-md px-3 py-3 lg:py-[6px] w-full"
                  >
                    <span className="font-fontBold text-base">
                      Jetzt gratis herunterladen!
                    </span>
                  </button>
                </Link>
                {/* <Link href="/auth">
              <button
                type="button"
                className="text-white bg-transparent hover:bg-blue-100 bg-opacity-50 rounded-md px-3 py-[6px]"
              >
                <span className="font-fontBold text-lg text-[#0081F2]">
                  <span>Request a demo</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="sm"
                    color="#0081F2"
                    className="ml-2 -mb-[2px]"
                  />
                </span>
              </button>
            </Link> */}
              </div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center px-4 lg:px-12 pt-32 pb-20">
      <div className="text-center z-10">
        <h1 className="text-[#534BA2] mx-10 text-[36px] md:text-[40px] lg:text-[60px] font-fontBold flex justify-center items-center flex-wrap lg:flex-nowrap space-y-0 space-x-2 lg:space-x-4 leading-[45px] lg:leading-relaxed">
          <Fade direction="up" duration={600} triggerOnce={true}>
            pharmazing
          </Fade>
          <Fade direction="up" duration={800} triggerOnce={true}>
            App
          </Fade>
        </h1>
        <Fade direction="up" duration={800} delay={500} triggerOnce={true}>
          <p className="text-primary text-[24px] lg:text-[26px] font-fontBold mt-6 lg:mt-0">
          #1 AI App für Medizin u. Pharmazie
          </p>
        </Fade>
      </div>
      <div className="mt-8 lg:mt-6 z-10 w-full md:w-fit">
        <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
          <div className="flex justify-center items-center gap-x-3 w-full md:w-fit">
            <Link href="/auth" className="w-[90%] md:w-full">
              <button
                type="button"
                className="text-white bg-secondary hover:bg-[#158c78] rounded-xl lg:rounded-md px-3 py-3 lg:py-[6px] w-full"
              >
                <span className="font-fontBold text-base">Jetzt gratis starten!</span>
              </button>
            </Link>
          </div>
        </Fade>
      </div>
      <div className="relative w-[56%] mt-9 hidden xl:block z-10">
        <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
          <div className="w-[800px] rounded-3xl shadow-2xl">
            <video
              width={800}
              height={450}
              autoPlay
              muted
              loop
              className="rounded-3xl"
            >
              <source src="/assets/videos/screen.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="w-96 fixed top-[12vh] left-[43vw]">
              <Image
                src="/assets/img/banners/phone.png"
                width={1080}
                height={1080}
                alt="screen"
              />
            </div>
          </div>
        </Fade>
      </div>
      <div
        ref={leftParallax.ref}
        className="hidden lg:block w-1/4 md:w-1/6 opacity-50 absolute -bottom-[50%] xl:bottom-[22%] -left-[1%]"
      >
        <div>
          <div ref={leftAnimation}></div>
        </div>
      </div>
      <div
        ref={rightParallax.ref}
        className="hidden lg:block w-1/2 md:w-1/4 opacity-50 absolute top-[80%] xl:top-[30%] -right-[8%] md:-right-[5%]"
      >
        <div>
          <div ref={rightAnimation}></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
