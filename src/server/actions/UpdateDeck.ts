"use server";

import axios from "axios";
import constants from "@/constants/general";

export const UpdateDeck = async (
    name: string,
    deck_id: string,
    token: string,
): Promise<{ success: boolean; data: any[] }> => {
    try {
        const response = await axios.put(
            constants.urlBase + `/decks/update-deck/${deck_id}`,
            {
                name
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                withCredentials: true
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
