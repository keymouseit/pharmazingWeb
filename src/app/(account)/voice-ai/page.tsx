"use client";

import { Navbar } from "@/components";
import { NextPage } from "next";
import Recorder from "./sections/Recorder";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/helper/getAccessToken";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { GetAllTranscriptions } from "@/server/actions/GetTranscriptions";
import { LoaderComp } from "./components/MainLoader";
import CustomTextEditor from "./components/CustomTextEditor";
import SideBar from "./components/SideBar";
import { useMediaQuery } from "react-responsive";
import { FaArrowLeft } from "react-icons/fa";
import { AppState } from "@/types/AppState";

type Props = {};

// export enum AppState {
//   LOADING = "LOADING",
//   FIRST_TIME = "FIRST_TIME",
//   RECORDER_OPENED = "RECORDER_OPENED",
//   EDITOR_OPENED = "EDITOR_OPENED",
//   MOBILE_EDITOR_OPENED = "MOBILE_EDITOR_OPENED",
// }
const VoiceAI: NextPage<Props> = (props: Props) => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [transcriptions, setTranscriptions] = useState<any>([]);
  const [selectedTranscription, setSelectedTranscription] = useState<any>([]);
  const [transcriptionToEdit, setTranscriptionToEdit] = useState({
    id: -1,
    name: "",
    arrayIndex: -1,
  });
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);

  useEffect(() => {
    getTranscriptions();
  }, []);

  const getTranscriptions = async () => {
    const token: string = await getAccessToken(dispatch, selector);
    const res: { success: boolean; data: any[] } = await GetAllTranscriptions(
      token
    );
    if (res.success) {
      setTranscriptions([...res.data]);
      if (res.data.length == 0) {
        setAppState(AppState.FIRST_TIME);
      } else {
        setAppState(AppState.EDITOR_OPENED);
        setSelectedTranscription(res.data[0]);
      }
    }
  };

  const handleOnTranscriptionFinished = () => {
    getTranscriptions();
  };
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  if (appState === AppState.LOADING) {
    return <LoaderComp />;
  }

  if (appState === AppState.FIRST_TIME) {
    return (
      <div>
        <Navbar />

        <div className="flex mt-12 justify-center items-center  overflow-y-scroll w-full ">
          <Recorder onTranscriptionDone={handleOnTranscriptionFinished} />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div>
        <Navbar />
        <div className="flex ">
          {appState == AppState.EDITOR_OPENED && (
            <div className="w-full">
              <SideBar
                isMobile={isMobile}
                setAppState={setAppState}
                selectedTranscription={selectedTranscription}
                setSelectedTranscription={setSelectedTranscription}
                transcriptionToEdit={transcriptionToEdit}
                setTranscriptionToEdit={setTranscriptionToEdit}
                appState={appState}
                transcriptions={transcriptions}
                getTranscriptions={getTranscriptions}
              />
            </div>
          )}

          {appState === AppState.RECORDER_OPENED && (
            <div className=" w-full overflow-y-visible  flex justify-center items-center">
              <div className="mt-10 p-2">
                <button
                  className="flex w-full text-primary py-2 mt-5 mb-2"
                  onClick={() => setAppState(AppState.EDITOR_OPENED)}
                >
                  <FaArrowLeft className="mr-5 mt-1" />
                  Zurückgehen
                </button>
                <Recorder onTranscriptionDone={handleOnTranscriptionFinished} />
              </div>
            </div>
          )}
          {appState === AppState.MOBILE_EDITOR_OPENED && (
            <div className="w-full p-2">
              <div className="mt-16">
                <button
                  className="flex w-full text-primary py-2 mt-5 mb-2"
                  onClick={() => setAppState(AppState.EDITOR_OPENED)}
                >
                  <FaArrowLeft className="mr-5 mt-1" />
                  Zurückgehen
                </button>
              </div>
              <CustomTextEditor transcription={selectedTranscription} />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="flex ">
        <div className="w-[40%]">
          <SideBar
            isMobile={isMobile}
            setAppState={setAppState}
            selectedTranscription={selectedTranscription}
            setSelectedTranscription={setSelectedTranscription}
            transcriptionToEdit={transcriptionToEdit}
            setTranscriptionToEdit={setTranscriptionToEdit}
            appState={appState}
            transcriptions={transcriptions}
            getTranscriptions={getTranscriptions}
          />
        </div>

        {appState === AppState.RECORDER_OPENED && (
          <div className="w-[60%] overflow-y-visible  flex justify-center items-center">
            <div className="mt-8">
              <Recorder onTranscriptionDone={handleOnTranscriptionFinished} />
            </div>
          </div>
        )}
        {(appState === AppState.EDITOR_OPENED ||
          appState === AppState.MOBILE_EDITOR_OPENED) && (
          <div className="w-[60%]">
            <div className="mr-4 mt-24">
              <CustomTextEditor transcription={selectedTranscription} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAI;
