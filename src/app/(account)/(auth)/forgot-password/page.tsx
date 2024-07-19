"use client";

import { useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal } from "@/components";
import { SendResetPasswordSMS } from "@/server";

type Props = {};

const ForgotPassword: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.users);
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("+49");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    noValidPhoneNumber: string;
    enterValidPhone: string;
    errorOccured: string;
    errorOccuredDescription: string;
    resetEmail: string;
    resetEmailTitle: string;
    email: string;
    sendEmail: string;
    forgotPassword: string;
    keineSMSErhalten: string;
    telephoneNumber: string;
  }>({
    noValidPhoneNumber: "",
    enterValidPhone: "",
    errorOccured: "",
    errorOccuredDescription: "",
    resetEmail: "",
    resetEmailTitle: "",
    email: "",
    sendEmail: "",
    forgotPassword: "",
    keineSMSErhalten: "",
    telephoneNumber: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidPhoneNumber: i18n(
        translation,
        "phoneRegistration",
        "noValidPhoneNumber"
      ),
      enterValidPhone: i18n(
        translation,
        "phoneRegistration",
        "enterValidPhone"
      ),
      errorOccured: i18n(translation, "phoneRegistration", "errorOccured"),
      errorOccuredDescription: i18n(
        translation,
        "phoneRegistration",
        "errorOccuredDescription"
      ),
      resetEmail: i18n(translation, "dialog", "resetEmail"),
      resetEmailTitle: i18n(translation, "dialog", "resetEmailTitle"),
      email: i18n(translation, "general", "email"),
      sendEmail: i18n(translation, "general", "sendEmail"),
      forgotPassword: i18n(translation, "signup", "forgotPassword"),
      keineSMSErhalten: i18n(translation, "general", "keineSMSErhalten"),
      telephoneNumber: i18n(
        translation,
        "phoneRegistration",
        "telephoneNumber"
      ),
    });
  }, [translation]);

  const onChangeTelephone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    let newText: string = "";
    for (let i = 0; i < inputText.length; i++) {
      if (!isNaN(parseInt(inputText[i], 10))) {
        newText += inputText[i];
      }
    }
    if (newText.length > 2) {
      newText = newText.substring(0, 2) + " " + newText.substring(2);
    }
    if (newText.length > 7) {
      newText = newText.substring(0, 7) + " " + newText.substring(7);
    }
    setTelephone("+" + newText);
  };

  const validPhoneNumber = () => {
    const regex = /^\+[\d ]{7,}$/;
    return regex.test(telephone);
  };

  const actionUponForgotPassword = (success: Boolean) => {
    if (success) {
      sessionStorage.setItem("telephone", telephone);
      router.push("/forgot-password/verify");
    } else {
      setDialogMessage(text.errorOccured);
      setDialogTitle(text.errorOccuredDescription);
      setShowDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPhoneNumber()) {
      setDialogMessage(text.noValidPhoneNumber);
      setDialogTitle(text.enterValidPhone);
      setShowDialog(true);
    } else {
      setIsSubmitting(true);
      const res: boolean = await SendResetPasswordSMS(telephone.replace(/\s+/g, ''));
      console.log(res)
      actionUponForgotPassword(res);
      setIsSubmitting(false);
    }
  };

  if (user && user.loggedIn) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-white items-center w-screen h-screen">
      <Modal
        theme="light"
        showModal={showDialog}
        title={dialogTitle}
        description={dialogMessage}
        submitButtonText="Ok"
        submitHandler={() => setShowDialog(false)}
      />
      <div className="absolute top-10 left-10">
        <FontAwesomeIcon
          className="w-8 h-8 cursor-pointer"
          icon={faArrowLeft}
          color="black"
          onClick={() => router.replace("/login")}
        />
      </div>
      <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] items-start text-black">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.telephoneNumber}
            </p>
            <input
              type="tel"
              value={telephone}
              onChange={onChangeTelephone}
              disabled={isSubmitting}
              className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-full"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.sendEmail}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              window.open(
                `mailto:app@pharmazing.de?subject=Support Phone: ${telephone}`,
                "_blank"
              )
            }
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            {text.keineSMSErhalten}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
