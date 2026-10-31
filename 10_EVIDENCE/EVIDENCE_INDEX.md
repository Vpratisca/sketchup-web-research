# 10 — Indeks Bukti Empiris (Evidence Catalog)

Semua bukti mentah yang dihimpun selama pengujian disimpan dalam format biner dan JSON terverifikasi pada diska lokal:

1. **Tangkapan Layar:**
   - `screenshots/initial_editor_state.png` — Tangkapan layar resolusi penuh kanvas editor SketchUp Web awal (83,448 bytes).
2. **Snapshot DOM:**
   - `dom_snapshots/dom_snapshot.json` — Snapshot lengkap struktur dokumen DOM dengan computed styles (5.9 MB).
3. **Pohon Aksesibilitas:**
   - `accessibility_snapshots/ax_tree.json` — Struktur pohon aksesibilitas Chrome DevTools (327 KB).
4. **Manifest Jaringan & Sumber Daya:**
   - `../01_APPLICATION_RESOURCES/resources_manifest.json` — Daftar seluruh aset (skrip, wasm, CSS, waktu muat).
5. **Inventaris Kelas C++ WebAssembly:**
   - `../04_GEOMETRY_TOPOLOGY/engine_classes_and_methods.json` — 296 kelas dan metode mesin C++ (52 KB).
6. **Matriks Investigasi Alat:**
   - `../03_TOOL_BEHAVIOR/tools_investigation_matrix.json` — Hasil uji transisi 32 alat pemodelan.
