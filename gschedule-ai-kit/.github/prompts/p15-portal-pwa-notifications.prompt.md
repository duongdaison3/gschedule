---
description: "P15 — Portal Giáo viên/CTV (mobile-first, PWA) và hệ thống thông báo"
agent: agent
---
# P15 — Teacher/CTV Portal, PWA, Notifications
**Model:** Flash (Med). **Đọc:** SRS §10.2 (màn 5), §10.1, FR-NOT-001/002, FR-LVM-005/006, NFR-UX-001, NFR-ACC-001, AT-028. **Skill:** vercel-react-best-practices, web-design-guidelines, frontend-design (nếu có).

## Mục tiêu
Giáo viên/CTV tự phục vụ trên điện thoại; mọi sự kiện quan trọng tạo thông báo có trạng thái đã gửi/đã đọc.

## Yêu cầu
1. Portal: lịch cá nhân ngày/tuần/tháng; xem địa chỉ/chỉ đường trường (liên kết ngoài, không tích hợp bản đồ); xác nhận tiết (xác nhận/vắng/báo sai); gửi đơn nghỉ/đổi ca; khai báo availability; xem bảng công/đối soát CHỈ của mình (CTV chỉ phần được phép).
2. PWA: manifest, service worker, cài được; offline chỉ đọc lịch tuần đã tải; KHÔNG cache dữ liệu nhạy cảm hay bảng lương.
3. Thông báo: `notifications` (recipient, kind, payload, channel, status SENT/READ/FAILED). Consumer đọc outbox từ các phần trước: lịch mới/đổi/hủy, nghỉ, dạy thay, dạy bù, nhắc HR (thử việc/hợp đồng), khóa kỳ. Kênh: in-app + adapter email/push qua interface (nhà cung cấp chưa chốt — P1-06), có adapter console/SMTP cho dev.
4. Trung tâm thông báo trong app (chưa đọc/đã đọc), tùy chọn kênh nhận.
5. Mobile-first: thao tác cốt lõi không cần hover, vùng chạm đủ lớn, hoạt động trên mạng chậm.

## Checklist đầu ra
- [ ] AT-028: GV/CTV không xem được lịch/bảng công/CCCD/bank của người khác (test e2e)
- [ ] Luồng xác nhận tiết trên 375px hoàn tất ≤ 3 thao tác
- [ ] Publish/đổi/hủy event tạo đúng thông báo cho đúng người bị ảnh hưởng, không trùng lặp
- [ ] Trạng thái đã gửi/đã đọc cập nhật; thất bại có thử lại tối đa N lần (cấu hình)
- [ ] PWA cài được; offline mở lại lịch đã tải; dữ liệu nhạy cảm không nằm trong cache (kiểm bằng DevTools)
- [ ] Lighthouse mobile: Performance ≥ 80, Accessibility ≥ 90 trên trang lịch
- [ ] `pnpm check` xanh; PROGRESS cập nhật
