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
        margin: 0;
        padding: 2em;
      }

      .wrapper {
        max-width: 80em;
        margin: 0 auto;
      }

      header {
        margin-bottom: 2em;
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
      button {
        font: inherit;
      }

      footer {
        margin-top: 5em;
        font-size: 80%;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <header>
        <h1>Front Conference PDFs</h1>
      </header>
      <main>
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
                    }" required${field.relation ? ` data-relation='${JSON.stringify(field.relation)}'` : ''}>
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
                    }${field.relation ? ` data-relation='${JSON.stringify(field.relation)}'` : ''}>`;
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
      </main>
      <footer>
        Source code: <a href="https://github.com/frontendconf/speakers-pdfs">https://github.com/frontendconf/speakers-pdfs</a>
      </footer>
    </div>
    <script>
      function toggleFields(form, fields) {
        const data = Object.fromEntries(new FormData(form));

        fields.forEach(field => {
          const [key, value] = JSON.parse(field.dataset.relation);
          const isValid = value ? data[key] === value : !data[key];
          
          field.disabled = !isValid;
        });
      }
  
      const form = document.querySelector('form');
      const fields = form.querySelectorAll('[data-relation]');

      toggleFields(form, fields);

      form.addEventListener('change', () => {
        toggleFields(form, fields);
      });
    </script>
  </body>
  </html>`);
};
