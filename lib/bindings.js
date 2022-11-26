// @ts-check

const path = require("path");
const { types } = require("ref-napi");
const { Library } = require("ffi-napi");
const { platform, arch } = require("os");

const { version } = require("../package.json");

const TYPE_PTR = "pointer";

const lib = Library(resolveBin(), {
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
});

function resolvePlatform() {
  const PLATFORM = platform();
  if (PLATFORM === "win32") return "windows";
  if (PLATFORM === "darwin") return "darwin";
  return "linux";
}

function resolveExt(platform) {
  if (platform === "windows") return ".dll";
  if (platform === "darwin") return ".dylib";
  return ".so";
}

function resolveBin() {
  const ARCH = arch() === "arm64" ? "aarch64" : "x86_64";
  const PLATFORM = resolvePlatform();
  const EXT = resolveExt(PLATFORM);
  const BIN_NAME = ARCH + "-" + PLATFORM + "-gif_ffi-v" + version + EXT;
  const BIN = "../bin/" + BIN_NAME;
  return path.join(__dirname, BIN);
}

const FrameResult = {
  Ok: 0,
  Empty: 1,
  Error: 2
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.lib = lib;
exports.FrameResult = FrameResult;
