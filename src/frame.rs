use crate::AllocFn;
use std::{borrow::Borrow, mem::size_of, ptr};

enum FrameResult {
    Ok = 0,
    Empty = 1,
}

// #[no_mangle]
// pub extern "C" fn frame_size() -> usize {
//     std::mem::size_of::<gif::Frame>()
// }

#[no_mangle]
pub extern "C" fn next_frame(d: *mut gif::Decoder<std::fs::File>, alloc: AllocFn<u8>) -> *const u8 {
    let f = alloc(size_of::<gif::Frame>() + 1);
    if f.is_null() {
        return ptr::null();
    }

    let Ok(info) = (unsafe { (*d).read_next_frame() }) else { return ptr::null() };

    if let Some(info) = info {
        unsafe {
            *f = FrameResult::Ok as u8;
            *((f as *mut gif::Frame).add(1)) = info.clone()
        }
    } else {
        unsafe { *f = FrameResult::Empty as u8 }
    }

    f
}

#[no_mangle]
pub extern "C" fn frame_delay(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).delay }
}

#[no_mangle]
pub extern "C" fn frame_buffer(f: *mut gif::Frame, alloc: AllocFn<u8>) -> *const u8 {
    let buffer: &[u8] = unsafe { (*f).buffer.borrow() };
    let len = buffer.len();
    let out = alloc(len);
    if out.is_null() {
        return ptr::null();
    }
    unsafe { std::slice::from_raw_parts_mut(out, len) }.copy_from_slice(&buffer);
    out
}

#[no_mangle]
pub extern "C" fn frame_width(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).width }
}

#[no_mangle]
pub extern "C" fn frame_height(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).height }
}
