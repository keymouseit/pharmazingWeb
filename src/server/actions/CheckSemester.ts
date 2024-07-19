"use server";

import axios from "axios";
import constants from "@/constants/general";

export const CheckSemester = async (token: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/getSemester`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
