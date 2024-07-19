"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetNextMarketingMessage = async (
  token: string,
  platform: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/marketingMessages/getNextMarketingMessage`,
      { platform },
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
