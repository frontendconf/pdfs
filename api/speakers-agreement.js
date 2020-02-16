const { resolve } = require("path");
const { readFileSync } = require("fs");
const ow = require("ow");
const merge = require("lodash.merge");
const generate = require("../lib/generate");

/**
 * Get YYYY-MM-DD formatted date string
 * @param {number} [daysFromToday=0] How many days in the future
 * @returns {string}
 */
function getFormattedDate(daysFromToday = 0) {
  let date = new Date();

  if (daysFromToday) {
    date = new Date(date.getTime() + daysFromToday * 24 * 60 * 60 * 1000);
  }

  return date.toISOString().substr(0, 10);
}

const speakersAgreementFields = [
  {
    label: "Deadline",
    type: "date",
    name: "deadline",
    value: getFormattedDate(10)
  },
  {
    label: "Duration [min]",
    type: "select",
    name: "duration",
    options: [{ label: 30 }, { label: 45 }]
  },
  { label: "Compensation [CHF]", type: "number", name: "compensation" },
  {
    label: "Origin",
    type: "select",
    name: "origin",
    options: [{ label: "Overseas" }, { label: "Europe" }, { label: "Europe" }]
  },
  { label: "Workshop", type: "checkbox", name: "workshop", value: true },
  {
    label: "Contact",
    type: "email",
    name: "contact",
    value: "NAME@frontconference.com"
  }
];

/**
 * Reset font styles after changing family or size
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See speakersAgreement function
 */
function resetFont({ doc, config } = options) {
  doc.font(config.font.family).fontSize(config.font.size);
}

/**
 * Add bold text immediately before following text
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See speakersAgreement function
 * @param {string} options.text
 * @param {object} options.textOptions
 */
function boldFont({ doc, config, text, textOptions } = options) {
  doc.font(`${config.font.family}-Bold`).text(
    text,
    merge(
      {
        continued: true
      },
      textOptions
    )
  );

  resetFont({ doc, config });
}

/**
 * Add content to PDFKit document
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See speakersAgreement function
 * @param {string} options.text Text to insert
 */
