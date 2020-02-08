const ow = require("ow");
const merge = require("lodash.merge");
const generate = require("../lib/generate");

/**
 * Reset font styles after changing family or size
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See exported function
 */
function resetFont({ doc, config } = options) {
  doc.font(config.font.family).fontSize(config.font.size);
}

/**
 * Add bold text immediately before following text
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See exported function
 */
function boldFont({ doc, config, text } = options) {
  doc.font(`${config.font.family}-Bold`).text(text, {
    continued: true
  });

  resetFont({ doc, config });
}

/**
 * Add content to PDFKit document
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See exported function
 * @param {string} options.text Text to insert
 */
function insertContent({ doc, config } = options) {
  // Meta
  doc.info["Title"] = config.meta.title;
  doc.info["Author"] = config.meta.author;

  // Set up basic formatting
  doc.font(config.font.family);
  doc.fontSize(config.font.size);

  // Allow for form elements
  doc.initForm();

  // Add content
  doc.addPage();

  // doc.text(
  //   `Date: ${config.date}, duration: ${config.duration}, compensation: ${config.compensation}`,
  //   doc.x,
  //   doc.y
  // );

  doc.text(
    `The Frontend Conference Association ("FCA") is organizing 30 minutes presentations at the Front Conference Zurich event to be held 29 - 30 August 2019 (the "Event").\n
This consent form (the "Consent") will serve as our agreement concerning your participation at the Event with a Presentation (the "Presentation").\n\n`
  );

  boldFont({ doc, config, text: 1 });

  doc.text(
    `. FCA will promote your Presentation on social media, the Event’s website and other channels.
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
    `. You acknowledge and agree that the only considerations you will receive in connection with this Consent are: (i) the speaking opportunity provided to you by FCA; (ii) accommodation at a hotel booked by FCA for up to 5 nights; (iii) a round trip economy class airline ticket from _______________________ to Zurich booked by FCA; and (iv) a compensation for the Presentation of 500 CHF (Swiss Francs) to be paid within 60 days after the conference, pursuant to providing an invoice to FCA’s accounting department, including wire transfer details or other means of payment.\n\n`
  );

  boldFont({ doc, config, text: 7 });

  doc.text(
    `. FCA and the Event are ran by web professionals in their spare time without any financial incentive. These circumstances complicate finding replacements, if a speaker cancels their participation at the Event on a short notice, and exacerbate thereby incurred expenses.\n
If you must cancel your appearance at the Event, you agree that you will notify FCA at least 60 days prior to the date of the first day of the conference. In the event that you fail to appear or perform pursuant to the terms of this agreement, you understand that you shall be responsible for covering the costs of the already booked flights and you shall try to help FCA find a replacement speaker of the same caliber. Shall you fail to appear or cancel later than 3 days prior to your scheduled arrival and should we not find a replacement, you shall cover the costs of the booked hotel nights. Cancellations due to illness, accident or attenuating circumstances are exempted.\n\n`
  );

  boldFont({ doc, config, text: 8 });

  doc.text(
    `. This Consent contains the entire understanding between you and FCA regarding the Presentation and Supporting Information and may not be modified except in writing signed by both parties.`
  );

  doc.formText("date", doc.x, doc.y + 10, 200, 20, {
    value: "2020-02-20",
    format: {
      type: "date",
      param: "yyyy-mm-dd"
    },
    borderColor: "green"
  });

  doc.formText("title", doc.x, doc.y + 40, 200, 20, {
    borderColor: "red"
  });

  doc.formText("city", doc.x, doc.y + 70, 200, 80, {
    borderColor: "blue"
  });

  doc
    .fontSize(10)
    .text(
      "This Consent shall be exclusively governed by Swiss/Zurich law without regard to choice-of-law principles. Any dispute concerning the Presentation and/or Supporting Information, or arising out of or relating to this Consent, shall be resolved in the courts of Zurich, Switzerland.",
      doc.x,
      doc.y + 170
    );

  resetFont({ doc, config });
}

/**
 * Add header to every page
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See exported function
 */
function insertHeader({ doc, config } = options) {
  const text = "FRONT CONFERENCE ZURICH";
  const offsetY = doc.page.margins.top - 80;
  // const currentFont = doc._font.name;
  // const currentFontSize = doc._fontSize;

  doc
    .font(`${config.font.family}-Bold`)
    .fontSize(25)
    .text(text, doc.x, offsetY, {
      align: "center",
      continued: true
    });

  resetFont({ doc, config });

  doc.text("\n\n29 - 30 August 2019");
}

/**
 * Add footer to every page
 * @param {object} options
 * @param {object} options.doc PDFKit document
 * @param {object} options.config See exported function
 */
function insertFooter({ doc, pages } = options) {
  const text = `${pages.current + 1} / ${pages.total}`;
  const offsetY =
    doc.page.height - doc.page.margins.bottom - doc.currentLineHeight() + 40;

  doc.text(text, doc.x, offsetY, {
    align: "center",
    height: 0
  });
}

/**
 * Generate speakers agreement PDF
 * @param {string|number} options.duration Talk duration
 * @param {string|number} options.compensation Speaker compensation
 * @param {string} [options.date] Conference date
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
  const config = merge(
    {
      date: "27 - 28 August 2020",
      duration: null,
      compensation: null,
      meta: {
        title: "Presentation Consent Form",
        author: "Front Conference Zurich"
      },
      pdf: {
        margins: {
          top: 120,
          bottom: 80
        }
      },
      font: {
        family: "Helvetica",
        size: 12
      }
    },
    options
  );

  ow(
    config,
    ow.object.partialShape({
      date: ow.string.not.empty,
      duration: ow.any(ow.string.not.empty, ow.number),
      compensation: ow.any(ow.string.not.empty, ow.number)
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
