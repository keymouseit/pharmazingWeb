"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide, SwiperRef, SwiperClass } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useParallax } from "react-scroll-parallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBook,
  faCalculator,
  faCube,
  faBridgeWater,
  // faAngleLeft,
  // faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Fade } from "react-awesome-reveal";
import { EarOutline } from "react-ionicons";

type Props = {};

const Slider: React.FC<Props> = (props: Props) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [index, setIndex] = useState(0);
  // const [isBeginning, setIsBeginning] = useState<boolean>(false);
  // const [isEnd, setIsEnd] = useState<boolean>(false);
  // const [showPrev, setShowPrev] = useState<boolean>(false);
  // const [showNext, setShowNext] = useState<boolean>(false);

  // const onSlideChange = () => {
  //   if (swiperRef && swiperRef.current) {
  //     setShowPrev(!swiperRef.current.swiper.isBeginning);
  //     setIsBeginning(swiperRef.current.swiper.isBeginning);
  //     setShowNext(!swiperRef.current.swiper.isEnd);
  //     setIsEnd(swiperRef.current.swiper.isEnd);
  //   }
  // };

  // const goToNextSlide = () => {
  //   if (swiperRef && swiperRef.current) {
  //     swiperRef.current.swiper.slideNext();
  //     onSlideChange();
  //     setIndex((prev) => (prev + 1 < 4 ? prev + 1 : 0));
  //   }
  // };

  // const goToPrevSlide = () => {
  //   if (swiperRef && swiperRef.current) {
  //     swiperRef.current.swiper.slidePrev();
  //     onSlideChange();
  //     setIndex((prev) => (prev > 0 ? prev - 1 : 3));
  //   }
  // };

  const handleSlideChange = (slideIndex: number) => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slideTo(slideIndex);
      setIndex(slideIndex);
      const activeSlide = swiperRef.current.swiper.slides[slideIndex];
      const videoElement = activeSlide.querySelector("video");
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play();
      }
    }
  };

  const caption: string[] = [
    "> 35.000 Abbildungen und interaktive 3D Animationen aus den Bereichen Chemie, Biologie, Physiologie, Histologie, Anatomie",
    "Erstelle Karteikarten zu jeder PDF mit nur einem Klick!",
    "Erstelle Zusammenfassung zu jeder PDF mit nur einem Klick!",
    "Erspare dir das mühselige mitschreiben während der Vorlesung und wandel gesprochene Inhalte in Text Form um!",
    "Lasse Rechenaufgaben und chemische Reaktionsgleichungen lösen und erklären.",
    "",
    "",
  ];

  const slides: string[] = [
    "3D.mp4",
    "ankiAi.mp4",
    "keywordAi.mp4",
    "voiceAi.mp4",
    "calculations.png",
    "feedback.png",
    "exercise.png",
  ];

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
    <>
      <div className="flex justify-center items-center">
        <div className="max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
          <div className="mt-16 lg:mt-36 flex justify-center items-center flex-wrap gap-x-10 gap-y-5">
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 0
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(0);
              }}
            >
              <FontAwesomeIcon icon={faCube} color="brown" size="lg" />
              <h1 className="font-fontBold text-2xl">3D</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 1
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(1);
              }}
            >
              <Image
                src="/assets/img/icons/flashcard.png"
                alt="flashcard"
                width={25}
                height={25}
              />
              <h1 className="font-fontBold text-2xl">Karteikarten</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 2
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(2);
              }}
            >
              <Image
                src="/assets/img/icons/keyword.png"
                alt="keyword"
                width={25}
                height={25}
              />
              <h1 className="font-fontBold text-2xl">Zusammenfassungen</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 3
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(3);
              }}
            >
              <EarOutline color="#800080" height="20px" width="20px" />
              <h1 className="font-fontBold text-2xl">Voice AI</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 4
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(4);
              }}
            >
              <FontAwesomeIcon icon={faCalculator} color="gold" size="lg" />
              <h1 className="font-fontBold text-2xl">Rechenaufgaben</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 5
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(5);
              }}
            >
              <FontAwesomeIcon icon={faBridgeWater} color="purple" size="lg" />
              <h1 className="font-fontBold text-2xl">Eselsbrücken</h1>
            </div>
            <div
              className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
                index === 6
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
              onClick={() => {
                handleSlideChange(6);
              }}
            >
              <FontAwesomeIcon icon={faBook} color="teal" size="lg" />
              <h1 className="font-fontBold text-2xl">Übungsaufgaben</h1>
            </div>
            <div className="flex lg:hidden justify-center items-center gap-x-2">
              {index === 0 ? (
                <>
                  <h1 className="font-fontBold text-2xl">3D</h1>
                  <FontAwesomeIcon icon={faCube} color="brown" size="lg" />
                </>
              ) : index === 1 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Karteikarten</h1>
                  <Image
                    src="/assets/img/icons/flashcard.png"
                    alt="flashcard"
                    width={25}
                    height={25}
                  />
                </>
              ) : index === 2 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Zusammenfassungen</h1>
                  <Image
                    src="/assets/img/icons/keyword.png"
                    alt="keyword"
                    width={25}
                    height={25}
                  />
                </>
              ) : index === 3 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Voice AI</h1>
                  <EarOutline color="#800080" height="20px" width="20px" />
                </>
              ) : index === 4 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Rechenaufgaben</h1>
                  <FontAwesomeIcon icon={faCalculator} color="gold" size="lg" />
                </>
              ) : index === 5 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Eselsbrücken</h1>
                  <FontAwesomeIcon
                    icon={faBridgeWater}
                    color="purple"
                    size="lg"
                  />
                </>
              ) : index === 6 ? (
                <>
                  <h1 className="font-fontBold text-2xl">Übungsaufgaben</h1>
                  <FontAwesomeIcon icon={faBook} color="teal" size="lg" />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      {index === 0 ||
      index === 1 ||
      index === 2 ||
      index === 3 ||
      index === 4 ? (
        <h1 className="text-primary font-fontRegular text-lg text-center mt-6 mb-4 flex flex-col gap-y-6 lg:gap-y-0 justify-center items-center">
          <span className="w-1/2">{caption[index]} </span>
          <span className="ml-2 cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
            <Link href="/auth" className="w-[90%] md:w-full">
              <span className="font-fontRegular text-lg">Jetzt starten!</span>
            </Link>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              color="#6056BF"
              className="ml-2 -mb-[2px]"
            />
          </span>
        </h1>
      ) : (
        <h1 className="text-primary font-fontRegular text-lg text-center mt-6 mb-4 flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 justify-center items-center">
          <span>{caption[index]} </span>
          <span className="ml-2 cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
            <Link href="/auth" className="w-[90%] md:w-full">
              <span className="font-fontRegular text-lg">Jetzt starten!</span>
            </Link>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              color="#6056BF"
              className="ml-2 -mb-[2px]"
            />
          </span>
        </h1>
      )}
      <div className="relative flex justify-center items-center w-full">
        <div className="z-10 relative shadow-2xl rounded-xl mt-4 w-4/5 lg:w-[55%] bg-transparent">
          <Swiper
            ref={swiperRef}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            effect="fade"
            navigation
            modules={[EffectFade, Navigation]}
            onInit={(swiper: SwiperClass) => {
              if (swiperRef && swiperRef.current) {
                // setShowPrev(!swiperRef.current.swiper.isBeginning);
                // setIsBeginning(swiperRef.current.swiper.isBeginning);
                // setShowNext(!swiperRef.current.swiper.isEnd);
                // setIsEnd(swiperRef.current.swiper.isEnd);
                setIndex(0);
              }
            }}
            className="bg-transparent"
          >
            {slides.map((s: string, i: number) => (
              <SwiperSlide key={i} className="bg-transparent">
                <div className="w-full flex justify-center rounded-xl items-center bg-transparent">
                  {s.endsWith(".mp4") ? (
                    <div
                      className={`w-full bg-transparent rounded-xl m-0 p-0 border-none outline-none ${
                        index === i ? "block" : "hidden"
                      }`}
                    >
                      <video
                        // width={2866}
                        // height={1618}
                        autoPlay
                        muted
                        loop
                        className={`rounded-xl m-0 p-0 border-none outline-none ${
                          index === 2 ? "-ml-1" : ""
                        }`}
                      >
                        <source src={`/assets/videos/${s}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div
                      className={`w-full ${
                        index === 0 || index === 1 || index === 2 || index === 3
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <Image
                        src={`/assets/img/banners/${s}`}
                        width={2866}
                        height={1618}
                        alt="1"
                        className="rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Navigators */}
          {/* <div className="absolute top-0 left-0 z-10 bg-transparent w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute left-0 w-1/2 h-full">
                <div
                  className="relative w-full h-full"
                  onMouseEnter={() => {
                    if (isBeginning) {
                      setShowPrev(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isBeginning) {
                      setShowPrev(false);
                    }
                  }}
                >
                  {showPrev && (
                    <div
                      className="cursor-pointer absolute z-10 top-1/2 left-2 lg:left-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
                      onClick={goToPrevSlide}
                    >
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        size="lg"
                        className="w-2 lg:w-3"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute right-0 w-1/2 h-full">
                <div
                  className="relative w-full h-full"
                  onMouseEnter={() => {
                    if (isEnd) {
                      setShowNext(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isEnd) {
                      setShowNext(false);
                    }
                  }}
                >
                  {showNext && (
                    <div
                      className="cursor-pointer absolute z-10 top-1/2 right-2 lg:right-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
                      onClick={goToNextSlide}
                    >
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        size="lg"
                        className="w-2 lg:w-3"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* <div
          ref={leftParallax.ref}
          className="hidden lg:block absolute w-1/4 -bottom-1/4 -left-8"
        >
          <Image
            src="/assets/img/icons/cloud-1.png"
            alt="cloud-1"
            width={675}
            height={675}
          />
        </div>
        <div
          ref={rightParallax.ref}
          className="hidden lg:block absolute w-1/4 -top-1/4 -right-8"
        >
          <Image
            src="/assets/img/icons/cloud-2.png"
            alt="cloud-2"
            width={768}
            height={768}
          />
        </div> */}
      </div>
    </>
  );
};

export default Slider;
