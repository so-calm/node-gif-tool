extern crate gif;

mod decoder;
mod encoder;
mod frame;

#[no_mangle]
pub extern "C" fn file_width(d: *mut gif::Decoder<std::fs::File>) -> u16 {
    unsafe { (*d).width() }
}

#[no_mangle]
pub extern "C" fn file_height(d: *mut gif::Decoder<std::fs::File>) -> u16 {
    unsafe { (*d).height() }
}

pub type AllocFn<T> = extern "C" fn(usize) -> *mut T;
