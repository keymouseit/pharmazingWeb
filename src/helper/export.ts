import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import sha256 from 'js-sha256';
import initSqlJs from "sql.js";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

interface Flashcard {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    page_number: number | null;
}

const generateGUID = (text: any) => {
    return sha256.sha256(text);
};

export const createTextFile = async (flascards: Flashcard[], deckName: string) => {
    try {
        //
        const fileName = `${deckName}.txt`;
        const fileContent = flascards.map((card) => `${card.question}; ${card.answer}`).join('\n');
        const blob = new Blob([fileContent], { type: 'text/plain' });
        saveAs(blob, fileName)
    } catch (err) {
        console.error('Error in creating text file: ', err)
    }
}

type Settings = {
    id: string;
    user_id: string | null;
    character_cutoff: number | null;
    deck_name_in_card: boolean | null;
    deck_page_in_card: boolean | null;
    tags_in_card: boolean | null;
};


export const createCustomAnkiForFlashcards = async (flashcardsArray: Flashcard[], deckName: string, userSettings: any) => {
    try {
        // console.log("settings from server", userSettings);
        const zip = new JSZip();
        const now = new Date();

        const timestamp = Math.floor(now.getTime() / 1000);
        const deckId = timestamp; // Unique deck ID based on current timestamp

        // Default settings if userSettings is undefined
        const defaultSettings = {
            deck_name_in_card: true, // Default value if userSettings is undefined
            deck_page_in_card: true, // Default value if userSettings is undefined
            tags_in_card: true       // Default value if userSettings is undefined
        };

        // Use user settings if available, otherwise use default settings
        const effectiveSettings = userSettings || defaultSettings;

        let FlascardModel = {
            "1543634829843": {
                sortf: 0,
                latexPre: `\\documentclass[12pt]{article}
        \\special{papersize=3in,5in}
        \\usepackage[utf8]{inputenc}
        \\usepackage{amssymb,amsmath}
        \\pagestyle{empty}
        \\setlength{\\parindent}{0in}
        \\begin{document}`,
                latexPost: "\\end{document}",
                did: 1,
                mod: Math.floor(Date.now() / 1000),
                usn: -1, // For a new object not yet synchronized, -1 is commonly used
                vers: [],
                type: 0,
                css: `.card {
                font-family: arial;
                font-size: 20px;
                text-align: center;
                color: black;
                background-color: white;
            }`,
                name: "Pharmazing",
                id: "1543634829843",
                flds: [
                    {
                        name: "Front", ord: 0, sticky: false,
                        rtl: false,
                        font: "Arial",
                        size: 20,
                        media: [],
                    },
                    {
                        name: "Back", ord: 1, sticky: false,
                        rtl: false,
                        font: "Arial",
                        size: 20,
                        media: [],
                    }
                ],
                req: [
                    [0, "all", [0]],
                    [1, "all", [1]]
                ],
                tmpls: [
                    {
                        name: "Card 1",
                        ord: 0,
                        qfmt: effectiveSettings.deck_name_in_card === false ? '{{Front}}' : `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}`,
                        afmt: effectiveSettings.deck_name_in_card === false ? '{{Front}}\n\n<hr id=answer>\n\n{{Back}}' : `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}\n\n<hr id=answer>\n\n{{Back}}`,
                        did: null,
                        bqfmt: "",
                        bafmt: "",
                    },
                    {
                        name: "Card 2",
                        ord: 1,
                        qfmt: effectiveSettings.deck_name_in_card === false ? '{{Front}}' : `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}`,
                        afmt: effectiveSettings.deck_name_in_card === false ? '{{Front}}\n\n<hr id=answer>\n\n{{Back}}' : `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}\n\n<hr id=answer>\n\n{{Back}}`,
                        did: null,
                        bqfmt: "",
                        bafmt: "",
                    }
                ],
                tags: [""]
            }
        }

        const deck = {
            // 1: {
            [deckId]: {
                // id: 1,
                id: deckId,
                name: deckName,
                desc: '',
                newToday: [0, 0], // currentDay, count
                revToday: [0, 0],
                lrnToday: [0, 0],
                timeToday: [0, 0], // time in ms
                conf: 1,
                usn: 0,
                dyn: 0,  // anki uses int/bool interchangably here
                collapsed: false,
                // added in beta11
                extendNew: 10,
                extendRev: 50,
            }
        }

        const col = [
            null,                           // id
            (+now / 1000) | 0,              // crt
            +now,                           // mod
            +now,                           // scm
            11,                             // ver
            0,                              // dty
            0,                              // usn
            0,                              // ls
            JSON.stringify(defaultConf),    // conf
            JSON.stringify(FlascardModel),         // models
            JSON.stringify(deck),          // decks
            JSON.stringify({ 1: { id: 1, ...defaultDeckConf } }),    // dconf
            JSON.stringify({}),             // tags
        ]


        const SQL = await initSqlJs({ locateFile: file => `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/sql-wasm.wasm` });
        const db = new SQL.Database();
        db.run(APKG_SCHEMA);


        db.prepare(`INSERT INTO col
        (id, crt, mod, scm, ver, dty, usn, ls, conf, models, decks, dconf, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(col);

        const insert_notes = db.prepare(`INSERT INTO notes (id, guid, mid, mod, usn, tags, flds, sfld, csum, flags, data) 
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, 0, 0, '')`)

        const insert_cards = db.prepare(`INSERT INTO cards (id, nid, did, ord, mod, usn, type, queue, due, ivl, factor, reps, lapses, left, odue, odid, flags, data) 
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, '')`)

        const sanitizeTag = (input: string) => {
            // Basic sanitization: replace spaces with underscores and remove special characters
            return input.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        };

        let dueCounter = 1;
        // First, find the maximum page number to determine the padding needed
        const maxPageNumber = Math.max(...flashcardsArray.map(card => card.page_number || 0));
        const maxDigits = maxPageNumber.toString().length;

        for (const card of flashcardsArray) {

            const sanitizedDeckName = sanitizeTag(deckName);
            // Conditionally set the tag based on userSettings.tags_in_card
            const tag = (effectiveSettings.tags_in_card === false) ? '' : `${sanitizedDeckName}::${card.page_number ? `page${String(card.page_number).padStart(maxDigits, '0')}` : 'unpaged'}`;

            // const frontHtml = `${card.question}`;
            // const backHtml = `${card.answer}`;
            // Embed the deck and page info directly into the frontHtml
            const frontHtml = `${card.question}`;
            const backHtml = `${card.answer}`;
            const guid = generateGUID(frontHtml + backHtml); // Unique ID for the note

            insert_notes.run(
                [
                    guid,                  // guid
                    "1543634829843",        // mid
                    (+now / 1000) | 0,          // mod
                    -1,                         // usn
                    tag,                       // tags
                    [
                        frontHtml,
                        backHtml
                    ].join('\x1f'),   // flds
                    0,                          // sfld
                ])
            let rowID = db.exec("select last_insert_rowid();")
            let note_id = rowID[0]['values'][0][0];
            insert_cards.run(
                [
                    note_id,            // nid
                    deckId, // did, using the unique deckId from earlier in your code
                    // 1,            // did
                    0, // ord (assuming a single card per note, this is 0; adjust if your model differs)
                    // 1,           // ord
                    (+now / 1000) | 0,  // mod
                    -1,                 // usn
                    0,                  // type 0=new, 1=learning, 2=due 
                    0,                  // queue -1 for suspended
                    dueCounter, // due (increment this for each card to space them out)
                ]);

            dueCounter++;
        }
        const data = db.export();
        const buffer = new Uint8Array(data).buffer;

        zip.file("collection.anki2", buffer);


        const content = await zip.generateAsync({ type: "blob", mimeType: "application/apkg" })
        saveAs(content, `${deckName}.apkg`);
    } catch (err) {
        console.error('Error in generating flascards: ', err);
    }
}

export const createCustomAnkiForCloze = async (flashcardsArray: Flashcard[], deckName: string) => {
    try {
        const zip = new JSZip();
        const now = new Date();
        const deck = {
            1: {
                id: 1,
                name: deckName,
                desc: '',
                newToday: [0, 0], // currentDay, count
                revToday: [0, 0],
                lrnToday: [0, 0],
                timeToday: [0, 0], // time in ms
                conf: 1,
                usn: 0,
                dyn: 0,  // anki uses int/bool interchangably here
                collapsed: false,
                // added in beta11
                extendNew: 10,
                extendRev: 50,
            }
        }

        const col = [
            null,                           // id
            (+now / 1000) | 0,              // crt
            +now,                           // mod
            +now,                           // scm
            11,                             // ver
            0,                              // dty
            0,                              // usn
            0,                              // ls
            JSON.stringify(defaultConf),    // conf
            JSON.stringify(FlascardModel),         // models
            JSON.stringify(deck),          // decks
            JSON.stringify({ 1: { id: 1, ...defaultDeckConf } }),    // dconf
            JSON.stringify({}),             // tags
        ]


        const SQL = await initSqlJs({ locateFile: file => `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/sql-wasm.wasm` });
        const db = new SQL.Database();
        db.run(APKG_SCHEMA);


        db.prepare(`INSERT INTO col
        (id, crt, mod, scm, ver, dty, usn, ls, conf, models, decks, dconf, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(col);

        const insert_notes = db.prepare(`INSERT INTO notes (id, guid, mid, mod, usn, tags, flds, sfld, csum, flags, data) 
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, 0, 0, '')`)

        const insert_cards = db.prepare(`INSERT INTO cards (id, nid, did, ord, mod, usn, type, queue, due, ivl, factor, reps, lapses, left, odue, odid, flags, data) 
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, '')`)


        for (const card of flashcardsArray) {
            const frontHtml = `${card.question}`;
            const backHtml = `${card.answer}`;
            const guid = generateGUID(frontHtml + backHtml); // Unique ID for the note
            insert_notes.run(
                [
                    guid,                  // guid
                    "1543634829843",        // mid
                    (+now / 1000) | 0,          // mod
                    -1,                         // usn
                    card.page_number,                       // tags
                    [
                        frontHtml,
                        backHtml
                    ].join('\x1f'),   // flds
                    0,                          // sfld
                ])
            let rowID = db.exec("select last_insert_rowid();")
            let note_id = rowID[0]['values'][0][0];
            insert_cards.run(
                [
                    note_id,            // nid
                    1,            // did
                    1,           // ord
                    (+now / 1000) | 0,  // mod
                    -1,                 // usn
                    0,                  // type 0=new, 1=learning, 2=due 
                    0,                  // queue -1 for suspended
                ])
        }
        const data = db.export();
        const buffer = new Uint8Array(data).buffer;

        zip.file("collection.anki2", buffer);


        const content = await zip.generateAsync({ type: "blob", mimeType: "application/apkg" })
        saveAs(content, `${deckName}.apkg`);
    } catch (err) {
        console.error('Error in generating flascards: ', err);
    }
}

