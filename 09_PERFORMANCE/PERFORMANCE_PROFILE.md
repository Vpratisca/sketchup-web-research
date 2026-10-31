# 09 — Profil Kinerja & Penggunaan Memori (Performance Profile)

## 1. Penggunaan Memori Klien
* **WebAssembly Memory Heap:**
  - Halaman Memori Alokasi Awal: **2,048 halaman**
  - Ukuran Buffer Memori Awal: **134,217,728 bytes (128 MB)**
  - Batas Maksimum Alokasi: **4,294,967,296 bytes (4 GB)**
* **DOM Overhead:**
  - Total Node DOM: ~10,480 node (sebagian besar berada di pohon SVG icons dan struktur modal UI).
  - Node Pohon Aksesibilitas: 540 node.

## 2. Metrik Latensi Responsivitas Viewport
* Waktu pergantian alat melalui pemanggilan `Module.RunCommand()`: **< 2 milidetik**.
* Latensi perbaruan kursor kanvas SVG: **Seketika (sinkron dengan DOM style update)**.
* Frame Rate Target: **60 FPS** pada pergerakan kamera Orbit/Pan/Zoom.
