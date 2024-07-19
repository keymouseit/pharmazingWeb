"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { Modal, ActivityIndicator } from "@/components";
import { CheckResetPasswordCode } from "@/server";

type Props = {};

const ForgotPasswordVerify: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[] | null>(new Array(6).fill(null));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    codeUnvalidPasswordReset: string;
    codeUnvalidPasswordResetTitle: string;
    securityCode: string;
    telephoneNumber: string;
    continue: string;
  }>({
    codeUnvalidPasswordReset: "",
    codeUnvalidPasswordResetTitle: "",
    securityCode: "",
    telephoneNumber: "",
    continue: "",
  });

  useLayoutEffect(() => {
    setText({
      codeUnvalidPasswordReset: i18n(
        translation,
        "dialog",
        "codeUnvalidPasswordReset"
      ),
      codeUnvalidPasswordResetTitle: i18n(
        translation,
        "dialog",
        "codeUnvalidPasswordResetTitle"
      ),
      securityCode: i18n(translation, "general", "securityCode"),
      telephoneNumber: i18n(
        translation,
        "phoneRegistration",
        "telephoneNumber"
      ),
      continue: i18n(translation, "general", "continue"),
    });
  }, [translation]);

  useEffect(() => {
    const savedTelephone = sessionStorage.getItem("telephone");
    if (savedTelephone) {
      setTelephone(savedTelephone);
      setTimeout(() => sessionStorage.removeItem("telephone"), 1000);
    } else {
      router.replace("/forgot-password");
    }
  }, [router]);

  const handleInput = (text: string, index: number) => {
    if (text.length > 1) {
      return;
    }
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (inputRefs.current) {
      if (text && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      } else if (!text && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const actionUponCheckPasswordCode = (success: Boolean) => {
    if (success) {
      sessionStorage.setItem("telephone", telephone);
      sessionStorage.setItem("code", code.join(''));
      router.push("/reset-password");
    } else {
      setDialogMessage(text.codeUnvalidPasswordReset);
      setDialogTitle(text.codeUnvalidPasswordResetTitle);
      setShowDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res: boolean = await CheckResetPasswordCode(telephone.replace(/\s+/g, ''), code.join(''));
    actionUponCheckPasswordCode(res);
    setIsSubmitting(false);
  };

  if (!telephone) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-white items-center w-screen h-screen">
      {telephone && (
        <>
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
              onClick={() => router.back()}
            />
          </div>
          <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] items-start text-black">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full mb-4">
                <h1 className="font-fontBold text-4xl font-bold mb-8">
                  {text.securityCode}
                </h1>
                <p className="font-fontBold text-base font-bold mb-8">
                  {text.telephoneNumber}
                </p>
                <div className="flex justify-between items-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(ref) => {
                        if (ref) {
                          inputRefs.current &&
                            (inputRefs.current[index] =
                              ref as HTMLInputElement);
                        }
                      }}
                      disabled={isSubmitting}
                      type="number"
                      max={9}
                      maxLength={1}
                      value={digit}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleInput(event.target.value, index)
                      }
                      className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-10"
                      autoFocus={index == 0 ? true : false}
                    />
                  ))}
                </div>
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
                    <span>{text.continue}</span>
                  )}
                </span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordVerify;
