export const FrameResult: { Ok: 0; Empty: 1; Error: 2 };

export namespace lib {
  export type Encoder = Buffer;
  export type Decoder = Buffer;
  export type Frame = Buffer;

  export function decoder_size(): number;
  export function decoder_from_src(src: string, d: Decoder): bool;
  export function file_width(d: Decoder): number;
  export function file_height(d: Decoder): number;
  export function next_frame(d: Decoder, f: Frame): number;
  export function frame_size(): number;
  export function frame_delay(f: Frame): number;
  export function encoder_size(): number;
  export function create_encoder(w: number, h: number, e: Encoder): bool;
  export function frame_buffer_size(f: Frame): number;
  export function frame_buffer(f: Frame, buffer: Buffer): void;
  export function set_repeat(e: Encoder, repeat: number): bool;
  export function write_frame(e: Encoder, buffer: Buffer, size: number): bool;
  export function encoder_buffer_size(e: Encoder): number;
  export function encoder_buffer(e: Encoder, buffer: Buffer): void;
  export function frame_width(f: Frame): number;
  export function frame_height(f: Frame): number;
  export function set_delay(e: Encoder, delay: number): void;
  export function encoder_finish(e: Encoder): void;
}
