import React, { useState } from "react";
import { Printer } from "lucide-react";
import { colors, fonts } from "../theme";

export default function PrintButton({ data }) {
  const [isPreparing, setIsPreparing] = useState(false);

  const handlePrint = () => {
    setIsPreparing(true);
    
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    
    // Build the menu HTML - WITH IMAGES
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.brand.name} - Menu</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&display=swap" rel="stylesheet">
          <style>
            /* --- Reset --- */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            /* --- Page setup --- */
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            
            body {
              background: #FBF3DE;
              color: #241F16;
              font-family: 'Cormorant Garamond', serif;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-size: 11px;
              line-height: 1.3;
            }
            
            /* --- Force everything to fit on one page --- */
            .print-container {
              max-width: 100%;
              margin: 0 auto;
            }
            
            /* --- Compact Header --- */
            .print-header {
              text-align: center;
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 2px solid #1F3D2E;
            }
            
            .print-header h1 {
              font-family: 'Fraunces', serif;
              font-style: italic;
              font-weight: 600;
              font-size: 26px;
              color: #142A20;
              margin: 0;
              letter-spacing: -0.5px;
            }
            
            .print-header .tagline {
              font-family: 'Cormorant Garamond', serif;
              font-size: 13px;
              font-style: italic;
              color: #241F16;
              opacity: 0.8;
              margin: 1px 0;
            }
            
            .print-header .est-line {
              font-family: 'Cormorant Garamond', serif;
              font-size: 11px;
              font-style: italic;
              color: #241F16;
              opacity: 0.6;
              margin: 1px 0;
            }
            
            .print-header .meta {
              font-family: 'Space Mono', monospace;
              font-size: 7.5px;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #241F16;
              opacity: 0.5;
              margin-top: 4px;
              line-height: 1.5;
            }
            
            /* --- Categories Grid Layout --- */
            .print-categories {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px 12px;
            }
            
            /* --- Individual Category --- */
            .print-category {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-category h2 {
              font-family: 'Fraunces', serif;
              font-style: italic;
              font-weight: 600;
              font-size: 14px;
              color: #142A20;
              margin: 0 0 1px 0;
              padding-top: 4px;
              border-bottom: 1px solid #1F3D2E22;
            }
            
            .print-category .subtitle {
              font-family: 'Cormorant Garamond', serif;
              font-size: 9px;
              font-style: italic;
              color: #241F16;
              opacity: 0.6;
              margin: 0 0 3px 0;
            }
            
            /* --- Dish items with image support --- */
            .print-item-wrapper {
              display: flex;
              gap: 8px;
              padding: 3px 0;
              border-bottom: 1px dotted #1F3D2E22;
              align-items: flex-start;
            }
            
            .print-item-wrapper:last-child {
              border-bottom: none;
            }
            
            .print-item-image {
              width: 40px;
              height: 40px;
              object-fit: cover;
              border-radius: 6px;
              flex-shrink: 0;
              background: #1F3D2E11;
            }
            
            .print-item-image-empty {
              width: 40px;
              height: 40px;
              flex-shrink: 0;
              display: none;
            }
            
            .print-item-content {
              flex: 1;
              min-width: 0;
            }
            
            .print-item {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              gap: 8px;
            }
            
            .print-item .name {
              font-family: 'Cormorant Garamond', serif;
              font-size: 11px;
              font-weight: 500;
              color: #241F16;
            }
            
            .print-item .veg {
              color: #1F3D2E;
              margin-left: 2px;
              font-size: 9px;
            }
            
            .print-item .price {
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              color: #C4602F;
              white-space: nowrap;
              flex-shrink: 0;
            }
            
            .print-item .desc {
              font-family: 'Cormorant Garamond', serif;
              font-size: 9px;
              color: #241F16;
              opacity: 0.7;
              margin: 0 0 1px 0;
              line-height: 1.2;
            }
            
            /* --- Footer --- */
            .print-footer {
              margin-top: 8px;
              padding-top: 6px;
              border-top: 1px solid #1F3D2E;
              text-align: center;
              font-family: 'Space Mono', monospace;
              font-size: 7px;
              letter-spacing: 0.05em;
              color: #241F16;
              opacity: 0.4;
            }
            
            .veg-note {
              font-size: 7.5px;
              font-style: italic;
              color: #241F16;
              opacity: 0.4;
              margin-top: 6px;
              padding-top: 4px;
              border-top: 1px solid #1F3D2E22;
              text-align: center;
            }
            
            .numeral {
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              color: #C4602F;
              margin-right: 4px;
            }
            
            /* --- Ensure everything fits --- */
            @media print {
              body { margin: 0; padding: 0; }
              .print-container { max-width: 100%; }
            }
            
            /* --- If content is too long, allow smaller font --- */
            @media print and (max-height: 800px) {
              body { font-size: 9px; }
              .print-header h1 { font-size: 20px; }
              .print-item .name { font-size: 9px; }
              .print-item .desc { font-size: 8px; }
              .print-category h2 { font-size: 12px; }
              .print-item-image { width: 32px; height: 32px; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- HEADER -->
            <div class="print-header">
              <h1>${data.brand.name}</h1>
              <div class="tagline">${data.brand.tagline}</div>
              <div class="est-line">${data.brand.estLine}</div>
              <div class="meta">
                ${data.brand.hours} · ${data.brand.phone} · ${data.brand.address}
              </div>
            </div>

            <!-- ALL CATEGORIES IN 2-COLUMN GRID -->
            <div class="print-categories">
              ${data.categories.map(cat => `
                <div class="print-category">
                  <h2>
                    <span class="numeral">${cat.numeral}</span>
                    ${cat.title}
                  </h2>
                  <div class="subtitle">${cat.subtitle}</div>
                  ${cat.items.map(item => {
                    // Check if item has an image
                    const hasImage = item.image && item.image.trim() !== '';
                    return `
                      <div class="print-item-wrapper">
                        ${hasImage ? `
                          <img 
                            src="${item.image}" 
                            alt="${item.name}" 
                            class="print-item-image"
                            onerror="this.style.display='none'"
                            loading="lazy"
                          />
                        ` : `
                          <div class="print-item-image-empty"></div>
                        `}
                        <div class="print-item-content">
                          <div class="print-item">
                            <span class="name">
                              ${item.name}
                              ${item.veg ? '<span class="veg">🌿</span>' : ''}
                            </span>
                            <span class="price">$${item.price}</span>
                          </div>
                          <div class="desc">${item.desc}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>

            <!-- FOOTER -->
            <div class="print-footer">
              ${data.brand.website} · ${data.brand.instagram}
            </div>
            
            <div class="veg-note">
              🌿 Vegetarian dish
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Wait for images and fonts to load, then print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
        setIsPreparing(false);
      }, 1000);
    }, 1000); // Increased timeout to allow images to load
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isPreparing}
      style={{
        fontFamily: fonts.mono,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "9px 18px",
        borderRadius: "8px",
        border: `1px solid ${colors.bottle}`,
        background: isPreparing ? colors.bottle + "88" : colors.bottle,
        color: colors.ivory,
        cursor: isPreparing ? "wait" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
        opacity: isPreparing ? 0.7 : 1,
      }}
    >
      <Printer size={13} />
      {isPreparing ? "Loading images..." : "Download PDF"}
    </button>
  );
}