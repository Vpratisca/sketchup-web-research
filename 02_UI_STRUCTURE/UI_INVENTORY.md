# 02 — Inventaris Antarmuka Editor & Struktur UI

## 1. Arsitektur Tata Letak Editor
Antarmuka pengguna SketchUp Web dirancang dengan pembagian zona kerja yang sangat modular:
1. **Top Bar (Baris Navigasi Atas):**
   - Tombol Home / Open Model & Preferences (`home-bar-button`)
   - Indikator Nama Model (`Untitled`)
   - Status Penyimpanan & Tombol Save
   - Tombol Undo (`Cmd/Ctrl + Z`) dan Redo (`Cmd/Ctrl + Y`)
   - Tombol SketchUp AI Assistant
   - Tombol Kolaborasi & Share
   - Profil Pengguna Trimble Identity
2. **Left Toolstrip (Bilah Alat Utama Kiri):**
   - Menampung seluruh alat pemodelan dengan dukungan flyout (sub-menu laci yang keluar saat diklik atau ditahan).
3. **Viewport Kanvas Pusat:**
   - Elemen `<canvas>` berdimensi dinamis yang merender ruang 3D interaktif. Kanvas ini memiliki `tabIndex = 0` untuk menangkap pintasan keyboard secara langsung.
4. **Bottom Status Bar (Bilah Status Bawah):**
   - Kiri: Petunjuk interaksi alat yang sedang aktif (misal: petunjuk klik, petunjuk tombol pengubah Shift/Ctrl/Alt).
   - Kanan: Kotak Pengukuran Numerik (`Measurements Box` / `#measurements-box`) dengan label dinamis yang berubah sesuai konteks alat.
5. **Right Sidebar Trays (Bilah Inspektor Kanan):**
   - Menampung 12 panel fungsional yang dapat diciutkan atau diperluas.

---

## 2. Inventaris 12 Panel Samping (Right Trays)
Ditemukan di dalam container `DIV.right-sidebar-panel-container_ddUjGTjs`:
| No | Nama Panel | Tag & Kelas Header | Fungsi dalam Editor |
| :--- | :--- | :--- | :--- |
| 1 | **Entity Info** | `P.title_UtABLreA` | Menampilkan properti entitas terpilih (tipe, panjang edge, luas face, volume komponen, tag terpasang, material). |
| 2 | **Components** | `P.title_UtABLreA` | Peramban komponen lokal dalam model dan koleksi komponen default. |
| 3 | **Materials** | `P.title_UtABLreA` | Manajemen warna, tekstur, transparansi, pemilih material (eyedropper), dan material dalam model. |
| 4 | **Styles** | `P.title_UtABLreA` | Pengaturan tampilan gaya visual (wireframe, shaded, x-ray, warna background langit/bumi, tebal profil garis). |
| 5 | **Tags** | `P.title_UtABLreA` | Sistem lapisan pengelompokan visibilitas (Layer) dan garis gaya. |
| 6 | **Scenes** | `P.title_UtABLreA` | Pengaturan sudut pandang kamera tersimpan (halaman/scene presentasi dan animasi transisi). |
| 7 | **Shadows** | `P.title_UtABLreA` | Pengaturan posisi matahari, bayangan, waktu hari, dan tanggal kalender. |
| 8 | **Display** | `P.title_UtABLreA` | Pengaturan visibilitas elemen pembantu (axes, guides, hidden geometry, section planes, section cuts). |
| 9 | **Model Info** | `P.title_UtABLreA` | Pengaturan unit pengukuran (Inches, Feet, Millimeters, Centimeters, Meters), format desimal/fraksional, dan presisi. |
| 10 | **Soften / Smooth** | `P.title_UtABLreA` | Pengaturan sudut pelunakan edge pada permukaan melengkung (`SoftenEdgesCommandId: 21383`). |
| 11 | **Instructor** | `P.title_UtABLreA` | Panduan interaktif animasi yang menjelaskan alur kerja dan fungsi dari alat yang sedang aktif. |
| 12 | **3D Warehouse** | `P.title_UtABLreA` | Pencarian dan impor model 3D langsung dari repositori global Trimble 3D Warehouse. |

---

## 3. Kotak Pengukuran (Measurements Box)
* **ID Elemen:** `#measurements-box`
* **Perilaku:**
  - Menerima input numerik tanpa perlu mengklik kotak secara manual saat alat aktif. Pengguna cukup mengetik angka pada keyboard, lalu menekan `Enter`.
  - Format angka mendukung notasi presisi, pecahan (`1/2"`, `3/4"`), nilai metrik (`1000mm`, `2.5m`), perkalian array (`5x` atau `x5`), dan pembagian array (`/3` atau `3/`).
