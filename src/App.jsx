import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState('');
  const previewRef = useRef();

  // Handle copying the rendered HTML to clipboard
  const handleCopy = async () => {
    const htmlContent = previewRef.current.innerHTML;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
        }),
      ]);
      alert('Rich text copied to clipboard!');
    } catch (err) {
      alert('Failed to copy rich text: ' + err);
    }
  };

  // Handle exporting the content as PDF
  const handleExport = () => {
    const content = previewRef.current;

    if (!content) {
      alert('Nothing to export');
      return;
    }

    // Use html2canvas to capture the content as an image
    html2canvas(content, { scale: 2 }).then((canvas) => {
      // Convert the canvas to a data URL (image format)
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Create a PDF using jsPDF
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 10, 10, 180, 250); // Adjust the position and size

      // Save the PDF
      pdf.save('markdown_preview.pdf');
    });
  };

  return (
    <div className="container">
      <div className="pane left">
        <h2>Markdown Input</h2>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Type your markdown here..."
        />
      </div>
      <div className="pane right">
        <h2>Preview</h2>
        <div ref={previewRef} className="preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
        <div className="buttons">
          <button onClick={handleCopy}>Copy</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
}

export default App;
