"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetHistory = async (token: string): Promise<any> => {
  try {
    const calculateDaysDiff = (date1: Date, date2: Date) => {
      const d1 = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate()
      );
      const d2 = new Date(
        date2.getFullYear(),
        date2.getMonth(),
        date2.getDate()
      );
      const diffTime: number = d1.getTime() - d2.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return Math.round(diffDays);
    };

    const shouldAddOffset = (addedOffsets: number[], offset: number) => {
      let shouldAdd = false;
      let maxElement = Math.max(...addedOffsets);
      if (offset < 7) {
        shouldAdd = true;
      } else if (offset >= 7 && offset < 14 && maxElement < 7) {
        shouldAdd = true;
      } else if (offset >= 14 && offset < 21 && maxElement < 14) {
        shouldAdd = true;
      } else if (offset >= 21 && offset < 28 && maxElement < 21) {
        shouldAdd = true;
      } else if (offset >= 28 && offset < 30 && maxElement < 28) {
        shouldAdd = true;
      } else if (offset >= 30 && offset < 60 && maxElement < 30) {
        shouldAdd = true;
      } else if (offset >= 60 && offset < 90 && maxElement < 60) {
        shouldAdd = true;
      } else if (offset >= 90 && offset < 120 && maxElement < 90) {
        shouldAdd = true;
      } else if (offset >= 120 && offset < 150 && maxElement < 120) {
        shouldAdd = true;
      } else if (offset >= 150 && offset < 180 && maxElement < 150) {
        shouldAdd = true;
      } else if (offset >= 180 && offset < 210 && maxElement < 180) {
        shouldAdd = true;
      } else if (offset >= 210 && offset < 240 && maxElement < 210) {
        shouldAdd = true;
      } else if (offset >= 240 && offset < 270 && maxElement < 240) {
        shouldAdd = true;
      } else if (offset >= 270 && offset < 300 && maxElement < 270) {
        shouldAdd = true;
      } else if (offset >= 300 && offset < 330 && maxElement < 300) {
        shouldAdd = true;
      } else if (offset >= 330 && offset < 360 && maxElement < 330) {
        shouldAdd = true;
      } else if (offset >= 360 && maxElement < 360) {
        shouldAdd = true;
      }
      return shouldAdd;
    };

    const response = await axios.post(
      constants.urlBase + "/users/fetchMessagesHistory",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const messages = response.data.messages.filter(
      (msg: any) => msg.role === "user"
    );

    let messagesCopy = [];

    let now = new Date();
    let addedOffsets = [];

    let previousDaysDiff = -1;
    let uniqueIdx = 0;
    if (messages.length > 0) {
      for (let i = 0; i < messages.length; i++) {
        let daysDiff = Math.round(
          calculateDaysDiff(now, new Date(messages[i].created_at))
        );

        if (daysDiff > previousDaysDiff) {
          let shouldAdd = shouldAddOffset(addedOffsets, daysDiff);
          if (shouldAdd) {
            messagesCopy.push({
              id: uniqueIdx,
              role: "date",
              content: "",
              offset: daysDiff,
            });
            previousDaysDiff = daysDiff;
            uniqueIdx += 1;
            addedOffsets.push(daysDiff);
          }
        }
        messagesCopy.push({
          id: uniqueIdx,
          question_id: messages[i].question_id,
          role: "user",
          content: messages[i].content,
          offset: calculateDaysDiff(now, new Date(messages[i].created_at)),
        });
        uniqueIdx += 1;
      }
    }
    return messagesCopy;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
