const PDFDocument = require("pdfkit");
const fs = require("fs");
const merge = require("lodash.merge");

/**
 * Generate speakers agreement PDF
 * @param {function} options.insertContent Add content to PDFKit document
 * @param {function} [options.insertHeader] Add header to every page
 * @param {function} [options.insertFooter] Add footer to every page
 * @param {string} [options.filePath] Save output to file
 * @param {WriteableStream} [options.outputStream] Pipe output to stream
 * @param {object} [options.pdf] Passed to PDFKit instance
 * @returns {object} output
 * @returns {object} output.doc PDFKit document
 * @returns {buffer} output.data Buffered document (unless `filePath` or `outputStream`)
 */
module.exports = (options = {}) => {
  const config = merge(
    {
      insertContent: null,
      insertHeader: null,
      insertFooter: null,
      filePath: null,
      outputStream: null,
      pdf: {
        margins: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
        },
        autoFirstPage: false,
        bufferPages: true
      }
    },
    options
  );

  return new Promise(resolve => {
    const doc = new PDFDocument(config.pdf);

    // Handle output stream, fall back to buffer
    let outputStream = config.outputStream;
    const buffers = [];

    if (config.filePath) {
      outputStream = fs.createWriteStream(config.filePath);
    }

    // Specify output
    if (outputStream) {
      doc.pipe(outputStream);
    } else {
      doc.on("data", buffers.push.bind(buffers));
    }

    doc.on("end", () => {
      let data;

      if (!outputStream) {
        data = Buffer.concat(buffers);
      }

      return resolve({ doc, data });
    });

    // doc.on("pageAdded", () => {
    //   if (config.insertHeader) {
    //     config.insertHeader({ doc, config });
    //   }

    //   if (config.insertFooter) {
    //     const range = doc.bufferedPageRange();
    //     const currentX = doc.x;
    //     const currentY = doc.y;

    //     config.insertFooter({
    //       doc,
    //       config,
    //       pages: { current: range.count - 1 }
    //     });

    //     doc.x = currentX;
    //     doc.y = currentY;
    //   }
    // });

    config.insertContent({ doc, config });

    if (config.insertHeader || config.insertFooter) {
      const range = doc.bufferedPageRange();

      for (let i = 0; i < range.count; i++) {
        const pages = { current: i, total: range.count };

        doc.switchToPage(i);

        if (config.insertHeader) {
          config.insertHeader({
            doc,
            config,
            pages
          });
        }

        if (config.insertFooter) {
          config.insertFooter({
            doc,
            config,
            pages
          });
        }
      }
    }

    doc.end();
  });
};
