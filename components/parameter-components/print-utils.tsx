"use client";

export function printContent(componentId: string, title: string) {
  // First, prepare the chart for printing by converting canvas to image
  const contentElement = document.getElementById(componentId);
  if (!contentElement) {
    alert("Druckinhalt konnte nicht gefunden werden.");
    return;
  }

  // Find all canvas elements in the content and convert them to images
  const canvases = contentElement.querySelectorAll("canvas");
  const canvasImages = Array.from(canvases)
    .map(canvas => {
      try {
        return {
          canvas,
          dataUrl: canvas.toDataURL("image/png")
        };
      } catch (e) {
        console.error("Error converting canvas to image:", e);
        return null;
      }
    })
    .filter(Boolean);

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert(
      "Bitte erlauben Sie Pop-ups für diese Seite, um die Druckfunktion zu nutzen."
    );
    return;
  }

  // Get all stylesheets
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join("\n");
      } catch (e) {
        // CORS restrictions might prevent accessing some stylesheets
        return "";
      }
    })
    .join("\n");

  // Clone the content to avoid modifying the original
  const contentClone = contentElement.cloneNode(true) as Element;

  // Replace canvas elements with images in the clone
  canvasImages.forEach(item => {
    if (!item) return;

    // Find the corresponding canvas in the clone
    const canvasRect = item.canvas.getBoundingClientRect();
    const canvasPosition = {
      top: canvasRect.top + window.scrollY,
      left: canvasRect.left + window.scrollX
    };

    // Find all canvases in the clone
    const cloneCanvases = contentClone.querySelectorAll("canvas");

    // Replace each canvas with an image
    cloneCanvases.forEach(cloneCanvas => {
      const img = document.createElement("img");
      img.src = item.dataUrl;
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.maxWidth = `${item.canvas.width}px`;
      img.style.display = "block";
      img.style.margin = "0 auto";

      // Replace the canvas with the image
      if (cloneCanvas.parentNode) {
        cloneCanvas.parentNode.replaceChild(img, cloneCanvas);
      }
    });
  });

  // Always use light theme for printing
  printWindow.document.write(`
    <!DOCTYPE html>
    <html class="light">
      <head>
        <title>${title}</title>
        <style>${styles}</style>
        <style>
          @media print {
            @page {
              margin: 1.5cm;
              size: A4 landscape;
            }
            body {
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background-color: white !important;
              color: black !important;
              line-height: 1.5;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #333;
            }
            .print-header h1 {
              font-size: 20px;
              margin: 0;
              color: #333;
            }
            .print-date {
              text-align: right;
              margin-bottom: 20px;
              font-size: 0.9em;
              color: #666;
            }
            .print-content {
              background-color: white !important;
              color: black !important;
            }
            button, .no-print, [data-radix-popper-content-wrapper], .chart-options {
              display: none !important;
            }
            table {
              width: 80%;
              border-collapse: collapse;
              margin: 10px auto;
              background-color: white !important;
              page-break-inside: avoid;
              font-size: 0.7em;
            }
            th, td {
              border: 1px solid #333;
              padding: 6px;
              text-align: left;
              color: black !important;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .dark {
              background-color: white !important;
              color: black !important;
            }
            * {
              background-color: white !important;
              color: black !important;
              border-color: #333 !important;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 10px auto;
            }
            .card {
              border: 1px solid #333;
              margin-bottom: 15px;
              padding: 10px;
              page-break-inside: avoid;
            }
            .card-header {
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #333;
            }
            .card-title {
              font-size: 16px;
              font-weight: bold;
              margin: 0;
            }
            .alert {
              border: 1px solid #333;
              padding: 10px;
              margin: 10px auto;
              page-break-inside: avoid;
              display: block !important;
              width: 80%;
              background-color: #fff5f5 !important;
            }
            .alert-title {
              font-weight: bold;
              margin-bottom: 5px;
              color: #dc2626 !important;
            }
            .alert-description {
              font-size: 0.9em;
            }
            .parameter-value, .parameter-value-label {
              display: none !important;
            }
            .grid {
              display: block !important;
              margin: 15px 0;
            }
            .md\\:col-span-3 {
              width: 100% !important;
            }
            .h-\\[400px\\] {
              height: 300px !important;
            }
            canvas {
              width: 100% !important;
              height: 300px !important;
            }
            .space-y-4 {
              display: block !important;
              margin-top: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${title}</h1>
        </div>
        <div class="print-date">
          Ausgedruckt am: ${new Date().toLocaleDateString("de-DE")}
        </div>
        <div class="print-content">
          ${contentClone.outerHTML}
        </div>
        <script>
          window.onload = function() {
            // Remove all buttons and interactive elements
            const buttons = document.querySelectorAll('button, select, .no-print, .chart-options');
            buttons.forEach(button => {
              if (button) button.style.display = 'none';
            });
            
            // Hide only parameter value labels and indicators
            const elementsToHide = document.querySelectorAll('.parameter-value, .parameter-value-label');
            elementsToHide.forEach(element => {
              if (element) element.style.display = 'none';
            });
            
            // Print and close after a short delay
            setTimeout(() => {
              window.print();
              window.close();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
