import axios from "axios";
import constants from "@/constants/general";
import { saveAs } from "file-saver";

export const exportTranscriptionPdf = async (
  transcriptionId: string,
  token: string,
  deckName: any
) => {
  try {
    const response = await axios.get(
      `${constants.urlBase}/voiceAi/pdf/${transcriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    saveAs(blob, `${deckName}.pdf`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const exportTranscriptionDoc = async (
  transcriptionId: string,
  token: string,
  deckName: any
) => {
  try {
    const response = await axios.get(
      `${constants.urlBase}/voiceAi/doc/${transcriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/docx" });
    saveAs(blob, `${deckName}.docx`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
