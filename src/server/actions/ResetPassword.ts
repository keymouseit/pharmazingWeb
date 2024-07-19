"use server";

import axios from "axios";
import constants from "@/constants/general";

export const ResetPassword = async (
  phonenumber: string,
  code: string,
  password: string
): Promise<{
  success: boolean;
  email: any;
}> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/resetPasswordPhonenumber`,
      { phonenumber, code, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = response.data;
    if (json.success > 0) {
      return { success: true, email: json.email };
    }
    return { success: false, email: "" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
