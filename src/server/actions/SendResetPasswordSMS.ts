"use server";

import axios from "axios";
import constants from "@/constants/general";

export const SendResetPasswordSMS = async (
  phonenumber: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/sendResetTokenPhonenumber`,
      { phonenumber },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;
    if (data.success > 0) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
