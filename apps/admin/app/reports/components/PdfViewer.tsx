"use client";

import { Dialog, DialogContent } from "@repo/ui/components/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  file: string | File | null;
}

export default function PdfViewer({ open, setOpen, file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[900px] h-[80vh] overflow-auto">
        <div className="flex flex-col items-center gap-4">
          <Document file={file} onLoadSuccess={onLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
}
