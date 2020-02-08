const { send, sendError, createError } = require("micro");
const url = require("url");
const speakersAgreement = require("./lib/speakers-agreement");

const html = (data = {}) => `<!doctype html>
<html lang=en>
<head>
    <meta charset=utf-8>
    <title>${data.title || "Front Conference PDFs"}</title>
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
        input,
        select {
            width: 100%;
            box-sizing: border-box;
            font: inherit;
        }
    </style>
</head>
<body>
    ${data.content}
</body>
</html>`;

module.exports = async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  let statusCode = 200;
  let content;

  switch (pathname) {
    case "/speakers-agreement.pdf":
      try {
        await speakersAgreement({ outputStream: res, ...query });
      } catch (err) {
        console.log(err);

        return res.end();
      }
      break;
    case "/":
      content = html({
        content: `
<h1>Front Conference PDFs</h1>
<h2>Speakers Agreement</h2>
<form action="/speakers-agreement.pdf">
    <dl>
        <div>
            <dt>
                <label for="date">Date</label>
            </dt>
            <dd>
                <input id="date" name="date" value="29 - 30 August 2019">
            </dd>
        </div>
        <div>
            <dt>
                <label for="duration">Duration [min]</label>
            </dt>
            <dd>
                <select id="duration" name="duration">
                    <option>30</option>
                    <option>45</option>
                </select>
            </dd>
        </div>
        <div>
            <dt>
                <label for="compensation">Compensation [CHF]</label>
            </dt>
            <dd>
                <input id="compensation" name="compensation" type="number">
            </dd>
        </div>
    </dl>
    <button type="submit">Create</button>
</form>
      `
      });
      break;
    default:
      throw createError(404, "Not found");
  }

  return send(res, statusCode, content);
};
