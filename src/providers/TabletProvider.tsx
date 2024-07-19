"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks";
import { Banner } from "@/components";

type Props = {
  children: React.ReactNode;
};

const TabletProvider: React.FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isTablet } = useWindowSize();
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showCookie, setShowCookie] = useState<boolean>(false);

  useEffect(() => {
    if (isTablet) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isTablet, router]);

  useEffect(() => {
    if (
      pathname === "/abo" ||
      pathname === "/voice_anki" ||
      pathname === "/voice_premium" ||
      pathname === "/anki_premium" ||
      pathname === "/anki_voice"
    ) {
      return;
    }
    const cookieAccess = localStorage.getItem("cookies");
    if (cookieAccess) {
      if (cookieAccess === "allow" || cookieAccess === "deny") {
        setShowCookie(false);
      } else {
        setShowCookie(true);
      }
    } else {
      setShowCookie(true);
    }
  }, [pathname]);

  return (
    <>
      {children}
      <Banner
        showBanner={showBanner}
        theme="light"
        title="Hol dir die App"
        description="App herunterladen. Erhältlich für Smartphone und Tablet."
        submitButtonText="Jetzt Herunterladen!"
        submitHandler={() => window.open("https://pharmazing-app.de/")}
        closeButtonText="Später"
        closeHandler={() => setShowBanner(false)}
      />
      <Banner
        showBanner={showCookie}
        theme="light"
        title="Erlaubnis zur Verwendung von Cookies"
        description="Wir schätzen Ihre Privatsphäre und möchten Ihr Surferlebnis auf unserer Website verbessern. Dafür verwenden wir Cookies, um zu verstehen, wie Sie mit unseren Inhalten interagieren, und um Ihr Erlebnis zu personalisieren."
        submitButtonText="Erlauben"
        submitHandler={() => {
          localStorage.setItem("cookies", "allow");
          setShowCookie(false);
        }}
        closeButtonText="Ablehnen"
        closeHandler={() => {
          localStorage.setItem("cookies", "deny");
          setShowCookie(false);
        }}
      />
    </>
  );
};

export default TabletProvider;
