# GSchedule — Phân tích SRS v2.0 & kế hoạch build bằng AI (Copilot + Antigravity)

## 1. Tóm tắt hệ thống
Webapp thay thế hai workbook Excel (hồ sơ giáo viên, lịch tuần 26-27) cho VP Hà Nội: hồ sơ nhân sự/CTV, phân công trường/lớp, lịch REGULAR + ADHOC, TCS (lịch trống/bận), nghỉ/dạy thay/dạy bù, quy đổi tiết, CTP, thù lao CTV, kỳ công, báo cáo. Quy mô: 53 yêu cầu chức năng (FR), 32 acceptance test (AT), 12 mục P0 chưa chốt, hơn 60 bảng.
Độ khó nằm ở: (1) mô hình lịch Event/Assignment/Period, (2) rule engine có version, (3) conflict/TCS, (4) payroll khóa kỳ + snapshot, (5) migration từ Excel bẩn, (6) RBAC + dữ liệu nhạy cảm.

## 2. Điểm cần lưu ý trong SRS (rủi ro khi vibe code)
1. **12 mục P0 chưa chốt, nhiều mục liên quan tiền** (CTV <2 tiết, CTP nhiều trường/buổi, CM/TC âm, môn ghép STEM+AI). AI rất dễ "tự đoán công thức". → Build rule engine theo cấu hình + trạng thái `PENDING_REVIEW`; mặc định tạm nằm trong skill `gschedule-rulebook`; payroll CTV có cờ tắt cho tới khi có văn bản chốt.
2. **Mâu thuẫn nguồn**: CM = 0.00 (PDF) vs -0.01 và TC = -0.02 (Excel); TCS Thứ Hai–Thứ Bảy vs lưới có Chủ Nhật; BN xuất hiện trong bảng quy đổi nhưng vẫn là câu hỏi P0-06. → Dùng giá trị PDF, mã lạ → PENDING_REVIEW, không import số âm.
3. **TCS hai tầng**: ngưỡng buổi 0.4 (tổng quan) khác với kiểm tra overlap theo slot (điều động). Phải làm cả hai, không dùng ngưỡng buổi để kết luận "rảnh chắc chắn".
4. **So sánh số thực**: ngưỡng `> 0.4` và biên CTP rất dễ sai do float. → Credit lưu integer centi-tiết (40), tiền integer VND; test biên bắt buộc.
5. **Ràng buộc chống trùng lịch phải ở DB**, không chỉ ở code (NFR-DATA-001): dùng exclusion constraint (btree_gist) + `version` cho optimistic lock (AT-032).
6. **Khóa kỳ công** phải chặn ở tầng DB/service (trigger + guard), vì AI hay quên đường sửa gián tiếp (AT-026/027).
7. **Migration không import công thức/màu**; mã `GV mới` không phải khóa; HN007 ≠ GVHN007 nếu chưa xác nhận (AT-001/002). File Excel gốc có 228 ô #VALUE! và 28 ô #N/A — chỉ dùng đối soát.
8. **Dữ liệu nhạy cảm** (CCCD, ngân hàng): Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15) có hiệu lực từ 01/01/2026 — SRS đã yêu cầu rà soát pháp lý riêng; nên làm trước go-live. Kit này chỉ dựng cơ chế kỹ thuật (mã hóa, mask, audit, retention cấu hình), không thay tư vấn pháp lý.
9. SRS không nêu stack ngoài PostgreSQL/UUID/web responsive-PWA → stack ở mục 3 là đề xuất của kit, bạn có thể đổi trước P00.

## 3. Quyết định kỹ thuật
| Hạng mục | Chọn | Lý do |
|---|---|---|
| Framework | Next.js 16 (App Router) + TS strict | Một codebase UI+server; Next 16.x là dòng ổn định hiện hành |
| DB | PostgreSQL 17 + Drizzle ORM | SRS yêu cầu Postgres; Drizzle schema-as-code, AI sinh/sửa dễ; hỗ trợ exclusion constraint qua SQL migration |
| Auth | Better Auth + bảng RBAC tự quản | Role đa vai + data scope là custom; agent phải tra Context7 trước khi dùng |
| UI | Tailwind + shadcn/ui + TanStack Table/Query | Sinh bằng CLI, ít token |
| Logic | `packages/domain` thuần TS | Test nhanh, rẻ, AI dễ đúng; tách rule khỏi UI |
| Test | Vitest + Postgres docker + Playwright | Bám AT-001…032 |
| Vendor | Postgres trung lập (không khóa Supabase) | Dùng được skill Postgres của Supabase mà không phụ thuộc nền tảng |

