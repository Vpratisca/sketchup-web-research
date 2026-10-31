# 07 — Manajemen Interaksi & Status Aplikasi (Interaction & State Management)

## 1. Model Mesin Status Alat (Tool State Machine)
Setiap alat di dalam SketchUp Web beroperasi sebagai mesin status hingga (*finite state machine*):
* **State: Idle / Pre-Selection:**
  Pengguna memilih entitas sebelum mengaktifkan alat (misal: memilih 3 face, lalu mengaktifkan Move Tool untuk memindahkan ketiganya sekaligus).
* **State: Active Point Pick:**
  Kursor menangkap input titik acuan pertama.
* **State: Drag / Move Preview:**
  Pergerakan kursor merender geometri pratinjau dinamis (garis putus-putus atau bayangan translasi).
* **State: Commit / Completed:**
  Titik kedua diklik atau nilai dimasukkan pada kotak Measurements. Perubahan dikomit ke topologi model dan ditambahkan ke tumpukan Undo.
* **State: Abort / Cancel:**
  Menekan tombol `Escape` membatalkan langkah interaksi aktif dan mereset alat ke status titik awal tanpa meninggalkan jejak modifikasi pada model.

---

## 2. Arsitektur Undo / Redo (Transaction Stack)
* **Command ID Undo:** `57643` (`EditUndoCommandId`)
* **Command ID Redo:** `57644` (`EditRedoCommandId`)
* **Manajemen Transaksi:**
  Operasi pemodelan dibungkus dalam blok operasi atomik (`start_operation` ... `commit_operation`).
  Jika operasi menghasilkan banyak perubahan topologi (misal: Push/Pull yang membuat 5 face baru dan membagi 4 edge), seluruh perubahan tersebut dicatat sebagai **1 transaksi tunggal** pada tumpukan Undo.
