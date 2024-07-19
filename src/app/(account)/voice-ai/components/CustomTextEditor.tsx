"use client";

import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import dynamic from "next/dynamic";
import { use, useEffect, useRef, useState } from "react";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FontSizeDropdown from "./font-size";
import { getAccessToken } from "@/helper";
import { GetTranscriptionContents } from "@/server/actions/GetTranscription";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { UpdateTranscription } from "@/server/actions/UpdateTranscription";
const randstring = require("randomstring");
import {
  exportTranscriptionDoc,
  exportTranscriptionPdf,
} from "@/server/actions/ExportTranscription";

export default function CustomTextEditor({ transcription }: { transcription: any }) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);

  const getTranscription = async (id: any) => {
    const token: string = await getAccessToken(dispatch, selector);
    const res: { success: boolean; data: any[] } =
      await GetTranscriptionContents(id, token);
    console.log("transcription contents found", res);
    if (res.success) {
      setContent(res?.data[0]?.content);
      if (res?.data[0]?.content) {
        setEditorState(
          EditorState.createWithContent(stateFromHTML(res?.data[0]?.content))
        );
      }
    }
  };

  useEffect(() => {
    getTranscription(transcription.id);
  }, [transcription]);

  const [content, setContent] = useState<string>("<h1>asdf</h1>");

  const handleEditorChange = (state: any) => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    setEditorState(state);
    setContent(html);
  };

  const [donwLoaderPDF, setDownLoaderPDF] = useState(false);
  const [donwLoaderDoc, setDownLoaderDoc] = useState(false);
  async function downloadSummaryPDF() {
    setDownLoaderPDF(true);
    const token: string = await getAccessToken(dispatch, selector);
    const fileName = transcription.name
      ? transcription.name
      : randstring.generate(10);
    await exportTranscriptionPdf(`${transcription.id}`, token, fileName);
    setDownLoaderPDF(false);
  }

  async function downloadSummaryDOCx() {
    setDownLoaderDoc(true);
    const token: string = await getAccessToken(dispatch, selector);
    const fileName = transcription.name
      ? transcription.name
      : randstring.generate(10);

    await exportTranscriptionDoc(`${transcription.id}`, token, fileName);
    setDownLoaderDoc(false);
  }

  const [saveLoading, setSaveLoading] = useState(false);
  const save = async () => {
    setSaveLoading(true);

    const token: string = await getAccessToken(dispatch, selector);
    const res: { success: boolean; data: any[] } = await UpdateTranscription(
      transcription.name,
      content,
      transcription.id,
      token
    );
    if (res.success) {
        setSaveLoading(false);
    }
  };
  const downloadButtonRef = useRef<any>(null);

  const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative inline-block text-left ml-3">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="options-menu"
            aria-expanded="true"
            aria-haspopup="true"
            ref={downloadButtonRef}
            onMouseEnter={() => {
              if (downloadButtonRef && downloadButtonRef.current) {
                downloadButtonRef.current.focus();
              }
            }}
            onMouseDown={() => {
              setIsOpen(!isOpen);
            }}
          >
            Exportieren als
          </button>
        </div>

        {isOpen && (
          <div className="origin-top-right absolute left-5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-blac bg-white z-50">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 w-full bg-white"
                role="menuitem"
                onMouseDown={() => {
                  downloadSummaryPDF();
                }}
              >
                {donwLoaderPDF ? "PDF Exportieren" : "PDF"}
              </button>
              <button
                className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 w-full bg-white"
                role="menuitem"
                onMouseDown={() => {
                  downloadSummaryDOCx();
                }}
              >
                {donwLoaderDoc ? "DOCX Exportieren" : "DOCX"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div className="">
        <div className="flex justify-start">
          <h1 className="text-lg font-semibold text-primary">Transkription</h1>
          <div className="grid grid-cols-3 gap-2">
            <Dropdown />
            <button
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => save()}
              disabled={saveLoading}
            >
              {saveLoading ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
        <div className="h-[85vh] md:h-[75vh] sm:[50vh] overflow-y-auto text-gray-500 mt-3 border border-gray-300 rounded-md">
          <Editor
            toolbar={{
              options: ["inline", "fontSize"],
              inline: {
                options: ["bold", "italic", "underline"],
              },
              fontSize: {
                options: [
                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                ],
                component: FontSizeDropdown,
              },
            }}
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
