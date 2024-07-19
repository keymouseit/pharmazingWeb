"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon } from "../icons/MicIcon";
import { StopIcon } from "../icons/StopIcon";
import { PauseIcon } from "../icons/PauseIcon";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { CancelIcon } from "../icons/CancelIcon";
import { getAccessToken } from "@/helper/getAccessToken";
import axios from "axios";
import constants from "@/constants/general";

export enum RecorderState {
  READY = "READY",
  RECORDING = "RECORDING",
  PAUSED = "PAUSED",
  ERROR = "ERROR",
  LOADING = "LOADING",
}
export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import Loading from "../components/Loading";

export enum MicrophoneState {
  NotSetup = -1,
  SettingUp = 0,
  Ready = 1,
  Opening = 2,
  Open = 3,
  Error = 4,
  Pausing = 5,
  Paused = 6,
}
export default function Recorder({
  onTranscriptionDone,
}: {
  onTranscriptionDone?: () => void;
}) {
  const [recorderState, setRecorderState] = useState<RecorderState>(
    RecorderState.READY
  );
  const [errorText, setErrorText] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [timer, setTimer] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<number>(0);
  const [loadingText, setLoadingText] = useState<string>("Loading...");
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);

  const handleDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0) {
      audioChunksRef.current.push(e.data);
      setAudioChunks((prev) => [...prev, e.data]);
    }
  };
  const handleStop = () => {
    console.log("stopped recording!");

    console.log("timer", timer);
    console.log("timerRef", timerRef.current);
    if (timerRef.current == -1) {
      setRecorderState(RecorderState.READY);
    } else if (timerRef.current < 15) {
      setRecorderState(RecorderState.ERROR);
      setErrorText(
        "Aufnahme ist zu kurz. Bitte achte darauf, dass die Aufnahme mindestens 60 Sekunden lang sein sollte!"
      );
    } else {
      handleOnRecordingFinished(audioChunksRef.current);
    }
    clearInterval(intervalRef.current!);

    audioChunksRef.current = [];
    setAudioChunks([]);
  };

  const handleOnRecordingFinished = async (chunks: Blob[]) => {
    setRecorderState(RecorderState.LOADING);
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    console.log("Recording Finished");

    console.log(blob.size);
    try {
      setLoadingText("Hochladen von Audio...");

      const formData = new FormData();
      formData.append("file", blob);

      const token: string = await getAccessToken(dispatch, selector);
      const response = await axios.post(
        constants.urlBase + "/voiceAi/transcribe-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 500000,
        }
      );

      const { data } = response;

      if (data.success) {
        setRecorderState(RecorderState.READY);
        if (onTranscriptionDone) {
          onTranscriptionDone();
        }
      } else {
        setErrorText(data.error);
        setRecorderState(RecorderState.ERROR);
        throw new Error("failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePause = () => {
    console.log("paused recording!");
    clearInterval(intervalRef.current!);
  };

  const startRecording = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const mediaRecorder = new MediaRecorder(userMedia);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorderRef.current.addEventListener(
        MicrophoneEvents.DataAvailable,
        handleDataAvailable
      );
      mediaRecorderRef.current.addEventListener(
        MicrophoneEvents.Stop,
        handleStop
      );
      mediaRecorderRef.current.addEventListener(
        MicrophoneEvents.Pause,
        handlePause
      );

      mediaRecorderRef.current.start(250);
      timerRef.current = 0;
      intervalRef.current = setInterval(() => {
        timerRef.current += 1;
        setTimer(timerRef.current);
      }, 1000);

      setRecorderState(RecorderState.RECORDING);
    } catch (error) {
      console.error("Error setting up microphone:", error);

      setRecorderState(RecorderState.ERROR);
      setErrorText(
        "Error accessing microphone. Please make sure you have given permission to access the microphone."
      );
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
    }

    setRecorderState(RecorderState.PAUSED);
  };

  const resumeRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      intervalRef.current = setInterval(() => {
        timerRef.current += 1;
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    setRecorderState(RecorderState.RECORDING);
  };
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive" &&
      mediaRecorderRef.current.state == "recording"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getAudioTracks().forEach((track) => {
        track.stop();
        mediaRecorderRef.current!.stream.removeTrack(track);
      });
    }
    setRecorderState(RecorderState.READY);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive" &&
      mediaRecorderRef.current.state == "recording"
    ) {
      mediaRecorderRef.current.stop();
      timerRef.current = -1;
      mediaRecorderRef.current.stream.getAudioTracks().forEach((track) => {
        track.stop();
        mediaRecorderRef.current!.stream.removeTrack(track);
      });
    }
    audioChunksRef.current = [];
    setAudioChunks([]);
    setRecorderState(RecorderState.READY);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener(
          MicrophoneEvents.DataAvailable,
          handleDataAvailable
        );
        mediaRecorderRef.current.removeEventListener(
          MicrophoneEvents.Stop,
          handleStop
        );
        mediaRecorderRef.current.removeEventListener(
          MicrophoneEvents.Pause,
          handlePause
        );
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (recorderState == RecorderState.LOADING) {
    return (
      <div className="flex items-center justify-center text-center mt-11">
        <Loading loadingText={loadingText} />
        </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col flex-auto h-full justify-center items-center ">
        <div className="card mt-4 relative flex-auto flex-grow-0 h-1/6 w-10/12  text-center align-middle ">
          <div className="w-64 h-28 m-auto">
            {recorderState == RecorderState.RECORDING &&
              mediaRecorderRef.current && (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorderRef.current}
                  width={256}
                  height={112}
                  barColor="#20AC96"
                />
              )}
          </div>

          <div className="text-3xl">{formatTime(timer)}</div>

          <div className="flex h-full justify-center align-middle items-center z-20 gap-4 my-2">
            {recorderState != RecorderState.RECORDING && (
              <>
                <button
                  onClick={() =>
                    recorderState == RecorderState.PAUSED
                      ? resumeRecording()
                      : startRecording()
                  }
                  className="button text-[rgb(96,86,191)]"
                >
                  <MicIcon />
                </button>
                {recorderState == RecorderState.PAUSED && (
                  <button
                    onClick={() => cancelRecording()}
                    className="button text-[rgb(96,86,191)] "
                  >
                    <CancelIcon />
                  </button>
                )}
              </>
            )}

            {recorderState == RecorderState.RECORDING && (
              <>
                <button
                  onClick={() => stopRecording()}
                  className="button text-[rgb(96,86,191)] transition ease-in-out delay-0 hover:scale-105 duration-50"
                >
                  <StopIcon />
                </button>
                <button
                  onClick={() => pauseRecording()}
                  className="button text-[rgb(96,86,191)] transition ease-in-out delay-0 hover:scale-105 duration-50 "
                >
                  <PauseIcon />
                </button>
                <button
                  onClick={() => cancelRecording()}
                  className="button text-[rgb(96,86,191)] transition ease-in-out delay-0 hover:scale-105 duration-50 "
                >
                  <CancelIcon />
                </button>
              </>
            )}
          </div>
          {recorderState == RecorderState.ERROR && (
            <div className="m-4 text-red-500">
              <p>{errorText}</p>
            </div>
          )}
        </div>
        <div className="mt-4 relative flex-auto flex-grow-0 h-1/6 w-10/12  text-center align-middle ">
          <p>
            Einfach auf das Mikrofon klicken, um eine Aufnahme zu starten. Die
            Aufnahme sollte mindestens 90 Sekunden lang sein. Wenn du auf Stopp
            drückst, wird die Aufnahme in Text-Form überführt und mit
            Überschriften strukturiert, um dir das bestmögliche Lernerlebnis zu
            bieten.{" "}
          </p>
          <br></br>
          <p>
            So musst du nie wieder in der Vorlesung mitschreiben und kannst
            unsere Voice AI die Arbeit für dich machen lassen!
          </p>
        </div>
        <div className="m-8 text-center">
          <h1 className="mb-4">oder lade eine Aufnahme hoch</h1>
          <form
            className="form "
            onSubmit={async (e) => {
              e.preventDefault();

              if ((e.target as HTMLFormElement).file.files.length == 0) {
                setUploadError("Please select a file to upload!");
                return;
              }

              const file = (e.target as HTMLFormElement).file.files?.[0]!;

              const blob = new Blob([file], { type: file.type });
              handleOnRecordingFinished([blob]);
            }}
          >
            <input name="file" type="file" accept="audio/opus" />

            <button
              className=" bg-teal-500 hover:bg-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-700 hover:border-transparent rounded inline-flex"
              type="submit"
            >
              hochladen
            </button>
          </form>
          {uploadError && <p className="text-red-500">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
