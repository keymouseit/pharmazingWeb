"use server";

import axios from "axios";
import constants from "@/constants/general";

export const CheckResetPasswordCode = async (
  phonenumber: string,
  code: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/checkResetPasswordCodePhonenumber`,
      {
        phonenumber,
        code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success > 0) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
