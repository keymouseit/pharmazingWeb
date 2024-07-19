"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch, pharmazingActions } from "@/redux";
import { Navbar } from "@/components";
import { useWindowSize } from "@/hooks";
import { ImagesProvider } from "@/context/imagesContext";

type Props = {
  children: React.ReactNode;
};

const ChatProvider: React.FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isDesktop } = useWindowSize();
  const dispatch = useAppDispatch();
  const { user, tutorialSeen } = useAppSelector((state) => state.users);
  const navbarRef = useRef<HTMLElement | null>(null);
  const [marginTop, setMarginTop] = useState<number>(0);
  const [height, setHeight] = useState<number | string>("100%");

  useEffect(() => {
    dispatch(pharmazingActions.resetMessages());
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (typeof document === "undefined") {
        return;
      }
      if (navbarRef.current) {
        if (isDesktop && pathname === "/Frage") {
          setMarginTop(navbarRef.current.clientHeight);
        } else {
          setMarginTop(navbarRef.current.clientHeight);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [pathname, isDesktop]);

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      setHeight((prev) =>
        pathname === "/Frage"
          ? marginTop > window.innerHeight
            ? prev
            : window.innerHeight - marginTop
          : marginTop > window.innerHeight
          ? prev
          : window.innerHeight - marginTop + 10
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [marginTop, pathname]);

  if (!user || !tutorialSeen) {
    return;
  }

  if (pathname === "/history/chat" && isDesktop) {
    router.replace("/history");
  }

  return (
    <ImagesProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">
        <Navbar ref={navbarRef} />
        <div
          style={{ height, marginTop }}
          className={`flex overflow-hidden bg-[#f5f5f5]`}
        >
          {children}
        </div>
      </div>
    </ImagesProvider>
  );
};

export default ChatProvider;
