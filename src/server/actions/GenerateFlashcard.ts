"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GenerateFlashcard = async (deckName: string, file: any, type: string, numberOfCards: string, diff: string, token: string) => {
    try {
        const formData = new FormData();
        formData.append("deckName", deckName);
        formData.append("file", file);
        formData.append("type", type);
        formData.append("numberOfFlashcards", numberOfCards);
        formData.append("difficulty", diff);
        const response = await axios.post(
            constants.urlBase + "/flashcards/generate-flashcards",
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
