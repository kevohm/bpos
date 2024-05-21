import React, { useRef, useEffect, useState } from 'react';
import { Modal, useMediaQuery } from '@mui/material';
import './Modal.scss';
import {
    Document,
    PDFDownloadLink,
    PDFViewer,
    Page,
    StyleSheet,
    Text,
    View,
  } from "@react-pdf/renderer";

const PdfModal = ({ open, onClose, pdfContent, pdfName }) => {
  const isSmallScreen = useMediaQuery('(max-width:769px)');
  const iframeRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log(pdfContent)
    setIsModalOpen(open);
  }, [open]);

  useEffect(() => {
    if (pdfContent && iframeRef.current) {
      iframeRef.current.contentDocument.title = pdfName;
    }
  }, [pdfContent, pdfName]);

  const shareViaWhatsApp = () => {
    if (pdfContent) {
      const pdfUrl = URL.createObjectURL(pdfContent);
      const blobUrl = "blob:" + window.location.origin + "/" + pdfUrl.split("/").pop();
      const whatsappMessage = "View the PDF: " + blobUrl;
      const whatsappLink = "https://wa.me/?text=" + encodeURIComponent(whatsappMessage);
      window.open(whatsappLink);
    } else {
      console.error("PDF content is not available.");
    }
  };
  
  

  const viewPdf = () => {
    if (pdfContent) {
      const pdfUrl = URL.createObjectURL(pdfContent);
      window.open(pdfUrl, '_blank');
    } else {
      console.error("PDF content is not available.");
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="ModalPdf">
        <div className="modal-content">
          <div className='ControlBts'>
            <button style={{ color: '#ffd412', padding: '10px 15px' }} onClick={onClose}>
              Close
            </button>
            {/* <button style={{ color: '#ffd412', padding: '10px 15px' }} onClick={shareViaWhatsApp}>
              Share via WhatsApp
            </button> */}
            <button style={{ color: '#ffd412', padding: '10px 15px' }} onClick={viewPdf}>
              View PDF
            </button>
          </div>

          {pdfContent && (
            <iframe
              ref={iframeRef}
              src={URL.createObjectURL(pdfContent)}
              style={{
                width: '100%',
                height: isSmallScreen ? '100vh' : 'calc(100vh - 64px)',
                border: 'none',
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PdfModal;
