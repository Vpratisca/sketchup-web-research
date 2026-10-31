# 04 — Arsitektur Mesin Geometri & Topologi (Geometry & Topology Engine)

## 1. Model Topologi Boundary Representation (B-Rep)
SketchUp Web dibangun di atas struktur data B-Rep (*Boundary Representation*) yang sangat unik dan berbeda dari mesin mesh game (seperti Three.js/Unity yang berbasis segitiga bebas). 

Topologi SketchUp menganut prinsip **"Geometri Hidup" (*Sticky/Self-Healing Geometry*)**:
1. **Vertex (Titik):**
   - Merepresentasikan koordinat unik 3D $(x, y, z)$.
   - Tidak ada dua vertex terpisah yang dapat berada pada posisi yang sama dalam radius toleransi ($10^{-5}$ inci). Jika dua vertex bertemu, keduanya otomatis digabungkan (*merged*).
2. **Edge (Garis Batas):**
   - Menghubungkan tepat dua vertex (Start Vertex & End Vertex).
   - Suatu edge dapat dimiliki bersama oleh satu face (edge terbuka), dua face (manifold boundary), atau lebih dari dua face (non-manifold T-junction).
   - Jika sebuah edge baru digambar melintasi edge yang sudah ada pada bidang yang sama, edge tersebut secara otomatis **terpecah (*split*)** pada titik potong persekutuan.
3. **Loop (Siklus Edge Terarah):**
   - Rangkaian edge yang membentuk batas tertutup. Setiap face memiliki 1 Outer Loop (batas luar) dan 0 atau lebih Inner Loops (lubang/voids).
4. **Face (Permukaan Poligonal Datar):**
   - Harus bersifat **koplanar** (semua vertex pembentuk berada pada satu bidang datar yang sama $\vec{N} \cdot \vec{P} + D = 0$).
   - Memiliki dua sisi: **Front Face** (permukaan depan, biasanya putih) dan **Back Face** (permukaan belakang, biasanya keabu-abuan/kebiruan). Orientasi ditentukan oleh arah siklus loop (*Right-hand rule*).

---

## 2. Karakteristik "Sticky Geometry"
* **Auto-Merge & Intersect:**
  Ketika geometri mentah (raw geometry) digambar saling bersentuhan tanpa dikelompokkan ke dalam Group atau Component, geometri tersebut langsung menyatu ke dalam graf topologi yang sama.
* **Auto-Face Generation:**
  Segera setelah sebuah loop edge tertutup terbentuk dan seluruh vertex-nya berada dalam satu bidang koplanar, mesin geometri langsung menginstansiasi sebuah entitas `Face` tanpa memerlukan perintah pengisian manual.
* **Auto-Fold:**
  Saat sebuah vertex atau edge digerakkan (`Move Tool`) keluar dari bidang koplanar asalnya, SketchUp secara otomatis memecah face segi empat menjadi dua face segitiga dengan menambahkan edge lipatan baru (*fold edge*).

---

## 3. WebAssembly Binding & C++ Engine Classes
Melalui dekomposisi modul Emscripten, ditemukan kelas-kelas C++ inti yang mengelola topologi:
* `WebCurve` — Mengelola representasi kurva parametrik (lingkaran dan busur yang secara visual dirender sebagai segmen garis namun menyimpan metadata radius dan pusat aslinya).
* `WebFaceDisplayStyle` — Mengatur visualisasi poligon dan pencahayaan normal face.
* `EEdgeColorMode` — Mengontrol pewarnaan edge (semua sama, berdasarkan sumbu koordinat, atau berdasarkan material).
* `WebLiveComponentClient` & `WebComponentMaker` — Logika instansiasi komponen parametrik procedural.
