"use client";

import { usePathname } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { Analytics, logEvent } from "firebase/analytics";
import { analytics } from "@/firebase/setup";

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

type Props = {
  children: React.ReactNode;
};

export const FirebaseContext = createContext<Analytics | null>(null);

const FirebaseProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const [tracking, setTracking] = useState<Analytics | null>(null);

  useEffect(() => {
    const analyticsInstance = analytics();
    setTracking(analyticsInstance);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const cookieAccess = localStorage.getItem("cookies");
      if (cookieAccess) {
        if (cookieAccess === "deny") {
          return;
        }
      } else {
        return;
      }
      if (!tracking) {
        return;
      }
      logEvent(tracking, "page_view", {
        page_location: url,
        page_title: document?.title,
      });
      setTimeout(
        () => console.log("🚀 ~ handleRouteChange ~:", window.dataLayer),
        1000
      );
    };
    handleRouteChange(pathname);
  }, [tracking, pathname]);

  return (
    <FirebaseContext.Provider value={tracking}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
