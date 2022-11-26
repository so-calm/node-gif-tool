# **node-gif-tool**

> [NPM](https://npmjs.com/package/gif-tool) \
> [GitHub](https://github.com/so-calm/node-gif-tool.git)

## About

> **WARNING!** This module is maintaned by one person yet. Great maintenance is not guaranteed. There are some plans on it though

This module is mainly written in **[Rust](https://rustlang.org/)** and bound to **NAPI** using **ffi-napi**\*. Image processing is implemented through **[image-rs/gif](https://github.com/image-rs/image-gif)**. Cross-platform builds are handled via **[cross](https://github.com/cross-rs/cross)**

- Easy to use
- Declaration files included
- Simple. Easy to learn

## Installation

> **npm**: `npm i gif-tool`\
> **yarn**: `yarn add gif-tool`\
> **pnpm**: `pnpm add gif-tool`

_The binaries are built-in_

## Inspiration

The idea of this module is to make an ease to use and performant gif encoder/decoder. No absurd amount of huge functions

## Examples

Could be found in [`examples/`](examples) folder

```js
const { GifEncoder, GifDecoder } = require("gif-tool");
const { writeFileSync } = require("fs");

/* explode */
const decoder = new GifDecoder("mygif.gif");
let i = 0;
for (const frame of decoder.frames) {
  writeFileSync(`./frames/frame_rgba_uncompressed_${i}`, frame.buffer());
  i += 1;
}

// simple single-pixel RGBA frames
const frames = [
  // red
  255, 0, 0, 255,

  // green
  0, 255, 0, 255,

  // blue
  0, 0, 255, 255
];

/* merge */
const encoder = new GifEncoder();
encoder.setDelay(10);

frames.forEach(frame => encoder.writeFrame(frame));
writeFileSync("./out.gif", encoder.buffer());
```

_It's that simple!_

### References:

- > ffi-napi:
  - [NPM](https://www.npmjs.com/package/ffi-napi)
  - [GitHub](https://github.com/node-ffi-napi/node-ffi-napi.git)

### Roadmap:

- [ ] Compare current implementation with **[gifski](https://gif.ski/)**
  - [ ] Migrate to **[gifski](https://gif.ski/)** if needed
- [ ] Handle more existing image processing methods
  - [ ] Get in use more existing options
- [ ] Implement different image loading methods into `GifDecoder`, such as raw buffer. Currently only file path is supported
- [ ] Built-in GIF manipulation functionality
- [ ] Add some paragraphs to the roadmap. lol

> Contributions are appreciated
