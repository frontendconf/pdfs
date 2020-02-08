const test = require("ava");
const { existsSync, unlinkSync, readFileSync } = require("fs");
const { Writable } = require("stream");
const speakersAgreement = require("../lib/speakers-agreement");

const filePath = "test.pdf";
const contentLength = 6685;

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
    filePath
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
  const outputStream = new Writable({
    write(chunk, encoding, callback) {
      buffers.push(chunk);
      callback();
    }
  });

  const { data } = await speakersAgreement({
    ...config,
    outputStream
  });

  t.is(data, undefined);
  t.is(Buffer.concat(buffers).length, contentLength);
});

test.after.always("cleanup", () => {
  cleanup();
});
