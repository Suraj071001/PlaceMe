"use client";

import { Dialog, DialogContent } from "@repo/ui/components/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  file: string | File | null;
}

export default function PdfViewer({ open, setOpen, file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageWidth, setPageWidth] = useState(780);

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 48, 780);
      setPageWidth(Math.max(width, 240));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[85vh] w-[calc(100vw-1rem)] overflow-auto p-3 sm:max-w-[900px] sm:p-4">
        <div className="flex flex-col items-center gap-4">
          <Document file={file} onLoadSuccess={onLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} width={pageWidth} />
            ))}
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
}
