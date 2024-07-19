"use client";

import { useEffect, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { useAppSelector } from "@/redux";
import { useWindowSize } from "@/hooks";
import { Hero } from "@/components";

type Props = {
  children: React.ReactNode;
};

const MobileProvider: React.FC<Props> = ({ children }: Props) => {
  const { isMobile } = useWindowSize();
  const { loading, user } = useAppSelector((state) => state.users);
  const [isAuthUser, setIsAuthUser] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && user && user.loggedIn) {
      setIsAuthUser(true);
    } else {
      setIsAuthUser(false);
    }
  }, [loading, user]);

  if (!isAuthUser && isMobile) {
    return (
      <ParallaxProvider>
        <Hero />
      </ParallaxProvider>
    );
  }

  return <ParallaxProvider>{children}</ParallaxProvider>;
};

export default MobileProvider;
