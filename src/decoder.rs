use crate::AllocFn;
use std::{ffi::CStr, fs::File, mem::size_of, ptr};

#[no_mangle]
pub extern "C" fn create_decoder(
    src: *mut i8,
    alloc: AllocFn<gif::Decoder<File>>,
) -> *const gif::Decoder<File> {
    let out = alloc(size_of::<gif::Decoder<File>>());
    if out.is_null() {
        return ptr::null();
    }

    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    let src = src as *const u8;

    let Ok(src) = unsafe { CStr::from_ptr(src) }.to_str() else { return ptr::null() };
    let Ok(src) = File::open(src) else { return ptr::null() };

    let mut decoder_build = gif::DecodeOptions::new();
    decoder_build.set_color_output(gif::ColorOutput::RGBA);
    unsafe { *out = decoder_build.read_info(src).unwrap() }

    out
}
