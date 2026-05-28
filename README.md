# S DESIGN — Admin Link UI

หน้า UI ระบบจัดการลิงก์ภายในของแบรนด์ S DESIGN ใช้เป็น single-page HTML สำหรับ deploy บน Netlify

## โครงสร้าง

- `index.html` — single-page React app (compiled, self-contained)
- `netlify.toml` — Netlify deploy config
- `calibration/` — dev/test artifacts

## Deploy

ต่อเข้ากับ Netlify ผ่าน GitHub repo นี้ — Netlify จะ auto-deploy ทุกครั้งที่ push ขึ้น `main`
