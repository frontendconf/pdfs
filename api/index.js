const { speakersAgreementFields } = require("./speakers-agreement");

module.exports = async (req, res) => {
  return res.send(`<!doctype html>
  <html lang=en>
  <head>
      <meta charset=utf-8>
      <title>Front Conference PDFs</title>
      <style>
          body {
              font-family: sans-serif;   
          }
          dl {
              max-width: 30em;
          }
          dl > div {
              display: flex;
              align-items: center;
          }
          dl > div + div {
              margin-top: 0.5em;
          }
          dt {
              flex-basis: 10em;
              margin-right: 1em;
          }
          dd {
              flex-grow: 1;
              margin: 0;
          }
          input[type="text"],
          input[type="date"],
          input[type="number"],
          input[type="email"],
          select {
              width: 100%;
              box-sizing: border-box;
              font: inherit;
          }
      </style>
  </head>
  <body>
      <h1>Front Conference PDFs</h1>
      <h2>Speakers Agreement</h2>
      <form action="/api/speakers-agreement.pdf">
          <dl>
            ${speakersAgreementFields
              .map(field => {
                let markup;
                switch (field.type) {
                  case "select":
                    markup = `<select id="${field.name}" name="${
                      field.name
                    }" required>
                        ${field.options
                          .map(
                            option =>
                              `<option ${
                                option.value ? (value = `${option.value}`) : ""
                              } ${option.selected ? "selected" : ""}>${
                                option.label
                              }</option>`
                          )
                          .join("")}
                    </select>`;
                    break;
                  default:
                    markup = `<input id="${field.name}" name="${
                      field.name
                    }" type="${field.type}" value="${field.value || ""}" ${
                      ["radio", "checkbox"].includes(field.type)
                        ? ""
                        : "required"
                    }>`;
                }

                return `<div>
                    <dt>
                        <label for="${field.name}">${field.label}</label>
                    </dt>
                    <dd>
                        ${markup}
                    </dd>
                </div>`;
              })
              .join("")}
          </dl>
          <button type="submit">Create</button>
      </form>
  </body>
  </html>`);
};
