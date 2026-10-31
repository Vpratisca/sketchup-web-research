# 03 — Dekomposisi & Analisis Mendalam Perilaku Alat (Tool Behavior)

Matriks investigasi 32 alat pemodelan berhasil diverifikasi secara empiris melalui pemanggilan `Module.RunCommand()` dan pemantauan status kanvas.

---

## 1. Matriks Spesifikasi Alat Utama

| Alat | Command ID | Pintasan | Label Measurements | File Kursor SVG & Hotspot | Tombol Pengubah (Modifiers) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Select** | 21022 | `Space` | `Measurements` | `select_default_c.svg` [9, 6] | `Shift`: Toggle seleksi; `Ctrl`: Tambah seleksi; `Shift+Ctrl`: Kurang seleksi |
| **Lasso Select** | 21027 | - | `Measurements` | `lasso_c.svg` [4, 2] | Poligon bebas / lasso seleksi |
| **Eraser** | 21019 | `E` | `Measurements` | `eraser_c.svg` [10, 28] | `Shift`: Sembunyikan edge (Hide); `Ctrl`: Lunakkan/haluskan edge (Soften/Smooth) |
| **Line (Pencil)** | 21020 | `L` | `Length` | `pencil_default_c.svg` [2, 29] | `Shift`: Kunci sumbu inferensi; Panah arah: Kunci sumbu X/Y/Z |
| **Freehand** | 21031 | - | `Measurements` | `freehand_default_c.svg` [2, 29] | Menggambar kurva polylines 3D kontinu |
| **Arc (2-Point)** | 21069 | `A` | `Sides` / `Bulge` | `arc_click1_c.svg` [2, 29] | Klik 1: Awal; Klik 2: Akhir; Drag: Tinggi lengkungan (Bulge) |
| **Rectangle** | 21094 | `R` | `Dimensions` | `rectangle_default_c.svg` [2, 29] | `Ctrl`: Buat dari pusat; Input: `width, height` (misal: `1000, 500`) |
| **Rotated Rect** | 24223 | - | `Measurements` | `rectangle_rotated_1_c.svg` [2, 29] | Menentukan baseline sudut sebelum menarik lebar |
| **Circle** | 21096 | `C` | `Sides` / `Radius` | `circle_default_c.svg` [2, 29] | Default 24 sisi; ketik `48s` untuk mengubah jumlah segmen kurva |
| **Polygon** | 21095 | - | `Sides` / `Radius` | `polygon_default_c.svg` [2, 29] | Default 6 sisi; ketik jumlah sisi sebelum klik pertama |
| **Push/Pull** | 21041 | `P` | `Distance` | `pushpull_c.svg` [15, 1] | `Ctrl`: Ekstrusi permukaan baru tanpa menghapus face lama; Dobel-klik: Ulangi jarak terakhir |
| **Follow Me** | 21525 | - | `Measurements` | `followme_c.svg` [3, 3] | Ekstrusi profil face sepanjang jalur garis (path) |
| **Offset** | 21100 | `F` | `Distance` | `offset_c.svg` [3, 3] | Menggeser kontur tertutup secara konsentris searah normal bidang |
| **Move** | 21048 | `M` | `Distance` | `move_c.svg` [15, 15] | `Ctrl`: Salin entitas (Copy); `Alt`: Auto-fold geometri; `*n` / `/n`: Linear array |
| **Rotate** | 21129 | `Q` | `Angle` | `rotate_c.svg` [15, 15] | `Ctrl`: Salin putar (Radial copy); Busur derajat snapping 15 derajat |
| **Scale** | 21236 | `S` | `Measurements` | `scale_c.svg` [3, 3] | `Ctrl`: Skala dari pusat (Center); `Shift`: Skala non-seragam (Uniform/Non-uniform toggle) |
| **Tape Measure** | 21024 | `T` | `Length` | `tape_measure_guides_c.svg` [5, 28] | `Ctrl`: Toggle buat garis panduan (Guide line) vs ukur jarak murni |
| **Protractor** | 21057 | - | `Angle` | `select_default_c.svg` [9, 6] | Membuat garis panduan bersudut |
| **Paint Bucket** | 21074 | `B` | `Measurements` | `paint_bucket_c.svg` [5, 29] | `Ctrl`: Warnai seluruh face terhubung; `Shift`: Warnai seluruh face bermaterial sama |
| **Orbit** | 10508 | `O` | `Measurements` | `orbit_c.svg` [15, 15] | Klik-tengah mouse (MMB); Berputar mengelilingi titik fokus kamera |
| **Pan** | 10523 | `H` | `Measurements` | `pan_c.svg` [14, 7] | `Shift + MMB`; Menggeser bidang pandang kamera |
| **Zoom** | 10509 | `Z` | `Field of View` | `zoom_c.svg` [21, 10] | Scroll mouse; Ubah FOV dengan mengetik sudut dalam derajat |
| **Zoom Extents** | 10527 | `Shift+Z` | `Measurements` | `zoom_window_c.svg` [18, 12] | Menyesuaikan kamera membingkai seluruh geometri dalam model |
| **Walk** | 10520 | - | `Eye Height` | `walk_c.svg` [15, 15] | Navigasi sudut pandang orang pertama (First-person) |
| **Look Around** | 10525 | - | `Eye Height` | `look_around_c.svg` [18, 17] | Memutar kamera di tempat (Pitch & Yaw) |
| **Section Plane**| 21337 | - | `Measurements` | `select_default_c.svg` [9, 6] | Memotong model secara dinamis dengan bidang penampang |

