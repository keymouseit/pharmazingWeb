import Script from "next/script";
import { FaCheck, FaEdit } from "react-icons/fa";
// import { AppState } from "../page";
import { AppState } from "@/types/AppState";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { UpdateTranscription } from "@/server/actions/UpdateTranscription";
import { getAccessToken } from "@/helper/getAccessToken";
import { DeleteTranscript } from "@/server/actions/DeleteTranscript";

export default function SideBar({
  setAppState,
  selectedTranscription,
  setSelectedTranscription,
  transcriptionToEdit,
  setTranscriptionToEdit,
  appState,
  transcriptions,
  getTranscriptions,
  isMobile,
}: {
  setAppState: (state: AppState) => void;
  selectedTranscription: any;
  setSelectedTranscription: any;
  transcriptionToEdit: any;
  setTranscriptionToEdit: any;
  appState: AppState;
  transcriptions: any;
  getTranscriptions: any;
  isMobile: boolean;
}) {
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);
  const saveName = async (idx: any, isActive = false) => {
    transcriptions[idx].name = transcriptionToEdit.name;
    setTranscriptionToEdit({
      id: -1,
      name: "",
      arrayIndex: -1,
    });

    const token: string = await getAccessToken(dispatch, selector);
    await UpdateTranscription(
      transcriptions[idx].name,
      undefined,
      transcriptions[idx].id,
      token
    );
  };

  const handleNameChange = (e: any) => {
    setTranscriptionToEdit((prev: any) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handleTranscriptDelete = async (id: any) => {
    setAppState(AppState.LOADING);
    const token: string = await getAccessToken(dispatch, selector);
    try {
      await DeleteTranscript(id, token);
      getTranscriptions();
    } catch (err) {
      getTranscriptions();
    }
  };
  return (
    <div className="overflow-hidden">
      <nav className="lg:hidden md:hidden fixed z-50 h-20 text-white mainSetting border-red-60 flex items-center px-10">
        <div className="flex items-center justify-center"></div>
      </nav>
      <div className="flex w-full h-screen">
        <div className="flex-grow bg-white overflow-y-auto mainSetting h-full p-12">
          <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">
                <span className="text-primary">Voice</span>{" "}
                <span className="text-secondary">AI</span>
              </h1>
              {appState != AppState.RECORDER_OPENED && (
                <div>
                  <button
                    className="py-2 px-3 bg-secondary text-white rounded"
                    onClick={() => {
                      setAppState(AppState.RECORDER_OPENED);
                      setSelectedTranscription(null);
                    }}
                  >
                    Neue Vorlesung aufnehmen
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-md">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left">
                    Transkriptionen
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {transcriptions.map((d: any, idx: number) => (
                    <tr
                      className="text-left"
                      onClick={() => {
                        setAppState(AppState.EDITOR_OPENED);
                        setSelectedTranscription(d);
                        if(isMobile){
                          setAppState(AppState.MOBILE_EDITOR_OPENED);
                        }
                      }}
                    >
                      <td
                        className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${
                          selectedTranscription &&
                          d.id === selectedTranscription.id
                            ? "bg-primary bg-opacity-30"
                            : ""
                        }`}
                      >
                        {transcriptionToEdit &&
                        transcriptionToEdit.arrayIndex === idx ? (
                          <div className="flex items-center gap-[5px] z-20">
                            <FaCheck
                              onClick={(e) => {
                                e.stopPropagation();
                                saveName(
                                  idx,
                                  d.id === transcriptionToEdit.arrayIndex
                                );
                              }}
                              className="m-[5px] cursor-pointer"
                            />
                            <input
                              onClick={(e) => e.stopPropagation()}
                              className="p-1"
                              type="text"
                              value={transcriptionToEdit.name}
                              onChange={handleNameChange}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-[5px] z-20">
                            <FaEdit
                              onClick={(e) => {
                                e.stopPropagation();
                                setTranscriptionToEdit({
                                  id: d.id,
                                  name: d.name,
                                  arrayIndex: idx,
                                });
                              }}
                              className="m-[5px] cursor-pointer"
                            />
                            <span
                              className="block min-w-[100px] min-h-[20px] cursor-pointer"
                              onClick={() => {
                                setAppState(AppState.EDITOR_OPENED);
                                setSelectedTranscription(d);
                              }}
                            >
                              {d.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td
                        className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${
                          selectedTranscription &&
                          d.id === selectedTranscription.id
                            ? "bg-primary bg-opacity-30"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-[5px] z-20 justify-end">
                          <svg
                            className="m-[5px] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTranscriptDelete(d.id);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
