use std::fs::File;

#[no_mangle]
pub extern "C" fn decoder_size() -> usize {
    std::mem::size_of::<gif::Decoder<File>>()
}

#[no_mangle]
pub extern "C" fn decoder_from_src(src: *mut i8, out: *mut gif::Decoder<File>) -> bool {
    let src = unsafe { std::ffi::CStr::from_ptr(src) }.to_str();
    if src.is_err() {
        return false;
    }

    let src = src.unwrap();
    let src = std::fs::File::open(src);
    if src.is_err() {
        return false;
    }

    let src = src.unwrap();
    let mut decoder_build = gif::DecodeOptions::new();
    decoder_build.set_color_output(gif::ColorOutput::RGBA);
    unsafe { *out = decoder_build.read_info(src).unwrap() }

    true
}
