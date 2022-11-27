use crate::AllocFn;
use std::{borrow::Cow, ffi::CStr, fs::File, io::Read, mem::size_of, ptr};

pub enum DecoderSrc {
    File(File),
    Bytes(Cow<'static, [u8]>),
}

impl Read for DecoderSrc {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        match self {
            Self::File(s) => s.read(buf),
            Self::Bytes(s) => match s {
                Cow::Borrowed(s) => Read::read(s, buf),
                Cow::Owned(s) => Read::read(&mut &s[..], buf),
            },
        }
    }
}

pub type GifDecoder = gif::Decoder<DecoderSrc>;

#[no_mangle]
pub extern "C" fn decoder_from_file(src: *mut i8, alloc: AllocFn<GifDecoder>) -> *const GifDecoder {
    let out = alloc(size_of::<GifDecoder>());
    if out.is_null() {
        return ptr::null();
    }

    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    let src = src as *const u8;

    let Ok(src) = unsafe { CStr::from_ptr(src) }.to_str() else { return ptr::null() };
    let Ok(src) = File::open(src) else { return ptr::null() };

    let mut decoder_build = gif::DecodeOptions::new();
    decoder_build.set_color_output(gif::ColorOutput::RGBA);
    unsafe { *out = decoder_build.read_info(DecoderSrc::File(src)).unwrap() }

    out
}

#[no_mangle]
pub extern "C" fn decoder_from_ptr(
    src: *mut u8,
    size: usize,
    alloc: AllocFn<GifDecoder>,
) -> *const GifDecoder {
    let out = alloc(size_of::<GifDecoder>());
    if out.is_null() {
        return ptr::null();
    }

    let src = unsafe { std::slice::from_raw_parts(src, size) };

    let mut decoder_build = gif::DecodeOptions::new();
    decoder_build.set_color_output(gif::ColorOutput::RGBA);
    unsafe {
        *out = decoder_build
            .read_info(DecoderSrc::Bytes(Cow::from(src)))
            .unwrap()
    }

    out
}
