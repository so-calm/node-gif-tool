use std::fs::File;

#[no_mangle]
pub extern "C" fn decoder_size() -> usize {
    std::mem::size_of::<gif::Decoder<File>>()
}

#[no_mangle]
pub extern "C" fn decoder_from_src(src: *mut i8, out: *mut gif::Decoder<File>) -> bool {
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    let src = src as *const u8;

    let Ok(src) = unsafe { std::ffi::CStr::from_ptr(src) }.to_str() else { return false };
    let Ok(src) = std::fs::File::open(src) else { return false };

    let mut decoder_build = gif::DecodeOptions::new();
    decoder_build.set_color_output(gif::ColorOutput::RGBA);
    unsafe { *out = decoder_build.read_info(src).unwrap() }

    true
}
