const { createCanvas } = require("canvas");
const { writeFileSync } = require("fs");

const { GifDecoder, GifEncoder, Repeat } = require("../bundle");

const decoder = new GifDecoder(
  __dirname.concat("/assets/im-waiting-aki-and-paw-paw.gif")
);

const canvas = createCanvas(decoder.width, decoder.height);
const ctx = canvas.getContext("2d");

const encoder = new GifEncoder(canvas.width, canvas.height);
encoder.setRepeat(Repeat.Infinite);

ctx.font = "36px sans-serif";
ctx.fillStyle = "#fff";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

for (const frame of decoder.frames) {
  const imageData = ctx.createImageData(decoder.width, decoder.height);
  const frameBuffer = frame.buffer();
  for (let i = 0; i < frameBuffer.length; i += 1) {
    imageData.data[i] = frameBuffer[i];
  }
  ctx.clearRect(0, 0, decoder.width, decoder.height);
  ctx.putImageData(imageData, 0, 0);
  ctx.fillText("Waiting", decoder.width / 2, 36);

  encoder.setDelay(frame.delay);
  encoder.writeFrame(
    ctx.getImageData(0, 0, decoder.width, decoder.height).data
  );
}

writeFileSync(__dirname.concat("/assets/out_canvas.gif"), encoder.buffer());
