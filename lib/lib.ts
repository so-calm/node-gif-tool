import { Callback, types } from "ffi-napi";

import { TYPE_PTR } from "./bindings";

export enum FrameResult {
  Ok = 0,
  Empty = 1
}

export const alloc = Callback(TYPE_PTR, [types.uint], (size: number) => {
  return Buffer.alloc(size);
});

export function isNullPtr(ptr: Buffer) {
  return ptr.buffer.byteLength === 0;
}

export * from "./bindings";
