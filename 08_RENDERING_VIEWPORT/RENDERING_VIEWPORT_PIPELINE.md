# 08 — Pipeline Viewport & Arsitektur Rendering WebGL2

## 1. Spesifikasi Konteks WebGL2 Kanvas
Berdasarkan data langsung dari objek `canvas.getContext('webgl2')`:
* **Engine Renderer:** ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)
* **Vendor:** Google Inc. (NVIDIA)
* **Canvas Resolution:** $921 \times 920$ piksel
* **Context Attributes:**
  - `antialias: true` (Multi-sample anti-aliasing diaktifkan)
  - `depth: true` (Depth buffer 24-bit aktif)
  - `stencil: true` (Stencil buffer 8-bit aktif untuk kliping bidang penampang)
  - `preserveDrawingBuffer: true` (Buffer layar dipertahankan untuk tangkapan layar instan)
  - `alpha: false` (Rendering kanvas sepenuhnya opak di atas background warna)

---

## 2. Pipeline Kamera 3D & Matriks Pandang
Data teramati dari `Module.getViewMatrix()` dan `Module.getFieldOfView()`:
* **Default Field of View (FOV):** **35.0 derajat**
* **Camera Height:** **133.0 inci**
* **View Matrix (4×4):**
  $$\begin{bmatrix}
  0.9447 & -0.0840 & -0.3169 & 14.2008 \\
  0.3279 & 0.2419 & 0.9132 & -129.1123 \\
  0.0000 & 0.9667 & -0.2561 & 71.5967 \\
  0.0000 & 0.0000 & 0.0000 & 1.0000
  \end{bmatrix}$$

---

## 3. Teknik Rendering Garis vs Permukaan (Polygon Offset & Depth Bias)
Untuk mencegah fenomena *Z-fighting* (gejala flickering saat garis batas edge tepat berimpit dengan poligon face pada kedalaman depth yang sama), SketchUp mengimplementasikan:
* `gl.polygonOffset(factor, units)` saat menggambar face, atau depth bias ke arah depan saat merender edge.
* Edge rendering dipisahkan menjadi dua pass:
  1. **Visible Edges Pass:** Digambar dengan garis penuh.
  2. **Back Edges Pass (K-ray mode):** Digambar dengan garis putus-putus untuk edge di belakang geometri jika mode diaktifkan.
