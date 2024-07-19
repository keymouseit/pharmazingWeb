import axios from "axios";
import constants from "@/constants/general";

export const UpdateFlashcard = async (
    id: any,
    obj: any,
    token: string,
): Promise<{ success: boolean; data: any[] }> => {
    try {
        const response = await axios.put(
            constants.urlBase + `/flashcards/update-flashcards/${id}`,
            obj,
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
