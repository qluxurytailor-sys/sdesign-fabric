# S DESIGN — Fabric Catalog

ระบบ Catalog ผ้าออนไลน์ของแบรนด์ S DESIGN — ใช้สำหรับ AI Agent ส่งรูปและข้อมูลผ้าให้ลูกค้าตอบกลับอัตโนมัติ

## โครงสร้าง

```
sdesign-fabric/
├─ index.html              ← Admin Link UI (single-page React app)
├─ fabrics.json            ← ฐานข้อมูลผ้า (Agent อ่านจากนี่)
├─ fabrics/                ← รูปผ้าจริง
│  ├─ HOW-TO-ADD.md        ← วิธีเพิ่มผ้าใหม่
│  └─ *.jpg                ← รูปแต่ละตัวอย่าง
├─ netlify.toml            ← Netlify deploy config
└─ calibration/            ← Dev artifacts
```

## URL หลังจาก deploy

| Path | ใช้ทำอะไร |
|------|----------|
| `/` | Admin Link UI |
| `/fabrics.json` | ฐานข้อมูลผ้าสำหรับ Agent |
| `/fabrics/<sku>.jpg` | รูปผ้าตัวอย่าง |

## ใช้งานกับ AI Agent

Agent flow ตัวอย่าง:
1. ลูกค้าถาม "ขอดูผ้า DryFit สีกรม"
2. Agent fetch `https://sdesign-fabric.netlify.app/fabrics.json`
3. Agent ค้นหาใน array โดยจับคู่ `name` / `tags` / `category`
4. Agent ส่งกลับ:
   - URL รูป: `base_url + "/" + image`
   - ข้อมูลผ้า: weight, stretch, use_for, description

## เพิ่มผ้าใหม่

ดู [`fabrics/HOW-TO-ADD.md`](fabrics/HOW-TO-ADD.md) — มี 4 ขั้นตอนชัดเจน

## Deploy

ต่อเข้ากับ Netlify ผ่าน GitHub repo นี้ — Netlify จะ auto-deploy ทุกครั้งที่ push ขึ้น `main`
