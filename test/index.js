const test = require("ava");
const {
  existsSync,
  unlinkSync,
  createWriteStream,
  readFileSync
} = require("fs");
const { resolve } = require("path");
const { Writable } = require("stream");
const { speakersAgreement } = require("../api/speakers-agreement");

const filePath = resolve(__dirname, "./results/test.pdf");
const contentLength = readFileSync(resolve(__dirname, "./fixtures/test.pdf"))
  .length;

const config = {
  duration: 30,
  compensation: 1000
};

function cleanup() {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

test("save file", async t => {
  cleanup();

  const { data } = await speakersAgreement({
    ...config,
    output: createWriteStream(filePath)
  });

  t.is(data, undefined);
  t.is(existsSync(filePath), true);
});

test("return buffer", async t => {
  const { data } = await speakersAgreement({
    ...config
  });

  t.is(Buffer.isBuffer(data), true);
  t.is(data.length, contentLength);
});

test("pipe to stream", async t => {
  const buffers = [];
  const output = new Writable({
    write(chunk, encoding, callback) {
      buffers.push(chunk);
      callback();
    }
  });

  const { data } = await speakersAgreement({
    ...config,
    output
  });

  t.is(data, undefined);
  t.is(Buffer.concat(buffers).length, contentLength);
});

test.after.always("cleanup", () => {
  cleanup();
});