---

## 2. Analisis Mendalam: Logika Matematis Per Alat Kunci

### A. Line Tool (Pencil)
* **Trigger:** Tombol `L` atau klik ikon Pencil (`PencilCommandId: 21020`).
* **State 1 (Pencarian Titik Awal):**
  - Ray casting dari posisi kursor layar ke bidang model 3D.
  - Memeriksa inferensi: jika mengenai vertex, snap ke titik ujung (Endpoint); jika mengenai edge, snap ke On Edge atau Midpoint.
* **State 2 (Pencarian Titik Akhir):**
  - Mengunci garis panduan dinamis dari Titik Awal ke posisi kursor saat ini.
  - Memeriksa keterikatan sumbu: jika sudut vektor mendekati sumbu X (Merah), Y (Hijau), atau Z (Biru) dalam toleransi ambang batas (threshold), kunci vektor ke sumbu tersebut.
  - Menampilkan jarak pada kolom `Length`.
* **State 3 (Konfirmasi & Pembuatan Topologi):**
  - Klik kedua atau menekan `Enter` setelah mengetik angka jarak.
  - Memanggil algoritma pemecahan topologi:
    1. Buat `Edge` baru antara Titik Awal dan Titik Akhir.
    2. Jika edge memotong face koplanar yang ada, pecah face tersebut menjadi dua face baru.
    3. Jika edge menutup suatu loop (siklus edge tertutup) yang koplanar, secara otomatis buat `Face` baru.
  - Secara otomatis melanjutkan titik akhir sebagai titik awal garis berikutnya (*continuous line drawing*) kecuali ditekan tombol `Escape`.

### B. Push/Pull Tool
* **Trigger:** Tombol `P` atau klik ikon Push/Pull (`PushPullCommandId: 21041`).
* **Prasyarat Seleksi:** Harus mengarah ke `Face` datar (planar). Permukaan melengkung (curved surface) ditolak.
* **Core Mathematical Operation:**
  - Menentukan vektor normal permukaan face: $\vec{N} = \frac{\vec{v}_1 \times \vec{v}_2}{\|\vec{v}_1 \times \vec{v}_2\|}$.
  - Menggeser posisi semua vertex pada loop luar (outer loop) dan loop dalam (holes) sepanjang $\vec{N} \times d$, di mana $d$ adalah jarak ekstrusi.
  - Menghasilkan face-face samping (side faces) berbentuk segi empat koplanar yang menghubungkan posisi edge awal dengan posisi edge baru.
  - Jika arah ekstrusi berlawanan dengan arah normal hingga menyentuh face belakang (back face) yang sejajar dan identik, sistem secara otomatis melakukan operasi *hollow/punch-through* (membuat lubang tembus).
