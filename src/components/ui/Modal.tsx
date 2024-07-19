"use client";

import { useState } from "react";

type Props = {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  inputValue?: string;
  onChangeInput?: (text: string) => void;
  submitButtonText?: string;
  closeButtonText?: string;
  showModal: boolean;
  submitHandler?: () => void;
  closeHandler?: () => void;
};

const Modal: React.FC<Props> = ({
  title,
  description,
  theme = "light",
  inputValue = "",
  onChangeInput,
  submitButtonText,
  closeButtonText,
  showModal,
  submitHandler,
  closeHandler,
}: Props) => {
  const [input, setInput] = useState<string>(inputValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInput(newValue);
    if (onChangeInput) {
      onChangeInput(newValue);
    }
  };

  return (
    <div className={`${showModal ? "block" : "hidden"} fixed inset-0 z-50`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>
        <span
          className="inline-block align-middle h-screen"
          aria-hidden="true"
        ></span>
        &#8203;
        <div
          className={`inline-block ${
            theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-auto md:w-full`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            className={`${
              theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
            } px-4 pt-5`}
          >
            <div className="flex items-start">
              <div className="mt-0 mx-4 text-left w-full">
                <h3
                  className={`text-2xl leading-6 font-medium ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {title}
                </h3>
                {description && (
                  <div className="mt-2">
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                )}
                {inputValue && onChangeInput && (
                  <div className="mt-4 w-full">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        theme === "dark"
                          ? "bg-[#333] text-white border-gray-600"
                          : "bg-[#f0f0f0] text-black border-gray-300"
                      }`}
                      placeholder="Enter text here"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`${
              theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
            } px-4 py-3 flex flex-row-reverse`}
          >
            {submitButtonText && (
              <button
                type="button"
                className="inline-flex justify-center border border-transparent m-2 text-secondary text-lg font-medium focus:outline-none ml-3 w-auto"
                onClick={submitHandler}
              >
                {submitButtonText}
              </button>
            )}
            {closeButtonText && (
              <button
                type="button"
                className="inline-flex justify-center border border-transparent mx-4 my-2 text-secondary text-lg font-medium focus:outline-none ml-3 w-auto"
                onClick={closeHandler}
              >
                {closeButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
