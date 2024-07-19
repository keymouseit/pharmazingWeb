"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useWindowSize } from "@/hooks";

type Props = {};

const Testimonial = (props: Props) => {
  const { isDesktop, isTablet } = useWindowSize();
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

  const slides: {
    name: string;
    date: string;
    title: string;
    description: string;
  }[] = [
    {
      name: "Pharmii",
      date: "June 6, 2024",
      title: "Super hilfreich!",
      description: `Ich finde die App gerade im Pharmaziestudium echt hilfreich! Viele Sachen kann man immer gar nicht so genau nachschlagen bzw. Findet das nicht so schnell. Die App hilft einem Easy dabei und ist unkompliziert zu bedienen:)`,
    },
    {
      name: "Redwipf",
      date: "May 30, 2024",
      title: "Sehr gute Funktionalität und super Support",
      description: `Pharmazing macht es genau richtig. Die App funktioniert und die KI beantwortet die medizinisch pharmazeutischen Fragen korrekt und vorallem versteht auch diese. Sollte was nicht funktionieren oder wie einmal erlebt die Server nicht funktionieren, ist das Team sehr freundlich und verteilt gratis wertvolles gut zusammen gestelltes Lernmaterial,als Ausgleich. Ich denke die App ist noch ausbaufähig und wer weiss vielleicht kann das neue chatgptO Anwendung finden, so dass man die KI als Lernpartner nutzen kann. Eine vielversprechende App für jeden Pharmazeuten und Mediziner. Danke liebes Pharmazing Team!`,
    },
    {
      name: "juma2707",
      date: "May 28, 2024",
      title: "Hilfreich",
      description: `Die App ist einfach und unkompliziert in der Bedienung und vor allem praktisch, wenn es mal schnell gehen muss.`,
    },
    {
      name: "MedMiri",
      date: "May 28, 2024",
      title: "Der Hammer",
      description: `Die App ist der absolute Hammer, ich kann es wirklich nur jedem empfehlen. Wenn man mal was nachlesen will, sich erinnern möchte, Verständnisprobleme hat. Ich hab die App Freundinnen von mir auf das Handy geladen (MFAs), auch sie sind total begeistert. Wenn Erklärungen ihr Verständnis überschreiten, bitten sie die App einfach ,,bitte erkläre es einfacher“ und die Erklärung steht. Wirklich, dass man so eine App kosten- oder werbefrei nutzen kann ist ein Privileg. Ich freue mich schon auf die weiteren Funktionen die nach und nach noch dazu kommen. Danke an das gesamte Team`,
    },
    {
      name: "K Isabelle",
      date: "May 28, 2024",
      title: "Super Add-On zum Lernen :)",
      description: `Ich hatte bereits für die Pharmakologie Klausur mit den LernKarten von pharmazing gelernt und finde diese App eine gute Ergänzung im Klinikalltag und beim Lernen derzeit für Klinische Pharmakologie :) Ich hatte, bevor ich von der der App gehört habe, bereits mehrfach nach einer App für Pharmakologie geschaut und nichts Gutes gefunden - aber das hat jetzt ja ein Ende ;) super handlich und auf dem Handy immer dabei, wenn man was nachschlagen will. Und da sie kostenlos ist, würde ich jedem Mediziner oder Pharmakologen empfehlen, sie mal zumindest auszuprobieren`,
    },
    {
      name: "mr_004",
      date: "May 21, 2024",
      title: "Wahnsinnig tolle App",
      description: `Diese App ist wirklich der absolute Hammer! Ich bin wirklich sehr sehr begeistert. Die Erklärungen, sind mehr als präzise und klar verständlich formuliert! Man kann diese App wirklich vernünftig zum lernen nutzen und vor allem für die Selbstkontrolle ist es einfach klasse. Vielen herzlichen Dank an das ganze Team, hier steckt unbeschreiblich viel Arbeit dahinter. Und das absolut beste ist, man kann das ganze ohne Werbung gar Kosten nutzen. Ein fettes Lob und Dankeschön an das gesamte Team!!!`,
    },
    {
      name: "CHse3",
      date: "May 9, 2024",
      title: "Super hilfreich",
      description: `Die App hat mir und meinen Freunden schon in vielen Situationen echt geholfen. Sei es im Labor, zur Vorbereitung einer Klausur oder sogar zum Staatsexamen. Sie erspart einem wirklich sehr viel Zeit, wenn es mal schnell gehen muss oder wenn es einfach um ergänzende Infos geht. Dazu kann man sich alles ausführlich erklären lassen und mit der neuen Bilderfunktion kann man auch super für die Biologie- und Chemieklausuren lernen, indem man sich die Pflanzen oder Strukturformeln anschauen kann. Und das ohne langes Suchen im Netz oder in Büchern. Für schnelle und gut erklärte Infos. Es ist wirklich eine super Ergänzung zu den normalen Lernmaterialien.`,
    },
    {
      name: "alicia_knb",
      date: "May 4, 2024",
      title: "Schon in der Beta Phase super!",
      description: `Hab die App für mein Pharmazie Studium im dritten Semester verwendet um Organische Chemie zu lernen und es hat mir das nachschauen von Informationen sehr erleichtert! Teilweise findet man Sachen auf Google in Richtung Chemie nicht, dort aber schon! Hatte noch keine Frage die mir nicht beantwortet werden konnte. Selbst Interessen fragen über Kittel und sonstiges konnte die App beantworten! Bin’s ehr überzeugt und werde die App weiterhin für mein Studium verwenden! 😍`,
    },
    {
      name: "Anna_jw",
      date: "May 3, 2024",
      title: "1a um sich Zeit zu sparen",
      description: `Super nützlich um sich im Medizinstudium einige Themen nochmal einfach erklären zu lassen oder zb wenn man im Seminar etwas in kurzer Zeit ausarbeiten muss. Man kann ggf Antworten mehr oder weniger detailliert erfragen etc. Ist wirklich eine absolute empfehlung!!`,
    },
    {
      name: "Marina0212",
      date: "May 14, 2024",
      title: "Ich würde mein Pharmazie-Studium ohne pharmazing abbrechen",
      description: `Diese App hilft mir im Moment so so sehr in instrumentelle Analytik weiter. Ich bin sehr begeistert von der App, da man wirklich alle möglichen Fragen stellen kann. Ich bin auch derzeit ohne die App echt aufgeschmissen. Wenn ich irgendwo mal wieder keine Ahnung habe versuche ich mein Problem mithilfe dieser App zu lösen und es klappt eigentlich immer.`,
    },
    {
      name: "Carlleofe",
      date: "May 4, 2024",
      title: "Viel besser als ChatGTP",
      description: `Die App ist für alles Medizinische wirklich der Hammer. Deutlich zuverlässiger als ChatGTP bei dem man manchmal nachfragen muss ob das Programm sich sicher ist. Alles was damit bearbeitet wurde konnte ohne Schwierigkeiten beantwortet werden. Alles in allem wirklich zu empfehlen für alle Medizinstudenten die gerne AI benutzen`,
    },
    {
      name: "Ljnaa",
      date: "May 5, 2024",
      title: "Erleichterung im Pharmaziestudium",
      description: `Die App ist sehr einfach aufgebaut und leicht verständlich. Sie ist mein Retter im Nachbereiten von Vorlesungen oder um sich einen groben Überblick über eine Thematik zu verschaffen. Auch sind die Abbildungen von Strukturformel super. Man muss mit der App nicht noch zusätzlich googeln sondern es ist alles wichtige an einem Ort. Spart einfach insgesamt so viel Zeit! Nur zu empfehlen!`,
    },
    {
      name: "N Lu.12",
      date: "May 3, 2024",
      title: "Sehr empfehlenswert",
      description: `Die App ist eine sehr große Hilfe, wenn es darum geht schnelle Antworten auf spezifische Fragen zu erhalten. Außerdem kann man damit auch sehr gut üben, da sie Aufgaben mit Lösungen erstellen kann. Also insgesamt ideal, wenn man Pharmazie studiert.`,
    },
    {
      name: "mamo0605",
      date: "May 3, 2024",
      title: "Erleichterung im Pharma-Studium",
      description: `Durch AI, erspart man sich das mühselige Suchen nach Inhalten und Lösungswegen in endlosen Büchern. Und da Zeit im Pharma-Studium ein Fremdwort ist, ist auch endlich mehr Zeit, um Inhalte zu verstehen und abzuspeichern! :)`,
    },
    {
      name: "na°°°ef",
      date: "May 6, 2024",
      title: "Top!",
      description: `Die App ist super. Ich komme schnell an meine Informationen. Geht viel schnell, als googeln oder in Büchern suchen. Kann ich nur empfehlen!!!`,
    },
    {
      name: "laurilos",
      date: "May 6, 2024",
      title: "Super App",
      description: `Die App macht das Lernen um einiges leichter. Komplizierte Themen werden einfach aufgeschlüsselt oder mit anderen Wörtern (besser) erklärt. Es gibt keine lange Sucherei mehr, da man alles in der App findet. Die App bietet alles, was man für das Studium benötigt.`,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full mt-10 lg:mt-24">
      <div className="z-10 flex flex-col justify-center items-center mt-4 w-[90%]">
        <h1 className="text-[#158c78] text-center text-2xl md:text-3xl lg:text-[44px] font-fontBold">
          Bewertungen
        </h1>
        <div className="relative bg-transparent mt-10 w-[90%]">
          <Swiper
            ref={swiperRef}
            loop={true}
            spaceBetween={10}
            slidesPerView={isDesktop ? 3 : isTablet ? 2 : 1}
            navigation
            modules={[Navigation]}
          >
            {slides.map(
              (
                s: {
                  name: string;
                  date: string;
                  title: string;
                  description: string;
                },
                i: number
              ) => (
                <SwiperSlide key={i}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-4/5 flex flex-col justify-center items-start">
                      <h2 className="text-xl font-fontBold text-[#534ba2] mb-2">
                        {s.name}, {s.date}
                      </h2>
                      <div className="w-full flex justify-start items-center mb-4">
                        {Array(5)
                          .fill("")
                          .map((_, i: number) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              color="#FF9500"
                              size="sm"
                            />
                          ))}
                      </div>
                      <p className="text-lg font-fontRegular w-full text-primary">
                        <b>{s.title}</b>
                        <br />{" "}
                        <span className="text-sm text-secondary flex justify-start items-center w-full">
                          {s.description}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 96 960 960"
                          className="inline-block w-6"
                        >
                          <path
                            fill="currentColor"
                            d="M580 556h160V396H580v160Zm-360 0h160V396H220v160Zm406 220 80-160H520V336h280v288l-76 152h-98Zm-360 0 80-160H160V336h280v288l-76 152h-98Zm34-300Zm360 0Z"
                          />
                        </svg>
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
          <div className="absolute top-0 left-0 z-10 bg-transparent w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute -left-5 lg:-left-10 w-1/2 h-full">
                <div className="relative w-full h-full">
                  <div
                    className="shadow-md cursor-pointer absolute z-10 top-1/2 left-2 lg:left-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
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
              <div className="absolute -right-5 lg:-right-10 w-1/2 h-full">
                <div className="relative w-full h-full">
                  <div
                    className="shadow-md cursor-pointer absolute z-10 top-1/2 right-2 lg:right-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
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
      </div>
    </div>
  );
};

export default Testimonial;
