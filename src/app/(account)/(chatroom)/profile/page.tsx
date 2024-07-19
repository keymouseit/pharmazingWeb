"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { Modal } from "@/components";
import constants from "@/constants/general";
import { DeleteAccount } from "@/server";
import { getAccessToken, logout } from "@/helper";

type Props = {};

const Profile: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state);
  const { data: translation } = selector.i18n;
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [text, setText] = useState<{
    deleteAccount: string;
    wantToDelete: string;
    waitTitle: string;
    cancel: string;
    delete: string;
    chooseLanguage: string;
    privacyPolicy: string;
  }>({
    deleteAccount: "",
    wantToDelete: "",
    waitTitle: "",
    cancel: "",
    delete: "",
    chooseLanguage: "",
    privacyPolicy: "",
  });

  useLayoutEffect(() => {
    setText({
      deleteAccount: i18n(translation, "account", "deleteAccount"),
      wantToDelete: i18n(translation, "account", "wantToDelete"),
      waitTitle: i18n(translation, "phoneRegistration", "waitTitle"),
      cancel: i18n(translation, "general", "cancel"),
      delete: i18n(translation, "general", "delete"),
      chooseLanguage: i18n(translation, "drawer", "chooseLanguage"),
      privacyPolicy: i18n(translation, "account", "privacyPolicy"),
    });
  }, [translation]);

  const handleDeleteAccount = async () => {
    const token: string = await getAccessToken(dispatch, selector);
    const res: boolean = await DeleteAccount(token);
    if (res) {
      logout(router, dispatch);
    }
  };

  return (
    <div className="flex-1 bg-inherit">
      <Modal
        theme="light"
        showModal={showDialog}
        title={text.deleteAccount}
        description={text.wantToDelete}
        submitButtonText={text.delete}
        submitHandler={handleDeleteAccount}
        closeButtonText={text.cancel}
        closeHandler={() => setShowDialog(false)}
      />
      <div className="flex flex-col w-full h-full">
        <div className="hidden lg:flex flex-col items-center justify-around w-full h-1/4 mt-4 lg:mt-8">
          <Link
            href={`${constants.urlBase}/privacyPolicy`}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline w-3/4 lg:w-1/2 xl:w-2/6 px-8 p-4 flex justify-start items-center rounded-2xl bg-secondary hover:bg-[#158c78]"
          >
            <span className="text-white text-center font-MathJaxRegular font-semibold w-full">
              {text.privacyPolicy}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="w-3/4 lg:w-1/2 xl:w-2/6 px-8 p-4 flex justify-start items-center rounded-2xl bg-secondary hover:bg-[#158c78]"
          >
            <span className="text-white font-MathJaxRegular font-semibold w-full">
              {text.deleteAccount}
            </span>
          </button>
        </div>
        <div className="block lg:hidden w-full p-4 border-b border-b-gray-600 hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-5">
          <Link
            href={`${constants.urlBase}/privacyPolicy`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-MathJaxRegular text-lg capitalize font-semibold no-underline"
          >
            {text.privacyPolicy}
          </Link>
        </div>
        <div className="block lg:hidden w-full p-4 border-b border-b-gray-600 hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-5">
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="font-MathJaxRegular text-lg text-left capitalize font-semibold"
          >
            {text.deleteAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
