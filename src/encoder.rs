pub struct Encoder {
    delay: u16,
    width: u16,
    height: u16,
    encoder: gif::Encoder<Vec<u8>>,
}

#[no_mangle]
pub extern "C" fn encoder_size() -> usize {
    std::mem::size_of::<Encoder>()
}

#[no_mangle]
pub extern "C" fn create_encoder(w: u16, h: u16, e: *mut Encoder) -> bool {
    let encoder = gif::Encoder::new(Vec::new(), w, h, &[]);
    if encoder.is_err() {
        return false;
    }

    let encoder = encoder.unwrap();
    unsafe {
        *e = Encoder {
            delay: 4,
            width: w,
            height: h,
            encoder,
        }
    };

    true
}

#[no_mangle]
pub extern "C" fn set_repeat(e: *mut Encoder, repeat: u16) -> bool {
    if unsafe {
        (*e).encoder.set_repeat(if repeat > 0 {
            gif::Repeat::Finite(repeat)
        } else {
            gif::Repeat::Infinite
        })
    }
    .is_err()
    {
        return false;
    }

    return true;
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
pub extern "C" fn encoder_buffer_size(e: *mut Encoder) -> usize {
    unsafe { (*e).encoder.get_ref().len() }
}

#[no_mangle]
pub extern "C" fn encoder_buffer(e: *mut Encoder, out: *mut u8) {
    let b = unsafe { (*e).encoder.get_ref() };
    unsafe { std::ptr::copy_nonoverlapping(b.as_ptr(), out, b.len()) }
}
