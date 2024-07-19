import { NextResponse, type NextRequest } from "next/server";

import pdfmake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import { mdpdfmake } from "@propra/mdpdfmake";


export async function POST(request: NextRequest) {
  // gotta use the request object to invalidate the cache every request :vomit:
  const url = request.url;
  const { data } = await request.json();


  const docDefinition = await mdpdfmake(data)
  const pdf = pdfmake.createPdf(docDefinition);


  const headers = new Headers();

  headers.set("Content-Type", "application/pdf");



  const blob = await new Promise(resolve => {
    return pdf.getBlob(blob => resolve(blob));
  });


  const response = new NextResponse(blob as Blob, { status: 200, statusText: "OK", headers });

  return response;
}