function insertContent({ doc, config } = options) {
  // Meta
  doc.info["Title"] = config.meta.title;
  doc.info["Author"] = config.meta.author;

  // Set up basic formatting
  doc.font(config.font.family);
  doc.fontSize(config.font.size);
  doc.lineGap(3);

  // Allow for form elements
  doc.initForm();

  // Add content
  doc.addPage();

  const contentWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const fieldOffset = 90;
  const fieldWidth = contentWidth - fieldOffset;
  const fieldHeight = 16;

  doc.fillColor("red");

  boldFont({
    doc,
    config,
    text: `Please complete this form, make copies for your records and email it to ${config.contact} latest until ${config.deadline}.\n\n\n`,

    textOptions: {
      continued: false,
      align: "center"
    }
  });

  doc.fillColor("black");

  doc.text(
    `The Frontend Conference Association ("FCA") is organizing presentations at the Front Conference Zurich event to be held ${config.date} (the "Event").\n
This consent form (the "Consent") will serve as our agreement concerning your participation at the Event with a Presentation (the "Presentation").\n\n\n`
  );

  if (config.workshop) {
    boldFont({
      doc,
      config,
      text: "Workshop\n",
      textOptions: {
        continued: false
      }
    });

    doc.text(
      `You agree to give the following Workshop at the Event:\n
Title:`
    );

    doc.formText(
      "titleWorkshop",
      doc.x + fieldOffset,
      doc.y - doc.currentLineHeight(true) - 6,
      fieldWidth,
      fieldHeight,
      {
        borderColor: "red"
      }
    );

    doc.text(
      `Date:                   ${config.dateWorkshop}
Duration:             8 hours\n\n\n`
    );
  }

  boldFont({
    doc,
    config,
    text: "Presentation\n",
    textOptions: {
      continued: false
    }
  });

  doc.text(
    `You agree to give the following Presentation at the Event:\n
Title:`
  );

  doc.formText(
    "title",
    doc.x + fieldOffset,
    doc.y - doc.currentLineHeight(true) - 6,
    fieldWidth,
    fieldHeight,
    {
      borderColor: "red"
    }
  );

  doc.text(
    `Date:                   ${config.date}
Duration:             ${config.duration} minutes\n\n\n`
  );

  boldFont({ doc, config, text: 1 });

  doc.text(
    `. FCA will promote your Presentation on social media, the Event’s website and other channels.\n
For this purpose, you agree to provide FCA and grant FCA the right to use Presentation outlines and supporting information, such as your name, voice, photograph, likeness and biographical data (collectively, "Supporting Information").\n\n`
  );

  boldFont({ doc, config, text: 2 });

  doc.text(
    `. FCA supports the spread of fresh ideas and practices around Technology and Design by making presentations freely and widely available to a broad audience. For this purpose, all presentations held at the Event are streamed live, and recorded for further display on FCA’s Vimeo channel, on FCA’s website or other video distribution channels.\n
You grant FCA and other entities — e.g., broadcasters — the right to record, stream, film and photograph your Presentation at the Event and to distribute, broadcast, edit, translate or otherwise disseminate it, without any further approval from you, in whole or in part, throughout the world, in perpetuity, in any and all media now known or hereafter developed. This grant to the FCA includes, but is not limited to, the right to use the Presentation either alone or together with Supporting Information.\n\n`
  );

  boldFont({ doc, config, text: 3 });

  doc.text(
    `. FCA encourages intelligent public debate around each presentation. Accordingly, your Presentation may be distributed under a "Creative Commons" license, which allows each distributed presentation to be re-published in noncommercial, non-derivative works, as long as the appropriate credit is given and the presentation is not edited or distorted. By signing this Consent, you acknowledge and agree that you do not object to the distribution of the Presentation by the FCA under a Creative Commons license.\n\n`
  );

  boldFont({ doc, config, text: 4 });

  doc.text(
    `. In addition, you understand and agree that: (i) FCA isn’t obligated to use the Presentation or Supporting Information in any way; (ii) you won’t receive any form of payment in connection with the use of the Presentation and/or Supporting Information.\n\n`
  );

  boldFont({ doc, config, text: 5 });

  doc.text(
    `. You affirm that: (i) you have the full power and authority to grant the rights and releases set forth in this Consent; (ii) you are the sole author of the Presentation; (iii) you own all rights to the Presentation, including, but not limited to, all copyrights and trademark rights; (iv) you will advise FCA in writing of all third-party material contained in the Presentation (to which you have not secured all necessary rights); (v) use of the Presentation as permitted by this Release will not violate the rights of any third party, and (vi) you may not revoke the rights granted in this Consent.\n
If any third party claims that the use of the Presentation violates its rights, you agree to cooperate fully with FCA to defend against or otherwise respond to such claim.\n\n`
  );

  boldFont({ doc, config, text: 6 });

  doc.text(
    `. You acknowledge and agree that the only considerations you will receive in connection with this Consent are: (i) the speaking opportunity provided to you by FCA; ${
      config.origin !== "Zurich"
        ? `(ii) accommodation at a hotel booked by FCA for up to ${
            config.origin === "Overseas" ? 5 : 3
          } nights; (iii) a round trip economy class airline ticket from${
            config.workshop ? "" : `\n`
          }
                                               to Zurich booked by FCA; and (iv)`
        : `and (ii)`
    } a compensation for the Presentation of ${
      config.compensation
    } CHF (Swiss Francs) to be paid within 60 days after the conference, pursuant to providing an invoice to FCA’s accounting department, including wire transfer details or other means of payment.\n\n`
  );

  if (config.origin !== "Zurich") {
    doc.formText(
      "departure",
      doc.x,
      doc.y - 6 * doc.currentLineHeight(true) - 5,
      150,
      fieldHeight,
      {
        borderColor: "red"
      }
    );
  }

  boldFont({ doc, config, text: 7 });

  doc.text(
    `. FCA and the Event are ran by web professionals in their spare time without any financial incentive. These circumstances complicate finding replacements, if a speaker cancels their participation at the Event on a short notice, and exacerbate thereby incurred expenses.\n
If you must cancel your appearance at the Event, you agree that you will notify FCA at least 60 days prior to the date of the first day of the conference. In the event that you fail to appear or perform pursuant to the terms of this agreement, you understand that you shall be responsible for covering the costs of the already booked flights and you shall try to help FCA find a replacement speaker of the same caliber. Shall you fail to appear or cancel later than 3 days prior to your scheduled arrival and should we not find a replacement, you shall cover the costs of the booked hotel nights. Cancellations due to illness, accident or attenuating circumstances are exempted.\n\n`
  );

  boldFont({ doc, config, text: 8 });

  doc.text(
    `. This Consent contains the entire understanding between you and FCA regarding the Presentation and Supporting Information and may not be modified except in writing signed by both parties.\n\n`
  );

  doc.text(`${config.workshop ? `\n\n\n\n` : `\n`}Name:`);

  doc.formText(
    "name",
    doc.x + fieldOffset,
    doc.y - doc.currentLineHeight(true) - 6,
    fieldWidth,
    fieldHeight,
    {
      borderColor: "red"
    }
  );

  doc.text(`\nName (signed):`);

  doc.formText(
    "signature",
    doc.x + fieldOffset,
    doc.y - doc.currentLineHeight(true) - 6,
    fieldWidth,
    fieldHeight,
    {
      borderColor: "red"
    }
  );

  doc.text(`\nDate:`);

  doc.formText(
    "date",
    doc.x + fieldOffset,
    doc.y - doc.currentLineHeight(true) - 6,
    fieldWidth,
    fieldHeight,
    {
      borderColor: "blue",
      value: getFormattedDate(),
      format: {
        type: "date",
        param: "yyyy-mm-dd"
      }
    }
  );

  doc
    .fontSize(10)
    .text(
      "This Consent shall be exclusively governed by Swiss/Zurich law without regard to choice-of-law principles. Any dispute concerning the Presentation and/or Supporting Information, or arising out of or relating to this Consent, shall be resolved in the courts of Zurich, Switzerland.",
      doc.x,
      doc.y + 50
    );

  resetFont({ doc, config });
}

