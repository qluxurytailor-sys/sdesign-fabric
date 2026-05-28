# วิธีเพิ่มผ้าใหม่เข้า Catalog

## ขั้นตอน 3 ข้อ

### 1. เตรียมรูปผ้า
- **ตั้งชื่อไฟล์:** ภาษาอังกฤษพิมพ์เล็ก + ขีด เช่น `dryfit-navy.jpg`
  - ❌ `ผ้ากรม.jpg` (ห้ามภาษาไทย)
  - ❌ `DryFit Navy.jpg` (ห้ามช่องว่าง/พิมพ์ใหญ่)
  - ✅ `dryfit-navy.jpg`
- **ขนาดไฟล์:** ย่อให้ ≤ 500 KB (Mobile โหลดเร็ว)
- **ขนาดภาพ:** 1200×1200 px ก็พอ
- **Format:** JPG สำหรับรูปถ่าย, PNG ถ้ามีพื้นโปร่ง

### 2. วางไฟล์รูปไว้ใน `fabrics/`
```
fabrics/
├─ HOW-TO-ADD.md
├─ dryfit-navy.jpg       ← รูปใหม่
├─ dryfit-red.jpg
└─ mesh-black.jpg
```

### 3. เพิ่ม entry ใน `fabrics.json`
แก้ไฟล์ `fabrics.json` ที่ root โฟลเดอร์ — เพิ่ม object ใหม่ใน array `"fabrics"`:

```json
{
  "sku": "DRYFIT-NAVY",
  "name": "DryFit สีกรม",
  "category": "DryFit",
  "color": "Navy Blue",
  "color_th": "กรมท่า",
  "color_hex": "#1e3a8a",
  "weight_gsm": 140,
  "stretch": "4-way",
  "image": "fabrics/dryfit-navy.jpg",
  "use_for": ["jersey", "polo"],
  "tags": ["breathable", "moisture-wicking"],
  "description": "ผ้ากีฬาระบายอากาศดี เหมาะกับชุดออกกำลังกาย"
}
```

### 4. Push ขึ้น GitHub
```bash
git add fabrics/ fabrics.json
git commit -m "Add fabric: DryFit Navy"
git push
```

Netlify จะ deploy ใหม่ภายใน 30-60 วินาที — รูปจะใช้ได้ที่:
`https://sdesign-fabric.netlify.app/fabrics/dryfit-navy.jpg`

---

## SKU Naming Convention

ใช้รูปแบบ `<หมวด>-<สี>-<รหัสเพิ่มเติม>` ทั้งหมดเป็นภาษาอังกฤษพิมพ์ใหญ่และขีด

| ตัวอย่าง | ความหมาย |
|---------|---------|
| `DRYFIT-NAVY` | DryFit สีกรม |
| `DRYFIT-NAVY-140` | DryFit สีกรม น้ำหนัก 140 gsm |
| `MESH-BLACK` | ผ้าตาข่ายดำ |
| `COTTON-WHITE-160` | ผ้าฝ้ายขาว 160 gsm |

---

## คำแนะนำเรื่องรูปถ่าย

- **แสง:** ถ่ายในที่แสงดี (ใกล้หน้าต่าง) ไม่ใช้แฟลช
- **พื้น:** พื้นเรียบสีกลาง (เทา/ขาว) ตัดผ้าให้ดูชัด
- **มุม:** ถ่ายตรงๆ จากบน 90° เห็นเนื้อผ้าชัด
- **ระยะ:** ตัด crop ให้เห็นเฉพาะผ้า ไม่มีของอื่นเข้ามา

---

## ตรวจสอบหลัง push

1. เปิด `https://sdesign-fabric.netlify.app/fabrics/<ชื่อไฟล์>.jpg` ดูว่ารูปขึ้น
2. เปิด `https://sdesign-fabric.netlify.app/fabrics.json` ดูว่า JSON ถูกต้อง

---

## ลบผ้าที่ไม่ขาย

1. ลบไฟล์รูปออกจาก `fabrics/`
2. ลบ object ออกจาก `fabrics.json`
3. Commit + push
