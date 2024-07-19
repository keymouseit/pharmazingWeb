"use client";

import { NextPage } from "next";
import Image from "next/image";
import { useRef } from "react";
import { Fade } from "react-awesome-reveal";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const Download: NextPage<Props> = (props: Props) => {
  const swiperRef = useRef<SwiperRef>(null);

  const goToNextSlide = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const slides: string[] = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
  ];

  return (
    <div className="flex-1 bg-inherit">
      <div className="flex flex-col lg:flex-row justify-center items-center w-screen h-full">
        <div className="hidden lg:block ml-8 mr-4 w-1/2">
          <Fade delay={200}>
            <div className="relative bg-black bg-opacity-5 shadow-2xl mt-4 rounded-xl">
              <Swiper
                ref={swiperRef}
                loop={true}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                navigation
                modules={[EffectFade, Navigation]}
              >
                {slides.map((s: string, i: number) => (
                  <SwiperSlide key={i}>
                    <div className="w-full py-4 flex justify-center items-center rounded-xl bg-transparent">
                      <div className="w-96">
                        <Image
                          src={`/assets/img/banners/iPad-${s}`}
                          width={1179}
                          height={2556}
                          alt="1"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-0 left-0 z-10 bg-transparent w-full h-full">
                <div className="relative w-full h-full">
                  <div className="absolute left-0 w-1/2 h-full">
                    <div className="relative w-full h-full">
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
                    </div>
                  </div>
                  <div className="absolute right-0 w-1/2 h-full">
                    <div className="relative w-full h-full">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>
        <div className="ml-0 lg:ml-4 mr-0 lg:mr-8 w-full lg:w-1/2 flex flex-col justify-center items-center">
          <Image
            src="/assets/img/qr-code.png"
            alt="qr-code"
            width={282}
            height={278}
          />
          <h1 className="text-[#158c78] mx-10 text-[40px] md:text-[50px] xl:text-[60px] font-fontBold">
            Hol dir die App
          </h1>
          <p className="text-primary text-center text-xl md:text-[25px] lg:text-2xl xl:text-[26px] font-fontBold mt-0 w-4/5">
            ,,QR Code scannen und App herunterladen. Erhältlich für Smartphone
            und Tablet&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default Download;
