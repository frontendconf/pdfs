# Generate PDF

When inviting a speaker, we send a `Presentation Consent Form`. It has dynamic data and some form fields.

PDFs are generated using [`PDFKit`](https://github.com/foliojs/pdfkit).

## Set up

`npm install`

## Development

Prerequisite: Account on [`ZEIT`](https://zeit.co/signup) so the project can be linked when using `now`.

- Run development server: `npm run now dev`
- Run tests: `npm test`
- Format code `npm format`
- Deploy: `npm run now`
- Alias: `npm run now alias DEPLOYMENT_ID pdfs.frontconference.com`
