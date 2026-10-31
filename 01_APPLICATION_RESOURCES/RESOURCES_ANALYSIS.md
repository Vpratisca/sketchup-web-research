# 01 — Analisis Sumber Daya Aplikasi & Manifest Klien

## 1. Ikhtisar Sumber Daya
Investigasi terhadap pipeline jaringan dan memori browser mengungkapkan bahwa SketchUp Web dimuat sebagai aplikasi berbasis WebAssembly dengan arsitektur hibrida C++/JS:
* **Host Application Origin:** `https://app.sketchup.com`
* **Static Assets Base URL:** `https://app.sketchup.com/app_static/2026-10-22--17-34-50--9ab196c/`
* **Core WebAssembly Binary:** `webapp_gl2_4gb.wasm`
  * Ukuran biner: **14,144,603 bytes (~14.1 MB)**
  * Tipe MIME: `application/wasm`
  * Waktu inisiasi: ~3.4 detik setelah pemuatan halaman
  * Kapasitas alokasi memori Emscripten: Dukungan ruang alamat hingga **4 GB** (mengaktifkan opsi Emscripten `MAXIMUM_MEMORY=4GB` dan `ALLOW_MEMORY_GROWTH=1`).
  * Alokasi memori awal teramati: **134,217,728 bytes (128 MB)** yang setara dengan **2,048 halaman WebAssembly** (1 halaman = 64 KB).

## 2. Inventaris Skrip JavaScript & Chunks
Frontend UI diatur melalui serangkaian berkas bundel Webpack terkompresi (brotli/gzip):
1. `runtime.js` — Inisialisasi modul webpack dan pemecah dependensi dinamis.
2. `vendor.js` — Pustaka pihak ketiga (React, core runtime helper, UI components).
3. `app.js` — Logika antarmuka editor SketchUp Web, tata letak toolstrip, footer status bar, dan dialog.
4. `webapp_gl2_4gb.js` (atau `webapp_gl2_4gb.js.jgz`) — Lapisan lem perekat Emscripten (glue code) yang menghubungkan DOM kanvas HTML5, WebGL2 context, input pointer/keyboard, dan panggilan fungsi WebAssembly C++.

## 3. Gaya Visual & Aset Grafis (CSS & Fonts)
* **Format Ikon:** Sistem sprite SVG modern berbasis `<symbol id="...">` dengan 354 definisi simbol vektor yang mencakup seluruh alat 2D/3D, alat penampang, ikon palet material, dan tray inspektor.
* **Kursor Dinamis:** Kursor tidak menggunakan kursor CSS generik, melainkan SVG kustom beresolusi tinggi yang dialokasikan di direktori `/images/web/*.svg` dengan hotspot piksel akurat.

## 4. Keamanan & Batasan Akses
Sesuai aturan riset, seluruh aset dikoleksi secara pasif tanpa merekayasa atau mengekstrak data otentikasi/kredensial sisi server.
