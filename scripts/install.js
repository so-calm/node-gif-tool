// @ts-check

const pathJoin = require("path").join;
const { extname, basename } = require("path");
const { request } = require("https");
const { inflateSync } = require("zlib");
const { arch, platform } = require("os");
const { existsSync, mkdirSync, statSync, writeFileSync } = require("fs");

const { version, repository } = require("../package.json");

const BIN_DIR = pathJoin(__dirname, "../bin");
const BIN = resolveBin();
if (existsSync(BIN)) process.exit(0);

if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR);
if (!statSync(BIN_DIR).isDirectory()) {
  throw new Error("Failed to create " + BIN_DIR);
}

makeRequest(
  filename(repository.url) +
    "/releases/download/" +
    version +
    "/" +
    basename(BIN) +
    ".dfl"
).then(dfl => {
  writeFileSync(BIN, inflateSync(dfl));
});

function filename(file) {
  return file.substring(0, file.length - extname(file).length);
}

function makeRequest(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects >= 10) {
      return reject(new Error("redirection exceeded the limit"));
    }

    request(url, async res => {
      if (res.statusCode === 302) {
        return resolve(makeRequest(res.headers.location, redirects + 1));
      }
      if (res.statusCode !== 200) {
        return reject(
          new Error("server responded with " + res.statusCode + " status code")
        );
      }

      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).end();
  });
}

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
  const BIN = ARCH + "-" + PLATFORM + "-gif_ffi-v" + version + EXT;
  return pathJoin(BIN_DIR, BIN);
}
