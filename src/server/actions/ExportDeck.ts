import axios from "axios";
import constants from "@/constants/general";
import { saveAs } from 'file-saver';

export const exportDeckPdf = async(deckId:string, token: string, deckName:any) => {
    try {
        const response = await axios.get(`${constants.urlBase}/decks/pdf/${deckId}`, {
            headers:{
              Authorization: `Bearer ${token}`,
            },
            responseType : "blob"
          });
          const blob = new Blob([response.data], { type: "application/pdf" });
          saveAs(blob, `${deckName}.pdf`);
    }catch (error: any) {
        throw new Error(error.message);
    }
}