export const createPDF = async (flashcardsArray: Flashcard[], deckName: string) => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#my-table' })

    // Define the columns for the table
    const tableColumn = ["Question", "Answer"];
    // Map flashcards data to match the autotable's data structure requirement
    const tableRows = flashcardsArray.map(card => [card.question, card.answer]);
    // Add the table to the PDF
    autoTable(doc, {
        startY: 10,
        styles: { fontSize: 8, cellPadding: { top: 2, right: 5, bottom: 2, left: 5 }, overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 'auto' }, 
            1: { cellWidth: 'auto' }
        },
        margin: { top: 20, right: 10, bottom: 10, left: 10 },
        theme: 'striped',
        head: [tableColumn],
        body: tableRows
    });

    // Filename for the PDF
    const fileName = `${deckName}.pdf`;

    // Save the generated PDF
    doc.save(fileName);
}

export const summaryPDF = async(summaryId: string) => {
    
}

/** Anki APG Configs Below */
const now = new Date();

const FlascardModel = {
    "1543634829843": {
        sortf: 0,
        latexPre: `\\documentclass[12pt]{article}
\\special{papersize=3in,5in}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,amsmath}
\\pagestyle{empty}
\\setlength{\\parindent}{0in}
\\begin{document}`,
        latexPost: "\\end{document}",
        did: 1,
        mod: Math.floor(Date.now() / 1000),
        usn: -1, // For a new object not yet synchronized, -1 is commonly used
        vers: [],
        type: 0,
        css: `.card {
        font-family: arial;
        font-size: 20px;
        text-align: center;
        color: black;
        background-color: white;
      }`,
        name: "Pharmazing",
        id: "1543634829843",
        flds: [
            {
                name: "Front", ord: 0, sticky: false,
                rtl: false,
                font: "Arial",
                size: 20,
                media: [],
            },
            {
                name: "Back", ord: 1, sticky: false,
                rtl: false,
                font: "Arial",
                size: 20,
                media: [],
            }
        ],
        req: [
            [0, "all", [0]],
            [1, "all", [1]]
        ],
        tmpls: [
            {
                name: "Card 1",
                ord: 0,
                qfmt: `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}`,
                afmt: `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}\n\n<hr id=answer>\n\n{{Back}}`,
                did: null,
                bqfmt: "",
                bafmt: "",
            },
            {
                name: "Card 2",
                ord: 1,
                qfmt: `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}`,
                afmt: `<h1 style="color:gray;font-size:12px;">{{Deck}}</h1>{{Front}}\n\n<hr id=answer>\n\n{{Back}}`,
                did: null,
                bqfmt: "",
                bafmt: "",
            }
        ],
        tags: [""]
    }
}
const ClozeModel = {
    "1543634829843": {
        sortf: 0,
        latexPre: `\\documentclass[12pt]{article}
\\special{papersize=3in,5in}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,amsmath}
\\pagestyle{empty}
\\setlength{\\parindent}{0in}
\\begin{document}`,
        latexPost: "\\end{document}",
        did: 1,
        mod: Math.floor(Date.now() / 1000),
        usn: -1, // For a new object not yet synchronized, -1 is commonly used
        vers: [],
        type: 1,
        css: `.card {
        font-family: arial;
        font-size: 20px;
        text-align: center;
        color: black;
        background-color: white;
      }`,
        name: "Pharmazing",
        id: "1543634829843",
        flds: [
            {
                name: "Front", ord: 0, sticky: false,
                rtl: false,
                font: "Arial",
                size: 20,
                media: [],
            },
            {
                name: "Back", ord: 1, sticky: false,
                rtl: false,
                font: "Arial",
                size: 20,
                media: [],
            }
        ],
        req: [
            [0, "all", [0]],
            [1, "all", [1]]
        ],
        tmpls: [
            {
                name: "Card 1",
                ord: 0,
                qfmt: "{{Front}}",
                afmt: "{{Front}}\n\n<hr id=answer>\n\n{{Back}}",
                did: null,
                bqfmt: "",
                bafmt: "",
            },
            {
                name: "Card 2",
                ord: 1,
                qfmt: "{{Front}}",
                afmt: "{{Front}}\n\n<hr id=answer>\n\n{{Back}}",
                did: null,
                bqfmt: "",
                bafmt: "",
            }
        ],
        tags: [""]
    }
}
const defaultConf = {
    // review options
    'activeDecks': [1],
    'curDeck': 1,
    'newSpread': 0,
    'collapseTime': 1200,
    'timeLim': 0,
    'estTimes': true,
    'dueCounts': true,
    // other config
    'curModel': null,
    'nextPos': 1,
    'sortType': "noteFld",
    'sortBackwards': false,
    'addToCur': true, // add new to currently selected deck?
    'dayLearnFirst': false,

}



