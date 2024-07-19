"use client";

import Image from "next/image";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useWindowSize } from "@/hooks";

type Props = {};

const Clients: React.FC<Props> = (props: Props) => {
  const { isDesktop, isTablet } = useWindowSize();

  const allClients: string[] = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
  ];
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full mt-24">
        <div className="flex flex-col justify-center items-center mt-4 w-[95%]">
          <h1 className="text-[#158c78] text-center text-2xl lg:text-4xl font-fontBold w-4/5 lg:w-3/5">
            Mehr als 15.000 Studierende u. Dozenten der verschiedensten
            Universitäten vertrauen pharmazing
          </h1>
          {/* <p className="text-secondary text-center font-fontRegular text-lg w-full lg:w-3/5 mt-4 leading-6">
            Powering the world’s best teams, from next-generation startups to
            established enterprises.
          </p>
          <span className="font-fontRegular cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
            <span className="font-fontRegular text-lg">
              Read customer stories
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              color="#6056BF"
              className="ml-2 -mb-[2px]"
            />
          </span> */}
          <div className="mt-16 w-full">
            <Swiper
              slidesPerView={isDesktop ? 6 : isTablet ? 3 : 2}
              loop={true}
              autoplay={{
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={5000}
              onSwiper={(swiper: SwiperClass) => {
                swiper.wrapperEl.style.transitionTimingFunction = "linear";
              }}
              modules={[Autoplay]}
            >
              {allClients.map((c: string, i: number) => (
                <SwiperSlide key={i}>
                  <div className="w-40">
                    <Image
                      src={`/assets/img/clients/${c}`}
                      width={1100}
                      height={356}
                      alt="1"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/* <div
          className="hidden lg:flex mt-28 flex-col justify-center items-center bg-cover bg-no-repeat bg-center h-[260px] xl:h-[310px] w-[851px] xl:w-[901px]"
          style={{ backgroundImage: 'url("/assets/img/icons/tools.png")' }}
        >
          <h1 className="text-[#534ba2] text-center font-fontBold text-3xl md:text-4xl lg:text-[44px] w-1/2 mb-40">
            Consolidate tools. Cut costs.
          </h1>
        </div>
        <div className="mt-16 flex lg:hidden flex-col justify-center items-center w-[90%]">
          <h1 className="text-[#534ba2] text-center font-fontBold text-3xl md:text-4xl lg:text-[44px] w-4/5 lg:w-3/5">
            Consolidate tools. Cut costs.
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center mt-4 w-4/5 lg:w-[55%]">
          <div className="flex flex-col justify-center items-center mt-14 lg:mt-20">
            <h1 className="text-secondary text-center font-fontRegular text-xl md:text-2xl w-[90%] lg:w-3/5">
              “We got rid of nearly a dozen different tools because of what
              Notion does for us.‶
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-x-3">
              <Image
                src="/assets/img/icons/metalab.png"
                width={128}
                height={35}
                alt="metalab"
                className="w-32"
              />
              <div className="flex flex-col justify-center items-center md:items-start">
                <h2 className="text-sm font-fontBold text-[#534ba2]">
                  Justin Watt
                </h2>
                <p className="text-sm font-fontRegular text-primary">
                  Director of Ops & Marketing, MetaLab
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Clients;
