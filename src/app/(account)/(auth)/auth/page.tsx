"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux";
import { useLayoutEffect, useState } from "react";
import { i18n } from "@/lng/logic";
import Lottie from "lottie-react";
import animationData from "@/assets/animations/bigLoading.json";

type Props = {};

const Auth: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.users);
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [text, setText] = useState<{
    registerNow: string;
    haveAccount: string;
    login: string;
  }>({
    registerNow: "",
    haveAccount: "",
    login: "",
  });

  useLayoutEffect(() => {
    setText({
      registerNow: i18n(translation, "welcome", "registerNow"),
      haveAccount: i18n(translation, "welcome", "haveAccount"),
      login: i18n(translation, "general", "login"),
    });
  }, [translation]);

  if (user && user.loggedIn) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-white items-center w-screen h-screen">
      <div className="w-96 h-96">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <div className="flex flex-col w-[90%] gap-y-4 items-center mt-10">
        <button
          className="px-4 py-4 w-3/4 md:w-1/2 xl:w-1/4 rounded-custom bg-secondary hover:bg-[#158c78]"
          onClick={() => router.push("/login")}
        >
          <span className="text-white font-fontRegular text-2xl leading-6 font-bold">
            {text.login}
          </span>
        </button>
        <button
          className="px-4 py-4 w-3/4 md:w-1/2 xl:w-1/4 rounded-custom bg-secondary hover:bg-[#158c78]"
          onClick={() => router.push("/register")}
        >
          <span className="text-white font-fontRegular text-2xl leading-6 font-bold">
            {text.registerNow}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