const defaultDeckConf = {
    'name': "Default",
    'new': {
        'delays': [1, 10],
        'ints': [1, 4, 7], // 7 is not currently used
        'initialFactor': 2500,
        'separate': true,
        'order': 1,
        'perDay': 20,
        // may not be set on old decks
        'bury': false,
    },
    'lapse': {
        'delays': [10],
        'mult': 0,
        'minInt': 1,
        'leechFails': 8,
        // type 0=suspend, 1=tagonly
        'leechAction': 0,
    },
    'rev': {
        'perDay': 200,
        'ease4': 1.3,
        'fuzz': 0.05,
        'minSpace': 1, // not currently used
        'ivlFct': 1,
        'maxIvl': 36500,
        // may not be set on old decks
        'bury': false,
        'hardFactor': 1.2,
    },
    'maxTaken': 60,
    'timer': 0,
    'autoplay': true,
    'replayq': true,
    'mod': 0,
    'usn': 0,
}




const APKG_SCHEMA = `
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE col (
    id              integer primary key,
    crt             integer not null,
    mod             integer not null,
    scm             integer not null,
    ver             integer not null,
    dty             integer not null,
    usn             integer not null,
    ls              integer not null,
    conf            text not null,
    models          text not null,
    decks           text not null,
    dconf           text not null,
    tags            text not null
);
CREATE TABLE notes (
    id              integer primary key,   /* 0 */
    guid            text not null,         /* 1 */
    mid             integer not null,      /* 2 */
    mod             integer not null,      /* 3 */
    usn             integer not null,      /* 4 */
    tags            text not null,         /* 5 */
    flds            text not null,         /* 6 */
    sfld            integer not null,      /* 7 */
    csum            integer not null,      /* 8 */
    flags           integer not null,      /* 9 */
    data            text not null          /* 10 */
);
CREATE TABLE cards (
    id              integer primary key,   /* 0 */
    nid             integer not null,      /* 1 */
    did             integer not null,      /* 2 */
    ord             integer not null,      /* 3 */
    mod             integer not null,      /* 4 */
    usn             integer not null,      /* 5 */
    type            integer not null,      /* 6 */
    queue           integer not null,      /* 7 */
    due             integer not null,      /* 8 */
    ivl             integer not null,      /* 9 */
    factor          integer not null,      /* 10 */
    reps            integer not null,      /* 11 */
    lapses          integer not null,      /* 12 */
    left            integer not null,      /* 13 */
    odue            integer not null,      /* 14 */
    odid            integer not null,      /* 15 */
    flags           integer not null,      /* 16 */
    data            text not null          /* 17 */
);
CREATE TABLE revlog (
    id              integer primary key,
    cid             integer not null,
    usn             integer not null,
    ease            integer not null,
    ivl             integer not null,
    lastIvl         integer not null,
    factor          integer not null,
    time            integer not null,
    type            integer not null
);
CREATE TABLE graves (
    usn             integer not null,
    oid             integer not null,
    type            integer not null
);
CREATE INDEX ix_notes_usn on notes (usn);
CREATE INDEX ix_cards_usn on cards (usn);
CREATE INDEX ix_revlog_usn on revlog (usn);
CREATE INDEX ix_cards_nid on cards (nid);
CREATE INDEX ix_cards_sched on cards (did, queue, due);
CREATE INDEX ix_revlog_cid on revlog (cid);
CREATE INDEX ix_notes_csum on notes (csum);
COMMIT;
`