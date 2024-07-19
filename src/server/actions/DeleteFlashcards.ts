
import axios from "axios";
import constants from "@/constants/general";

export const DeleteFlashcards = async (
    id: string,
    token: string,
): Promise<{ success: boolean; data: any[] }> => {
    try {
        const response = await axios.post(
            constants.urlBase + `/flashcards/delete-flashcards/${id}`,{},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