## 4. Phân rã 17 phần build
| # | Phần | SRS | Phụ thuộc | Model gợi ý (thinking) | Rủi ro |
|---|---|---|---|---|---|
| P00 | Bootstrap monorepo, DB, CI, shell UI | §8.1, §12 | - | Flash (Low) | Thấp |
| P01 | IAM, RBAC, data scope, audit | §4, FR-IAM, FR-AUD | P00 | Mạnh (High) | Cao |
| P02 | Master data + alias + lịch trường | §8.3, FR-MD | P01 | Flash (Med) | Thấp |
| P03 | Hồ sơ HR, hợp đồng, chứng chỉ, nhạy cảm | §5.1, FR-HR | P01,P02 | Flash (Med) + review mạnh | TB |
| P04 | Rule engine (domain thuần) | §7, FR-CAL-003/004/005/007 | P00 | Mạnh (High) | Cao |
| P05 | Import framework + HR/master | §11, FR-IMP | P02,P03 | Flash (Med) | TB |
| P06 | Phân công & bàn giao lớp | §5.2, FR-ASG | P03 | Flash (Med) | TB |
| P07 | Scheduling core + conflict + copy tuần | §5.3-5.4, FR-SCH | P04,P06 | Mạnh (High) | Cao |
| P08 | Master Schedule UI | §10 | P07 | Flash (Med) | TB |
| P09 | Import lịch tuần từ Excel | §11 | P05,P07 | Mạnh (High) | Cao (cần file mẫu) |
| P10 | Nghỉ/dạy thay/NB/bù/availability/đổi ca/xác nhận | §5.5-5.9, FR-LVM | P07 | Mạnh (High) | Cao |
| P11 | TCS & điều động | §7.4, FR-CAL-001/002 | P10 | Mạnh (High) | Cao |
| P12 | CTP & di chuyển | §7.5-7.6, FR-CAL-005/006 | P04,P07 | Mạnh (High) | Cao (P0-04) |
| P13 | Payroll, đối soát, khóa kỳ | §5.10, §7.9, FR-PAY | P10,P12 | Mạnh (High) | Rất cao |
| P14 | Báo cáo, dashboard, export | §10.3, FR-RPT | P13 | Flash (Med) | TB |
| P15 | Portal GV/CTV (PWA) + thông báo | §10.2, FR-NOT | P10 | Flash (Med) | TB |
| P16 | Hardening, UAT, deploy | §12, §13 | tất cả | Mạnh (High) | TB |

Ánh xạ giai đoạn SRS: G0 sign-off = chốt P0 (làm song song ngay từ đầu) · G1 = P00–P05 · G2 = P06–P09 · G3 = P10–P11 · G4 = P04+P12–P14 · G5 = P15–P16.
Thứ tự khuyến nghị: P00 → P01 → P02 → P04 (song song được) → P03 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12 → P13 → P14 → P15 → P16.
Mốc dùng thử sớm: sau P08 (xem/sửa lịch, chưa tính công). Mốc đối soát song song với Excel: sau P13.

## 5. Chiến lược giảm token
1. **Không đưa PDF cho agent mỗi lần.** Chuyển một lần sang `docs/SRS_v2.md`; agent chỉ `grep` theo mã FR/AT/§ (prompt đã liệt kê sẵn mục cần đọc).
2. **AGENTS.md ngắn (<50 dòng, luôn nạp)**; kiến thức dài nằm trong skill (agent chỉ nạp tên + mô tả, nạp nội dung khi cần).
3. **Một phiên = một prompt**, mở chat mới mỗi phần; bàn giao qua `docs/PROGRESS.md` (≤30 dòng) thay vì kéo dài lịch sử chat.
4. **Logic tính toán làm trước trong `packages/domain` + test**, rồi mới nối DB/UI. Lỗi tính tiền bị bắt bằng test rẻ thay vì debug UI tốn token.
5. **CLI trước, AI sau**: create-next-app, `shadcn add`, `drizzle-kit generate`; AI chỉ viết phần nghiệp vụ.
6. **Định tuyến model**: việc lặp (CRUD, UI, import) dùng Gemini 3.8 Flash ở mức thinking Low/Med; việc rủi ro (RBAC, conflict, TCS, payroll, lock) dùng model mạnh nhất bạn có (Gemini 4 Argon trên gói Pro/Ultra của Antigravity, hoặc Claude trong Antigravity/Copilot) ở mức High, hoặc dùng model mạnh để *review* sau khi Flash viết.
7. **Một lệnh kiểm tra duy nhất `pnpm check`**; agent chỉ in phần lỗi.
8. **MCP tối thiểu**: mỗi MCP server nạp thêm schema công cụ vào ngữ cảnh. Chỉ bật Context7 (và Playwright ở P16).
9. **Chỉ định file cần đụng** thay vì "đọc cả repo"; prompt đã nêu phạm vi.
10. **Test fixture ẩn danh sinh bằng script**, không dán dữ liệu thật vào chat.

