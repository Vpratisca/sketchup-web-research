# SketchUp Web Reengineering Research & Technical Architecture
**Project:** Replikasi Mandiri SketchUp Web (Fase 1: Riset Komprehensif & Akuisisi Data)
**Date:** November 2026
**Target URL:** `https://app.sketchup.com/app`
**Status:** Fase 1 Selesai — Seluruh Prioritas P0 dan P1 Berhasil Diekstraksi dan Diverifikasi.

---

## 1. Executive Summary
Riset ini menyajikan dekonstruksi arsitektural dan dokumentasi fungsional menyeluruh dari **SketchUp Web** melalui Chrome DevTools Protocol (CDP) langsung pada sesi browser Microsoft Edge yang sedang berjalan (v156.0.4314.50).

Tujuan utama adalah menyediakan spesifikasi teknis dan bukti empiris yang cukup untuk mengimplementasikan kembali editor pemodelan 3D setara SketchUp Web secara mandiri (*clean-room implementation*) dari nol menggunakan **TypeScript**, **WebGL2/WebGPU**, dan pustaka matematika geometris modern.

### Temuan Inti Arsitektur SketchUp Web:
1. **Core Modeling Engine (WebAssembly/C++):**
   - Menggunakan file biner bervolume 14.1 MB (`webapp_gl2_4gb.wasm`) yang dikompilasi dari mesin C++ asli SketchUp menggunakan Emscripten dengan alokasi memori WebAssembly 4GB (awal 128 MB / 2048 halaman).
   - Menjalankan 157 Command IDs bawaan (`PencilCommandId: 21020`, `SelectionCommandId: 21022`, `PushPullCommandId: 21041`, dll.).
   - Mengekspos 296 kelas/metode C++ melalui Emscripten binding (`WebEntityInfo`, `WebUnitsOptions`, `TagTreeBrowser`, `WebMaterialBrowser`, dll.).
2. **Frontend UI Architecture:**
   - Dibangun dengan Webpack chunk modern (`webpackChunksketchup_web_frontend`).
   - Berinteraksi dengan mesin WASM melalui antarmuka perintah terpadu: `Module.RunCommand(commandId)`, `Module.GetActiveToolId()`, `Module.IsCommandEnabled(commandId)`, dan `Module.IsCommandChecked(commandId)`.
   - Mengontrol elemen kanvas tunggal WebGL2 berukuran 921×920 dengan atribut konteks canggih (`preserveDrawingBuffer: true`, `stencil: true`, `depth: true`, `antialias: true`).
3. **Viewport & Camera Engine:**
   - Default Field of View (FOV): tepat **35.0 derajat**.
   - Default Camera Eye Height: **133.0 inci** (~3.37 meter).
   - Matriks kamera 4×4 mentransformasikan koordinat dunia (world space) dalam satuan standar **Inches** dengan batas model awal (bounding box) figur skala manusia.
4. **Sistem Inferensi & Penepatan (Snapping):**
   - Penepatan panjang default diaktifkan dengan resolusi **0.0625 inci (1/16")**.
   - Penepatan sudut default diaktifkan dengan inkremen **15.0 derajat**.
   - Visualisasi kursor berbasis SVG kustom yang diperbarui secara dinamis pada kanvas per alat dengan koordinat hotspot spesifik (misal: Line/Pencil di `[2, 29]`, Push/Pull di `[15, 1]`, Select di `[9, 6]`).

---

## 2. Struktur Direktori Penelitian
```
SketchUp_Web_Research/
├── 00_README/
│   └── README.md
├── 01_APPLICATION_RESOURCES/
│   ├── RESOURCES_ANALYSIS.md
│   └── resources_manifest.json
├── 02_UI_STRUCTURE/
│   ├── UI_INVENTORY.md
│   ├── ui_elements.json
│   ├── toolbars_detailed.json
│   ├── right_trays_detailed.json
│   └── svg_symbols.json
├── 03_TOOL_BEHAVIOR/
│   ├── TOOL_DEEP_DIVE.md
│   ├── tools_investigation_matrix.json
│   └── tool_command_status.json
├── 04_GEOMETRY_TOPOLOGY/
│   ├── GEOMETRY_TOPOLOGY_ENGINE.md
│   ├── engine_commands_and_module.json
│   ├── engine_classes_and_methods.json
│   └── wasm_exports_and_memory.json
├── 05_INFERENCE_SYSTEM/
│   ├── INFERENCE_SNAPPING_SYSTEM.md
│   └── snapping_and_style_options.json
├── 06_ENTITY_MODEL/
│   ├── ENTITY_MODEL_ARCHITECTURE.md
│   └── entity_model_architecture.json
├── 07_INTERACTION_STATE/
│   ├── INTERACTION_STATE_MANAGEMENT.md
│   └── event_handling_architecture.json
├── 08_RENDERING_VIEWPORT/
│   ├── RENDERING_VIEWPORT_PIPELINE.md
│   ├── webgl_architecture.json
│   └── camera_and_model_state.json
├── 09_PERFORMANCE/
│   └── PERFORMANCE_PROFILE.md
├── 10_EVIDENCE/
│   ├── EVIDENCE_INDEX.md
│   ├── screenshots/
│   │   └── initial_editor_state.png
│   ├── dom_snapshots/
│   │   └── dom_snapshot.json
│   └── accessibility_snapshots/
│       └── ax_tree.json
└── 11_OFFLINE_ANALYSIS/
    └── REPLICATION_TECHNICAL_SPECIFICATION.md
```
