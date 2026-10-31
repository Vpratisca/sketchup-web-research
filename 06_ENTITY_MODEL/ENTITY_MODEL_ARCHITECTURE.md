# 06 — Arsitektur Entitas & Model Data (Entity & Model Architecture)

## 1. Hierarki Struktur Pohon Entitas (Entity Tree)
Model SketchUp diorganisasikan dalam struktur hierarkis berakar:
```
Model (Root)
├── Entities (Koleksi geometri mentah: Vertices, Edges, Faces, Curves)
├── ComponentDefinitions (Pustaka definisi master komponen)
│   ├── ComponentDefinition "Stacy" (Definisi figur skala manusia)
│   │   └── Entities (Edges, Faces, Materials milik Stacy)
│   └── ComponentDefinition ...
├── ComponentInstances (Instansiasi definisi di dalam ruang model dengan Transformasi 4x4)
├── Groups (Instansiasi komponen privat tanpa nama publik)
├── Tags / Layers (Koleksi label penanda visibilitas)
├── Materials (Koleksi palet warna, transparansi, dan tekstur bitmap)
├── Scenes / Pages (Koleksi pengaturan kamera, bayangan, dan visibilitas layer)
└── Styles (Koleksi parameter render grafis, warna background, watermark)
```

---

## 2. Matriks Transformasi Koordinat (4×4 Transformation)
Setiap `ComponentInstance` dan `Group` memiliki matriks transformasi lokal ke dunia ($4 \times 4$ column-major):
$$T = \begin{bmatrix} r_{00} & r_{01} & r_{02} & t_x \\ r_{10} & r_{11} & r_{12} & t_y \\ r_{20} & r_{21} & r_{22} & t_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
* $r_{ij}$: Mengatur rotasi dan penskalaan (termasuk flip/mirror jika determinan bernilai negatif).
* $[t_x, t_y, t_z]^T$: Posisi translasi dalam satuan model (Inci).

### Perbedaan Pengeditan Geometri Mentah vs Group/Component:
* **Geometri Mentah:** Berinteraksi dan menyatu (*merge*) langsung dengan geometri tetangga.
* **Group:** Membungkus entitas dalam ruang koordinat terlindungi (*isolated scope*). Geometri di luar tidak menyatu dengan geometri di dalam.
* **Component:** Memiliki sifat *instanced replication*. Mengedit isi satu instans komponen otomatis memperbarui seluruh instans komponen lain yang berbagi definisi yang sama di dalam model.