/**
 * Add header to every page
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See speakersAgreement function
 */
function insertHeader({ doc, config } = options) {
  const text = config.title;
  let offsetY = config.pdf.margins.topHeader;
  // const currentFont = doc._font.name;
  // const currentFontSize = doc._fontSize;

  if (config.logo) {
    doc.addSVG(
      config.logo.path,
      (doc.page.width - config.logo.size) / 2,
      offsetY
    );

    offsetY += config.logo.size;
  }

  doc
    .font(`${config.font.family}-Bold`)
    .fontSize(25)
    .text(text, doc.x, offsetY, {
      align: "center",
      continued: true
    });

  doc.fontSize(config.font.size);

  doc.text(`\n\nFront Conference Zurich – ${config.date}`);
}

/**
 * Add footer to every page
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See speakersAgreement function
 */
function insertFooter({ doc, config, pages } = options) {
  const text = `${pages.current + 1} / ${pages.total}`;
  const offsetY =
    doc.page.height - doc.page.margins.bottom - doc.currentLineHeight() + 40;

  resetFont({ doc, config });

  doc.text(text, doc.x, offsetY, {
    align: "center",
    height: 0
  });
}

/**
 * Generate speakers agreement PDF
 * @param {string} options.deadline Until when to return the form
 * @param {string|number} options.duration Talk duration
 * @param {string|number} options.compensation Speaker compensation
 * @param {string|boolean} options.workshop Whether there will be an additional workshop
 * @param {string} options.contact E-mail contact to return form to
 * @param {string} [options.date="27 - 28 August 2020"] Conference date
 * @param {string} [options.dateWorkshop="26 August 2020"] Workshop date
 * @param {string} [options.title="Presentation Consent Form"] Title
 * @param {object} [options.meta] Added to PDF meta data
 * @param {string} [options.meta.title]
 * @param {string} [options.meta.author]
 * @param {object} [options.pdf] Passed to PDFKit instance
 * @param {object} [options.pdf.margins]
 * @param {object} [options.font] Used to (manually) set up / reset font family and size
 * @param {string} [options.font.family]
 * @param {number} [options.font.size]
 */
function speakersAgreement(options = {}) {
  const title = options.workshop
    ? "Workshop and Presentation Consent Form"
    : "Presentation Consent Form";
  const config = merge(
    {
      deadline: null,
      duration: null,
      compensation: null,
      workshop: false,
      contact: null,
      date: "27 - 28 August 2020",
      dateWorkshop: "26 August 2020",
      title,
      meta: {
        title,
        author: "Front Conference Zurich"
      },
      pdf: {
        margins: {
          top: 180,
          topHeader: 40,
          bottom: 80
        }
      },
      font: {
        family: "Helvetica",
        size: 12
      },
      logo: {
        path: readFileSync(resolve(__dirname, "../public/logo.svg"), "utf8"),
        size: 63
      }
    },
    options
  );

  config.workshop = config.workshop === "true";

  ow(
    config,
    ow.object.partialShape({
      deadline: ow.string.not.empty,
      duration: ow.any(ow.string.not.empty, ow.number),
      compensation: ow.any(ow.string.not.empty, ow.number),
      contact: ow.string.not.empty
    })
  );

  return generate({
    ...config,
    insertContent,
    insertHeader,
    insertFooter
  });
}

module.exports = async (req, res) => {
  const { query } = req;

  return speakersAgreement({ output: res, ...query });
};

module.exports.speakersAgreement = speakersAgreement;

module.exports.speakersAgreementFields = speakersAgreementFields;
