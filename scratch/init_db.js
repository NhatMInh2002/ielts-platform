
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Không tìm thấy DATABASE_URL trong .env.local");
  process.exit(1);
}

// Cấu hình kết nối (loại bỏ ?pgbouncer=true nếu cần cho lệnh DDL)
const sql = postgres(connectionString.replace('?pgbouncer=true', ''), {
  ssl: 'require',
  max: 1
});

async function migrate() {
  try {
    console.log("🚀 Đang đọc file MIGRATION.sql...");
    const migrationPath = path.join(process.cwd(), 'MIGRATION.sql');
    const schemaSql = fs.readFileSync(migrationPath, 'utf8');

    console.log("⚡ Đang thực thi các lệnh SQL trên Supabase...");
    
    // Tách các câu lệnh để thực thi (đơn giản hóa)
    // Lưu ý: Postgres.js có thể thực thi cả khối SQL lớn
    await sql.unsafe(schemaSql);

    console.log("✅ Khởi tạo Database thành công!");
    console.log("------------------------------------------");
    console.log("Bây giờ bạn đã có các bảng: profiles, tests, submissions, token_transactions.");
    console.log("Trigger handle_new_user cũng đã được thiết lập.");
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo database:", error);
  } finally {
    await sql.end();
  }
}

migrate();
