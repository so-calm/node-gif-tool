enum FrameResult {
    Ok = 0,
    Empty = 1,
    Error = 2,
}

#[no_mangle]
pub extern "C" fn frame_size() -> usize {
    std::mem::size_of::<gif::Frame>()
}

#[no_mangle]
pub extern "C" fn next_frame(d: *mut gif::Decoder<std::fs::File>, f: *mut gif::Frame) -> u8 {
    let info = unsafe { (*d).read_next_frame() };
    if info.is_err() {
        return FrameResult::Error as u8;
    }

    let info = info.unwrap();
    if info.is_none() {
        return FrameResult::Empty as u8;
    }

    let info = info.unwrap();
    unsafe { *f = info.clone() }

    FrameResult::Ok as u8
}

#[no_mangle]
pub extern "C" fn frame_delay(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).delay }
}

#[no_mangle]
pub extern "C" fn frame_buffer_size(f: *mut gif::Frame) -> usize {
    unsafe { (*f).buffer.len() }
}

#[no_mangle]
pub extern "C" fn frame_buffer(f: *mut gif::Frame, out: *mut u8) {
    for (i, b) in unsafe { (*f).buffer.iter() }.enumerate() {
        unsafe { *out.add(i) = *b }
    }
}

#[no_mangle]
pub extern "C" fn frame_width(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).width }
}

#[no_mangle]
pub extern "C" fn frame_height(f: *mut gif::Frame) -> u16 {
    unsafe { (*f).height }
}
