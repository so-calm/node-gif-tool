import { alloc } from "./lib";

export const TYPE_PTR: "pointer";

export namespace lib {
  type AllocFn = typeof alloc;
  export type Encoder = Buffer;
  export type Decoder = Buffer;
  export type Frame = Buffer;

  export function create_encoder(w: number, h: number, alloc: AllocFn): Encoder;
  export function decoder_from_file(src: string, alloc: AllocFn): Decoder;
  export function decoder_from_ptr(
    src: Buffer,
    size: number,
    alloc: AllocFn
  ): Decoder;
  export function encoder_buffer(e: Encoder, alloc: AllocFn): Buffer;
  export function encoder_finish(e: Encoder): void;
  export function file_height(d: Decoder): number;
  export function file_width(d: Decoder): number;
  export function frame_buffer(f: Frame, alloc: AllocFn): Buffer;
  export function frame_delay(f: Frame): number;
  export function frame_height(f: Frame): number;
  export function frame_width(f: Frame): number;
  export function next_frame(d: Decoder, f: Frame): Buffer;
  export function set_delay(e: Encoder, delay: number): void;
  export function set_repeat(e: Encoder, repeat: number): bool;
  export function write_frame(e: Encoder, buffer: Buffer, size: number): bool;
}
