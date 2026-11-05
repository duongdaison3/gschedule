# GSchedule — Kế hoạch build bằng AI (v2: Aiven + Windows + Antigravity/Copilot)

## 0. Thay đổi so với bản đầu
| Hạng mục | Bản đầu | v2 |
|---|---|---|
| DB | Postgres Docker | **Aiven PostgreSQL cho dev**, Docker (cổng 5433) giữ cho test/CI |
| Môi trường | Giả định bash | **Windows + PowerShell**: dùng `rg`/`Select-String`, script Node/tsx, không `grep/sed` |
| Phần mới | - | **P00B**: rào an toàn DB, vai trò DB tối thiểu, SSL/pool, Windows, bí mật |
| Skill giao diện | frontend-design + web-design-guidelines | **impeccable** (bạn đã cài) thay cả hai → bớt trùng lặp, bớt token |
| Skill giữ | - | vercel-react-best-practices, supabase-postgres-best-practices (chỉ phần Postgres), gschedule-rulebook |
| Prompt đã sửa | - | AGENTS.md, p00 (đánh dấu xong), p00b (bổ sung), p01, p02, p05, p07, p08, p11, p13, p14, p15, p16 |
| Tài liệu SRS | PDF → md tự chuyển | `docs/SRS_v2.md` đã làm sạch (bảng đúng, bỏ header/footer, có heading `##`/`###`) |

## 1. Tóm tắt hệ thống
Webapp thay hai workbook Excel cho VP Hà Nội: hồ sơ nhân sự/CTV, phân công trường/lớp, lịch REGULAR + ADHOC, TCS, nghỉ/dạy thay/dạy bù, quy đổi tiết, CTP, thù lao CTV, kỳ công, báo cáo. Quy mô: 53 FR, 32 AT, 12 mục P0 chưa chốt, hơn 60 bảng. Độ khó: mô hình lịch Event/Assignment/Period, rule engine có version, conflict/TCS, payroll khóa kỳ + snapshot, migration từ Excel bẩn, RBAC + dữ liệu nhạy cảm.

## 2. Rủi ro trong SRS
1. 12 mục P0 chưa chốt, nhiều mục liên quan tiền → cấu hình + `PENDING_REVIEW`, mặc định tạm trong skill `gschedule-rulebook`, cờ `payroll.ctv_release` tắt.
2. Mâu thuẫn nguồn: CM 0.00 (PDF) vs -0.01 và TC -0.02 (Excel); TCS Thứ Hai–Thứ Bảy vs lưới có Chủ Nhật; BN trong bảng quy đổi nhưng vẫn là câu hỏi P0-06.
3. TCS hai tầng: ngưỡng buổi 0.4 (tổng quan) ≠ overlap theo slot (điều động).
4. Số thực: credit lưu centi-tiết integer, tiền VND integer; test biên bắt buộc.
5. Chống trùng lịch và khóa kỳ công phải ở DB (exclusion constraint, trigger), không chỉ ở code.
6. Migration không import công thức/màu; `GV mới` không phải khóa; HN007 ≠ GVHN007 nếu chưa xác nhận.
7. Dữ liệu nhạy cảm (CCCD, ngân hàng): xem mục 4.6 về nơi lưu và pháp lý.

## 3. Quyết định kỹ thuật
| Hạng mục | Chọn | Ghi chú |
|---|---|---|
| Framework | Next.js 16 App Router + TS strict | Đã dựng ở P00 |
| DB | PostgreSQL trên Aiven + Drizzle | Chỉ dùng tính năng không cần superuser |
| Auth | Better Auth + bảng RBAC tự quản | Tra Context7 trước khi dùng |
| UI | Tailwind v4 + shadcn/ui + TanStack | Đã dựng ở P00 |
| Logic | `packages/domain` thuần TS | Test rẻ, tách rule khỏi UI |
| Test | Vitest + Postgres test riêng + Playwright | Bám AT-001…032 |

## 4. Aiven: thiết lập và rủi ro
### 4.1 Ba URL, ba vai trò
| Biến | Dùng cho | Role |
|---|---|---|
| `DATABASE_URL` | app khi chạy (dev) | `gschedule_app`, không DDL, không UPDATE/DELETE trên `audit_logs` |
| `DATABASE_MIGRATE_URL` | `pnpm db:migrate` | owner (`avnadmin` hoặc tương đương) |
| `DATABASE_TEST_URL` | test tích hợp | Docker `localhost:5433` (hoặc DB `*_test`), không bao giờ trùng `DATABASE_URL` |

