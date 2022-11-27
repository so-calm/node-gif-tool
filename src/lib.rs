#![allow(clippy::not_unsafe_ptr_arg_deref)]

extern crate gif;

mod decoder;
mod encoder;
mod frame;

use decoder::GifDecoder;

#[no_mangle]
pub extern "C" fn file_width(d: *mut GifDecoder) -> u16 {
    unsafe { (*d).width() }
}

#[no_mangle]
pub extern "C" fn file_height(d: *mut GifDecoder) -> u16 {
    unsafe { (*d).height() }
}

pub type AllocFn<T> = extern "C" fn(usize) -> *mut T;
