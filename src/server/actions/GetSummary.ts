"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetAllSummary = async (
    token: string,
): Promise<{ success: boolean; data: any[] }> => {
    try {
        const response = await axios.get(
            constants.urlBase + "/summary/get-all-summary",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        );
        const json = response.data;
        return {
            success: json.success,
            data: json.data,
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
