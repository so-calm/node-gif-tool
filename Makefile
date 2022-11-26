CROSS=cross b -r --target

all: windows linux darwin

windows: target.x86_64-windows target.aarch64-windows
linux: target.x86_64-linux target.aarch64-linux
darwin: target.x86_64-darwin target.aarch64-darwin

target.x86_64-%: ARCH=x86_64
target.aarch64-%: ARCH=aarch64

target.%-windows: TARGET=$(ARCH)-pc-windows-msvc
target.%-windows: PLATFORM=windows
target.%-windows: OUT=gif_ffi.dll
target.%-windows: BIN=gif_ffi.dll

target.%-linux: TARGET=$(ARCH)-unknown-linux-gnu
target.%-linux: PLATFORM=linux
target.%-linux: OUT=libgif_ffi.so
target.%-linux: BIN=gif_ffi.so

target.%-darwin: TARGET=$(ARCH)-apple-darwin
target.%-darwin: PLATFORM=darwin
target.%-darwin: OUT=libgif_ffi.dylib
target.%-darwin: BIN=gif_ffi.dylib

target.%:
	$(CROSS) $(TARGET)
	node scripts/bin target/$(TARGET)/release/$(OUT) bin/$(ARCH)-$(PLATFORM)-$(BIN)
