export class GifEncoderError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class GifDecoderError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class GifFrameError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}