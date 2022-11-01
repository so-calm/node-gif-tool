const { createCanvas } = require("canvas");
const { writeFileSync } = require("fs");

const { GifDecoder } = require("../bundle");

const decoder = new GifDecoder(
  __dirname.concat("/assets/jim-carrey-silly.gif")
);

// using canvas only for example purposes. It's not the best practice, kindly
// decide to use something else to encode image into any other format
const canvas = createCanvas(decoder.width, decoder.height);
const ctx = canvas.getContext("2d");

let i = 0;
for (const frame of decoder.frames) {
  const imageData = ctx.createImageData(decoder.width, decoder.height);
  const frameBuffer = frame.buffer();
  for (let i = 0; i < frameBuffer.length; i += 1) {
    imageData.data[i] = frameBuffer[i];
  }
  ctx.clearRect(0, 0, decoder.width, decoder.height);
  ctx.putImageData(imageData, 0, 0);

  writeFileSync(
    __dirname.concat(`/assets/explode/frame_${i}.png`),
    canvas.toBuffer()
  );
  i += 1;
}