## 6. Skill, plugin, MCP khuyến nghị
| Công cụ | Dùng ở | Cài đặt | Ghi chú |
|---|---|---|---|
| `gschedule-rulebook` (có sẵn trong kit) | P03–P14 | đã nằm ở `.agents/skills/` | Cả Copilot (VS Code) và Antigravity đều đọc thư mục này |
| vercel-react-best-practices | P00, P08, P14–P16 | `npx skills add vercel-labs/agent-skills --skill react-best-practices` | Tên hiển thị trên skills.sh là vercel-react-best-practices; kiểm tra lại tên skill bằng `--list` |
| web-design-guidelines | P08, P15, P16 | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | Rà a11y/UX theo NFR-ACC-001 |
| supabase-postgres-best-practices | P01, P02, P07, P13 | `npx skills add supabase/agent-skills` (chọn skill Postgres) | Dùng cho schema/index/RLS; dự án không dùng Supabase nên bỏ qua skill `supabase` chính |
| frontend-design | P08, P15 | cài từ skills.sh nếu muốn giao diện bớt "mẫu" | Tùy chọn |
| Context7 MCP | mọi phần | `.vscode/mcp.json` (VS Code) hoặc `docs/mcp-antigravity.json.example` (Antigravity dùng khóa `serverUrl`) | Gọi bằng "use context7" khi viết code dùng thư viện đổi nhanh |
| Playwright MCP | P16 | thêm tạm khi làm e2e | Tắt sau đó |

Cấu hình theo công cụ:
- **GitHub Copilot (VS Code)**: `AGENTS.md` và `.github/copilot-instructions.md` đều được nạp tự động; kit chỉ dùng `AGENTS.md` để một nguồn dùng chung. Prompt nằm ở `.github/prompts/*.prompt.md` → gõ `/p05-import-framework` trong Chat (chế độ Agent). Skill ở `.agents/skills/`.
- **Antigravity**: đọc `AGENTS.md`, skill ở `.agents/skills/<tên>/SKILL.md`, MCP trong Customizations → Open MCP Config. Chưa có slash command cho prompt file → mở file prompt rồi nhắn: "Thực hiện đúng prompt trong @.github/prompts/p05-....prompt.md". Gemini 3.8 Flash cho chọn mức thinking Low/Medium/High ngay trong bộ chọn model.
- **An toàn chuỗi cung ứng**: skill/MCP là mã chạy với quyền của agent. Chỉ cài từ nguồn uy tín, đọc `SKILL.md` và `scripts/` trước khi cài, ghim phiên bản.

## 7. Vòng lặp mỗi phiên
1. Chat mới → chọn model theo bảng mục 4 → gọi prompt Pxx.
2. Agent đọc PROGRESS + mục SRS nêu sẵn → lập kế hoạch ngắn → code → `pnpm check`.
3. Bạn đọc diff của phần rủi ro cao (RBAC, tiền, lock) hoặc nhờ model mạnh review: "Review diff theo checklist của Pxx, chỉ liệt kê lỗi".
4. Tick checklist, commit, cập nhật PROGRESS, sang phần kế.

## 8. Bước 0 — chuẩn bị (≈15 phút)
1. Tạo repo rỗng, chép toàn bộ kit vào gốc repo. Chép PDF SRS vào `docs/SRS_v2.pdf`.
2. Chuyển SRS sang Markdown một lần: `pdftotext -layout docs/SRS_v2.pdf docs/SRS_v2.md` (hoặc `uvx markitdown`). Kiểm tra nhanh `grep -c "FR-" docs/SRS_v2.md` ≥ 50.
3. Cài skill (mục 6) và cấu hình Context7.
4. Chuẩn bị bản **ẩn danh** của hai workbook (hoặc 2–3 sheet mẫu) đặt ở `fixtures/` cho P05 và P09. Không commit dữ liệu thật; thêm `fixtures/` vào `.gitignore` nếu chưa ẩn danh.
5. Gửi chủ nghiệp vụ danh sách P0 trong `docs/OPEN_QUESTIONS.md` (P00 sẽ tạo) để chốt song song.
