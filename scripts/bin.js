// @ts-check
const { extname } = require("path");
const { deflateSync } = require("zlib");

const {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync
} = require("fs");

const { version } = require("../package.json");

if (!existsSync("bin")) mkdirSync("bin");

const rbin = process.argv[3];
const ext = extname(rbin);
const bin = rbin.substring(0, rbin.length - ext.length) + "-v" + version + ext;
if (existsSync(bin)) rmSync(bin);

writeFileSync(bin + ".dfl", deflateSync(readFileSync(process.argv[2])));