### 4.2 Giới hạn gói free cần tính trước (kiểm tra lại trên Console, số liệu có thể thay đổi)
- Tối đa 20 kết nối, không có connection pooling → `DB_POOL_MAX` ≤ 5, pool singleton, transaction ngắn.
- Không fork, không IP tĩnh; dịch vụ có thể bị **tự tắt khi không hoạt động** → không dùng cho môi trường có người dùng thật. Gói trả phí thấp nhất (Developer) không tự tắt; xem bảng giá hiện hành.
- Có sao lưu tự động, nhưng nên có thêm `pg_dump` logic độc lập nhà cung cấp.
- Độ trễ mạng mỗi truy vấn → viết truy vấn theo tập hợp (P05, P07, P11, P14 đã có yêu cầu này).
- Aiven không cấp superuser; `avnadmin` vẫn tạo được database/role, extension, GRANT/REVOKE. 4 extension bạn đã bật (btree_gist, pgcrypto, pg_trgm, unaccent) là đủ.

### 4.3 Rào an toàn (P00B)
`db:reset`/`db:seed`/truncate chỉ chạy trên localhost hoặc DB `*_dev`/`*_test`; test từ chối chạy khi trỏ vào DB cloud; không có `rejectUnauthorized: false` ngoài nhánh dev; nên bật IP allowlist.

### 4.4 Quyền mặc định
Owner tạo bảng → cần `ALTER DEFAULT PRIVILEGES … GRANT … TO gschedule_app`, và `REVOKE` riêng cho `audit_logs` sau khi tạo bảng (P01).

### 4.5 Bí mật
Agent có thể đọc file `.env` rồi gửi nội dung lên mô hình. Giữ `.env` ngoài git, không dán chuỗi kết nối vào chat, dùng role DB quyền thấp cho dev, đổi mật khẩu Aiven nếu nghi ngờ lộ. P00B kiểm tra lịch sử git.

### 4.6 Nơi lưu dữ liệu và pháp lý (mục P1-09 mới)
Dữ liệu thật (CCCD, tài khoản ngân hàng, hợp đồng) lưu ở cloud/ngoài nước cần rà soát yêu cầu pháp luật Việt Nam về bảo vệ dữ liệu cá nhân (Luật có hiệu lực từ 01/01/2026) trước khi nhập. Kit chỉ dựng cơ chế kỹ thuật, không thay tư vấn pháp lý. Cho tới khi chốt: chỉ dùng dữ liệu giả/ẩn danh trong dev.

## 5. Phân rã build
| # | Phần | SRS | Phụ thuộc | Model gợi ý (thinking) | Trạng thái |
|---|---|---|---|---|---|
| P00 | Bootstrap monorepo, shell UI, tiện ích | §8.1, §12 | - | Flash (Low) | ✔ xong |
| **P00B** | **Aiven + Windows + rào an toàn DB** | docs/PROGRESS | P00 | Flash (Med) | **làm ngay** |
| P01 | IAM, RBAC, data scope, audit | §4, FR-IAM, FR-AUD | P00B | Mạnh (High) | |
| P02 | Master data + alias + lịch trường | §8.3, FR-MD | P01 | Flash (Med) | |
| P03 | Hồ sơ HR, hợp đồng, chứng chỉ, nhạy cảm | §5.1, FR-HR | P01,P02 | Flash (Med) + review mạnh | |
| P04 | Rule engine (domain thuần) | §7, FR-CAL | P00 | Mạnh (High) | |
| P05 | Import framework + HR/master | §11, FR-IMP | P02,P03 | Flash (Med) | |
| P06 | Phân công & bàn giao lớp | §5.2, FR-ASG | P03 | Flash (Med) | |
| P07 | Scheduling core + conflict + copy tuần | §5.3-5.4, FR-SCH | P04,P06 | Mạnh (High) | |
| P08 | Master Schedule UI | §10 | P07 | Flash (Med) | |
| P09 | Import lịch tuần từ Excel | §11 | P05,P07 | Mạnh (High) | cần file mẫu |
| P10 | Nghỉ/dạy thay/NB/bù/availability/đổi ca/xác nhận | §5.5-5.9, FR-LVM | P07 | Mạnh (High) | |
| P11 | TCS & điều động | §7.4, FR-CAL-001/002 | P10 | Mạnh (High) | |
| P12 | CTP & di chuyển | §7.5-7.6 | P04,P07 | Mạnh (High) | P0-04 |
| P13 | Payroll, đối soát, khóa kỳ | §5.10, §7.9, FR-PAY | P10,P12 | Mạnh (High) + review | rủi ro rất cao |
| P14 | Báo cáo, dashboard, export | §10.3, FR-RPT | P13 | Flash (Med) | |
| P15 | Portal GV/CTV (PWA) + thông báo | §10.2, FR-NOT | P10 | Flash (Med) | |
| P16 | Hardening, UAT, deploy | §12, §13 | tất cả | Mạnh (High) | |

Thứ tự: P00B → P01 → P02 → P04 (song song được) → P03 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12 → P13 → P14 → P15 → P16. Mốc dùng thử sớm: sau P08. Mốc đối soát song song với Excel: sau P13.
Ánh xạ SRS: G0 = chốt P0 (làm song song ngay) · G1 = P00–P05 · G2 = P06–P09 · G3 = P10–P11 · G4 = P04+P12–P14 · G5 = P15–P16.

