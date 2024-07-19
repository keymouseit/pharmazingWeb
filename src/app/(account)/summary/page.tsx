"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navbar } from "@/components";
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import { stateToHTML } from 'draft-js-export-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import constants from "@/constants/general";
import { useDropzone } from "react-dropzone";
import { FaArrowLeft,FaEdit, FaCheck } from 'react-icons/fa';
import { getAccessToken } from "@/helper";
import Lottie from "lottie-react";
import bigLoadingAnimation from "@/assets/animations/bigLoading.json";
import loadingAnimation from "@/assets/animations/pdf-to-summary.json";

import Script from "next/script";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GetContents, UpdateSummary } from "@/server";

type Props = {};

import {
    useAppDispatch,
    useAppSelector,
    RootState,
} from "@/redux";
import { GetAllSummary } from "@/server";
import { exportSummaryDoc, exportSummaryPdf } from "@/server/actions/ExportSummary";

import { useMediaQuery } from 'react-responsive';
import { DeleteSummary } from "@/server/actions/DeleteSummary";
import FontSizeDropdown from "./font-size";
const randstring = require("randomstring");

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(module => module.Editor),
    { ssr: false }
);
const Dashboard = (props: any) => {

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const isLandscape = useMediaQuery({ query: '(orientation: landscape)' });

    const [isMainLoader , setMainLoader] = useState(true)
    const [donwLoaderPDF, setDownLoaderPDF] = useState(false)
    const [donwLoaderDoc, setDownLoaderDoc] = useState(false)
    const [shouldRed , setShouldRed] = useState(false);
    const [deckName, setDeckName] = useState("");
    const [decks, setDecks] = useState<any>([]);
    const dispatch = useAppDispatch();
    const selector: RootState = useAppSelector((state) => state);
    const downloadButtonRef = useRef<any>(null);
    // const router = useRouter();
    const [bulletPoint, setBulletPoint] = useState("0");
    const [files, setFiles] = useState<any>(null);
    const [name, setName] = useState('');
    const [maxSize, setMaxSize] = useState(0);
    // const router = useRouter();
    // const { decodedToken } = useSelector(state => state.Auth);
    const [warn, setWarn] = useState('');
    const [textNotes, setTextNotes] = useState('');
    const [addSummary, setAddSummary] = useState(false);
    const [summaryId, setSummaryId] = useState(0);

    // const router = useRouter();
    // const id = router?.query?.id;
    const [deckDetail, setDeckDetail] = useState<any>(null);

    const [flashcards, setFlashcards] = useState<any>([]);
    const [loading, setloading] = useState(false);

    const [content, setContent] = useState("");
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [disable, setDisable] = useState(true);
    const [loader, setLoader] = useState(false);
    const [dName, setDName] = useState('');

    const [editIndex, setEditIndex] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [idd, setIdd] = useState(0);

    const handleNameChange = (e: any) => {
        setEditName(e.target.value);
    };

    const saveName = async (idx: any, isActive=false) => {
        // Save the new name to the corresponding deck
        decks[idx].name = editName;
        setDecks(decks)
        if(isActive){
            setDName(editName)
        }
        setEditIndex(null);
        const token: string = await getAccessToken(dispatch, selector);
        await UpdateSummary(editName, undefined, decks[idx].id, token);
    };


    useEffect(() => {
        if (files) setDisable(false);
        else setDisable(true);
    }, [files])

    const handleEditorChange = (state: any) => {
        const contentState = editorState.getCurrentContent();
        const html = stateToHTML(contentState);
        setEditorState(state);
        setContent(html)
    };

    const handleDeckDelete = async(id:any) => {
        setMainLoader(true);
        const token: string = await getAccessToken(dispatch, selector);
        try{
            await DeleteSummary(id, token);
            getDecks()
        }catch(err){
            getDecks()
        }
    }

    const LoaderComp = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-999">
            <Lottie
                animationData={bigLoadingAnimation}
                loop={true}
                autoPlay={true}
                style={{ width: '200px', height: '200px' }}
            />
        </div>
    );


    const getDecks = async () => {
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await GetAllSummary(
            token,
        );
        if (res.success) {
            setDecks([...res.data]);
        }
    };

    useEffect(() => {
        getDecks();
    }, [])


    const DragAndDrop = () => {
        const onDrop = useCallback((acceptedFiles: any) => {
            setFiles(null);
            setWarn('');
            if (acceptedFiles.length) {
                const pdfs = acceptedFiles.filter((file: any) => file.type === 'application/pdf');
                if (pdfs.length) {
                    setFiles(pdfs);
                    // handleUpdateFile(pdfs);
                } else {
                    setWarn('Der Dateityp wird nicht unterstützt. Bitte lade eine PDF Datei hoch.');
                }
            } else {
                setWarn('You uploaded Mehr als 1 file / Mehr als 200MB file uploaded.');
            }
        }, []);

        let decodedToken: any;

        useEffect(() => {
            const sizeInMB = decodedToken?.decodedToken?.file_size_limit;
            const sizeInBytes = sizeInMB * 1024 * 1024;
            setMaxSize(sizeInBytes);
            // }
        }, [])

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            maxSize: maxSize,
            maxFiles: 1
        });

        return (
            <div
                {...getRootProps({ className: 'dropzone' })}
                className={
                    "border-dashed border-4 border-primary mt-5 cursor-pointer w-[80%] h-[374px] flex items-center justify-center rounded-md bg-[#F1F2F7]"
                }
            >
                <input {...getInputProps()} accept='application/pdf' />

                <div className="flex flex-col justify-center items-center">
                    {/* <CloudUploadOutlined className="text-[110px]" /> */}
                    <p className={`text-[${isMobile ? "10px" : "30px"}] font-medium`}>PDF-Datei hier hineinziehen</p>
                    <p className="text-[#9C9C9C]">oder</p>
                    <button className="py-2 px-3 bg-primary text-white rounded mt-4">Datei auswählen</button>
                    {
                        files?.length && <p className="pt-2 text-center">Ausgewählt: {
                            files.map((file: any) => file.name).join(' , ')
                        }
                        </p>
                    }
                    {
                        <p className="pt-2">{warn}</p>
                    }
                </div>

            </div >
        );
    };


    const save = async () => {
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await UpdateSummary(
            flashcards[0].name,
            content,
            flashcards[0].id,
            token,
        );
        if (res.success) {
        }
    }

    async function downloadSummaryPDF() {
        setDownLoaderPDF(true)
        const token: string = await getAccessToken(dispatch, selector);
        const deckName = dName ? dName : randstring.generate(10);
        await exportSummaryPdf(`${summaryId}`, token, deckName)
        setDownLoaderPDF(false)
    }

    async function downloadSummaryDOCx() {
        setDownLoaderDoc(true)
        const token: string = await getAccessToken(dispatch, selector);
        const deckName = dName ? dName : randstring.generate(10);
        await exportSummaryDoc(`${summaryId}`, token,deckName)
        setDownLoaderDoc(false)
    }




    const canRedirect = async () => {
        try {
            setShouldRed(true)
            setLoader(true);
            const formData = new FormData();
            formData.append("name", deckName);
            formData.append("file", files[0]);
            formData.append("bullet_point", bulletPoint);
            const token: string = await getAccessToken(dispatch, selector);
            const response = await axios.post(
                constants.urlBase + "/summary/generate-summary",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    },
                    timeout: 500000
                }
            );

            const { data } = response;
            if (data.success) {
                toast.success('Successfully Uploaded');
                setLoader(false);
                setMainLoader(true)
                setFiles(null)
                getDecks();
                setAddSummary(false);
            } else {
                throw new Error('failed')
            }

        } catch (err) {
            setTimeout(()=>{toast.success('Successfully Uploaded');setLoader(false);setMainLoader(true);getDecks();setAddSummary(false);setFiles(null);},1000 * 7)
        }
    }


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
                        onMouseEnter={()=>{
                            if(downloadButtonRef && downloadButtonRef.current){
                                downloadButtonRef.current.focus();
                            }
                        }}
                        onMouseDown={() => {
                            setIsOpen(!isOpen)
                        }}
                    >
                        {loader ? "Wird geladen" : "Herunterladen"}
                    </button>
                </div>

                {isOpen && (
                    <div className="origin-top-right absolute left-5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-blac bg-white z-50">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <button
                                disabled={deckDetail?.deck_type === 'cloze'}
                                className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 w-full bg-white"
                                role="menuitem"
                                onMouseDown={() => {
                                    downloadSummaryPDF()
                                }}
                            >
                                {donwLoaderPDF ? 'PDF Exportieren' : 'PDF'}
                            </button>
                            <button
                                disabled={deckDetail?.deck_type === 'cloze'}
                                className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 w-full bg-white"
                                role="menuitem"
                                onMouseDown={() => {
                                    downloadSummaryDOCx()
                                }}
                            >
                                {donwLoaderDoc ? 'DOCX Exportieren' : 'DOCX'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getFlashcards = async (id: any) => {
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await GetContents(
            id,
            token,
        );
        if (res.success) {
            setContent(res?.data[0]?.content)
            if (res?.data[0]?.content) {
                setEditorState(EditorState.createWithContent(stateFromHTML(res?.data[0]?.content)))
                setFlashcards([...res?.data]);
            }
            if(isMainLoader){
                setMainLoader(false)
            }
        }
    };

    useEffect(() => {
        if(shouldRed || (!isMobile)){
            setShouldRed(false)
            setSummaryId(decks[0]?.id)
            setIdd(decks[0]?.id)
            setDName(decks[0]?.name)
            getFlashcards(decks[0]?.id);
        }else if(decks.length > 0){
            setMainLoader(false)
        }
    }, [decks])

    if(isMainLoader){
        return(<LoaderComp/>)
    }

    if(loader){
        return (
        <div>
          <Navbar />
          <div
            className="flex flex-col flex-1 h-screen w-full justify-center items-center text-center"
            role="status"
          >
            <div className="">
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                autoPlay={true}
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          </div>
          </div>
        );
    }

    if (isTablet) {
        if (isLandscape) {
            return <div>
                <Navbar />
                {decks.length === 0 && <div>
                    <div className="overflow-auto h-[97vh] text-primary">
                        <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                            {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                            <p>Ensure you select the same language as your material in the language selector.</p> */}

                            <div className="flex justify-between w-[80%] sm:block mt-8">
                                <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                    <label className="block text-xs font-medium text-gray-700">Name des Decks </label>
                                    <input

                                        placeholder="Bitte Namen der Zusammenfassung eintragen"
                                        className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                        onChange={(e) => setDeckName(e.target.value)}
                                    />

                                </div>
                                <div className="mt-7">
                                    {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                </div>
                            </div>
                            <DragAndDrop />
                            {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
            </div> */}

                            {/* <div className="w-[80%]">
                <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

                <textarea
                    id="OrderNotes"
                    className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
                    rows={4}
                    placeholder="Enter any additional notes to generate from..."
                    onChange={handleTextNotesChange}
                ></textarea>
            </div> */}
                            <br />
                            <div className="flex justify-around space-x-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                    <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                        <option value="0">Grober Überblick</option>
                                        <option value="1">Normal</option>
                                        <option value="2">Detailliert</option>
                                    </select>
                                </div>
                                {/* <div>
                    <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
                    <select name="Number Of Cards" id="Number Of Cards">
                        <option value="50 - 100">50 - 100</option>
                        <option value="100 - 250">100 - 250</option>
                        <option value="⁠250 - 400">⁠250 - 400</option>
                        <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
                    </select>
                </div> */}
                            </div>
                            <div className="w-[80%] flex justify-between">
                                <div></div>
                                <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                    {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                </button>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>}
                <div className="flex">
                    {!addSummary && decks.length > 0 && flashcards.length === 0 && <div>
                        {/* <Provider store={reduxStore}> */}
                        <Script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></Script>
                        <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
                        <Script type="module" src="https://assets.cello.so/app/latest/cello.js" async></Script>

                        {/* <Banner /> */}
                        <div className="overflow-hidden">
                            <nav className="lg:hidden md:hidden fixed z-50 h-20 text-white mainSetting border-red-60 flex items-center px-10">
                                <div className="flex items-center justify-center">
                                </div>
                            </nav>
                            {/* <Navbar /> */}
                            <div className="flex w-full h-screen">

                                <div className="flex-grow bg-white overflow-y-auto mainSetting h-full p-12">
                                    {/* {error && (
                <ErrorDialog message={error} onClose={() => setError(null)} />
            )} */}
                                    <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
                                        {/* <div className="bg-red-500 mb-4  rounded-lg p-4 shadow-lg"><p className="text-white text-center">We apologize for the inconvenience. Our server is currently experiencing high demand and may have intermittent downtime. We are actively working to resolve this issue ASAP (before Saturday).</p>
</div> */}
                                        <div className="flex justify-between items-center mb-4">
                                            {/* <h1 className="text-2xl font-semibold">Hello {changeEmailToName(decodedToken?.decodedToken?.email)}! 👋</h1> */}
                                            <h1 className="text-2xl font-semibold">
                                                <span className="text-primary">Keyword</span> <span className="text-secondary">AI</span>
                                                </h1>
                                            {!addSummary && <div>
                                                <button
                                                    className="py-2 px-3 bg-secondary text-white rounded"
                                                    onClick={() => setAddSummary(!addSummary)}
                                                >
                                                    Zusammenfassung erstellen
                                                </button>
                                            </div>
                                            }
                                        </div>

                                        <div className="overflow-x-auto bg-white shadow rounded-md">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left" >Zusammenfassung</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left" ></th>
                                                        {/* <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Deck Type</th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Number of Cards</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {decks.map((d: any, idx: number) => <tr className="text-left" onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}>
                                                        <td
                                                            className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                        >
                                                            {editIndex === idx ? (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaCheck
                                                                 onClick={(e)=>{e.stopPropagation();saveName(idx, d.id === idd)}}
                                                                 className="m-[5px] cursor-pointer"/>
                                                            <input
                                                                onClick={(e)=>e.stopPropagation()}
                                                                className="p-1"
                                                                type="text"
                                                                value={editName}
                                                                onChange={handleNameChange}
                                                                autoFocus
                                                            />
                                                            </div>
                                                            ) : (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaEdit onClick={(e)=>{
                                                                    e.stopPropagation()
                                                                    setEditIndex(idx);
                                                                    setEditName(d.name);
                                                                }} className="m-[5px] cursor-pointer" />
                                                                <span className="block min-w-[100px] min-h-[20px] cursor-pointer"
                                                                onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}
                                                                >
                                                                    {d.name}
                                                                </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-end">
                                                                    <svg className="m-[5px] cursor-pointer" onClick={(e)=>{
                                                                                e.stopPropagation()
                                                                                handleDeckDelete(d.id)
                                                                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                                    </svg>
                                                                </div>
                                                                </td>
                                                    </tr>)}
                                                    {/* {renderTableContent()} */}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <ToastContainer /> */}
                                    </div>
                                    {/* <Component
                {...pageProps}
                user={user}
                signIn={signIn}
                signOut={signOut}
                form={form}
                setForm={setForm}

            /> */}
                                </div>
                            </div>
                        </div>
                        {/* </Provider > */}
                    </div>}
                    {addSummary && flashcards.length === 0 && <div>
                        <button className="flex w-full text-primary py-2 mt-20 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                            <FaArrowLeft className="mr-5 mt-1" />
                            Alle Zusammenfassung
                        </button>
                        <div className="overflow-auto h-[97vh] text-primary">
                            <div className="flex flex-col items-center justify-center px-auto mb-20">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-8">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name des Decks </label>
                                        <input

                                            placeholder="Bitte Namen der Zusammenfassung eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                    <div className="mt-7">
                                        {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                    </div>
                                </div>
                                <DragAndDrop />
                                {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
</div> */}

                                {/* <div className="w-[80%]">
    <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

    <textarea
        id="OrderNotes"
        className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
        rows={4}
        placeholder="Enter any additional notes to generate from..."
        onChange={handleTextNotesChange}
    ></textarea>
</div> */}
                                <br />
                                <div className="flex justify-around space-x-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                        <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                            <option value="0">Grober Überblick</option>
                                            <option value="1">Normal</option>
                                            <option value="2">Detailliert</option>
                                        </select>
                                    </div>
                                    {/* <div>
        <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
        <select name="Number Of Cards" id="Number Of Cards">
            <option value="50 - 100">50 - 100</option>
            <option value="100 - 250">100 - 250</option>
            <option value="⁠250 - 400">⁠250 - 400</option>
            <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
        </select>
    </div> */}
                                </div>
                                <div className="w-[60%] flex">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-primary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>}
                    {!addSummary && flashcards.length > 0 && <div>
                        <button className="flex w-full text-primary py-2 mt-20 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                            <FaArrowLeft className="mr-5 mt-1" />
                            Alle Zusammenfassung
                        </button>
                        <div>
                            <div className="flex items-center justify-center text-primary">

                                {/* {
    // Conditional rendering based on whether a PDF URL is available
    pdfUrl ? (
        <div className='h-[95vh] sm:h-[50vh] overflow-y-auto mt-[-46px] sm:mt-[10px]'>
            <div className="Example__container__document" ref={setContainerRef}>
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} options={options} onLoadError={() => {
                    setText('PDF Not Loading ...');
                }}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        />
                    ))}
                </Document>
            </div>
        </div>
    ) : (
        <p className='font-semibold'>No PDF associated with this deck.</p>
    )
} */}

                                {/* EHYMAD CODE */}
                                {/* {
    !pdfUrl ? <p className='text-[45px] font-semibold'>{text}</p> : <div className='h-[95vh] sm:h-[50vh] overflow-y-auto mt-[-46px] sm:mt-[10px]'>
        <div className="Example__container__document" ref={setContainerRef}>
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} options={options} onLoadError={() => {
                setText('Not Working...');
            }}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                    />
                ))}
            </Document>
        </div>

    </div>
} */}
                                <div>
                                    <div className='flex justify-start'>
                                        <h1 className='text-lg font-semibold'>Zusammenfassung</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                            <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => save()} disabled={loading}>{loading ? 'Saving...' : 'Speichern'}</button>
                                            {/* <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={startReview}>Review</button> */}
                                        </div>
                                    </div>
                                    {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                    {flashcards.length > 0 ? <div className='h-[85vh] md:h-[75vh] sm:[50vh] overflow-y-auto text-gray-500 mt-3 border border-gray-300 rounded-md mr-4'>
                                            <Editor
                                                toolbar={{
                                                    options: ['inline','fontSize'],
                                                    inline: {
                                                        options: ['bold', 'italic', 'underline']
                                                    },
                                                    fontSize: {
                                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                                        component: FontSizeDropdown
                                                    }
                                                }}
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                            />
                                    </div> : null
                                    }
                                </div>

                                <ToastContainer />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        }
        if (isPortrait) {
            return (
                <div>
                    <Navbar />
                    {decks.length === 0 && <div>
                        <div className="overflow-auto h-[97vh] text-primary">
                            <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-8">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                        <input
                                            placeholder="Bitte Namen der Zusammenfassung eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                    <div className="mt-7">
                                        {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                    </div>
                                </div>
                                <DragAndDrop />
                                {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
            </div> */}

                                {/* <div className="w-[80%]">
                <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

                <textarea
                    id="OrderNotes"
                    className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
                    rows={4}
                    placeholder="Enter any additional notes to generate from..."
                    onChange={handleTextNotesChange}
                ></textarea>
            </div> */}
                                <br />
                                <div className="flex justify-around space-x-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                        <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                            <option value="0">Grober Überblick</option>
                                            <option value="1">Normal</option>
                                            <option value="2">Detailliert</option>
                                        </select>
                                    </div>
                                    {/* <div>
                    <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
                    <select name="Number Of Cards" id="Number Of Cards">
                        <option value="50 - 100">50 - 100</option>
                        <option value="100 - 250">100 - 250</option>
                        <option value="⁠250 - 400">⁠250 - 400</option>
                        <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
                    </select>
                </div> */}
                                </div>
                                <div className="w-[80%] flex justify-between">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-primary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>}
                    <div>
                        {!addSummary && decks.length > 0 && flashcards.length === 0 && <div>
                            {/* <Provider store={reduxStore}> */}
                            <Script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></Script>
                            <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
                            <Script type="module" src="https://assets.cello.so/app/latest/cello.js" async></Script>

                            {/* <Banner /> */}
                            <div className="overflow-hidden">
                                <nav className="lg:hidden md:hidden fixed z-50 h-20 text-white mainSetting border-red-60 flex items-center px-10">
                                    <div className="flex items-center justify-center">
                                    </div>
                                </nav>
                                {/* <Navbar /> */}
                                <div className="flex w-full h-screen">

                                    <div className="flex-grow bg-white overflow-y-auto mainSetting h-full p-12">
                                        {/* {error && (
                <ErrorDialog message={error} onClose={() => setError(null)} />
            )} */}
                                        <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
                                            {/* <div className="bg-red-500 mb-4  rounded-lg p-4 shadow-lg"><p className="text-white text-center">We apologize for the inconvenience. Our server is currently experiencing high demand and may have intermittent downtime. We are actively working to resolve this issue ASAP (before Saturday).</p>
</div> */}
                                            <div className="flex justify-between items-center mb-4">
                                                {/* <h1 className="text-2xl font-semibold">Hello {changeEmailToName(decodedToken?.decodedToken?.email)}! 👋</h1> */}
                                                <h1 className="text-2xl font-semibold">
                                                <span className="text-primary">Keyword</span> <span className="text-secondary">AI</span>
                                                </h1>
                                                {!addSummary && <div>
                                                    <button
                                                        className="py-2 px-3 bg-secondary text-white rounded"
                                                        onClick={() => setAddSummary(!addSummary)}
                                                    >
                                                        Zusammenfassung erstellen
                                                    </button>
                                                </div>
                                                }
                                            </div>

                                            <div className="overflow-x-auto bg-white shadow rounded-md">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left">Zusammenfassung</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left"></th>
                                                            {/* <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Deck Type</th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Number of Cards</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {decks.map((d: any, idx: number) => <tr className="text-left" onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}>
                                                            <td
                                                                className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                            >
                                                                {editIndex === idx ? (
                                                                   <div className="flex items-center gap-[5px] z-20">
                                                                   <FaCheck
                                                                    onClick={(e)=>{e.stopPropagation();saveName(idx, d.id === idd)}}
                                                                    className="m-[5px] cursor-pointer"/>
                                                               <input
                                                                    onClick={(e)=>e.stopPropagation()}
                                                                   className="p-1"
                                                                   type="text"
                                                                   value={editName}
                                                                   onChange={handleNameChange}
                                                                   autoFocus
                                                               />
                                                               </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-[5px] z-20">
                                                                    <FaEdit onClick={(e)=>{
                                                                        e.stopPropagation()
                                                                        setEditIndex(idx);
                                                                        setEditName(d.name);
                                                                    }} className="m-[5px] cursor-pointer" />
                                                                    <span className="block min-w-[100px] min-h-[20px] cursor-pointer"
                                                                    onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}
                                                                    >
                                                                        {d.name}
                                                                    </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-end">
                                                                    <svg className="m-[5px] cursor-pointer" onClick={(e)=>{
                                                                                e.stopPropagation()
                                                                                handleDeckDelete(d.id)
                                                                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                                    </svg>
                                                                </div>
                                                                </td>
                                                        </tr>)}
                                                        {/* {renderTableContent()} */}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* <ToastContainer /> */}
                                        </div>
                                        {/* <Component
                {...pageProps}
                user={user}
                signIn={signIn}
                signOut={signOut}
                form={form}
                setForm={setForm}

            /> */}
                                    </div>
                                </div>
                            </div>
                            {/* </Provider > */}
                        </div>}
                        {addSummary && flashcards.length === 0 && 
                        <div className="pl-8">
                            <button className="flex w-full text-primary py-2 mt-20 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                                <FaArrowLeft className="mr-5 mt-1" />
                                Alle Zusammenfassung
                            </button>
                            <div className="overflow-auto h-[97vh] text-primary">
                                <div className="flex flex-col items-center justify-center px-auto mb-20">
                                    {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                    <p>Ensure you select the same language as your material in the language selector.</p> */}

                                    <div className="flex justify-between w-[80%] sm:block mt-8">
                                        <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                            <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                            <input

                                                placeholder="Bitte Namen der Zusammenfassung eintragen"
                                                className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                onChange={(e) => setDeckName(e.target.value)}
                                            />

                                        </div>
                                        <div className="mt-7">
                                            {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                        </div>
                                    </div>
                                    <DragAndDrop />
                                    {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
    <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
</div> */}

                                    {/* <div className="w-[80%]">
    <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

    <textarea
        id="OrderNotes"
        className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
        rows={4}
        placeholder="Enter any additional notes to generate from..."
        onChange={handleTextNotesChange}
    ></textarea>
</div> */}
                                    <br />
                                    <div className="flex justify-around space-x-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                            <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                                <option value="0">Grober Überblick</option>
                                                <option value="1">Normal</option>
                                                <option value="2">Detailliert</option>
                                            </select>
                                        </div>
                                        {/* <div>
        <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
        <select name="Number Of Cards" id="Number Of Cards">
            <option value="50 - 100">50 - 100</option>
            <option value="100 - 250">100 - 250</option>
            <option value="⁠250 - 400">⁠250 - 400</option>
            <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
        </select>
    </div> */}
                                    </div>
                                    <div className="w-[60%] flex">
                                        <div></div>
                                        <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                            {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                        </button>
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        </div>}
                        {!addSummary && flashcards.length > 0 && <div className="pl-8 pr-8">
                            <button className="flex w-full text-primary py-2 mt-20 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                                <FaArrowLeft className="mr-5 mt-1" />
                                Alle Zusammenfassung
                            </button>
                            <div>
                                <div className="flex items-center justify-center text-primary">

                                    {/* {
    // Conditional rendering based on whether a PDF URL is available
    pdfUrl ? (
        <div className='h-[95vh] sm:h-[50vh] overflow-y-auto mt-[-46px] sm:mt-[10px]'>
            <div className="Example__container__document" ref={setContainerRef}>
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} options={options} onLoadError={() => {
                    setText('PDF Not Loading ...');
                }}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        />
                    ))}
                </Document>
            </div>
        </div>
    ) : (
        <p className='font-semibold'>No PDF associated with this deck.</p>
    )
} */}

                                    {/* EHYMAD CODE */}
                                    {/* {
    !pdfUrl ? <p className='text-[45px] font-semibold'>{text}</p> : <div className='h-[95vh] sm:h-[50vh] overflow-y-auto mt-[-46px] sm:mt-[10px]'>
        <div className="Example__container__document" ref={setContainerRef}>
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} options={options} onLoadError={() => {
                setText('Not Working...');
            }}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                    />
                ))}
            </Document>
        </div>

    </div>
} */}
                                    <div>
                                        <div className='flex justify-start'>
                                            <h1 className='text-lg font-semibold'>Zusammenfassung</h1>
                                            <div className='grid grid-cols-3 gap-2'>
                                                <Dropdown />
                                                <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => save()} disabled={loading}>{loading ? 'Saving...' : 'Speichern'}</button>
                                                {/* <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={startReview}>Review</button> */}
                                            </div>
                                        </div>
                                        {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                        {flashcards.length > 0 ? <div className='h-[85vh] sm:[50vh] overflow-y-auto text-gray-500 mt-3 border border-gray-300 rounded-md mr-4'>
                                        <Editor
                                                toolbar={{
                                                    options: ['inline','fontSize'],
                                                    inline: {
                                                        options: ['bold', 'italic', 'underline']
                                                    },
                                                    fontSize: {
                                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                                        component: FontSizeDropdown
                                                    }
                                                }}
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                            />
                                        </div> : null
                                        }
                                    </div>

                                    <ToastContainer />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            )
        }
    } else if (isMobile) {
        return (
            <div>
                <Navbar />
                {decks.length === 0 && <div>
                    <div className="overflow-auto h-[97vh] text-primary">
                        <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                            {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                            <p>Ensure you select the same language as your material in the language selector.</p> */}

                            <div className="flex justify-between w-[80%] sm:block mt-8">
                                <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                    <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                    <input

                                        placeholder="Bitte Namen der Zusammenfassung eintragen"
                                        className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                        onChange={(e) => setDeckName(e.target.value)}
                                    />

                                </div>
                                <div className="mt-7">
                                    {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                </div>
                            </div>
                            <DragAndDrop />
                            {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
            </div> */}

                            {/* <div className="w-[80%]">
                <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

                <textarea
                    id="OrderNotes"
                    className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
                    rows={4}
                    placeholder="Enter any additional notes to generate from..."
                    onChange={handleTextNotesChange}
                ></textarea>
            </div> */}
                            <br />
                            <div className="flex pl-8 text-center">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                    <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                        <option value="0">Grober Überblick</option>
                                        <option value="1">Normal</option>
                                        <option value="2">Detailliert</option>
                                    </select>
                                </div>
                                {/* <div>
                    <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
                    <select name="Number Of Cards" id="Number Of Cards">
                        <option value="50 - 100">50 - 100</option>
                        <option value="100 - 250">100 - 250</option>
                        <option value="⁠250 - 400">⁠250 - 400</option>
                        <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
                    </select>
                </div> */}
                            </div>
                            <div className="w-[80%] flex justify-center">
                                <div></div>
                                <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                    {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                </button>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>}
                <div>
                    {!addSummary && decks.length > 0 && flashcards.length === 0 && 
                    <div className="pl-4">
                    <div className="w-full h-screen">

                                <div className="flex-grow bg-white overflow-y-auto mainSetting h-full pl-4 pr-8 pt-10">
                                    {/* {error && (
                    <ErrorDialog message={error} onClose={() => setError(null)} />
                )} */}
                                    <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
                                        {/* <div className="bg-red-500 mb-4  rounded-lg p-4 shadow-lg"><p className="text-white text-center">We apologize for the inconvenience. Our server is currently experiencing high demand and may have intermittent downtime. We are actively working to resolve this issue ASAP (before Saturday).</p>
</div> */}
                                        <div className="block justify-between items-center mb-4">
                                            {/* <h1 className="text-2xl font-semibold">Hello {changeEmailToName(decodedToken?.decodedToken?.email)}! 👋</h1> */}
                                            <h1 className="text-2xl font-semibold">
                                                <span className="text-primary">Keyword</span> <span className="text-secondary">AI</span>
                                                </h1>
                                            {!addSummary && <div>
                                                <button
                                                    className="py-2 px-3 bg-secondary text-white rounded"
                                                    onClick={() => setAddSummary(!addSummary)}
                                                >
                                                    Zusammenfassung erstellen
                                                </button>
                                            </div>
                                            }
                                        </div>

                                        <div className="overflow-x-auto bg-white shadow rounded-md">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left">Zusammenfassung</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left"></th>
                                                        {/* <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Deck Type</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Number of Cards</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {decks.map((d: any, idx: number) => <tr className="text-left" onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}>
                                                        <td
                                                            className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                        >
                                                            {editIndex === idx ? (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaCheck
                                                                 onClick={(e)=>{e.stopPropagation();saveName(idx, d.id === idd)}}
                                                                 className="m-[5px] cursor-pointer"/>
                                                            <input
                                                            onClick={(e)=>e.stopPropagation()}
                                                                className="p-1"
                                                                type="text"
                                                                value={editName}
                                                                onChange={handleNameChange}
                                                                autoFocus
                                                            />
                                                            </div>
                                                            ) : (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaEdit onClick={(e)=>{
                                                                    e.stopPropagation()
                                                                    setEditIndex(idx);
                                                                    setEditName(d.name);
                                                                }} className="m-[5px] cursor-pointer" />
                                                                <span className="block min-w-[100px] min-h-[20px] cursor-pointer"
                                                                onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}
                                                                >
                                                                    {d.name}
                                                                </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-end">
                                                                    <svg className="m-[5px] cursor-pointer" onClick={(e)=>{
                                                                                e.stopPropagation()
                                                                                handleDeckDelete(d.id)
                                                                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                                    </svg>
                                                                </div>
                                                                </td>
                                                    </tr>)}
                                                    {/* {renderTableContent()} */}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <ToastContainer /> */}
                                    </div>
                                    {/* <Component
                    {...pageProps}
                    user={user}
                    signIn={signIn}
                    signOut={signOut}
                    form={form}
                    setForm={setForm}

                /> */}
                                </div>
                    </div>
                    </div>}
                    {addSummary && flashcards.length === 0 && 
                    <div className="overflow-auto h-[97vh] text-primary pl-4 mt-4">
                        <button className="flex w-full text-primary py-2 mt-16 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                            <FaArrowLeft className="mr-5 mt-1" />
                            Alle Zusammenfassung
                        </button>
                        <div className="flex flex-col items-center justify-center px-auto mb-28 sm:p-0">
                            <div className="flex flex-col items-center justify-center px-auto mb-20">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-8">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                        <input

                                            placeholder="Bitte Namen der Zusammenfassung eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                    <div className="mt-7">
                                        {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                    </div>
                                </div>
                                <DragAndDrop />
                                {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
        <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
        <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
        <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
    </div> */}

                                {/* <div className="w-[80%]">
        <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

        <textarea
            id="OrderNotes"
            className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
            rows={4}
            placeholder="Enter any additional notes to generate from..."
            onChange={handleTextNotesChange}
        ></textarea>
    </div> */}
                                <br />
                                <div className="text-center">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                        <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                            <option value="0">Grober Überblick</option>
                                            <option value="1">Normal</option>
                                            <option value="2">Detailliert</option>
                                        </select>
                                    </div>
                                    {/* <div>
            <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
            <select name="Number Of Cards" id="Number Of Cards">
                <option value="50 - 100">50 - 100</option>
                <option value="100 - 250">100 - 250</option>
                <option value="⁠250 - 400">⁠250 - 400</option>
                <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
            </select>
        </div> */}
                                </div>
                                <div className="w-[60%] flex">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>}
                    {!addSummary && flashcards.length > 0 && 
                    <div className="pl-8 pr-4">
                        <button className="flex w-full text-primary py-2 mt-16 mb-2" onClick={() => { setFlashcards([]); setAddSummary(false) }}>
                            <FaArrowLeft className="mr-5 mt-1" />
                            Alle Zusammenfassung
                        </button>
                        <div>
                            <div className="flex items-center justify-center text-primary">
                                <div>
                                    <div className='block justify-start'>
                                        <h1 className='text-lg font-semibold'>Zusammenfassung</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                            <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => save()} disabled={loading}>{loading ? 'Sparen...' : 'Speichern'}</button>
                                            {/* <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={startReview}>Review</button> */}
                                        </div>
                                    </div>
                                    {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                    {flashcards.length > 0 ? <div className='h-[65vh] sm:h-[55vh] xs:h-[60vh] overflow-y-auto text-gray-500 mt-3 border border-gray-300 rounded-md mr-4'>
                                    <Editor
                                                toolbar={{
                                                    options: ['inline','fontSize'],
                                                    inline: {
                                                        options: ['bold', 'italic', 'underline']
                                                    },
                                                    fontSize: {
                                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                                        component: FontSizeDropdown
                                                    }
                                                }}
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                            />
                                    </div> : null
                                    }
                                </div>

                                <ToastContainer />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Navbar />
                {decks.length === 0 && <div>
                    <div className="overflow-auto h-[97vh] text-primary">
                        <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                            {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                            <p>Ensure you select the same language as your material in the language selector.</p> */}

                            <div className="flex justify-between w-[80%] sm:block mt-8">
                                <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                    <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                    <input

                                        placeholder="Bitte Namen der Zusammenfassung eintragen"
                                        className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                        onChange={(e) => setDeckName(e.target.value)}
                                    />

                                </div>
                                <div className="mt-7">
                                    {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                </div>
                            </div>
                            <DragAndDrop />
                            {/* <div className="py-5 w-[80%] flex justify-between sm:grid sm:grid-col-1 xs:grid xs:grid-col-1">
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Maximum Upload file size: <span className="text-black font-bold">{decodedToken?.decodedToken?.file_size_limit}MB</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">{decodedToken?.decodedToken?.subscribed_plan === 'free' ? 'PDF File Quote:' : 'PDF Files per day:'} <span className="text-black font-bold">{decodedToken?.decodedToken?.daily_flash_card_limit} {decodedToken?.decodedToken?.daily_flash_card_limit === 1 ? 'File' : 'Files'}</span></span>
                <span className="text-[#9C9C9C] sm:mt-2 xs:mt-2">Character limit: <span className="text-black font-bold">{decodedToken?.decodedToken?.word_limit} characters</span></span>
            </div> */}

                            {/* <div className="w-[80%]">
                <label for="OrderNotes" className="block text-sm font-medium text-gray-700"> Copy and Paste Notes </label>

                <textarea
                    id="OrderNotes"
                    className="mt-2 w-full p-4 rounded-lg border-gray-400 align-top shadow-sm sm:text-sm"
                    rows={4}
                    placeholder="Enter any additional notes to generate from..."
                    onChange={handleTextNotesChange}
                ></textarea>
            </div> */}
                            <br />
                            <div className="flex justify-around space-x-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                    <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                        <option value="0">Grober Überblick</option>
                                        <option value="1">Normal</option>
                                        <option value="2">Detailliert</option>
                                    </select>
                                </div>
                                {/* <div>
                    <label  className="text-sm font-medium text-gray-700 pr-5">Number Of Cards</label>
                    <select name="Number Of Cards" id="Number Of Cards">
                        <option value="50 - 100">50 - 100</option>
                        <option value="100 - 250">100 - 250</option>
                        <option value="⁠250 - 400">⁠250 - 400</option>
                        <option value="⁠⁠Mehr als 400">⁠⁠Mehr als 400</option>
                    </select>
                </div> */}
                            </div>
                            <div className="w-[80%] flex justify-between">
                                <div></div>
                                <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                    {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                </button>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>}
                <div className="flex">
                    <div className="w-[40%]">
                        {/* <Provider store={reduxStore}> */}
                        <Script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></Script>
                        <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
                        <Script type="module" src="https://assets.cello.so/app/latest/cello.js" async></Script>

                        {/* <Banner /> */}
                        <div className="overflow-hidden">
                            <nav className="lg:hidden md:hidden fixed z-50 h-20 text-white mainSetting border-red-60 flex items-center px-10">
                                <div className="flex items-center justify-center">
                                </div>
                            </nav>
                            {/* <Navbar /> */}
                            <div className="flex w-full h-screen">

                                <div className="flex-grow bg-white overflow-y-auto mainSetting h-full p-12">
                                    {/* {error && (
                            <ErrorDialog message={error} onClose={() => setError(null)} />
                        )} */}
                                    <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
                                        {/* <div className="bg-red-500 mb-4  rounded-lg p-4 shadow-lg"><p className="text-white text-center">We apologize for the inconvenience. Our server is currently experiencing high demand and may have intermittent downtime. We are actively working to resolve this issue ASAP (before Saturday).</p>
      </div> */}
                                        <div className="flex justify-between items-center mb-4">
                                            {/* <h1 className="text-2xl font-semibold">Hello {changeEmailToName(decodedToken?.decodedToken?.email)}! 👋</h1> */}
                                            <h1 className="text-2xl font-semibold">
                                                <span className="text-primary">Keyword</span> <span className="text-secondary">AI</span>
                                            </h1>
                                            {!addSummary && <div>
                                                <button
                                                    className="py-2 px-3 bg-secondary text-white rounded"
                                                    onClick={() => setAddSummary(!addSummary)}
                                                >
                                                    Zusammenfassung erstellen
                                                </button>
                                            </div>
                                            }
                                        </div>

                                        <div className="overflow-x-auto bg-white shadow rounded-md">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left">Zusammenfassung</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left"></th>
                                                        {/* <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Deck Type</th>
                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-right">Number of Cards</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {decks.map((d: any, idx: number) => <tr className="text-left" onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}>
                                                        <td
                                                            className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                        >
                                                            {editIndex === idx ? (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaCheck
                                                                 onClick={(e)=>{e.stopPropagation();saveName(idx, d.id === idd)}}
                                                                 className="m-[5px] cursor-pointer"/>
                                                            <input
                                                            onClick={(e)=>e.stopPropagation()}
                                                                className="p-1"
                                                                type="text"
                                                                value={editName}
                                                                onChange={handleNameChange}
                                                                autoFocus
                                                            />
                                                            </div>
                                                            ) : (
                                                                <div className="flex items-center gap-[5px] z-20">
                                                                <FaEdit onClick={(e)=>{
                                                                    e.stopPropagation()
                                                                    setEditIndex(idx);
                                                                    setEditName(d.name);
                                                                }} className="m-[5px] cursor-pointer" />
                                                                <span className="block min-w-[100px] min-h-[20px] cursor-pointer"
                                                                onClick={() => { getFlashcards(d.id); setAddSummary(false); setSummaryId(d.id); setDName(d.name); setIdd(d.id) }}
                                                                >
                                                                    {d.name}
                                                                </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className={`px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-end">
                                                                    <svg className="m-[5px] cursor-pointer" onClick={(e)=>{
                                                                                e.stopPropagation()
                                                                                handleDeckDelete(d.id)
                                                                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                                    </svg>
                                                                </div>
                                                                </td>
                                                    </tr>)}
                                                    {/* {renderTableContent()} */}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <ToastContainer /> */}
                                    </div>
                                    {/* <Component
                            {...pageProps}
                            user={user}
                            signIn={signIn}
                            signOut={signOut}
                            form={form}
                            setForm={setForm}

                        /> */}
                                </div>
                            </div>
                        </div>
                        {/* </Provider > */}
                    </div>
                    {addSummary && <div className="w-[60%]">
                        <div className="overflow-auto h-[97vh] text-primary">
                            <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-8">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name der Zusammenfassung</label>
                                        <input

                                            placeholder="Bitte Namen der Zusammenfassung eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                    <div className="mt-7">
                                        {/* <LanguageSelector handleUpdateLanguage={handleUpdateLanguage} /> */}
                                    </div>
                                </div>
                                <DragAndDrop />
                                <br />
                                <div className="flex justify-around space-x-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Wie detailliert soll die Zusammenfassung sein?</label>
                                        <select name="Length Of Summary" id="Length Of Summary" onChange={(e) => setBulletPoint(e.target.value)}>
                                            <option value="0">Grober Überblick</option>
                                            <option value="1">Normal</option>
                                            <option value="2">Detailliert</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-[80%] flex justify-between">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Zusammenfassung erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>}
                    {!addSummary && <div className="w-[60%]">
                        <div>
                            <div className="flex items-center justify-center mt-[4.75rem] text-primary">

                                <div>
                                    <div className='flex justify-start'>
                                        <h1 className='text-lg font-semibold'>Zusammenfassung</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                            <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => save()} disabled={loading}>{loading ? 'Saving...' : 'Speichern'}</button>
                                            {/* <button className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={startReview}>Review</button> */}
                                        </div>
                                    </div>
                                    {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                    {flashcards.length > 0 ?
                                        <div className='h-[85vh] md:h-[75vh] sm:[50vh] overflow-y-auto text-gray-500 mt-3 border border-gray-300 rounded-md mr-14'>
                                            <Editor
                                                toolbar={{
                                                    options: ['inline','fontSize'],
                                                    inline: {
                                                        options: ['bold', 'italic', 'underline']
                                                    },
                                                    fontSize: {
                                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                                        component: FontSizeDropdown
                                                    }
                                                }}
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                            />
                                        </div> : null
                                    }
                                </div>
                                <ToastContainer />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default Dashboard;