"use client";

import { NextPage } from "next";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from "@/components";
import { useRouter } from "next/router";
import { FaArrowLeft,FaEdit, FaCheck, FaTrash } from 'react-icons/fa';
import axios from "axios";
import constants from "@/constants/general";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import bigLoadingAnimation from "@/assets/animations/bigLoading.json";
import loadingAnimation from "@/assets/animations/pdf-to-flashcard.json";

type Props = {};

import {
    useAppDispatch,
    useAppSelector,
    RootState,
} from "@/redux";
import { GenerateFlashcard, GetDecks, GetFlashcards, DeleteFlashcards, UpdateDeck } from "@/server";
import Script from "next/script";
import { createPDF, createCustomAnkiForFlashcards, createTextFile } from "@/helper/export";
import { getAccessToken } from "@/helper";

import { useMediaQuery } from 'react-responsive';
import { UpdateFlashcard } from "@/server/actions/UpdateFlashcard";
import { exportDeckPdf } from "@/server/actions/ExportDeck";
import { DeleteDeck } from "@/server/actions/DeleteDeck";
const randstring = require("randomstring");

const Flashcard = (props: Props) => {

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const isLandscape = useMediaQuery({ query: '(orientation: landscape)' });

    const [isMainLoader , setMainLoader] = useState(true);
    const [shouldRed , setShouldRed] = useState(false)
    const [donwLoaderPDF, setDownLoaderPDF] = useState(false);
    const [donwLoaderAnki, setDownLoaderAnki] = useState(false);
    const [donwLoaderTxt, setDownLoaderTxt] = useState(false);
    const downloadButtonRef = useRef<any>(null);
    const [files, setFiles] = useState<any>(null);
    const [name, setName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [delLoader, setDelLoader] = useState('');
    const [flashcards, setFlashcards] = useState<any[]>([])
    const [deckName, setDeckName] = useState('');
    const [dName, setDName] = useState('');
    const [idd, setIdd] = useState(0);
    const dispatch = useDispatch();
    const [dif, setDif] = useState("Easy");
    const [cards, setCards] = useState("1");
    const [type, setType] = useState("anki");
    const [warn, setWarn] = useState('');
    const [textNotes, setTextNotes] = useState('');
    const [decks, setDecks] = useState<any>([]);
    const [addDeck, setAddDeck] = useState(false);
    const selector: RootState = useAppSelector((state) => state);
    const [deckDetail, setDeckDetail] = useState<any>(null);
    const [disable, setDisable] = useState(true);
    const [loader, setLoader] = useState(false);

    const [editIndex, setEditIndex] = useState<any>(null);
    const [editName, setEditName] = useState('');

    const handleNameChange = (e: any) => {
        setEditName(e.target.value);
    };

    const saveName = async (idx: any, isActive = false) => {
        decks[idx].name = editName;
        setDecks(decks)
        if(isActive){
            setDName(editName)
        }
        setEditIndex(null);
        const token: string = await getAccessToken(dispatch, selector);
        await UpdateDeck(editName, decks[idx].id, token);
        
    };

    useEffect(() => {
        if (files) setDisable(false);
        else setDisable(true);
    }, [deckName, files])

    const DragAndDrop = () => {
        const onDrop = useCallback((acceptedFiles: any) => {
            setFiles(null);
            setWarn('');
            if (acceptedFiles.length) {
                const pdfs = acceptedFiles.filter((file: any) => file.type === 'application/pdf');
                if (pdfs.length) {
                    setFiles(pdfs);
                } else {
                    setWarn('Der Dateityp wird nicht unterstützt. Bitte lade eine PDF Datei hoch.');
                }
            } else {
                setWarn('You uploaded Mehr als 1 file / Mehr als 200MB file uploaded.');
            }
        }, []);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            maxSize: 100 * 1024 * 1024,
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
                        <p className="pt-2 text-center">{warn}</p>
                    }
                </div>

            </div >
        );
    };

    const handleEditFlashcard = async (id: any, obj: any) => {
        try {
            if (!isEdit) return;
            setIsEdit(false)
            const token: string = await getAccessToken(dispatch, selector);
            UpdateFlashcard(id, obj, token)
        } catch (err) {

        }
    }


    const canRedirect = async () => {
        try {
            setLoader(true);
            setShouldRed(true)
            const formData = new FormData();
            formData.append("deckName", deckName);
            formData.append("file", files[0]);
            formData.append("type", type);
            formData.append("numberOfFlashcards", cards);
            formData.append("difficulty", dif);
            const token: string = await getAccessToken(dispatch, selector);
            const response = await axios.post(
                constants.urlBase + "/flashcards/generate-flashcards",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const { data } = response;
            setLoader(false);
            toast.success('Successfully Uploaded');
            setMainLoader(true)
            setFiles(null)
            getDecks()
            setAddDeck(false)
            return;
        } catch (err) {
            setTimeout(()=>{toast.success('Successfully Uploaded');setLoader(false); setMainLoader(true);getDecks();setAddDeck(false);setFiles(null);},1000 * 7)
        }
    }

    const getDecks = async () => {
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await GetDecks(
            token,
        );
        if (res.success) {
            setDecks([...res.data]);
        }
    };

    useEffect(() => {
        getDecks();
    }, [])

    async function downloadBase64Pdf() {
        setDownLoaderPDF(true)
        setLoader(true);
        const token: string = await getAccessToken(dispatch, selector);
        const deckName = dName ? dName : randstring.generate(10);
        await exportDeckPdf(`${idd}`, token,deckName)
        setDownLoaderPDF(false)
        setLoader(false);

    }

    async function downloadBase64Apkg() {
        setDownLoaderAnki(true)
        setLoader(true);
        const deckName = dName ? dName : randstring.generate(10);
        await createCustomAnkiForFlashcards(flashcards, deckName, null);
        setDownLoaderAnki(false)
        setLoader(false);

    }

    async function downloadBase64FileTxt() {
        setDownLoaderTxt(true)
        setLoader(true);
        const deckName = dName ? dName : randstring.generate(10);
        await createTextFile(flashcards, deckName);

        setDownLoaderTxt(false)
        setLoader(false);

    }


    const Dropdown = () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative inline-block text-left ml-3">
                <div>
                    <button
                        type="button"
                        ref={downloadButtonRef}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="options-menu"
                        aria-expanded="true"
                        aria-haspopup="true"
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
                    <div className="origin-top-right absolute left-5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-black">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <button
                                className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 border-b border-black w-full"
                                role="menuitem"
                                onMouseDown={() => {
                                    downloadBase64Apkg()
                                }}
                            >
                                {donwLoaderAnki ? 'Anki Exportieren' : 'Anki (.apkg)'} 
                            </button>
                            {deckDetail?.deck_type !== 'cloze' &&
                                <button
                                    className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 border-b border-black w-full"
                                    role="menuitem"
                                    onMouseDown={() => {
                                        downloadBase64FileTxt()
                                    }}
                                    onClick={downloadBase64FileTxt}
                                >
                                    {donwLoaderTxt ?'Quizlet Exportieren' : 'Quizlet (.txt)'}
                                </button>
                            }
                            {deckDetail?.deck_type !== 'cloze' &&
                                <button
                                    disabled={deckDetail?.deck_type === 'cloze'}
                                    className="text-start block px-4 py-1 font-medium text-sm text-black hover:bg-gray-100 hover:text-gray-900 w-full"
                                    role="menuitem"
                                    onMouseDown={() => {
                                        downloadBase64Pdf()
                                    }}
                                >
                                    {donwLoaderPDF ?'PDF Exportieren' : 'PDF'}
                                </button>
                            }
                        </div>
                    </div>
                )}
            </div>
        );
    };

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

    const handleDeckDelete = async(id:any) => {
        setMainLoader(true);
        const token: string = await getAccessToken(dispatch, selector);
        try{
            await DeleteDeck(id, token);
            getDecks()
        }catch(err){
            getDecks()
        }
    }


    const getFlashcards = async (id: any) => {
        setFlashcards([]);
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await GetFlashcards(
            id,
            token,
        );
        if (res.success) {
            if (res.data) {
                let data: any[] = res.data
                setDelLoader('')
                setFlashcards([...data]);
                setMainLoader(false)
            }

        }
    };

    useEffect(() => {
        if(shouldRed || (!isMobile)){
            setShouldRed(false)
            setIdd(decks[0]?.id)
            setDName(decks[0]?.name)
            getFlashcards(decks[0]?.id);
        }else if(decks.length>0){
            setMainLoader(false)
        }
    }, [decks])

    const deleteFlashcard = async (id: any) => {
        setDelLoader(id)
        const token: string = await getAccessToken(dispatch, selector);
        const res: { success: boolean; data: any[] } = await DeleteFlashcards(
            id,
            token,
        );
        if (res.success) {
            console.log('Idd: ', idd)
            getFlashcards(idd)
        }
    };

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
            return (
                <div>
                    <Navbar />
                    {decks.length === 0
                        &&
                        <div className="overflow-auto h-[97vh] text-primary">
                        <div className="flex flex-col items-center justify-center px-auto mt-20 mb-40 pt-10 sm:p-0">
                            <div className="flex justify-between w-[80%] sm:block mt-8">
                                <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                    <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                    <input
                                        type="text"
                                        placeholder="Bitte Namens des Decks eintragen"
                                        className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                        onChange={(e) => setDeckName(e.target.value)}
                                    />

                                </div>
                            </div>
                            <DragAndDrop />
                            <br />
                            <div className="flex justify-around space-x-6 text-center">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                    <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                        <option value="Easy">Einfach</option>
                                        <option value="Medium">Mittel</option>
                                        <option value="Hard">Schwierig</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                    <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                        <option value="1">50 - 100</option>
                                        <option value="2">100 - 250</option>
                                        <option value="3">⁠250 - 500</option>
                                        <option value="4">⁠⁠Mehr als 500</option>
                                    </select>
                                </div>
                                <div>
                                <label className="text-sm font-medium text-gray-700">Art der Karteikarten</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                                <option value="anki">Frage - Antwort</option>
                                                <option value="cloze">Lückentext</option>
                                                <option value="mcqs">Multiple Choice</option>
                                            </select>
                                </div>
                            </div>
                            <div className="w-[80%] flex justify-between">
                                <div></div>
                                <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                    {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                </button>
                            </div>
                        </div>
                        </div>
                    }
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
                                                <span className="text-primary">Anki</span> <span className="text-secondary">AI</span>
                                                </h1>
                                                {!addDeck && <div>
                                                    <button
                                                        className="py-2 px-3 bg-secondary text-white rounded"
                                                        onClick={() => setAddDeck(!addDeck)}
                                                    >
                                                        Deck erstellen
                                                    </button>
                                                </div>}
                                            </div>

                                            <div className="overflow-x-auto bg-white shadow rounded-md">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Name des Decks</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center ">Art der Karteikarten</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Kartenanzahl</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {decks.map((d: any, idx: number) =>
                                                            <tr key={idx} className="text-center" onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}>
                                                                <td
                                                                    className={`text-left px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                                >
                                                                    {editIndex === idx ? (
                                                                        <div className="flex items-center gap-[5px] z-20">
                                                                            <FaCheck
                                                                             onClick={(e)=>{ e.stopPropagation();saveName(idx , d.id === idd)}}
                                                                             className="m-[5px] cursor-pointer"/>
                                                                        <input
                                                                            className="p-1"
                                                                            type="text"
                                                                            onClick={(e)=>e.stopPropagation()}
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
                                                                        onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}
                                                                        >
                                                                            {d.name}
                                                                        </span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>{(d.type === 'anki' ? 'Frage' :( d.type === 'cloze' ? 'Lückentext' : 'Multiple' )) || "N/A"}</td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-center">
                                                                        <span>
                                                                            {d.numberOfCards || "0"}
                                                                        </span>
                                                            </div>
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-between">
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!addDeck && <div className="w-[60%]">
                            <div className="block mt-16 text-primary">
                                <div>
                                    <div className='flex justify-start'>
                                        <h1 className='text-lg font-semibold'>Karteikarten</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                        </div>
                                    </div>
                                    <div className='h-[85vh] sm:[50vh] overflow-y-auto' style={{
                                        // width: "calc(100% - -500px)"
                                    }}>
                                        {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                        {flashcards?.map((flashcard: any, index: number) => (
                                            <div key={index} className='text-[#000000] border border-gray rounded-3xl mt-5 grid grid-cols-1 px-4 py-3 mr-5'>
                                                <div className="flex justify-between">
                                                    <p className='text-xs font-medium text-primary'>Frage</p>
                                                    {delLoader === flashcard.id ?
                                                        <svg className="justify-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#808080">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                        :
                                                        <svg className="cursor-pointer justify-end" onClick={() => deleteFlashcard(flashcard.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                    }

                                                </div>

                                                {
                                                    deckDetail?.deck_type === 'anki' &&
                                                    <input

                                                        value={flashcard.question}
                                                        onChange={(e) => {
                                                            setIsEdit(true)
                                                            let updatedFlashcards = [...flashcards];
                                                            updatedFlashcards[index].question = e.target.value;
                                                            setFlashcards(updatedFlashcards);
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }
                                                {
                                                    deckDetail?.deck_type !== 'anki' &&
                                                    <textarea

                                                        value={deckDetail?.deck_type === 'cloze' ? flashcard.question : flashcard.question}
                                                        onChange={(e) => {
                                                            setIsEdit(true)
                                                            if (deckDetail?.deck_type === 'cloze') {
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            } else {
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            }
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }

                                                {deckDetail?.deck_type !== 'cloze' &&
                                                    <>
                                                        <p className='text-xs font-medium text-green-700 mt-4'>Antwort</p>
                                                        {
                                                            deckDetail?.deck_type !== 'anki' &&
                                                            <textarea

                                                                value={deckDetail?.deck_type === 'cloze' ? '' : flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                        {
                                                            deckDetail?.deck_type === 'anki' &&
                                                            <input

                                                                value={flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                    </>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {addDeck && <div className="w-[60%]">
                            <div className="overflow-auto h-[97vh] text-primary">
                                {/* <Navbar /> */}
                                <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                                    {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                    <p>Ensure you select the same language as your material in the language selector.</p> */}

                                    <div className="flex justify-between w-[80%] sm:block mt-8">
                                        <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                            <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                            <input
                                                type="text"
                                                placeholder="Bitte Namens des Decks eintragen"
                                                className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                onChange={(e) => setDeckName(e.target.value)}
                                            />

                                        </div>
                                    </div>
                                    <DragAndDrop />

                                    <br />
                                    <div className="flex justify-around space-x-6 text-center">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                            <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                                <option value="Easy">Einfach</option>
                                                <option value="Medium">Mittel</option>
                                                <option value="Hard">Schwierig</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                                <option value="1">50 - 100</option>
                                                <option value="2">100 - 250</option>
                                                <option value="3">⁠250 - 500</option>
                                                <option value="4">⁠⁠Mehr als 500</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Art der Karteikarten</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                                <option value="anki">Frage - Antwort</option>
                                                <option value="cloze">Lückentext</option>
                                                <option value="mcqs">Multiple Choice</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-[80%] flex justify-between">
                                        <div></div>
                                        <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                            {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                        </button>
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        </div>}
                    </div>
                </div>
            )
        }
        if (isPortrait) {
            return (
                <div>
                    <Navbar />
                    {decks.length === 0
                        &&
                        <div>
                            <div className="overflow-auto h-[97vh] text-primary pl-8 mt-20">
                                <div className="flex flex-col items-center justify-center px-auto mb-20 sm:p-0">
                                    {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                    <p>Ensure you select the same language as your material in the language selector.</p> */}

                                    <div className="flex justify-between w-[80%] sm:block mt-8">
                                        <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                            <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                            <input
                                                type="text"
                                                placeholder="Bitte Namens des Decks eintragen"
                                                className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                onChange={(e) => setDeckName(e.target.value)}
                                            />

                                        </div>
                                    </div>
                                    <DragAndDrop />

                                    <br />
                                    <div className="flex justify-around space-x-6 text-center">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                            <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                                <option value="Easy">Einfach</option>
                                                <option value="Medium">Mittel</option>
                                                <option value="Hard">Schwierig</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                                <option value="1">50 - 100</option>
                                                <option value="2">100 - 250</option>
                                                <option value="3">⁠250 - 500</option>
                                                <option value="4">⁠⁠Mehr als 500</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Art der Karteikarten</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                                <option value="anki">Frage - Antwort</option>
                                                <option value="cloze">Lückentext</option>
                                                <option value="mcqs">Multiple Choice</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-[60%] flex">
                                        <div></div>
                                        <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                            {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                        </button>
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        </div>
                    }
                    <div>
                        {!addDeck && decks.length > 0 && flashcards.length === 0 && <div>
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
                                                <span className="text-primary">Anki</span> <span className="text-secondary">AI</span>
                                                </h1>
                                                {!addDeck && <div>
                                                    <button
                                                        className="py-2 px-3 bg-secondary text-white rounded"
                                                        onClick={() => setAddDeck(!addDeck)}
                                                    >
                                                        Deck erstellen
                                                    </button>
                                                </div>}
                                            </div>

                                            <div className="overflow-x-auto bg-white shadow rounded-md">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Name des Decks</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Art der Karteikarten</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Kartenanzahl</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {decks.map((d: any, idx: number) =>
                                                            <tr key={idx} className="text-center" onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}>
                                                                <td
                                                                    className={`text-left px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                                >
                                                                    {editIndex === idx ? (
                                                                        <div className="flex items-center gap-[5px] z-20">
                                                                        <FaCheck
                                                                         onClick={(e)=>{ e.stopPropagation();saveName(idx , d.id === idd)}}
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
                                                                        onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}
                                                                        >
                                                                            {d.name}
                                                                        </span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>{(d.type === 'anki' ? 'Frage - Antwort' :( d.type === 'cloze' ? 'Lückentext' : 'Multiple Choice' )) || "N/A"}</td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-center">
                                                                        <span>
                                                                            {d.numberOfCards || "0"}
                                                                        </span>
                                                            </div>
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-between">
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {flashcards.length > 0 && <div>
                            <div className="mt-16 text-primary pl-8">
                                <div>
                                    <button className="flex w-full text-primary py-2 mt-2 mb-2" onClick={() => setFlashcards([])}>
                                        <FaArrowLeft className="mr-5 mt-1" />
                                        Alle Decks
                                    </button>
                                    <div className='flex justify-start'>
                                        <h1 className='text-lg font-semibold'>Karteikarten</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                        </div>
                                    </div>
                                    <div className='h-[85vh] sm:[50vh] overflow-y-auto' style={{
                                        // width: "calc(100% - -500px)"
                                    }}>
                                        {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                        {flashcards?.map((flashcard: any, index: number) => (
                                            <div key={index} className='text-[#000000] border border-gray rounded-3xl mt-5 grid grid-cols-1 px-4 py-3 mr-5'>
                                                <div className="flex justify-between">
                                                    <p className='text-xs font-medium text-primary'>Frage</p>
                                                    {delLoader === flashcard.id ?
                                                        <svg className="justify-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#808080">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                        :
                                                        <svg className="cursor-pointer justify-end" onClick={() => deleteFlashcard(flashcard.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                    }
                                                </div>

                                                {
                                                    deckDetail?.deck_type === 'anki' &&
                                                    <input

                                                        value={flashcard.question}
                                                        onChange={(e) => {
                                                            setIsEdit(true)
                                                            let updatedFlashcards = [...flashcards];
                                                            updatedFlashcards[index].question = e.target.value;
                                                            setFlashcards(updatedFlashcards);
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }
                                                {
                                                    deckDetail?.deck_type !== 'anki' &&
                                                    <textarea

                                                        value={deckDetail?.deck_type === 'cloze' ? flashcard.question : flashcard.question}
                                                        onChange={(e) => {
                                                            if (deckDetail?.deck_type === 'cloze') {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            } else {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            }
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }

                                                {deckDetail?.deck_type !== 'cloze' &&
                                                    <>
                                                        <p className='text-xs font-medium text-green-700 mt-4'>Antwort</p>
                                                        {
                                                            deckDetail?.deck_type !== 'anki' &&
                                                            <textarea

                                                                value={deckDetail?.deck_type === 'cloze' ? '' : flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                        {
                                                            deckDetail?.deck_type === 'anki' &&
                                                            <input

                                                                value={flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                    </>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {addDeck && flashcards.length === 0 &&
                            <div>
                                <div className="overflow-auto h-[97vh] text-primary pl-8">
                                    <button className="flex w-full text-primary py-2 mb-2 mt-20 pl-10" onClick={() => { setFlashcards([]); setAddDeck(false) }}>
                                        <FaArrowLeft className="mr-5 mt-1" />
                                        Alle Decks
                                    </button>
                                    <div className="flex flex-col items-center justify-center px-auto mb-20 sm:p-0">
                                        {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                        <p>Ensure you select the same language as your material in the language selector.</p> */}

                                        <div className="flex justify-between w-[80%] sm:block mt-8">
                                            <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                                <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                                <input
                                                    type="text"
                                                    placeholder="Bitte Namens des Decks eintragen"
                                                    className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                    onChange={(e) => setDeckName(e.target.value)}
                                                />

                                            </div>
                                        </div>
                                        <DragAndDrop />

                                        <br />
                                        <div className="flex justify-around space-x-6 text-center">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                                <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                                    <option value="Easy">Einfach</option>
                                                    <option value="Medium">Mittel</option>
                                                    <option value="Hard">Schwierig</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                                <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                                    <option value="1">50 - 100</option>
                                                    <option value="2">100 - 250</option>
                                                    <option value="3">⁠250 - 500</option>
                                                    <option value="4">⁠⁠Mehr als 500</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 pr-5">Art der Karteikarten</label>
                                                <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                                    <option value="anki">Frage - Antwort</option>
                                                    <option value="cloze">Lückentext</option>
                                                    <option value="mcqs">Multiple Choice</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-[60%] flex">
                                            <div></div>
                                            <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                                {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                            </button>
                                        </div>
                                    </div>
                                    <ToastContainer />
                                </div>
                            </div>}
                    </div>
                </div>
            );
        }
    }
    else if (isMobile) {
        return (
            <div>
                <Navbar />
                {decks.length === 0
                    &&
                    <div>
                        <div className="overflow-auto h-[97vh] text-primary pl-8 pr-8 mt-12">
                            <div className="flex flex-col items-center justify-center px-auto mb-20 sm:p-0">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-8">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                        <input
                                            type="text"

                                            placeholder="Bitte Namens des Decks eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                </div>
                                <DragAndDrop />

                                <br />
                                <div className="block text-center justify-around space-x-6 text-center">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                        <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                            <option value="Easy">Einfach</option>
                                            <option value="Medium">Mittel</option>
                                            <option value="Hard">Schwierig</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                        <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                            <option value="1">50 - 100</option>
                                            <option value="2">100 - 250</option>
                                            <option value="3">⁠250 - 500</option>
                                            <option value="4">⁠⁠Mehr als 500</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Art der Karteikarten</label>
                                        <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                            <option value="anki">Frage - Antwort</option>
                                            <option value="cloze">Lückentext</option>
                                            <option value="mcqs">Multiple Choice</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-[60%] flex">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>

                }
                <div>
                    {!addDeck && decks.length > 0 && flashcards.length === 0 && <div className="pl-8 pr-8">
                        {/* <Provider store={reduxStore}> */}
                        <Script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></Script>
                        <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
                        <Script type="module" src="https://assets.cello.so/app/latest/cello.js" async></Script>

                        {/* <Banner /> */}
                        <div className="overflow-hidden mt-16">
                            <nav className="lg:hidden md:hidden fixed z-50 h-20 text-white mainSetting border-red-60 flex items-center">
                                <div className="flex items-center justify-center">
                                </div>
                            </nav>
                            <div className="flex w-full h-screen">

                                <div className="flex-grow bg-white overflow-y-auto mainSetting h-full">
                                    {/* {error && (
                                <ErrorDialog message={error} onClose={() => setError(null)} />
                            )} */}
                                    <div className="container mx-auto p-4 sm:p-0 sm:mt-6 rounded-lg">
                                        {/* <div className="bg-red-500 mb-4  rounded-lg p-4 shadow-lg"><p className="text-white text-center">We apologize for the inconvenience. Our server is currently experiencing high demand and may have intermittent downtime. We are actively working to resolve this issue ASAP (before Saturday).</p>
          </div> */}
                                        <div className="flex justify-between items-center mb-4">
                                            {/* <h1 className="text-2xl font-semibold">Hello {changeEmailToName(decodedToken?.decodedToken?.email)}! 👋</h1> */}
                                            <h1 className="text-2xl font-semibold">
                                                <span className="text-primary">Anki</span> <span className="text-secondary">AI</span>
                                                </h1>
                                            {!addDeck && <div>
                                                <button
                                                    className="py-2 px-3 bg-secondary text-white rounded"
                                                    onClick={() => setAddDeck(!addDeck)}
                                                >
                                                    Deck erstellen
                                                </button>
                                            </div>}
                                        </div>

                                        <div className="overflow-x-auto bg-white shadow rounded-md">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Name des Decks</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Art der Karteikarten</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Kartenanzahl</th>
                                                        <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {decks.map((d: any, idx: number) =>
                                                        <tr key={idx} className="text-center" onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}>
                                                            <td
                                                                className={`text-left px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                            >
                                                                {editIndex === idx ? (
                                                                    <div className="flex items-center gap-[5px] z-20">
                                                                    <FaCheck
                                                                     onClick={(e)=>{ e.stopPropagation();saveName(idx , d.id === idd)}}
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
                                                                    onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}
                                                                    >
                                                                        {d.name}
                                                                    </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>{(d.type === 'anki' ? 'Frage - Antwort' :( d.type === 'cloze' ? 'Lückentext' : 'Multiple Choice' )) || "N/A"}</td>
                                                            <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                            <div className="flex items-center gap-[5px] z-20 justify-center">
                                                                        <span>
                                                                            {d.numberOfCards || "0"}
                                                                        </span>
                                                            </div>
                                                            </td>
                                                            <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-between">
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

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {flashcards.length > 0 && 
                    <div className="pl-8">
                        <button className="flex w-full text-primary py-2 mb-2 mt-20" onClick={() => setFlashcards([])}>
                                        <FaArrowLeft className="mr-5 mt-1" />
                                        Alle Decks
                        </button>
                        <div>
                        <div className="flext items-center text-primary justify-center">
                            <div>
                                <div  className='block justify-start'>
                                    <h1 className='text-lg font-semibold'>Karteikarten</h1>
                                    <div className='grid grid-cols-3 gap-2'>
                                        <Dropdown />
                                    </div>
                                </div>
                                <div className='h-[70vh] sm:h-[55vh] xs:h-[60vh] overflow-y-auto' style={{
                                    // width: "calc(100% - -500px)"
                                }}>
                                    {flashcards.length === 0 ? <h3 className="mt-10">No Flashcard Found</h3> : null}
                                    {flashcards?.map((flashcard: any, index: number) => (
                                        <div key={index} className='text-[#000000] border border-gray rounded-3xl mt-5 grid grid-cols-1 px-4 py-3 mr-5'>
                                            <div className="flex justify-between">
                                                <p className='text-xs font-medium text-primary'>Frage</p>
                                                {delLoader === flashcard.id ?
                                                    <svg className="justify-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#808080">
                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                    </svg>
                                                    :
                                                    <svg className="cursor-pointer justify-end" onClick={() => deleteFlashcard(flashcard.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                        <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                    </svg>
                                                }
                                            </div>

                                            {
                                                deckDetail?.deck_type === 'anki' &&
                                                <input
                                                    value={flashcard.question}
                                                    onChange={(e) => {
                                                        setIsEdit(true);
                                                        let updatedFlashcards = [...flashcards];
                                                        updatedFlashcards[index].question = e.target.value;
                                                        setFlashcards(updatedFlashcards);
                                                    }}
                                                    onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                    className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                />
                                            }
                                            {
                                                deckDetail?.deck_type !== 'anki' &&
                                                <textarea
                                                    value={deckDetail?.deck_type === 'cloze' ? flashcard.question : flashcard.question}
                                                    onChange={(e) => {
                                                        if (deckDetail?.deck_type === 'cloze') {
                                                            setIsEdit(true)
                                                            let updatedFlashcards = [...flashcards];
                                                            updatedFlashcards[index].question = e.target.value;
                                                            setFlashcards(updatedFlashcards);
                                                        } else {
                                                            setIsEdit(true)
                                                            let updatedFlashcards = [...flashcards];
                                                            updatedFlashcards[index].question = e.target.value;
                                                            setFlashcards(updatedFlashcards);
                                                        }
                                                    }}
                                                    onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                    className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                />
                                            }

                                            {deckDetail?.deck_type !== 'cloze' &&
                                                <>
                                                    <p className='text-xs font-medium text-green-700 mt-4'>Antwort</p>
                                                    {
                                                        deckDetail?.deck_type !== 'anki' &&
                                                        <textarea

                                                            value={deckDetail?.deck_type === 'cloze' ? '' : flashcard.answer}
                                                            onChange={(e) => {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].answer = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            }}
                                                            onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                            className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                        />
                                                    }
                                                    {
                                                        deckDetail?.deck_type === 'anki' &&
                                                        <input

                                                            value={flashcard.answer}
                                                            onChange={(e) => {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].answer = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            }}
                                                            onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                            className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                        />
                                                    }
                                                </>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>}
                    {addDeck && flashcards.length === 0 && <div>
                        <div className="overflow-auto h-[97vh] text-primary pl-4 mt-4">
                            <button className="flex w-full text-primary py-2 mb-2 mt-10" onClick={() => { setFlashcards([]); setAddDeck(false) }}>
                                <FaArrowLeft className="mr-5 mt-1" />
                                Alle Decks
                            </button>
                            <div className="flex flex-col items-center justify-center px-auto mb-28 sm:p-0">
                                {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                <p>Ensure you select the same language as your material in the language selector.</p> */}

                                <div className="flex justify-between w-[80%] sm:block mt-4">
                                    <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                        <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                        <input
                                            type="text"

                                            placeholder="Bitte Namens des Decks eintragen"
                                            className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />

                                    </div>
                                </div>
                                <DragAndDrop />

                                <br />
                                <div className="text-center justify-around space-x-6 text-center">
                                    <div className="mb-[10px]">
                                        <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                        <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                            <option value="Easy">Einfach</option>
                                            <option value="Medium">Mittel</option>
                                            <option value="Hard">Schwierig</option>
                                        </select>
                                    </div>
                                    <div className="mb-[10px]">
                                        <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                        <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                            <option value="1">50 - 100</option>
                                            <option value="2">100 - 250</option>
                                            <option value="3">⁠250 - 500</option>
                                            <option value="4">⁠⁠Mehr als 500</option>
                                        </select>
                                    </div>
                                    <div className="mb-[10px]">
                                        <label className="text-sm font-medium text-gray-700 pr-5">Art der Karteikarten</label>
                                        <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                            <option value="anki">Frage - Antwort</option>
                                            <option value="cloze">Lückentext</option>
                                            <option value="mcqs">Multiple Choice</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-[60%] flex">
                                    <div></div>
                                    <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                        {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                    </button>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
    else {
        return (
            <div>
                <Navbar />
                {decks.length === 0
                    &&
                    <div className="overflow-auto h-[97vh] text-primary">
                    <div className="flex flex-col items-center justify-center px-auto mt-20 mb-40 pt-10 sm:p-0">
                        <div className="flex justify-between w-[80%] sm:block mt-8">
                            <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                <input
                                    type="text"

                                    placeholder="Bitte Namens des Decks eintragen"
                                    className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    onChange={(e) => setDeckName(e.target.value)}
                                />

                            </div>
                        </div>
                        <DragAndDrop />
                        <br />
                        <div className="flex justify-around space-x-6 text-center">
                            <div>
                                <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                    <option value="Easy">Einfach</option>
                                    <option value="Medium">Mittel</option>
                                    <option value="Hard">Schwierig</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                    <option value="1">50 - 100</option>
                                    <option value="2">100 - 250</option>
                                    <option value="3">⁠250 - 500</option>
                                    <option value="4">⁠⁠Mehr als 500</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Art der Karteikarten</label>
                                <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                    <option value="anki">Frage - Antwort</option>
                                    <option value="cloze">Lückentext</option>
                                    <option value="mcqs">Multiple Choice</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-[80%] flex justify-between">
                            <div></div>
                            <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                {loader ? "Wird geladen" : "Karteikarten erstellen"}
                            </button>
                        </div>
                    </div>
                    </div>

                }
                {decks.length > 0 &&
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
                                                <span className="text-primary">Anki</span> <span className="text-secondary">AI</span>
                                                </h1>
                                                {!addDeck && <div>
                                                    <button
                                                        className="py-2 px-3 bg-secondary text-white rounded"
                                                        onClick={() => setAddDeck(!addDeck)}
                                                    >
                                                        Deck erstellen
                                                    </button>
                                                </div>}
                                            </div>

                                            <div className="overflow-x-auto bg-white shadow rounded-md">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Name des Decks</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Art der Karteikarten</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center">Kartenanzahl</th>
                                                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-center"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {decks.map((d: any, idx: number) =>
                                                            <tr key={idx} className="text-center" onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}>
                                                                <td
                                                                    className={`text-left px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}
                                                                >
                                                                    {editIndex === idx ? (
                                                                       <div className="flex items-center gap-[5px] z-20">
                                                                       <FaCheck
                                                                        onClick={(e)=>{ e.stopPropagation();saveName(idx , d.id === idd)}}
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
                                                                            e.stopPropagation();
                                                                            setEditIndex(idx);
                                                                            setEditName(d.name);
                                                                        }} className="m-[5px] cursor-pointer" />
                                                                        <span className="block min-w-[100px] min-h-[20px] cursor-pointer"
                                                                        onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}}
                                                                        >
                                                                            {d.name}
                                                                        </span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>{(d.type === 'anki' ? 'Frage - Antwort' :( d.type === 'cloze' ? 'Lückentext' : 'Multiple Choice' )) || "N/A"}</td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}> 
                                                                <div className="flex items-center gap-[5px] z-20 justify-center">
                                                                        <span>
                                                                            {d.numberOfCards || "0"}
                                                                        </span>
                                                            </div>
                                                                </td>
                                                                <td onClick={() => { getFlashcards(d.id); setAddDeck(false); setDName(d.name); setIdd(d.id)}} className={`cursor-pointer px-6 py-3 border-b-2 border-gray-300 bg-gray-50 ${d.id === idd ? 'bg-primary bg-opacity-30' : ''}`}>
                                                                <div className="flex items-center gap-[5px] z-20 justify-between">
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!addDeck && <div className="w-[60%]">
                            <div className="mt-[4.75rem] text-primary block">
                                <div>
                                    <div className='flex justify-start'>
                                        <h1 className='text-lg font-semibold'>Karteikarten</h1>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <Dropdown />
                                        </div>
                                    </div>
                                    <div className={`h-[85vh] sm:[50vh] overflow-y-auto pr-[25px]`}>
                                        {flashcards.length === 0 ? <h3 className="mt-10">...Karteikarten werden geladen</h3> : null}
                                        {flashcards?.map((flashcard: any, index: number) => (
                                            <div key={index} className='text-[#000000] border border-gray rounded-3xl mt-5 grid grid-cols-1 px-4 py-3 mr-5'>
                                                <div className="flex justify-between">
                                                    <p className='text-xs font-medium text-primary'>Frage</p>
                                                    {delLoader === flashcard.id ?
                                                        <svg className="justify-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#808080">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                        :
                                                        <svg className="cursor-pointer justify-end" onClick={() => deleteFlashcard(flashcard.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                            <path d="M3 6h18v2H3V6zm2 3h14v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 0v12h2V9H8zm4 0v12h2V9h-2zm4 0v12h2V9h-2zM8 4V2h8v2H8z" />
                                                        </svg>
                                                    }
                                                </div>

                                                {
                                                    deckDetail?.deck_type === 'anki' &&
                                                    <input
                                                        value={flashcard.question}
                                                        onChange={(e) => {
                                                            setIsEdit(true)
                                                            let updatedFlashcards = [...flashcards];
                                                            updatedFlashcards[index].question = e.target.value;
                                                            setFlashcards(updatedFlashcards);
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}

                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }
                                                {
                                                    deckDetail?.deck_type !== 'anki' &&
                                                    <textarea
                                                        value={deckDetail?.deck_type === 'cloze' ? flashcard.question : flashcard.question}
                                                        onChange={(e) => {
                                                            if (deckDetail?.deck_type === 'cloze') {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            } else {
                                                                setIsEdit(true)
                                                                let updatedFlashcards = [...flashcards];
                                                                updatedFlashcards[index].question = e.target.value;
                                                                setFlashcards(updatedFlashcards);
                                                            }
                                                        }}
                                                        onBlur={() => handleEditFlashcard(flashcard.id, { question: flashcard.question })}
                                                        className='text-[15px] font-bold border-b-2 border-black pb-1'
                                                    />
                                                }

                                                {deckDetail?.deck_type !== 'cloze' &&
                                                    <>
                                                        <p className='text-xs font-medium text-green-700 mt-4'>Antwort</p>
                                                        {
                                                            deckDetail?.deck_type !== 'anki' &&
                                                            <textarea
                                                                value={deckDetail?.deck_type === 'cloze' ? '' : flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                        {
                                                            deckDetail?.deck_type === 'anki' &&
                                                            <input

                                                                value={flashcard.answer}
                                                                onChange={(e) => {
                                                                    setIsEdit(true)
                                                                    let updatedFlashcards = [...flashcards];
                                                                    updatedFlashcards[index].answer = e.target.value;
                                                                    setFlashcards(updatedFlashcards);
                                                                }}
                                                                onBlur={() => handleEditFlashcard(flashcard.id, { answer: flashcard.answer })}
                                                                className='text-[15px] text-[#787777] font-bold pb-1 border-b-2 border-black'
                                                            />
                                                        }
                                                    </>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {addDeck && <div className="w-[60%]">
                            <div className="overflow-auto h-[97vh] text-primary">
                                {/* <Navbar /> */}
                                <div className="flex flex-col items-center justify-center px-auto mt-20 mb-20 pt-10 sm:p-0">
                                    {/* <p>Upload a PDF file or paste your text notes in the textarea below.</p>
                                    <p>Ensure you select the same language as your material in the language selector.</p> */}

                                    <div className="flex justify-between w-[80%] sm:block mt-8">
                                        <div className="mb-4 w-[75%] sm:w-full sm:mt-5">


                                            <label className="block text-xs font-medium text-gray-700">Name des Decks</label>
                                            <input
                                                type="text"

                                                placeholder="Bitte Namens des Decks eintragen"
                                                className="p-3 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                onChange={(e) => setDeckName(e.target.value)}
                                            />

                                        </div>
                                    </div>
                                    <DragAndDrop />

                                    <br />
                                    <div className="flex justify-around space-x-6 text-center">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Schwierigkeit</label>
                                            <select className="relative" name="difficulty" id="difficulty" onChange={(e) => setDif(e.target.value)}>
                                                <option value="Easy">Einfach</option>
                                                <option value="Medium">Mittel</option>
                                                <option value="Hard">Schwierig</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Kartenanzahl</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setCards(e.target.value)}>
                                                <option value="1">50 - 100</option>
                                                <option value="2">100 - 250</option>
                                                <option value="3">⁠250 - 500</option>
                                                <option value="4">⁠⁠Mehr als 500</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 pr-5">Art der Karteikarten</label>
                                            <select name="Number Of Cards" id="Number Of Cards" onChange={(e) => setType(e.target.value)}>
                                                <option value="anki">Frage - Antwort</option>
                                                <option value="cloze">Lückentext</option>
                                                <option value="mcqs">Multiple Choice</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-[80%] flex justify-between">
                                        <div></div>
                                        <button className="w-[256px] sm:w-full bg-secondary text-white py-2 rounded-md mt-5" onClick={canRedirect} disabled={disable || loader}>
                                            {loader ? "Wird geladen" : "Karteikarten erstellen"}
                                        </button>
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        </div>}
                    </div>
                }
            </div>
        );
    }
}

export default Flashcard;