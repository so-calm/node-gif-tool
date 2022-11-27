use crate::AllocFn;
use std::{mem::size_of, ptr};

pub struct Encoder {
    delay: u16,
    width: u16,
    height: u16,
    encoder: gif::Encoder<Vec<u8>>,
}

#[no_mangle]
pub extern "C" fn create_encoder(w: u16, h: u16, alloc: AllocFn<Encoder>) -> *const Encoder {
    let Ok(encoder) = gif::Encoder::new(Vec::new(), w, h, &[]) else {
        return ptr::null();
    };

    let e = alloc(size_of::<Encoder>());
    if !e.is_null() {
        unsafe {
            *e = Encoder {
                delay: 4,
                width: w,
                height: h,
                encoder,
            }
        };
    }

    e
}

#[no_mangle]
pub extern "C" fn set_repeat(e: *mut Encoder, repeat: u16) -> bool {
    unsafe {
        (*e).encoder.set_repeat(if repeat > 0 {
            gif::Repeat::Finite(repeat)
        } else {
            gif::Repeat::Infinite
        })
    }
    .is_ok()
}

#[no_mangle]
pub extern "C" fn set_delay(e: *mut Encoder, delay: u16) {
    unsafe { (*e).delay = delay }
}

#[no_mangle]
pub extern "C" fn write_frame(e: *mut Encoder, bytes: *mut u8, size: usize) -> bool {
    let mut frame = gif::Frame::from_rgba(unsafe { (*e).width }, unsafe { (*e).height }, unsafe {
        std::slice::from_raw_parts_mut(bytes, size)
    });
    frame.delay = unsafe { (*e).delay };

    if unsafe { (*e).encoder.write_frame(&frame) }.is_err() {
        return false;
    }

    true
}

#[no_mangle]
pub extern "C" fn encoder_finish(e: *mut Encoder) {
    unsafe { (*e).encoder.get_mut() }.push(0x3b)
}

#[no_mangle]
pub extern "C" fn encoder_buffer(e: *mut Encoder, alloc: AllocFn<u8>) -> *const u8 {
    let b = unsafe { (*e).encoder.get_ref() };
    let len = b.len();
    let out = alloc(len);
    if out.is_null() {
        return ptr::null();
    }
    unsafe { std::ptr::copy_nonoverlapping(b.as_ptr(), out, len) };
    out
}
