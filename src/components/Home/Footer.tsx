"use client";

import Image from "next/image";
import Link from "next/link";

type SubMenu = {
  name: string;
  url?: string;
  subMenu?: SubMenu[];
};

type Product = {
  name: string;
  url?: string;
  subMenu?: SubMenu[];
};

const products: Product[] = [
  {
    name: "Pharmazie",
    subMenu: [
      {
        name: "Grundstudium",
        subMenu: [
          {
            name: "Zusammenfassungen",
            url: "https://pharmazing.de/zusammenfassungen-grundstudium/",
          },
          {
            name: "Lernplaene",
            url: "https://pharmazing.de/lernplaene-grundstudium/",
          },
          {
            name: "Karteikarten",
            url: "https://pharmazing.de/karteikarten-grundstudium/",
          },
        ],
      },
      {
        name: "Hauptstudium",
        subMenu: [
          {
            name: "Zusammenfassungen",
            url: "https://pharmazing.de/zusammenfassungen-hauptstudium/",
          },
          {
            name: "Karteikarten",
            url: "https://pharmazing.de/karteikarten-hauptstudium/",
          },
        ],
      },
      {
        name: "3. Staatsexamen",
        subMenu: [
          {
            name: "Zusammenfassungen",
            url: "https://pharmazing.de/zusammenfassungen-3-staatsexamen/",
          },
          {
            name: "Karteikarten",
            url: "https://pharmazing.de/karteikarten-3-staatsexamen/",
          },
        ],
      },
    ],
  },
  { name: "PTA", url: "https://pharmazing.de/pta-lernmaterialien2" },
  { name: "Medizin", url: "https://pharmazing.de/medizin-lernmaterialien/" },
];

type Props = {};

const Footer: React.FC<Props> = (props: Props) => {
  const renderLinks = (items: SubMenu[] | Product[], level = 0) =>
    items.map((item, i) => (
      <div key={i} style={{ marginLeft: `${level * 20}px` }}>
        {item.url ? (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 no-underline cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
          >
            {item.name}
          </Link>
        ) : (
          <div className="my-2 font-fontRegular text-primary leading-3">
            {item.name}
          </div>
        )}
        {item.subMenu && renderLinks(item.subMenu, level + 1)}
      </div>
    ));

  return (
    <>
      <div className="flex justify-center items-center mt-8">
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 justify-center items-start border-t border-t-gray-200 p-10 w-[98%]">
          <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
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
            <div className="flex justify-center items-start gap-x-2 mt-8">
              <Link
                href="https://www.instagram.com/pharmazingde/"
                target="_blank"
                rel="noopener noreferrer"
                className="my-2 no-underline"
              >
                <Image
                  src="/assets/img/icons/instagram.png"
                  width={1080}
                  height={1080}
                  alt="instagram"
                  className="cursor-pointer w-8"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">
              Lernmaterialien
            </h1>
            {renderLinks(products)}
          </div>
          <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">Nachhilfe</h1>
            <Link
              href="https://pharmazing.de/tutorinnen/"
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 no-underline cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
            >
              Jetzt Probestunde buchen!
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">Rechtliches</h1>
            <Link
              href="https://www.pharmazing-app.de/privacyPolicy"
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 no-underline cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
            >
              Datenschutzerklärung
            </Link>
            <Link
              href="https://www.pharmazing-app.de/de/termsConditions"
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 no-underline cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
            >
              AGB
            </Link>
            <Link
              href="https://pharmazing.de/impressum/"
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 no-underline cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center mb-4">
        <p className="text-[#534ba2]">
          © 2024 pharmazing - Alle Rechte vorbehalten
        </p>
      </div>
    </>
  );
};

export default Footer;
