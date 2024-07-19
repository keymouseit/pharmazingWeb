
import axios from "axios";
import constants from "@/constants/general";

export const DeleteSummary = async (
    id: string,
    token: string,
): Promise<any> => {
    try {
        const response = await axios.delete(
            constants.urlBase + `/summary/delete-summary/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );
        return true;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
