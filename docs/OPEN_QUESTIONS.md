# Danh sách câu hỏi nghiệp vụ & Mặc định tạm (SRS v2)

Tài liệu này ghi nhận các mục [CẦN XÁC NHẬN] từ SRS v2 và kỹ năng `gschedule-rulebook`. Mọi giá trị mặc định được thiết kế dưới dạng cấu hình được trong DB/rules, có thể điều chỉnh khi doanh nghiệp chốt chính thức.

| ID | Vấn đề nghiệp vụ cần xác nhận | Mặc định tạm đang áp dụng | Trạng thái |
|---|---|---|---|
| **P0-01/02** | Khái niệm buổi vs tiết; phân công nhiều GV/nhiều lớp | Event = buổi; Period = tiết trong buổi; 1 assignment/nhân sự/event; DB schema cho phép quan hệ n-n (UI mặc định 1 lớp) | CHƯA CHỐT |
| **P0-03** | Cơ sở tính thù lao CTV & ca < 2 tiết | Cơ sở `ctv_basis` = ACTUAL_PERIODS (cấu hình); buổi < 2 tiết đưa về `PENDING_REVIEW` amount NULL, chặn xuất payroll CTV; cờ `payroll.ctv_release` = off | CHƯA CHỐT |
| **P0-04** | Chính sách CTP cho khoảng cách & hành trình | Nếu `ctp_policy` rỗng -> item CTP ở `PENDING_REVIEW`, không cho duyệt; cho phép cấu hình basis (FIRST_SCHOOL, FARTHEST, PER_LEG, FIXED_PER_SESSION) và way (ONE_WAY, ROUND_TRIP) | CHƯA CHỐT |
| **P0-05** | Nguồn tính khoảng cách trường học - địa điểm | DistanceProvider: MANUAL + MATRIX; chưa tích hợp API bản đồ bên ngoài | CHƯA CHỐT |
| **P0-06** | Mã quy đổi không xác định hoặc số âm | CM/trống = 0.00 theo PDF; BN = 2.00; TC và số âm không import -> `PENDING_REVIEW` | CHƯA CHỐT |
| **P0-07** | Môn ghép (ví dụ "STEM + AI") | Giữ chuỗi thô (raw), gán `PENDING_REVIEW`, không tự động chia quỹ | CHƯA CHỐT |
| **P0-08** | Lịch ngày Chủ Nhật & trạng thái bận | `include_sunday` = false; `busy_activity_types` = TEACHING, SUBSTITUTE, MAKEUP, EVENT_WORKSHOP (DG/CM không chiếm lịch bận) | CHƯA CHỐT |
| **P0-09** | Điều kiện tính công (payroll eligibility) | Chỉ event COMPLETED và được xác nhận/verified mới đủ điều kiện ELIGIBLE | CHƯA CHỐT |
| **P0-10** | Tách / gộp nghĩa vụ dạy bù (makeup obligation) | `allow_split_makeup` = true, `allow_merge_makeup` = false; Điều phối viên (COORDINATOR) xác nhận hoàn tất | CHƯA CHỐT |
| **P0-11** | Chính sách phê duyệt & maker-checker | Bảng `approval_policies` seed theo ma trận phân quyền §4.3, kích hoạt maker-checker đối với duyệt tiền và mở khóa kỳ công | CHƯA CHỐT |
| **P0-12** | Chu kỳ kỳ công tính lương | Kỳ công tính theo tháng dương lịch Asia/Ho_Chi_Minh, cho phép cấu hình ngày bắt đầu/kết thúc | CHƯA CHỐT |

