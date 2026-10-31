# 05 — Sistem Inferensi & Penepatan (Inference & Snapping Engine)

Sistem inferensi adalah "jiwa" dari pengalaman pemodelan SketchUp, yang memungkinkan pemodelan 3D presisi tinggi tanpa perlu memasukkan koordinat $x, y, z$ secara manual setiap saat.

---

## 1. Taksonomi Titik Inferensi (Snapping Points)

| Tipe Titik | Warna Visual | Simbol / Bentuk | Deskripsi Geometris |
| :--- | :--- | :--- | :--- |
| **Endpoint** | Hijau Terang | Kotak Kecil | Titik ujung dari suatu Edge, Arc, atau Guide Line. |
| **Midpoint** | Cyan / Biru Muda | Lingkaran Kecil | Titik tengah persis ($t = 0.5$) dari sebuah Edge. |
| **Intersection** | Hitam | Huruf 'X' | Titik perpotongan antara dua Edge, Edge dengan Face, atau garis panduan. |
| **On Edge** | Merah | Kotak Kecil | Titik sebarang yang terletak pada segmen suatu Edge. |
| **On Face** | Biru / Ungu | Belah Ketupat Kecil | Titik sebarang yang menempel pada bidang permukaan Face. |
| **Center** | Biru Laut | Lingkaran | Titik pusat geometris dari Lingkaran (Circle), Busur (Arc), atau Poligon. |

---

## 2. Keterikatan Sumbu & Pengarah Linear (Axis Inferences)
1. **Sumbu Utama:**
   - **Sumbu Merah (X-Axis):** Vektor arah $[1, 0, 0]$
   - **Sumbu Hijau (Y-Axis):** Vektor arah $[0, 1, 0]$
   - **Sumbu Biru (Z-Axis / Up):** Vektor arah $[0, 0, 1]$
2. **Sumbu Relatif (Magenta Inference):**
   - **Parallel (Sejajar):** Muncul garis putus-putus magenta saat garis yang digambar sejajar dengan edge acuan yang disentuh kursor sebelumnya.
   - **Perpendicular (Tegak Lurus):** Muncul garis putus-putus magenta saat garis membentuk sudut tepat 90 derajat terhadap edge acuan.
3. **Mekanisme Penguncian (Locking Controls):**
   - **Shift Lock:** Menahan tombol `Shift` mengunci pergerakan alat pada garis atau sumbu inferensi yang sedang aktif (garis inferensi berubah menjadi tebal).
   - **Arrow Key Locks (Penguncian Tombol Panah):**
     - Panah **Kanan**: Mengunci permanen ke sumbu Merah (X).
     - Panah **Kiri**: Mengunci permanen ke sumbu Hijau (Y).
     - Panah **Atas**: Mengunci permanen ke sumbu Biru (Z).
     - Panah **Bawah**: Mengunci permanen ke garis paralel/tegak lurus terakhir.

---

## 3. Parameter Penepatan Numerik (Snap Options)
Hasil pembacaan dari kelas C++ `WebUnitsOptions`:
* `getLengthSnapEnabled`: `true`
* `getSnapLength`: `0.0625` inci ($1/16"$)
* `getAngleSnapEnabled`: `true`
* `getSnapAngle`: `15.0` derajat
