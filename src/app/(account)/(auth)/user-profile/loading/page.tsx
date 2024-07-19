"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch, userActions } from "@/redux";
import { i18n } from "@/lng/logic";
import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { ActivityIndicator } from "@/components";

type Props = {};

const UserLoading: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const translation = useAppSelector((state) => state.i18n.data);
  const { loading, user, tutorialSeen } = useAppSelector(
    (state) => state.users
  );
  const [userData, setUserData] = useState<{
    phoneNumber: string;
    name: string;
    password: string;
    email: string;
    university: string;
    studies: string;
    country: string;
    occupation: string;
  }>({
    phoneNumber: "",
    name: "",
    password: "",
    email: "",
    university: "",
    studies: "",
    country: "",
    occupation: "",
  });
  const [text, setText] = useState<{
    preparingAll: string;
    country: string;
    university: string;
    regionBe: string;
  }>({
    preparingAll: "",
    country: "",
    university: "",
    regionBe: "",
  });

  useLayoutEffect(() => {
    setText({
      preparingAll: i18n(translation, "signup", "preparingAll"),
      country: i18n(translation, "userInfo", "country"),
      university: i18n(translation, "userInfo", "university"),
      regionBe: i18n(translation, "userInfo", "regionBe"),
    });
  }, [translation]);

  useEffect(() => {
    const savedUserData = sessionStorage.getItem("userData");
    if (savedUserData) {
      const parsedJson = JSON.parse(savedUserData);
      setUserData(parsedJson);
    } else {
      router.replace("/user-profile");
    }
  }, [router]);

  useEffect(() => {
    if (!loading && user && user.loggedIn) {
      dispatch(userActions.setTutorialSeen(false));
      setTimeout(() => {
        sessionStorage.removeItem("userData");
        router.replace("/tutorial");
      }, 3000);
    }
  }, [router, loading, user, tutorialSeen]);

  if (
    !userData.phoneNumber ||
    !userData.name ||
    !userData.password ||
    !userData.email ||
    !userData.university ||
    !userData.studies ||
    !userData.country ||
    !userData.occupation
  ) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-white items-center w-screen h-screen">
      <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] justify-center items-center mt-10 text-black">
        <div className="w-20 h-20 mb-6">
          <Image
            src="/assets/img/pharmazingRound.png"
            alt="pharmazing"
            width={1300}
            height={1300}
            className="rounded-full"
          />
        </div>
        <p className="font-fontBold text-center text-2xl font-bold mb-2">
          {text.preparingAll}
        </p>
        <p className="font-fontBold text-center text-2xl font-bold mb-2">
          {text.country}: {userData.country}
        </p>
        {userData.studies != "OTHER" && (
          <p className="font-fontBold text-center text-2xl font-bold mb-2">
            {i18n(translation, "userInfo", userData.occupation)}:
            {i18n(translation, "userInfo", userData.studies)}
          </p>
        )}
        {userData.occupation == "ST" && (
          <p className="font-fontBold text-center text-2xl font-bold mb-2">
            {text.university}: {userData.university}
          </p>
        )}
        {userData.occupation != "ST" && (
          <p className="font-fontBold text-center text-2xl font-bold mb-6">
            {text.regionBe}: {userData.university}
          </p>
        )}
        <ActivityIndicator color="secondary" size="medium" />
      </div>
    </div>
  );
};

export default UserLoading;
