const path = require("path");
const { types } = require("ref-napi");
const { Library } = require("ffi-napi");

const TYPE_PTR = "pointer";

const lib = Library(
  path.join(
    __dirname,
    path.basename(__dirname) === "lib"
      ? "../target/release/gif_ffi.dll"
      : "./gif_ffi.dll"
  ),
  {
    decoder_size: [types.size_t, []],
    decoder_from_src: [types.bool, [types.CString, TYPE_PTR]],
    file_width: [types.uint16, [TYPE_PTR]],
    file_height: [types.uint16, [TYPE_PTR]],
    next_frame: [types.uint8, [TYPE_PTR, TYPE_PTR]],
    frame_size: [types.size_t, []],
    frame_delay: [types.uint16, [TYPE_PTR]],
    encoder_size: [types.size_t, []],
    create_encoder: [types.bool, [types.uint16, types.uint16, TYPE_PTR]],
    frame_buffer_size: [types.size_t, [TYPE_PTR]],
    frame_buffer: [types.void, [TYPE_PTR, TYPE_PTR]],
    set_repeat: [types.bool, [TYPE_PTR, types.uint16]],
    write_frame: [types.bool, [TYPE_PTR, TYPE_PTR, types.size_t]],
    encoder_buffer_size: [types.size_t, [TYPE_PTR]],
    encoder_buffer: [types.void, [TYPE_PTR, TYPE_PTR]],
    frame_width: [types.uint16, [TYPE_PTR]],
    frame_height: [types.uint16, [TYPE_PTR]],
    set_delay: [types.void, [TYPE_PTR, types.uint16]],
    encoder_finish: [types.void, [TYPE_PTR]]
  }
);

const FrameResult = {
  Ok: 0,
  Empty: 1,
  Error: 2
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.lib = lib;
exports.FrameResult = FrameResult;