## 6. Chiến lược giảm token
1. Agent đọc `docs/SRS_v2.md` bằng `rg` theo mã FR/AT/§, không đọc cả file (khoảng 90 KB).
2. `AGENTS.md` ngắn, luôn nạp; kiến thức dài nằm trong skill (chỉ nạp khi cần).
3. Một phiên = một prompt, chat mới mỗi phần; bàn giao qua `docs/PROGRESS.md` (≤30 dòng).
4. Làm logic tính toán thuần + test trước, rồi mới nối DB/UI.
5. CLI trước, AI sau: `shadcn add`, `drizzle-kit generate`.
6. Định tuyến model: Flash (Low/Med) cho CRUD/UI/import; model mạnh nhất (High) cho RBAC, conflict, TCS, payroll, lock, hoặc để *review* diff sau khi Flash viết.
7. Một lệnh kiểm tra `pnpm check`; agent chỉ in phần lỗi.
8. MCP tối thiểu: chỉ Context7; Playwright MCP chỉ ở P16.
9. **Tránh skill trùng lặp:** bạn đang có skill ở `.agents/`, `.claude/`, `.codex/`. Copilot đọc cả `.agents/skills` lẫn `.claude/skills`, nên cùng một skill có thể bị liệt kê hai lần (tốn token). Chỉ giữ thư mục của công cụ bạn thật sự dùng (Copilot + Antigravity: `.agents/skills`); xóa `.claude/`, `.codex/` nếu không dùng Claude Code/Codex, và cài lại skill chỉ cho các agent cần dùng.
10. Chỉ bật `impeccable` ở P02/P08/P15/P16 (23 lệnh thiết kế không cần cho phần backend).

## 7. Skill, plugin, MCP
| Công cụ | Dùng ở | Ghi chú |
|---|---|---|
| gschedule-rulebook | P03–P14 | Có sẵn trong kit, `.agents/skills/` |
| impeccable | P02, P08, P15, P16 | Thay frontend-design + web-design-guidelines; `/impeccable audit` để rà UI/a11y |
| vercel-react-best-practices | P00, P08, P14–P16 | Giữ |
| supabase-postgres-best-practices | P01, P02, P07, P13 | Giữ, chỉ lấy phần Postgres (index, schema); bỏ qua RLS/Supabase vì dự án dùng RBAC ở tầng ứng dụng |
| Context7 MCP | mọi phần | `.vscode/mcp.json` hoặc `docs/mcp-antigravity.json.example` (Antigravity dùng `serverUrl`) |
| Playwright MCP | P16 | Bật tạm rồi tắt |
| MCP cho Aiven/DB | không dùng | Thêm schema công cụ vào ngữ cảnh và thêm quyền; dùng `psql`/Drizzle Studio trong terminal |

Cấu hình theo công cụ:
- Copilot (VS Code): `AGENTS.md` tự nạp; prompt ở `.github/prompts/*.prompt.md` → gõ `/p00b-aiven-windows` trong Chat (Agent).
- Antigravity: đọc `AGENTS.md` và `.agents/skills/`; chưa có slash command cho prompt file → nhắn "Thực hiện đúng prompt trong @.github/prompts/p00b-aiven-windows.prompt.md". Chọn Gemini 3.8 Flash với thinking Low/Med/High theo bảng mục 5.
- An toàn chuỗi cung ứng: skill/MCP là mã chạy với quyền của agent; đọc `SKILL.md` và `scripts/` trước khi cài, ghim phiên bản.

## 8. Vòng lặp mỗi phiên
1. Chat mới → chọn model theo bảng → gọi prompt Pxx.
2. Agent đọc PROGRESS + mục SRS nêu sẵn → kế hoạch ngắn → code → `pnpm check`.
3. Với phần rủi ro cao (RBAC, tiền, lock) nhờ model mạnh review: "Review diff theo checklist của Pxx, chỉ liệt kê lỗi".
4. Tick checklist, commit, cập nhật PROGRESS, sang phần kế.

## 9. Việc cần làm ngay (dựa trên trạng thái repo hiện tại)
1. Chép `AGENTS.md`, `.github/prompts/`, `docs/SRS_v2.md`, `docs/00_KE_HOACH_BUILD.md` của kit v2 vào repo (đè bản cũ). Chuyển `00_KE_HOACH_BUILD.md` từ gốc vào `docs/`.
2. Xóa `package-lock.json` (đang có cùng `pnpm-lock.yaml`); chỉ dùng pnpm.
3. Dọn skill trùng lặp (mục 6.9); xác nhận `.env` nằm trong `.gitignore`.
4. Chuẩn bị bản **ẩn danh** của workbook (hoặc 2–3 sheet mẫu) trong `fixtures/` cho P05 và P09; không commit dữ liệu thật.
5. Chạy **P00B**, rồi P01. Gửi danh sách P0 trong `docs/OPEN_QUESTIONS.md` cho chủ nghiệp vụ chốt song song (thêm P1-09 về nơi lưu dữ liệu).
