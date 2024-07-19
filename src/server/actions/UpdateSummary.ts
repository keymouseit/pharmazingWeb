"use server";

import axios from "axios";
import constants from "@/constants/general";

export const UpdateSummary = async (
    name: string,
    content: any,
    summary_id: string,
    token: string,
): Promise<{ success: boolean; data: any[] }> => {
    try {
        const response = await axios.put(
            constants.urlBase + `/summary/update-summary/${summary_id}`,
            {
                name: name,
                content: content
            },
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
