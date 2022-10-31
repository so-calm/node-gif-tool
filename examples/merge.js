// encode gif animation from png file frames. Repeat set to single

const { loadImage, createCanvas } = require("canvas");
const { writeFileSync, readdirSync } = require("fs");

const { GifEncoder } = require("../bundle");

// using canvas only for example purposes. It's not the best practice, kindly decide
// to use something else to encode image into any other format
const assets = __dirname.concat("/assets/explode");
const framePromises = readdirSync(assets).map(file => {
  return loadImage(assets.concat("/", file));
});

Promise.all(framePromises).then(frames => {
  const [frame] = frames;
  if (!frame) return;

  const canvas = createCanvas(frame.width, frame.height);
  const ctx = canvas.getContext("2d");

  const encoder = new GifEncoder(frame.width, frame.height);
  encoder.setRepeat(1);

  // by default, frame rate is set to 25. Results in faster animation
  encoder.setDelay(4); // default

  frames.forEach(frame => {
    ctx.drawImage(frame, 0, 0);
    const buffer = ctx.getImageData(0, 0, encoder.width, encoder.height).data;
    encoder.writeFrame(buffer);
  });

  writeFileSync(__dirname.concat("/assets/out_merge.gif"), encoder.buffer());
});
