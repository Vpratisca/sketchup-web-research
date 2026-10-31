# 11 — Spesifikasi Teknis Replikasi Mandiri (Replication Technical Specification)

Dokumen ini adalah cetak biru arsitektur teknis (*software architecture blueprint*) untuk mengimplementasikan kembali aplikasi pemodelan 3D setara SketchUp Web secara mandiri tanpa menggunakan kode berpemilik.

---

## 1. Pilihan Tumpukan Teknologi yang Direkomendasikan
* **Bahasa Utama:** TypeScript (Strict Mode)
* **Mesin Rendering:** WebGL 2.0 atau WebGPU (menggunakan pustaka ringan berbasis shader kustom atau Three.js yang dimodifikasi untuk pipeline B-Rep garis dan poligon offset).
* **State Management:** Zustand atau Redux Toolkit (mengatur status UI, alat aktif, nilai measurements, panel samping).
* **UI Framework:** React atau Svelte (merender antarmuka pengguna, ikon, modal, dan status bar).

---

## 2. Struktur Data Geometri Inti (Topological Half-Edge / B-Rep)
Untuk mereproduksi perilaku *sticky geometry*, penggabungan otomatis, dan pemotongan face:

```typescript
export interface Vertex {
  id: number;
  position: [number, number, number]; // Koordinat 3D dalam Inci
  edges: number[];                     // ID Edge yang terhubung
}

export interface Edge {
  id: number;
  startVertexId: number;
  endVertexId: number;
  faces: number[];                     // ID Face yang menggunakan edge ini
  isSoft: boolean;                     // Soften edge
  isSmooth: boolean;                   // Smooth normal edge
  isHidden: boolean;                   // Hide edge
}

export interface Loop {
  edgeIds: number[];                   // Siklus edge terarah
  isOuter: boolean;                    // true untuk batas luar, false untuk lubang (hole)
}

export interface Face {
  id: number;
  outerLoop: Loop;
  innerLoops: Loop[];                  // Lubang-lubang di dalam face
  normal: [number, number, number];    // Normal bidang datar
  planeConstant: number;               // D dalam N . P + D = 0
  frontMaterialId: string | null;
  backMaterialId: string | null;
}
```

---

## 3. Algoritma Inti yang Harus Diimplementasikan
1. **Face Planar Splitting:**
   - Menghitung perpotongan segmen garis terhadap poligon 2D menggunakan algoritma *Sutherland-Hodgman* atau *Constrained Delaunay Triangulation (CDT)* pada bidang proyeksi normal.
2. **Push/Pull Extrusion:**
   - Menerjemahkan vertex loop searah $\vec{N}$, membalik normal face dasar (bottom face), dan membangkitkan face sisi (side quad faces) dengan orientasi berlawanan jarum jam (*counter-clockwise*).
3. **3D Inference Raycasting:**
   - Melakukan unproject dari kursor layar 2D ke ray 3D ($O + t \vec{D}$).
   - Menghitung jarak terdekat ray terhadap kumpulan vertex (Endpoint), titik tengah edge (Midpoint), dan segmen edge (On Edge).
   - Memproyeksikan ray ke bidang acuan X/Y/Z untuk mengunci sumbu inferensi Merah/Hijau/Biru.
4. **Measurements Box Parser:**
   - Mendukung parsing ekspresi fleksibel (angka desimal, pecahan, konversi unit otomatis, perkalian array `5x`, pembagian array `/4`).

---

## 4. Kesimpulan Kesiapan Fase 2 (Implementasi)
Seluruh data, konstanta perintah, matriks alat, parameter kamera, dan model topologi telah lengkap dan terdokumentasi. Fondasi teknis ini siap digunakan sebagai acuan utama dalam memulai tahap perancangan dan pengkodean mesin pemodelan 3D mandiri.
