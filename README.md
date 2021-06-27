# Generate PDF

When inviting a speaker, we send a `Presentation Consent Form`. It has dynamic data and some form fields.

PDFs are generated using [`PDFKit`](https://github.com/foliojs/pdfkit).

## Set up

`npm install`

## Development

Prerequisite: Account on [`Vercel`](https://vercel.com) so the project can be linked when using `vercel`.

- Run development server: `npx vercel dev`
- Run tests: `npm test`
- Format code `npm format`
- Deploy: `npx vercel`
- Deploy to https://pdfs.frontconference.com: `npx vercel -- --prod`
