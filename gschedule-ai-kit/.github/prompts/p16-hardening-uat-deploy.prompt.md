---
description: "P16 — Hardening bảo mật, hiệu năng, UAT trace AT-001..032, backup/restore, triển khai"
agent: agent
---
# P16 — Hardening, UAT, Deploy
**Model:** mạnh nhất có (thinking High) để rà soát; Flash cho tài liệu/script. **Đọc:** SRS §12, §13, §15.1, Phụ lục C, NFR-*; docs/PROGRESS.md. **Skill:** web-design-guidelines, vercel-react-best-practices. **MCP:** bật tạm Playwright MCP, tắt sau khi xong.

## Mục tiêu
Đạt điều kiện nghiệm thu UAT §13.3 ở phía kỹ thuật; sẵn sàng pilot song song với Excel.

## Yêu cầu
1. **Bảo mật:** rà theo checklist OWASP ASVS rút gọn (authN/authZ, session, CSRF, XSS, SSRF, upload file, rate limit, header/CSP); `pnpm audit`/kiểm tra phụ thuộc; xoay khóa mã hóa có tài liệu + lệnh; MFA/SSO chỉ bật nếu yêu cầu đã chốt (FR-IAM-004).
2. **RBAC:** test ma trận mọi role × hành động chính × scope (§4.3); không còn đường lộ dữ liệu nhạy cảm (route, export, log).
3. **Hiệu năng:** seed dữ liệu ≈ 36 tuần × lịch thật; mục tiêu 95% request đọc ≤ 3 giây (NFR-PERF-001); tìm và sửa N+1; thêm index dựa trên EXPLAIN, ghi vào PROGRESS.
4. **Vận hành:** logging pino không PII, metrics/tracing cho tính toán và batch; script backup tự động + **test restore**; tài liệu RPO/RTO để chủ hệ thống chốt; cấu hình retention (tài liệu NS, audit, payroll, backup) dạng tham số chờ phê duyệt; cơ chế xuất/xóa dữ liệu cá nhân theo yêu cầu chủ thể (chờ rà soát pháp lý riêng).
5. **UAT:** `docs/UAT_TRACE.md` ánh xạ AT-001..AT-032 và mọi FR MUST → file test; Playwright e2e cho 6 luồng: tạo/copy/công bố lịch · nghỉ→dạy thay · trường nghỉ→dạy bù · xác nhận tiết · chạy payroll→khóa kỳ · import→exception queue. Kịch bản đối soát song song 1–2 kỳ với Excel (tuần thường, giao thoa tháng, có nghỉ/thay/bù, nhiều sự kiện/CTV).
6. **Triển khai:** Dockerfile, biến môi trường, migration chạy tự động an toàn, healthcheck, runbook sự cố, hướng dẫn người dùng theo vai trò.

## Checklist đầu ra
- [ ] 100% FR MUST có test và pass (UAT_TRACE không có dòng trống)
- [ ] 32/32 AT có test tương ứng; các AT phụ thuộc P0 chưa chốt được đánh dấu rõ "chờ P0-xx"
- [ ] Không còn lỗi nghiêm trọng về tính công/CTP/CTV, trùng lịch, mất dữ liệu, lộ dữ liệu nhạy cảm
- [ ] Restore thử thành công từ backup; ghi lại thời gian thực tế
- [ ] 6 luồng e2e xanh trên CI
- [ ] Header bảo mật + CSP có; audit phụ thuộc không còn lỗ hổng cao/nghiêm trọng chưa xử lý
- [ ] Lighthouse a11y ≥ 90 ở 3 trang chính; điều hướng bàn phím form chính
- [ ] Danh sách P0 còn mở được liệt kê kèm tác động và tính năng đang bị chặn
- [ ] Tài liệu: runbook, hướng dẫn vai trò, backup/restore, xoay khóa
- [ ] `pnpm check` xanh; PROGRESS cập nhật; tag phiên bản pilot
