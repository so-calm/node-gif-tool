// @ts-check

const path = require("path");
const { Library, types } = require("ffi-napi");
const { platform, arch } = require("os");

const { version } = require("../package.json");

const TYPE_PTR = "pointer";

const lib = Library(resolveBin(), {
  create_encoder: [TYPE_PTR, [types.uint16, types.uint16, TYPE_PTR]],
  decoder_from_file: [TYPE_PTR, [types.CString, TYPE_PTR]],
  decoder_from_ptr: [TYPE_PTR, [TYPE_PTR, types.uint, TYPE_PTR]],
  encoder_buffer: [TYPE_PTR, [TYPE_PTR, TYPE_PTR]],
  encoder_finish: [types.void, [TYPE_PTR]],
  file_height: [types.uint16, [TYPE_PTR]],
  file_width: [types.uint16, [TYPE_PTR]],
  frame_buffer: [TYPE_PTR, [TYPE_PTR, TYPE_PTR]],
  frame_delay: [types.uint16, [TYPE_PTR]],
  frame_height: [types.uint16, [TYPE_PTR]],
  frame_width: [types.uint16, [TYPE_PTR]],
  next_frame: [TYPE_PTR, [TYPE_PTR, TYPE_PTR]],
  set_delay: [types.void, [TYPE_PTR, types.uint16]],
  set_repeat: [types.bool, [TYPE_PTR, types.uint16]],
  write_frame: [types.bool, [TYPE_PTR, TYPE_PTR, types.size_t]]
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

Object.defineProperty(exports, "__esModule", { value: true });

exports.TYPE_PTR = TYPE_PTR;
exports.lib = lib;
