SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
TÀI LIỆU ĐẶC TẢ
YÊU CẦU PHẦN MỀM
SOFTWARE REQUIREMENTS SPECIFICATION
WEBAPP QUẢN LÝ NHÂN SỰ &
ĐIỀU PHỐI LỊCH GIẢNG DẠY
VĂN PHÒNG HÀ NỘI
THUỘC TÍNH GIÁ TRỊ
Mã tài liệu SRS-HR-SCHED-HN-002
Phiên bản 2.0 - Bản baseline đề xuất để thẩm định
Ngày lập 04/11/2026
DRAFT FOR BUSINESS REVIEW - Chưa được chủ
Trạng thái
nghiệp vụ phê duyệt
Đơn vị áp dụng Văn phòng Hà Nội
SRS v1.0 PDF; workbook lịch 26-27; workbook thông tin
Nguồn đầu vào
giáo viên VP Hà Nội
LƯU Ý PHÊ DUYỆT Tài liệu này là bản đặc tả v2 được tổng hợp và mở rộng từ tài liệu/ dữ liệu đính kèm. Các nội dung có
nhãn CẦN XÁC NHẬN hoặc ĐỀ XUẤT V2 phải được chủ nghiệp vụ xác nhận trước khi chốt thiết kế chi tiết và phát triển
chính thức.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 1

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
KIỂM SOÁT TÀI LIỆU
Mục Nội dung
Làm căn cứ thống nhất nghiệp vụ, dữ liệu, chức năng, quy
Mục đích
tắc tính toán, kiểm thử và nghiệm thu Webapp.
Chủ nghiệp vụ, Ban quản lý, Giáo vụ, HR, Kế toán, Product
Đối tượng đọc Owner, BA, UI/UX, Backend, Frontend, QA và đơn vị triển
khai.
Mô tả baseline nghiệp vụ và thiết kế logic cho VP Hà Nội;
Phạm vi phiên bản chưa thay thế quyết định phê duyệt nghiệp vụ của doanh
nghiệp.
Tiếng Việt; tên bảng/trường, enum và mã kỹ thuật sử dụng
Ngôn ngữ
tiếng Anh không dấu.
Mọi thay đổi ảnh hưởng đến công, lương, CTP, dữ liệu lịch
Nguyên tắc cập nhật hoặc quyền truy cập phải có mã thay đổi, người duyệt và
ngày hiệu lực.
Lịch sử phiên bản
Phiên bản Ngày Người soạn Nội dung
Đặc tả ý tưởng hệ thống, phân
1.0 Theo tài liệu gốc Tài liệu nguồn hệ, một phần schema và quy
tắc tính.
Chuẩn hóa yêu cầu; bổ sung
workflow, state, RBAC, data
2.0 04/11/2026 OpenAI - bản hỗ trợ soạn thảo model, rulebook, migration,
NFR, test và danh sách cần
xác nhận.
Trạng thái thông tin trong tài liệu
Nhãn Ý nghĩa Cách sử dụng
Giữ thuật ngữ và giá trị nguồn; vẫn phải xác
[NGUỒN] Nội dung đã nêu trong PDF/Excel đính kèm.
nhận nếu nguồn có mâu thuẫn.
Thiết kế khuyến nghị nhằm biến ý tưởng Là baseline đề xuất; Product Owner/chủ
[ĐỀ XUẤT V2]
thành đặc tả triển khai. nghiệp vụ phê duyệt hoặc điều chỉnh.
Nguồn chưa đủ rõ, thiếu công thức hoặc mâu Không hardcode và không tự suy diễn trong
[CẦN XÁC NHẬN]
thuẫn. code trước khi có quyết định.
Đưa vào kế hoạch release; các tính năng
[MVP] Phạm vi ưu tiên cho bản triển khai đầu tiên.
ngoài MVP vẫn phải được thiết kế mở rộng.
MỤC LỤC
PHẦN PHẦN
1. Tổng quan và bối cảnh hệ thống 10. Yêu cầu giao diện và báo cáo
2. Mục tiêu, phạm vi và giả định 11. Migration, import/export và chuyển đổi dữ liệu
3. Thuật ngữ và mô hình nghiệp vụ 12. Yêu cầu phi chức năng, bảo mật và vận hành
4. Vai trò, người dùng và phân quyền 13. Kiểm thử và tiêu chí nghiệm thu
5. Quy trình nghiệp vụ TO-BE 14. Danh sách vấn đề cần xác nhận
6. Yêu cầu chức năng 15. Đề xuất phân kỳ triển khai
7. Quy tắc nghiệp vụ và công thức tính Phụ lục A. Danh mục dữ liệu và mã nghiệp vụ
8. Mô hình dữ liệu và quy tắc toàn vẹn Phụ lục B. Bộ test dữ liệu tính toán mẫu
9. Trạng thái và nhật ký vòng đời Phụ lục C. Checklist phê duyệt trước phát triển
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 2

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
1. TỔNG QUAN VÀ BỐI CẢNH HỆ THỐNG
1.1. Mục đích tài liệu
Tài liệu xác định yêu cầu đối với Webapp quản lý hồ sơ nhân sự, năng lực giảng dạy, phân công trường/lớp, điều phối
lịch tuần, xử lý lịch phát sinh, tra cứu lịch trống/bận (TCS), tính tiết quy đổi, công tác phí (CTP), thù lao CTV và đối soát
công theo kỳ. Tài liệu là căn cứ chung để thống nhất giữa đơn vị vận hành và đội xây dựng phần mềm.
1.2. Bối cảnh vận hành
Hệ thống phục vụ hoạt động đào tạo các môn Kỹ năng sống (KNS), STEM/STEM Robotics, Công dân số (CDS) và Trí
tuệ nhân tạo (AI) tại các trường Tiểu học và THCS trên địa bàn Hà Nội. Các pháp nhân được nêu trong tài liệu nguồn
gồm GAIA, NEWG và 8BC. Dữ liệu hiện được quản lý phân tán ở workbook hồ sơ giáo viên và workbook điều phối lịch
giảng dạy.
1.3. Hiện trạng dữ liệu nguồn đã rà soát
Nguồn Cấu trúc/quan sát Hàm ý với hệ thống mới
03 sheet: 20 hồ sơ đang làm việc, 12 hồ sơ
đã nghỉ việc và phân công xuống trường theo
Cần data profiling, chuẩn hóa mã/alias, phân
năm học. Có 6 hồ sơ đang dùng mã tạm “GV
THÔNG TIN GIÁO VIÊN VP HÀ NỘI.xlsx biệt nhân sự với tài khoản và phân công có
mới”; 9/20 hồ sơ đang làm việc có
hiệu lực theo thời gian.
official_date và 13/20 có company_email
trong snapshot rà soát.
Workbook có 41 sheet: 36 sheet tuần và các
Cần nhập theo batch, mapping các trường dữ
sheet phụ trợ/tổng hợp TCS, TỔNG TIẾT,
LỊCH HÀ NỘI - NH - 26-27 (1).xlsx liệu và kiểm thử đối soát. Không dùng bố cục
CTV, MAIL. Có 17 mã CTV khác nhau xuất
lưới làm mô hình database.
hiện trong lịch tuần được rà soát.
Kết quả công thức chỉ dùng đối soát tham
Trong snapshot rà soát có 228 ô #VALUE! ở
Lỗi công thức trong snapshot đã rà soát khảo; dữ liệu lịch gốc và quy tắc đã xác nhận
sheet TCS và 28 ô #N/A ở sheet TỔNG TIẾT.
mới là nguồn tính lại.
Có mã HN007/GVHN007; giá trị mã tạm như
Cần bảng alias và hàng đợi mapping chưa
Mã nhân sự và danh mục GV mới; tên trường, pháp nhân, môn học có
xác định; không tự ghép theo tên gần giống.
biến thể.
CTV xuất hiện trong workbook lịch nhưng hồ
sơ CTV chưa được thể hiện thành một danh Cần mô-đun hồ sơ CTV hoặc hồ sơ nhân sự
Danh sách CTV
mục hồ sơ đầy đủ trong workbook HR được có loại quan hệ/hợp đồng riêng.
cung cấp.
NGUYÊN TẮC MIGRATION Không import trực tiếp ô tổng hợp, màu sắc hoặc kết quả công thức như dữ liệu chuẩn.
Import bản ghi nguồn, giữ nguyên giá trị gốc, mapping sang danh mục chuẩn, ghi lỗi và đối soát trước khi cut-over.
1.4. Các điểm nghẽn cần giải quyết
 Ma trận lịch tuần quá rộng, nhiều ô trống, khó tra cứu và thao tác trên điện thoại.
 Nhân bản sheet thủ công, khó quản lý lịch sử thay đổi và tuần giao thoa tháng.
 Tên nhân sự, trường, phân hiệu, pháp nhân, lớp, môn học được nhập tự do dẫn đến sai lệch.
 Quy ước màu sắc đang mang ý nghĩa nghiệp vụ nhưng không phải dữ liệu có cấu trúc.
 TCS phụ thuộc công thức tra cứu phức tạp; kết quả dễ lỗi và khó truy nguyên.
 Tổng tiết, CTP và thù lao CTV cần được tính thống nhất từ dữ liệu lịch đã xác nhận.
2. MỤC TIÊU, PHẠM VI VÀ GIẢ ĐỊNH
2.1. Mục tiêu
 Tập trung dữ liệu nhân sự, trường/cơ sở, lớp, môn học, pháp nhân, chứng chỉ, lịch phân công và lịch giảng dạy trong
một nguồn dữ liệu chuẩn.
 Cho phép quản lý lịch cố định và lịch phát sinh theo từng ngày/tuần, có kiểm tra xung đột và lịch sử thay đổi.
 Tự động hóa TCS, quy đổi tiết, CTP và tổng hợp thù lao theo bộ quy tắc có phiên bản và hiệu lực.
 Quản lý vòng đời đơn nghỉ, dạy thay, dạy bù, bàn giao lớp và xác nhận tiết thực tế.
 Cho phép HR, Giáo vụ, Kế toán và giáo viên sử dụng góc nhìn phù hợp với quyền hạn.
 Loại bỏ phụ thuộc vào thao tác copy sheet; cho phép drill-down từ báo cáo về giao dịch gốc.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 3

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
2.2. Phạm vi trong release mục tiêu
Nhóm phạm vi Bao gồm
Hồ sơ giáo viên/CTV, trạng thái làm việc, hợp đồng, chứng chỉ, thông
HR & hồ sơ năng lực
tin liên hệ, thông tin phục vụ CTP, lịch sử thay đổi.
Pháp nhân, trường, phân hiệu, lớp, môn học, địa điểm, năm học, lịch
Master data
hoạt động/nghỉ của trường.
Phân công người phụ trách theo trường/lớp/môn/vai trò, thời gian
School assignment
hiệu lực, nhận lại lớp/bàn giao.
Lịch mẫu/định kỳ, lịch theo tuần, lịch phát sinh, copy tuần, kiểm tra
Scheduling
xung đột, công bố và hủy/sửa lịch.
Availability & leave TCS, lịch rảnh khai báo, đơn nghỉ phép, điều động dạy thay, đổi ca.
Trường báo nghỉ, nghĩa vụ dạy bù, dạy bù, dự giờ, chuyên môn, sự
Makeup & events
kiện/chuyên đề.
Xác nhận tiết thực hiện, tiết quy đổi, CTP, thù lao CTV, kỳ công, đối
Time & payroll
soát, duyệt và khóa kỳ.
Dashboard, báo cáo theo giáo viên/trường/môn/pháp nhân/kỳ, xuất
Reporting & export
Excel theo quyền.
Administration RBAC, audit log, thông báo, import batch và quản lý lỗi dữ liệu.
2.3. Ngoài phạm vi hoặc chưa cam kết trong baseline
 Tính lương tổng thể bao gồm thuế, bảo hiểm, khấu trừ hoặc tích hợp phần mềm kế toán/ERP: chưa có đủ yêu cầu
nguồn để đặc tả.
 GPS/QR điểm danh, tracking vị trí thời gian thực: chỉ là hướng mở rộng, chưa thuộc MVP.
 Tối ưu tuyến đường tự động bằng dữ liệu bản đồ thời gian thực: chỉ triển khai khi có quyết định tích hợp và nguồn dữ
liệu.
 Ứng dụng native iOS/Android riêng: baseline ưu tiên web responsive/PWA; cần xác nhận nếu có yêu cầu khác.
 Đồng bộ hai chiều với Google Sheets: mặc định không nằm trong phạm vi; Webapp là nguồn dữ liệu chính thức,
Excel/Sheets là kênh import/export.
2.4. Giả định và nguyên tắc
 Múi giờ vận hành: Asia/Ho_Chi_Minh; tiền tệ: VND; ngày giờ lưu và hiển thị theo quy ước thống nhất của hệ thống.
 Lịch làm việc có thể có Thứ Hai đến Chủ Nhật; TCS hiện tại được nguồn mô tả từ Thứ Hai đến Thứ Bảy. Phạm vi
Chủ Nhật cần xác nhận.
 Một giáo viên có thể mang nhiều vai trò hệ thống; một tài khoản có thể gắn một hoặc nhiều role và data scope.
 Lịch dự kiến, lịch được công bố và lịch thực tế hoàn thành là ba khái niệm khác nhau.
 Không xóa cứng lịch sử nhân sự, lịch dạy, bàn giao và kỳ công; dùng trạng thái, hiệu lực và audit log.
3. THUẬT NGỮ VÀ MÔ HÌNH NGHIỆP VỤ
Thuật ngữ Định nghĩa dùng trong SRS v2
Lịch định kỳ/lịch chính được sinh từ lịch mẫu hoặc từ kế hoạch được
REGULAR
phê duyệt.
Lịch phát sinh: dạy thay, dạy bù, dự giờ, chuyên môn, sự kiện,
ADHOC
chuyên đề hoặc hoạt động ngoài định kỳ.
Một hoạt động/buổi được xếp tại một thời điểm và địa điểm, có thể
Schedule Event
kéo dài một hoặc nhiều tiết.
Phân công một nhân sự vào một Schedule Event với vai trò cụ thể
Schedule Assignment
(giáo viên chính, hỗ trợ, CTV, báo cáo viên...).
Period Slot Tiết/slot thuộc một buổi; dùng để kiểm tra trùng giờ và tổng hợp tiết.
Conversion Code Mã quy đổi dùng để xác định giá trị tiết và quỹ tiết được cộng.
Bản chất hoạt động như TEACHING, SUBSTITUTE, MAKEUP,
Activity Type
OBSERVATION, TRAINING, EVENT, LEAVE, SCHOOL_OFF.
Nhãn vận hành DT, NB, NL, DG, CM...; không mặc nhiên đồng nghĩa
Business Tag
với mã quy đổi.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 4

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
Thuật ngữ Định nghĩa dùng trong SRS v2
Teacher/Credential/Calendar Availability hoặc ma trận lịch trống/bận
TCS
theo định nghĩa vận hành trong workbook.
Công tác phí di chuyển, tính theo điểm xuất phát, khoảng cách và
CTP
bảng mức phí có hiệu lực.
Kỳ tổng hợp công/thù lao; có ngày bắt đầu, ngày kết thúc và trạng
Pay Period
thái khóa.
Nghĩa vụ dạy bù được tạo ra khi trường báo nghỉ/tiết gốc cần bù;
Makeup Obligation
được liên kết đến một hoặc nhiều ca bù.
Quy trình bàn giao trách nhiệm lớp/môn từ nhân sự cũ sang nhân sự
Handover
mới, có thời gian hiệu lực.
3.1. Mô hình đối tượng khái niệm
Đối tượng Quan hệ chính
Có thể có 1 tài khoản hoặc không; có nhiều mã alias, hợp đồng,
Employee
chứng chỉ, địa điểm xuất phát và lịch sử công tác.
Trường có thể có nhiều phân hiệu/cơ sở; cơ sở có nhiều lớp; lớp
School / Campus / Class
thuộc niên khóa và có thể thay đổi theo năm.
Assignment Gắn nhân sự với trường/cơ sở/lớp/môn/vai trò trong khoảng hiệu lực.
Định nghĩa lịch định kỳ; sinh ra nhiều Schedule Event theo ngày thực
Schedule Template
tế.
Có nhiều Period Slot và một/nhiều Schedule Assignment; có thể liên
Schedule Event
kết event gốc/thay/bù.
Được áp dụng cho Assignment/hoạt động theo effective date; tạo
Conversion Rule
snapshot kết quả quy đổi.
Một chuyến/phiên di chuyển theo nhân sự và buổi, có thể bao gồm
Travel Trip
nhiều chặng; cách tính CTP cần chủ nghiệp vụ chốt.
Tập hợp các dòng công/tiết/CTP/thù lao của một kỳ; khi khóa sẽ đóng
Payroll Run
băng snapshot quy tắc và dữ liệu.
MÔ HÌNH LỊCH ĐỀ XUẤT V2 Không dùng một dòng lịch duy nhất để vừa đại diện hoạt động, vừa đại diện mọi giáo viên,
vừa đại diện mọi tiết. Tách Schedule Event, Schedule Assignment và Period Slot để hỗ trợ nhiều giáo viên trong một buổi,
nhiều tiết trong một buổi, và tính công theo nhân sự.
4. VAI TRÒ, NGƯỜI DÙNG VÀ PHÂN QUYỀN
4.1. Nhóm người dùng
Role đề xuất Đối tượng Nhiệm vụ chính
Quản lý cấu hình hệ thống, tài khoản, role, tham
SUPER_ADMIN Quản trị kỹ thuật/hệ thống số môi trường; không mặc nhiên xem dữ liệu
nhạy cảm nếu không được cấp quyền.
Duyệt phân công, cấu hình danh mục nghiệp vụ,
ADMIN / TEAM_LEAD Nhóm trưởng/chuyên môn duyệt nghỉ/bàn giao, phân công DG/CM, duyệt
và khóa kỳ theo ủy quyền.
Thiết lập kế hoạch năm học, copy lịch, điều phối
COORDINATOR Giáo vụ/điều phối
ca, xử lý DT/NB, xem TCS, công bố lịch.
Quản lý hồ sơ, hợp đồng,
HR Hành chính - nhân sự onboarding/offboarding, chứng chỉ, thông tin cá
nhân và thông báo nhân sự.
Xem dữ liệu công và mức chi theo phạm vi,
PAYROLL Kế toán lương/đối soát tạo/đối soát payroll run, xuất báo cáo, đề nghị
điều chỉnh.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 5

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
| Role đề xuất |     | Đối tượng |     | Nhiệm vụ chính |     |
| ------------ | --- | --------- | --- | -------------- | --- |
Xem lịch cá nhân, cập nhật yêu cầu nghỉ/đổi ca,
TEACHER Giáo viên cơ hữu/báo cáo viên xác nhận hoạt động đã thực hiện, gửi phản
hồi/đề nghị điều chỉnh.
Cập nhật availability, xem lịch được phân công,
| COLLABORATOR |     | CTV |     | xác nhận hoạt động, xem bảng đối soát CTV  |     |
| ------------ | --- | --- | --- | ------------------------------------------ | --- |
được phép.
Chỉ xem lịch của trường/lớp được gán; chưa
SCHOOL_VIEWER (optional) Đầu mối trường/đối tác nếu được cấp tài khoản nằm trong role bắt buộc của nguồn, cần quyết
định nếu triển khai.
4.2. Nguyên tắc phân quyền
 RBAC kết hợp data scope: role quyết định hành động; data scope giới hạn pháp nhân, trường, lớp, nhân sự hoặc
đơn vị được truy cập.
Một nhân sự có thể kiêm nhiệm nhiều vai trò. Không dùng một cột ENUM duy nhất trên employees để biểu diễn role

hệ thống.
 Tách quyền xem/sửa/xóa mềm/duyệt/công bố/khóa kỳ/xuất dữ liệu; quyền xuất CCCD, tài khoản ngân hàng là quyền
nhạy cảm riêng.
 Người tạo không được tự duyệt giao dịch nhạy cảm của chính mình trừ khi có chính sách maker-checker được phê
duyệt.
Quyền hiệu lực có thời hạn và phải được thu hồi khi nhân sự thay đổi vị trí hoặc nghỉ việc.

4.3. Ma trận quyền baseline
| Chức năng | Admin | Giáo vụ | HR/Payroll | GV  | CTV |
| --------- | ----- | ------- | ---------- | --- | --- |
Xem/sửa danh mục
| trường, lớp, môn, pháp  | Có  | Theo phân công | Không | Không | Không |
| ----------------------- | --- | -------------- | ----- | ----- | ----- |
nhân
Xem/sửa hồ sơ HR đầy  Chỉ hồ sơ cá nhân giới  Chỉ hồ sơ cá nhân giới
|     | Theo quyền | Không | Có  |                       |                       |
| --- | ---------- | ----- | --- | --------------------- | --------------------- |
| đủ  |            |       |     | hạn                   | hạn                   |
|     |            |       |     | Chỉ dữ liệu của mình  | Chỉ dữ liệu của mình  |
Xem CCCD/tài khoản
ngân hàng Theo quyền nhạy cảm Không Có theo nhiệm vụ nếu chính sách cho  nếu chính sách cho
|                     |        |               |       | phép  | phép  |
| ------------------- | ------ | ------------- | ----- | ----- | ----- |
| Tạo/sửa lịch nháp   | Có     | Có            | Không | Không | Không |
| Duyệt/công bố lịch  | Có     | Theo ủy quyền | Không | Không | Không |
| Tạo đơn nghỉ/đổi ca | Có thể | Có thể        | Không | Có    | Có    |
| Duyệt nghỉ/dạy thay | Có     | Theo ủy quyền | Không | Không | Không |
Xem TCS toàn văn
|     | Có  | Có  | Theo quyền | Không | Không |
| --- | --- | --- | ---------- | ----- | ----- |
phòng
Xác nhận tiết đã thực
hiện Theo quyền Theo quyền Không Có lịch của mình Có lịch của mình
Xem bảng công cá nhân Có Theo quyền Có Có của mình Có của mình
Xem toàn bộ bảng công  Theo quyền Không Có theo phạm vi Không Không
và đơn giá
| Điều chỉnh công/CTP  |               |       | Đề nghị/duyệt theo tách  |       |       |
| -------------------- | ------------- | ----- | ------------------------ | ----- | ----- |
|                      | Theo ủy quyền | Không |                          | Không | Không |
| sau đối soát         |               |       | quyền                    |       |       |
Khóa/mở kỳ công Theo phân quyền Không Có nếu được ủy quyền Không Không
Log HR/payroll theo
| Audit log | Có theo quyền | Log lịch trong phạm vi |     | Không | Không |
| --------- | ------------- | ---------------------- | --- | ----- | ----- |
quyền
Ma trận trên là baseline đề xuất, không phải quyết định tổ chức đã được xác nhận. Cần chỉ định role nào được duyệt từng loại yêu cầu
và phạm vi dữ liệu cụ thể.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 6

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
5. QUY TRÌNH NGHIỆP VỤ TO-BE
5.1. Vòng đời nhân sự (HR Lifecycle)
| Bước | Vai trò | Xử lý và kết quả |
| ---- | ------- | ---------------- |
Tạo hồ sơ nhân sự, mã chuẩn, loại lao động,
HR-01 Tiếp nhận HR thông tin liên hệ, địa chỉ hiện tại, ngày nhận
việc và tài liệu cần thiết.
Kiểm tra trùng CCCD/email/điện thoại/mã
| HR-02 Xác thực | HR/Admin |     |
| -------------- | -------- | --- |
alias; trạng thái hồ sơ DRAFT → VERIFIED.
Tạo hợp đồng, ngày bắt đầu/kết thúc, ngày
HR-03 Hợp đồng/thử việc HR chính thức dự kiến; hệ thống nhắc trước 7
ngày theo yêu cầu nguồn (cần cấu hình).
Ghi nhận bằng cấp/chứng chỉ, ngày cấp/hết
| HR-04 Năng lực | HR/Team Lead |     |
| -------------- | ------------ | --- |
hạn, file và trạng thái xác minh.
Tạo user, gắn nhiều role và data scope; kích
| HR-05 Cấp tài khoản | Admin |     |
| ------------------- | ----- | --- |
hoạt/khóa theo quy trình.
Ghi ngày thôi việc; cảnh báo các lớp/ca sắp
HR-06 Nghỉ việc HR/Admin tới; tạo danh sách bàn giao; khóa đăng nhập
nhưng giữ lịch sử.
Chuyển hồ sơ sang RESIGNED/ARCHIVED;
HR-07 Lưu trữ Hệ thống bảo toàn giao dịch, payroll đã khóa và audit
log.
5.2. Phân công giáo viên xuống trường và bàn giao lớp
1. Khởi tạo năm học, trường, phân hiệu, lớp, môn và pháp nhân phụ trách.
2. Tạo assignment với nhân sự, vai trò (MAIN_TEACHER / SUPPORT_TEACHER / COLLABORATOR), thời gian hiệu
lực và phạm vi lớp.
3. Kiểm tra nhân sự đang hoạt động, loại hợp đồng, chứng chỉ và xung đột assignment trong cùng khoảng hiệu lực.
4. Gửi duyệt nếu chính sách yêu cầu; sau phê duyệt, assignment trở thành nguồn gợi ý để tạo lịch REGULAR.
5. Khi bàn giao: tạo handover request, chỉ rõ các lớp/môn, người cũ, người mới, thời điểm hiệu lực, lý do và người
duyệt.
6. Sau khi duyệt, cập nhật phân công tương lai kể từ ngày hiệu lực; không tự sửa hoặc ghi đè lịch đã hoàn thành/kỳ
công đã khóa.
7. Ghi nhật ký bàn giao để tra cứu chuỗi kế nhiệm A → B → C.
5.3. Thiết lập lịch định kỳ và copy tuần
| Bước               | Mô tả                                              | Kiểm soát bắt buộc                              |
| ------------------ | -------------------------------------------------- | ----------------------------------------------- |
|                    | Tạo lịch mẫu theo trường/cơ sở/lớp/môn, ngày       | Kiểm tra lớp tồn tại, assignment còn hiệu lực,  |
| SC-01 Tạo template | trong tuần, buổi, tiết, khung giờ, nhân sự và vai  |                                                 |
chứng chỉ và thời lượng hợp lệ.
trò.
|     | Chọn tuần đích hoặc khoảng ngày để sinh lịch  | Không copy ADHOC tạm thời, đơn nghỉ hoặc  |
| --- | --------------------------------------------- | ----------------------------------------- |
SC-02 Sinh tuần
|     | REGULAR từ template/tuần chuẩn.                     | dạy thay cũ; không tạo trùng event.            |
| --- | --------------------------------------------------- | ---------------------------------------------- |
|     | Hiển thị số ca tạo mới, ca bỏ qua, ca có thay đổi,  | Người dùng xác nhận trước khi ghi. Có thể hủy  |
SC-03 Preview
|     | xung đột và dữ liệu không map được.             | toàn bộ thao tác.                              |
| --- | ----------------------------------------------- | ---------------------------------------------- |
|     | Ghi lịch với batch_id, source_template/version  | Idempotent: chạy lại cùng template/tuần không  |
SC-04 Commit
|     | và người tạo.                                | tạo duplicate.                              |
| --- | -------------------------------------------- | ------------------------------------------- |
|     | Admin/Coordinator được ủy quyền duyệt, công  | Sau công bố, chỉnh sửa quan trọng phải lưu  |
SC-05 Duyệt/công bố
|     | bố lịch cho các bên. | version và thông báo. |
| --- | -------------------- | --------------------- |
5.4. Kiểm tra xung đột lịch
| Loại xung đột | Điều kiện phát hiện                           | Kết quả xử lý                                 |
| ------------- | --------------------------------------------- | --------------------------------------------- |
|               | Một nhân sự được gán hai hoạt động có khoảng  | BLOCK nếu trùng tuyệt đối; cảnh báo/cho phép  |
Nhân sự trùng giờ
|     | thời gian giao nhau. | override chỉ khi có lý do và quyền. |
| --- | -------------------- | ----------------------------------- |
Cùng lớp/cùng môn hoặc cùng lớp có hai sự
BLOCK hoặc yêu cầu xác nhận theo chính sách
| Lớp trùng giờ | kiện không tương thích trong khoảng thời gian  |     |
| ------------- | ---------------------------------------------- | --- |
trường.
giao nhau.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 7

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
| Loại xung đột | Điều kiện phát hiện                             | Kết quả xử lý                           |
| ------------- | ----------------------------------------------- | --------------------------------------- |
|               | Thời gian giữa hai hoạt động nhỏ hơn thời gian  | WARNING/BLOCK theo mức cấu hình; nguồn  |
Địa điểm và di chuyển di chuyển tối thiểu giữa hai địa điểm. khoảng cách/thời gian phải được xác định.
|                     | Nhân sự thiếu chứng chỉ bắt buộc hoặc đã hết  | BLOCK mặc định; quyền override phải có lý do  |
| ------------------- | --------------------------------------------- | --------------------------------------------- |
| Chứng chỉ/điều kiện | hạn tại ngày giảng dạy.                       | và phê duyệt.                                 |
Hợp đồng/trạng thái Ngày dạy ngoài thời gian hợp đồng hoặc nhân  BLOCK, trừ ngoại lệ có phê duyệt và có hiệu lực
|     | sự đã nghỉ việc. | pháp lý. |
| --- | ---------------- | -------- |
5.5. Nghỉ phép và dạy thay (DT)
| Trạng thái đơn nghỉ | Ý nghĩa                 | Chuyển tiếp hợp lệ            |
| ------------------- | ----------------------- | ----------------------------- |
| DRAFT               | Người gửi đang lập đơn. | SUBMITTED hoặc CANCELLED      |
| SUBMITTED           | Đã gửi chờ duyệt.       | APPROVED, REJECTED, WITHDRAWN |
APPROVED Đã duyệt; các ca bị ảnh hưởng chuyển sang nhu  CLOSED sau khi xử lý; CANCEL_REQUESTED
|     | cầu bố trí thay hoặc trạng thái phù hợp. | nếu muốn rút |
| --- | ---------------------------------------- | ------------ |
REJECTED Không được chấp thuận. Có thể tạo đơn mới; không tự quay về
APPROVED
| WITHDRAWN | Người gửi rút trước khi duyệt.                | Kết thúc                                     |
| --------- | --------------------------------------------- | -------------------------------------------- |
|           | Đã xử lý xong, các ca liên quan đã được giải  | Không sửa trực tiếp; mở case điều chỉnh nếu  |
| CLOSED    | quyết.                                        | cần                                          |
8. Giáo viên gửi đơn theo ngày/buổi/tiết, lý do và tài liệu đính kèm nếu có.
9. Giáo vụ/Approver xem các ca chịu ảnh hưởng và phê duyệt/từ chối.
10. Sau duyệt, hệ thống tạo danh sách ca cần dạy thay; ca gốc vẫn được giữ, không xóa.
11. TCS gợi ý nhân sự theo lịch rảnh, chứng chỉ, hợp đồng, địa bàn và khả năng di chuyển; kết quả chỉ là gợi ý, người
có quyền chọn và chịu trách nhiệm.
12. Khi phân công người thay, tạo Schedule Assignment mới loại SUBSTITUTE, liên kết event gốc và lưu nhân sự bị
thay.
13. Giáo viên thay xác nhận hoạt động thực tế; payroll ghi nhận đúng người thực hiện theo quy tắc đã duyệt.
14. Nếu người thay từ chối hoặc ca thay bị hủy, yêu cầu quay lại hàng đợi điều phối và gửi thông báo.
5.6. Trường báo nghỉ và dạy bù (NB)
15. Giáo vụ ghi nhận thông báo trường nghỉ, chọn các ca/lớp/ngày bị ảnh hưởng và bằng chứng/ghi chú.
16. Hệ thống chuyển ca gốc sang SCHOOL_OFF/CANCELLED_BY_SCHOOL theo trạng thái; không ghi nhận như tiết
đã dạy.
17. Tạo Makeup Obligation cho phần nội dung/tiết cần bù, liên kết tới ca gốc và trạng thái OPEN.
18. Khi xếp lịch bù, tạo event ADHOC với tag NB và liên kết một hoặc nhiều obligation; hỗ trợ bù một phần hoặc nhiều
ca nếu chủ nghiệp vụ cho phép.
19. Khi ca bù hoàn thành và được xác nhận, cập nhật obligation PARTIALLY_FULFILLED/FULFILLED; ngăn tính trùng
nghĩa vụ.
20. Báo cáo phải chỉ ra ngày nghỉ gốc, ca bù, nhân sự thực hiện và số tiết đã xử lý/còn lại.
CẦN XÁC NHẬN  Một tiết gốc có thể được bù thành nhiều ca hay không; có được gộp nhiều tiết gốc vào một ca bù hay
không; ai có quyền xác nhận nghĩa vụ đã hoàn tất.
5.7. Sự kiện, chuyên đề, dự giờ và sinh hoạt chuyên môn
Các hoạt động BCTH, BCCĐ, ĐP, HN, KI, BN, HT, TQ, CA, DG, CM được tạo ở tầng ADHOC. Mỗi event phải có loại
hoạt động, người phụ trách, thời gian, địa điểm/online, đơn vị tổ chức, ghi chú, quy tắc quy đổi và bộ đếm sự kiện. Không
sử dụng màu sắc hoặc nội dung notes làm nguồn tính công.
5.8. Availability, TCS và đổi ca
Availability khai báo của CTV/giáo viên được lưu theo tuần, ngày, buổi hoặc khoảng giờ; có trạng thái

DRAFT/SUBMITTED/APPROVED (nếu cần duyệt).
 TCS tính trạng thái từ lịch đã công bố/được duyệt và các hạn chế availability, leave, hợp đồng, chứng chỉ. Lịch
nháp/hủy không được tính bận.
 TCS cung cấp lý do vì sao nhân sự không khả dụng: trùng lịch, không có chứng chỉ, nghỉ, không có hợp đồng hiệu
lực, không đủ thời gian di chuyển.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 8

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
 Yêu cầu đổi ca phải ghi người đề nghị, ca hiện tại, ca mong muốn, người nhận đổi (nếu có), lý do và trạng thái phê
duyệt.
 Đổi ca chỉ có hiệu lực sau phê duyệt và cập nhật đồng bộ các phân công bị ảnh hưởng.
5.9. Xác nhận tiết dạy và xử lý sai lệch
 Sau hoạt động, nhân sự được phân công xác nhận đã thực hiện, vắng, không thực hiện hoặc báo sai thông tin.
 Giáo vụ có thể xác minh các ca bất thường, trường báo nghỉ, dạy thay hoặc sự kiện.
 Chỉ ca đủ điều kiện xác nhận mới được đưa vào payroll; lịch đã lên nhưng chưa diễn ra không tự động được coi là
công.
 Mọi sửa đổi sau xác nhận phải có lý do, người duyệt và audit log; kỳ đã khóa chỉ được điều chỉnh bằng payroll
adjustment.
5.10. Đối soát và khóa kỳ công
Giai đoạn Vai trò Hành vi
Thu thập các event/assignment đủ điều kiện
OPEN Hệ thống/Payroll
trong kỳ.
Kiểm tra tiết, quỹ môn, event counter, CTP,
RECONCILING Payroll/HR
ca CTV; xem drill-down và cảnh báo.
Xác nhận dữ liệu đã kiểm tra; khóa các chỉnh
REVIEWED Người duyệt
sửa trực tiếp hoặc yêu cầu sửa trước duyệt.
APPROVED Người có thẩm quyền Duyệt kết quả công/thù lao.
Đóng băng snapshot dữ liệu và rule version;
LOCKED Payroll/Admin được ủy quyền không sửa trực tiếp giao dịch nguồn ảnh
hưởng kỳ.
Ghi nhận ngày thanh toán/mã tham chiếu
PAID (optional) Payroll
thanh toán nếu phạm vi bao gồm.
Mặc định đề xuất: mỗi payroll run lưu snapshot rule version, đơn giá, kết quả tính và danh sách giao dịch nguồn. Mở
khóa là thao tác đặc quyền, phải có lý do và audit log. Nếu kỳ đã thanh toán, sai lệch xử lý qua adjustment ở kỳ hiện tại
hoặc theo chính sách kế toán được phê duyệt.
6. YÊU CẦU CHỨC NĂNG
Các yêu cầu dưới đây có mã để truy vết từ SRS sang thiết kế, test case và nghiệm thu. Mức ưu tiên: MUST = bắt buộc
cho vận hành cốt lõi; SHOULD = nên có trong release đầu; COULD = mở rộng.
6.1. Tài khoản và phân quyền
Mã Mức Yêu cầu
Hệ thống cho phép tạo, kích hoạt, khóa và vô
FR-IAM-001 MUST
hiệu hóa tài khoản độc lập với hồ sơ nhân sự.
Một user có thể được gán nhiều role và một
FR-IAM-002 MUST hoặc nhiều data scope; mọi thay đổi quyền được
audit.
Hệ thống kiểm soát quyền xem/sửa/duyệt/công
FR-IAM-003 MUST
bố/xuất/khóa theo chức năng và dữ liệu.
Hỗ trợ đăng nhập qua email doanh nghiệp/SSO
FR-IAM-004 SHOULD nếu hạ tầng được phê duyệt; nếu không thì dùng
cơ chế đăng nhập nội bộ an toàn.
6.2. Hồ sơ HR và năng lực
Mã Mức Yêu cầu
Tạo, sửa, xem và lưu trữ hồ sơ nhân sự; phân
FR-HR-001 MUST
loại cơ hữu/CTV và trạng thái làm việc.
Quản lý mã nhân sự chuẩn và nhiều mã alias;
FR-HR-002 MUST
cấm trùng mã chuẩn.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 9

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
| Mã  | Mức | Yêu cầu |
| --- | --- | ------- |
Quản lý hợp đồng, ngày nhận việc, ngày chính
FR-HR-003 MUST thức, ngày hết hạn, ngày nghỉ việc và lịch sử
hợp đồng.
Quản lý bằng cấp/chứng chỉ theo loại, ngày
FR-HR-004 MUST cấp/hết hạn, file, trạng thái xác minh và người
xác minh.
Quản lý địa chỉ xuất phát mặc định, các điểm
FR-HR-005 MUST xuất phát thay thế và lịch sử hiệu lực phục vụ
CTP.
Offboarding khóa tài khoản, hiển thị ca/lớp
| FR-HR-006 | MUST |     |
| --------- | ---- | --- |
tương lai cần bàn giao và giữ lịch sử.
Nhắc HR trước 7 ngày tới hạn thử việc/hợp
| FR-HR-007 | SHOULD |     |
| --------- | ------ | --- |
đồng theo cấu hình và người nhận.
Hỗ trợ hồ sơ CTV và thuộc tính hợp đồng/đơn
| FR-HR-008 | MUST |     |
| --------- | ---- | --- |
giá/availability riêng.
6.3. Master data và phân công
| Mã        | Mức  | Yêu cầu                                       |
| --------- | ---- | --------------------------------------------- |
| FR-MD-001 | MUST | Quản lý pháp nhân, trường, phân hiệu/campus,  |
địa điểm, lớp, môn, năm học và lịch trường.
| FR-MD-002 | MUST | Mỗi danh mục có mã duy nhất, trạng thái hoạt  |
| --------- | ---- | --------------------------------------------- |
động, ngày hiệu lực và alias nếu cần.
Phân công giáo viên chính/hỗ trợ/CTV theo
| FR-ASG-001 | MUST |     |
| ---------- | ---- | --- |
trường, campus, lớp, môn và khoảng hiệu lực.
Kiểm tra điều kiện chứng chỉ và hợp đồng tại
| FR-ASG-002 | MUST |     |
| ---------- | ---- | --- |
thời điểm phân công.
Tạo, duyệt và tra cứu lịch sử bàn giao lớp; hỗ trợ
| FR-ASG-003 | MUST |     |
| ---------- | ---- | --- |
nhiều lần bàn giao.
Báo cáo lớp/môn chưa có nhân sự phụ trách
| FR-ASG-004 | SHOULD |     |
| ---------- | ------ | --- |
hoặc chưa có lịch tương ứng.
6.4. Scheduling
| Mã  | Mức | Yêu cầu |
| --- | --- | ------- |
Tạo lịch mẫu REGULAR theo
FR-SCH-001 MUST trường/lớp/môn/ngày/buổi/tiết/khung giờ/nhân
sự.
Sinh lịch theo ngày hoặc tuần từ template/tuần
| FR-SCH-002 | MUST |     |
| ---------- | ---- | --- |
gốc và ghi lại nguồn sinh.
Copy tuần có preview, kiểm tra xung đột, log kết
| FR-SCH-003 | MUST |     |
| ---------- | ---- | --- |
quả và cơ chế chống tạo trùng.
Tạo, sửa, hủy event ADHOC; hỗ trợ
| FR-SCH-004 | MUST | SUBSTITUTE, MAKEUP, OBSERVATION,  |
| ---------- | ---- | --------------------------------- |
TRAINING, EVENT.
FR-SCH-005 MUST Kiểm tra trùng giờ nhân sự/lớp và thời gian di
chuyển khi có dữ liệu đủ.
Lưu lịch sử phiên bản và người sửa; phân biệt
| FR-SCH-006 | MUST | DRAFT, PUBLISHED, CANCELLED,  |
| ---------- | ---- | ----------------------------- |
COMPLETED.
Hỗ trợ nhiều nhân sự trong một event và nhiều
| FR-SCH-007 | MUST |     |
| ---------- | ---- | --- |
period slot trong một buổi.
Công bố lịch và gửi thông báo tới người chịu ảnh
| FR-SCH-008 | SHOULD |     |
| ---------- | ------ | --- |
hưởng.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 10

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
6.5. Leave, substitute, makeup, availability
| Mã  | Mức | Yêu cầu |
| --- | --- | ------- |
Tạo, gửi, duyệt, từ chối, rút đơn nghỉ; liên kết
| FR-LVM-001 | MUST |     |
| ---------- | ---- | --- |
các ca bị ảnh hưởng.
Sinh nhu cầu dạy thay từ ca gốc; liên kết ca thay
| FR-LVM-002 | MUST |     |
| ---------- | ---- | --- |
và nhân sự bị thay.
Ghi nhận trường báo nghỉ và tạo makeup
| FR-LVM-003 | MUST |     |
| ---------- | ---- | --- |
obligation có trạng thái.
Liên kết ca dạy bù với obligation gốc; kiểm soát
| FR-LVM-004 | MUST |     |
| ---------- | ---- | --- |
bù một phần/đủ theo chính sách.
Cho phép giáo viên/CTV khai báo availability
| FR-LVM-005 | SHOULD | theo ngày/buổi/khoảng giờ. |
| ---------- | ------ | -------------------------- |
Tạo và duyệt yêu cầu đổi ca; chỉ áp dụng sau
| FR-LVM-006 | SHOULD | duyệt. |
| ---------- | ------ | ------ |
6.6. TCS, conversion, CTP, CTV
| Mã  | Mức | Yêu cầu |
| --- | --- | ------- |
Tính TCS theo lịch đủ điều kiện, leave,
FR-CAL-001 MUST availability, hợp đồng, chứng chỉ và ngày/khung
giờ.
FR-CAL-002 MUST Hiển thị lý do bận/không phù hợp và bộ lọc nhân
sự thay thế.
FR-CAL-003 MUST Quản lý conversion rules theo phiên bản, ngày
hiệu lực và quỹ tiết/bộ đếm.
FR-CAL-004 MUST Tính tiết quy đổi và lưu snapshot đầu vào/đầu ra
của mỗi assignment.
Quản lý bảng CTP theo điểm xuất phát, khoảng
| FR-CAL-005 | MUST |     |
| ---------- | ---- | --- |
cách và thời gian hiệu lực.
Tính và lưu từng travel allowance item; cho phép
| FR-CAL-006 | MUST |     |
| ---------- | ---- | --- |
override có lý do/phê duyệt.
Tính thù lao CTV theo buổi và rule version; tách
| FR-CAL-007 | MUST |     |
| ---------- | ---- | --- |
ca >=2 tiết và <2 tiết.
Drill-down mọi chỉ số công/CTP/thù lao về event,
| FR-CAL-008 | MUST |     |
| ---------- | ---- | --- |
assignment, period và rule đã áp dụng.
6.7. Payroll và báo cáo
| Mã  | Mức | Yêu cầu |
| --- | --- | ------- |
FR-PAY-001 MUST Quản lý kỳ công theo start_date/end_date và loại
kỳ.
| FR-PAY-002 | MUST | Tạo payroll run, tổng hợp theo giáo  |
| ---------- | ---- | ------------------------------------ |
viên/CTV/môn/quỹ tiết/event counter/CTP.
Đối soát và xử lý ngoại lệ trước khi duyệt/khóa
| FR-PAY-003 | MUST |     |
| ---------- | ---- | --- |
kỳ.
Khóa kỳ và snapshot rule, dữ liệu, đơn giá; ngăn
| FR-PAY-004 | MUST |     |
| ---------- | ---- | --- |
sửa trực tiếp sau khóa.
Tạo adjustment có liên kết payroll run gốc và lý
| FR-PAY-005 | SHOULD |     |
| ---------- | ------ | --- |
do.
Dashboard KPI có định nghĩa công thức và thời
| FR-RPT-001 | MUST |     |
| ---------- | ---- | --- |
điểm dữ liệu.
Báo cáo tuần/tháng theo ngày dạy thực tế; xử lý
| FR-RPT-002 | MUST |     |
| ---------- | ---- | --- |
tuần giao thoa tháng bằng teaching_date.
Xuất báo cáo theo template/role; ghi audit log
| FR-RPT-003 | MUST |     |
| ---------- | ---- | --- |
cho thao tác xuất dữ liệu.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 11

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
6.8. Import, audit, notification
| Mã  |     | Mức | Yêu cầu |     |
| --- | --- | --- | ------- | --- |
Import workbook bằng batch, mapping cột/danh
| FR-IMP-001 |     | MUST |     |     |
| ---------- | --- | ---- | --- | --- |
mục và xem trước kết quả trước khi commit.
Ghi từng dòng lỗi/cảnh báo; hỗ trợ sửa mapping
| FR-IMP-002 |     | MUST |     |     |
| ---------- | --- | ---- | --- | --- |
và chạy lại mà không tạo bản ghi trùng.
Audit mọi thay đổi quan trọng với before/after,
| FR-AUD-001 |     | MUST |     |     |
| ---------- | --- | ---- | --- | --- |
actor, timestamp, source, reason.
Thông báo lịch mới/đổi/hủy, nghỉ, dạy thay, dạy
| FR-NOT-001 |     | SHOULD |     |     |
| ---------- | --- | ------ | --- | --- |
bù, nhắc HR và khóa kỳ.
Người dùng có thể xem trạng thái đã gửi/đã đọc;
FR-NOT-002 SHOULD kênh email/push phụ thuộc tích hợp được duyệt.
7. QUY TẮC NGHIỆP VỤ VÀ CÔNG THỨC TÍNH
7.1. Nguyên tắc quản lý rule
 Không hardcode mức quy đổi/đơn giá vào mã nguồn. Mỗi rule có version, effective_from/effective_to, trạng thái và
người duyệt.
 Khi tạo payroll run, snapshot rule version và kết quả tính để việc chỉnh rule tương lai không làm thay đổi kỳ đã khóa.
 Tách Activity Type, Business Tag, Conversion Code và Payroll Category thành các trường riêng.
 Mọi override bằng tay phải có giá trị trước/sau, lý do, người đề nghị, người duyệt và thời điểm.
7.2. Danh mục quy đổi tiết từ tài liệu gốc
Mã quy đổi Mô tả theo nguồn Giá trị Quỹ cộng dồn Bộ đếm sự kiện
| K   | Dạy chính KNS | 1.00 | KNS | Không |
| --- | ------------- | ---- | --- | ----- |
Dạy chính STEM/STEM
| S   |     | 1.00 | STEM | Không |
| --- | --- | ---- | ---- | ----- |
Robotics
| C    | Dạy chính CDS            | 1.00 | CDS  | Không   |
| ---- | ------------------------ | ---- | ---- | ------- |
| A    | Dạy chính AI             | 1.00 | AI   | Không   |
| K/2  | Hỗ trợ teambuilding KNS  | 0.50 | KNS  | Không   |
| S/2  | Hỗ trợ teambuilding STEM | 0.50 | STEM | Không   |
| C/2  | Hỗ trợ teambuilding CDS  | 0.50 | CDS  | Không   |
| A/2  | Hỗ trợ teambuilding AI   | 0.50 | AI   | Không   |
| BCTH | Báo cáo viên tập huấn    | 3.00 | KNS  | +1 BCTH |
Báo cáo viên tập huấn hệ số
| BCTH/2 |     | 2.00 | KNS | Không |
| ------ | --- | ---- | --- | ----- |
2.0
Báo cáo viên chuyên đề
| BCCĐ |     | 3.00 | KNS | +1 BCCĐ |
| ---- | --- | ---- | --- | ------- |
trường
Điều phối chương trình/sự
| ĐP  | kiện                    | 3.00 | KNS | +1 ĐP |
| --- | ----------------------- | ---- | --- | ----- |
| HN  | Hoạt náo sự kiện        | 2.00 | KNS | +1 HN |
| KI  | Diễn xuất kịch/múa/nhảy | 2.00 | KNS | +1 KI |
Kỹ thuật âm thanh/bấm nhạc
| BN  | sự kiện                 | 2.00 | KNS | Không |
| --- | ----------------------- | ---- | --- | ----- |
| HT  | Hỗ trợ vận hành sự kiện | 1.00 | KNS | +1 HT |
| TQ  | Trao tặng quà           | 1.00 | KNS | Không |
| CA  | Chụp ảnh tư liệu        | 1.00 | KNS | Không |
Sinh hoạt chuyên môn/dự giờ
| CM / trống |     | 0.00 | NONE | Không |
| ---------- | --- | ---- | ---- | ----- |
hoặc mã trống theo nguồn
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 12

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
CẦN XÁC NHẬN - MÃ VÀ HỆ SỐ  Nguồn Excel được mô tả có thể chứa CM = -0.01 và TC = -0.02 trong một số công
thức, trong khi PDF quy định CM/trống = 0.00. Cần chủ nghiệp vụ giải thích CM, TC, vai trò của số âm và xác nhận các mã
chuẩn trước khi import rule.
7.3. Tách loại hoạt động và mã quy đổi
| Trường | Ví dụ | Ý nghĩa |
| ------ | ----- | ------- |
TEACHING, SUBSTITUTE, MAKEUP,
|     | OBSERVATION, TRAINING_CM,  | Mô tả bản chất nghiệp vụ; dùng điều khiển  |
| --- | -------------------------- | ------------------------------------------ |
activity_type
|     | EVENT_WORKSHOP, TEACHER_LEAVE,  | workflow và điều kiện payroll. |
| --- | ------------------------------- | ------------------------------ |
SCHOOL_OFF
Nhãn hiển thị/ghi chú điều phối. Không nhất
| business_tag | DT, NB, NL, DG, CM |     |
| ------------ | ------------------ | --- |
thiết có giá trị quy đổi riêng.
conversion_code K, S, C, A, K/2, BCTH, BCCĐ... Chọn quy tắc tiết và quỹ cộng dồn.
DRAFT, PUBLISHED, CANCELLED,
| status | COMPLETED...             | Vòng đời giao dịch.                    |
| ------ | ------------------------ | -------------------------------------- |
|        | ELIGIBLE, NOT_ELIGIBLE,  | Kết luận có được tính vào kỳ công hay  |
payroll_eligibility
|     | PENDING_REVIEW | không. |
| --- | -------------- | ------ |
Đề xuất: NB được quản lý như activity_type MAKEUP và/hoặc business_tag NB; mã quy đổi thực tế vẫn là K/S/C/A hoặc
mã event phù hợp. DT/NL/DG/CM cũng không được lưu chung trong conversion_code nếu chúng không định nghĩa hệ
số quy đổi độc lập. Cần chủ nghiệp vụ xác nhận phân loại cuối cùng.
7.4. Logic TCS
Theo PDF nguồn, trạng thái bận trong một buổi được xác định bằng tổng quỹ tiết quy đổi:
CÔNG THỨC NGUỒN  Tổng tiết buổi = TTKNS + TTSTEM + TTCDS + TTAI. Nếu tổng > 0.4: BẬN. Nếu tổng <= 0.4:
TRỐNG.
Quy định triển khai đề xuất: TCS chỉ tính assignment thuộc event ở trạng thái hợp lệ và đã được duyệt/công bố; loại trừ
event đã hủy, draft, school-off và các ca không chiếm availability theo quy định. TCS cần có hai chế độ: (1) trạng thái
tổng quan theo buổi theo ngưỡng 0.4 của nguồn; (2) kiểm tra chính xác slot/time overlap để điều động. Không được coi
trạng thái TRỐNG theo ngưỡng buổi là bằng chứng chắc chắn rằng mọi tiết trong buổi đều trống.
CẦN XÁC NHẬN TCS  Nguồn PDF nêu TCS từ Thứ Hai đến Thứ Bảy, trong khi lưới lịch có Thứ Hai đến Chủ Nhật. Cần
chốt Chủ Nhật; xác nhận các mã có credit âm/0; quy định sự kiện/CM/DG có làm bận hay không; và availability do CTV khai
báo có ưu tiên hơn lịch trống tính toán không.
7.5. Bảng CTP theo nguồn
| Điểm xuất phát              | Khoảng cách    | CTP (VND) |
| --------------------------- | -------------- | --------- |
| N - Nhà riêng               | < 12 km        | 0         |
| N - Nhà riêng               | >=12 và <18 km | 30.000    |
| N - Nhà riêng               | >=18 và <24 km | 40.000    |
| N - Nhà riêng               | >=24 và <30 km | 60.000    |
| N - Nhà riêng               | >=30 và <50 km | 80.000    |
| N - Nhà riêng               | >=50 km        | 120.000   |
| V - Văn phòng hoặc K - Khác | < 7 km         | 0         |
| V - Văn phòng hoặc K - Khác | >=7 và <12 km  | 30.000    |
| V - Văn phòng hoặc K - Khác | >=12 và <18 km | 40.000    |
| V - Văn phòng hoặc K - Khác | >=18 và <24 km | 60.000    |
| V - Văn phòng hoặc K - Khác | >=24 và <30 km | 80.000    |
| V - Văn phòng hoặc K - Khác | >=30 km        | 110.000   |
Quy tắc nguồn: hoạt động online có is_online = true thì distance = 0 km và CTP = 0 đồng. Điểm xuất phát N/V/K và các
mức phí cần được cấu hình theo effective date thay vì cố định trong code.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 13

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
7.6. CTP - mô hình chặng di chuyển đề xuất
Đề xuất v2: tạo Travel Trip theo nhân sự/ngày/buổi, sau đó lưu một hoặc nhiều Travel Leg (điểm đi, điểm đến,
distance_km, duration_minutes, thứ tự, nguồn khoảng cách). Travel Allowance Item lưu kết quả áp dụng rule. Cho phép
chọn nguồn N/V/K và manual override có phê duyệt. Tuy nhiên, công thức xác định số lần được hưởng và chặng nào
được tính hiện chưa rõ từ nguồn, nên chưa được triển khai cứng.
CẦN XÁC NHẬN CTP  Khi giáo viên dạy nhiều trường trong cùng buổi, tính CTP theo trường đầu tiên, trường xa nhất,
từng chặng hay một khoản cố định/buổi? CTP tính theo quãng đường một chiều hay cả hành trình? Ai chọn điểm K - Khác?
Có tính chặng giữa các trường không? Cự ly lấy theo ma trận nội bộ, Google Maps hay số km do quản trị nhập?
7.7. Thù lao CTV
Theo PDF nguồn: tổng hợp theo ca/buổi thực tế; nhóm từ 2 tiết/buổi trở lên áp dụng đơn giá mặc định 130.000 VND/tiết
(có thể cấu hình); nhóm dưới 2 tiết/buổi đưa vào quỹ riêng để áp dụng khung ca lẻ hoặc định mức hỗ trợ.
| Điều kiện | Nguồn xác định | Trạng thái đặc tả |
| --------- | -------------- | ----------------- |
Đã có trong PDF; cần chốt tính trên tiết thực
Số tiết quy đổi/buổi >= 2 Mức mặc định 130.000 VND/tiết. tế hay tiết quy đổi và có hệ số môn/event
không.
Số tiết quy đổi/buổi < 2 Có khung thù lao ca lẻ/định mức riêng. CẦN XÁC NHẬN: chưa có số tiền/công thức.
Đơn giá theo hợp đồng CTV có thể có mức thù lao khác nhau. ĐỀ XUẤT V2: rule theo CTV/loại hoạt
động/hợp đồng/effective date.
Ca dạy thay, teambuilding, event Chưa thấy công thức đầy đủ. CẦN XÁC NHẬN.
NGĂN TÍNH SAI TIỀN  Không phát hành payroll CTV cho tới khi có quyết định bằng văn bản về công thức nhóm dưới 2
tiết/buổi, cách tính đúng ngưỡng 2 tiết, quy đổi 0.5/1.0/2.0/3.0 và mức giá theo hợp đồng.
7.8. Phân bổ theo tháng và tuần giao thoa
Báo cáo tháng phải nhóm theo teaching_date (ngày thực tế diễn ra) trong timezone Asia/Ho_Chi_Minh, không nhóm theo
tuần chứa ngày đầu tuần. Nếu một tuần giao thoa hai tháng, event/assignment/period được phân bổ theo ngày của từng
slot; nếu buổi kéo qua nửa đêm (nếu có) thì dùng start_at/end_at đầy đủ. Quy tắc kỳ công ngoài tháng dương lịch phải
được cấu hình bằng pay_period start_date/end_date.
7.9. Công thức tổng quát cho payroll
| Chỉ số | Cách tổng hợp đề xuất                  | Điều kiện                                  |
| ------ | -------------------------------------- | ------------------------------------------ |
|        | SUM(credit_component.amount) group by  | Chỉ từ assignment đủ điều kiện payroll và  |
Tiết theo quỹ
|     | employee, bucket, date range.                | snapshot đã xác nhận.                         |
| --- | -------------------------------------------- | --------------------------------------------- |
|     | COUNT(DISTINCT qualifying assignment/event)  | Chỉ áp dụng các mã có bộ đếm và quy định đếm  |
Event counter
|     | theo event counter code. | duy nhất. |
| --- | ------------------------ | --------- |
Chỉ item approved, có rule snapshot và không bị
| CTP | SUM(travel_allowance_items.amount). |     |
| --- | ----------------------------------- | --- |
hủy.
|     | SUM(payroll_items.amount) từ ctv_payment_rule  | Theo group_by buổi và rate effective date; chưa  |
| --- | ---------------------------------------------- | ------------------------------------------------ |
CTV gross fee
|     | snapshot.                                      | áp dụng nhóm dưới 2 nếu chưa chốt.             |
| --- | ---------------------------------------------- | ---------------------------------------------- |
|     | Gross + allowances + adjustments - deductions  | Các khoản thuế/khấu trừ ngoài phạm vi cho đến  |
Net payable
|     | (nếu có). | khi được đặc tả. |
| --- | --------- | ---------------- |
8. MÔ HÌNH DỮ LIỆU VÀ QUY TẮC TOÀN VẸN
8.1. Nguyên tắc thiết kế dữ liệu
PostgreSQL; PK UUID; FK rõ ràng; created_at/updated_at/created_by/updated_by cho các bảng giao dịch chính.

 Dùng bảng danh mục chuẩn thay cho free text. Lưu raw_value/raw_payload ở lớp import để đối soát.
 Dữ liệu có lịch sử và hiệu lực dùng effective_from/effective_to hoặc valid_from/valid_to.
 Không dùng JSONB cho danh sách lớp/chứng chỉ cần truy vấn, lọc, ràng buộc và audit; chỉ dùng JSONB cho
payload linh hoạt, không thay thế quan hệ.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 14

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
 Không lưu số tài khoản ngân hàng/CCCD dạng numeric; phải lưu chuỗi để giữ nguyên số 0 đầu và định dạng.
 Không mặc định TRUE cho chứng chỉ chưa xác minh. Trạng thái chứng chỉ phải thể hiện
UNKNOWN/PENDING/VERIFIED/EXPIRED/REVOKED.
 Các số liệu payroll phải có snapshot kết quả và rule version; dữ liệu nguồn vẫn được giữ riêng.
8.2. Mô hình ERD logic (mô tả quan hệ)
| Cụm | Bảng chính                              | Quan hệ                                          |
| --- | --------------------------------------- | ------------------------------------------------ |
|     | users, roles, permissions, user_roles,  | users N-N roles; roles N-N permissions; user có  |
| IAM | user_data_scopes                        | thể gắn nhiều scope.                             |
|     | employees, employee_code_aliases,       | employee 1-N                                     |
HR employment_contracts, employee_certificates,  aliases/contracts/certificates/locations; user 0..1
|     | employee_documents, employee_locations | hoặc 1..N tùy chính sách. |
| --- | -------------------------------------- | ------------------------- |
companies, schools, school_campuses, classes,
school 1-N campuses; campus 1-N classes;
| Master | subjects, academic_years, locations,  |     |
| ------ | ------------------------------------- | --- |
classes gắn academic_year.
school_calendars
employee N-N class/subject theo khoảng hiệu
Assignment class_assignments, class_handover_events lực; handover liên kết assignment cũ/mới.
schedule_templates, template_events,
|            | template_staff, schedule_events,  | template sinh event; event 1-N             |
| ---------- | --------------------------------- | ------------------------------------------ |
| Scheduling |                                   | assignments/periods; event_links liên kết  |
schedule_assignments, event_periods,
gốc/thay/bù.
event_links
leave_requests, leave_affected_events,
Attendance/leave availability_slots, shift_swap_requests,  leave/swap liên kết event/assignment;
confirmation thuộc nhân sự và assignment.
teaching_confirmations
conversion_rules, conversion_rule_versions,
|     | conversion_rule_components,  | rule version áp dụng theo ngày; trip N legs; item  |
| --- | ---------------------------- | -------------------------------------------------- |
Rules & CTP
|     | travel_allowance_rules, distance_matrix,  | snapshot rule. |
| --- | ----------------------------------------- | -------------- |
travel_trips, travel_legs, travel_allowance_items
Payroll pay_periods, payroll_runs, payroll_items,  pay period 1-N runs; run 1-N items/adjustments;
|     | payroll_adjustments                         | item liên kết nguồn.                           |
| --- | ------------------------------------------- | ---------------------------------------------- |
|     | audit_logs, notifications, import_batches,  | audit theo entity; import batch có nhiều row;  |
Governance
|     | import_rows | notification theo user/target. |
| --- | ----------- | ------------------------------ |
8.3. Danh mục bảng đề xuất
| Bảng | Trường chính (tóm tắt) | Mục đích/ghi chú |
| ---- | ---------------------- | ---------------- |
id UUID PK; employee_code UNIQUE; full_name;
employees employment_type; work_status; phone; emails; dob;  Hồ sơ người. Không đặt role hệ thống tại đây.
join_date; official_date; resign_date; address fields
|                       | id; employee_id FK; alias_code; source_system;    | Ánh xạ mã cũ như HN007 về mã chuẩn. alias_code  |
| --------------------- | ------------------------------------------------- | ----------------------------------------------- |
| employee_code_aliases | valid_from/to                                     | UNIQUE theo nguồn.                              |
|                       | id; employee_id FK nullable/unique;               | Tài khoản đăng nhập. Khóa tài khoản không xóa   |
| users                 | username/email; password_hash/identity_provider;  |                                                 |
employee.
status; last_login_at
roles / permissions / user_roles / role_permissions id/code/name; permission_code; user_id; role_id;  RBAC nhiều vai trò và phạm vi dữ liệu.
scope_id; effective dates
id; employee_id; contract_type; start_date;
Hợp đồng CTV/cơ hữu, thời gian hiệu lực, đơn
| employment_contracts | end_date; probation_end; official_date; status;  |                          |
| -------------------- | ------------------------------------------------ | ------------------------ |
|                      | document_id                                      | giá/hạn chế nếu áp dụng. |
employee_certificates id; employee_id; certificate_type_id; issue_date;  Chứng chỉ có thời hạn và trạng thái xác minh.
expiry_date; status; verified_by; file_id
id; employee_id; location_id;
Địa chỉ nhà/văn phòng/điểm khác phục vụ tính
employee_locations location_type(N/V/K/OTHER); is_default;  chuyến đi.
valid_from/to
id; code UNIQUE; full_name; office_location_id;
| companies |     | GAIA, NEWG, 8BC và pháp nhân mở rộng. |
| --------- | --- | ------------------------------------- |
status
schools id; school_code UNIQUE; name; level; district; status Đơn vị trường đối tác.
id; school_id; campus_code; name;
school_campuses Phân hiệu/cơ sở riêng, tránh gộp vào tên trường.
address/location_id; status
id; campus_id; academic_year_id; class_code;
classes grade; status Lớp riêng, có unique theo campus/năm học.
subjects id; code UNIQUE; name; subject_group;  KNS, STEM, STEM Robotics, CDS, AI...
default_color; status
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 15

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
Bảng Trường chính (tóm tắt) Mục đích/ghi chú
id; name; start_date; end_date; school_id;
academic_years / school_calendars Niên khóa và ngày hoạt động/nghỉ/trường báo nghỉ.
campus_id; date; calendar_type
id; employee_id; class_id; subject_id; role_type; Phân công theo từng lớp/môn/người trong khoảng
class_assignments
valid_from/to; status; approved_by hiệu lực.
id; old_assignment_id; new_assignment_id;
class_handover_events handover_date; reason; requested_by; Lịch sử bàn giao nhiều lần.
approved_by; status
id; name; academic_year_id; school_id/campus_id;
schedule_templates Lịch mẫu định kỳ.
valid_from/to; status; version
template_id; weekday; session; period/time;
template_events / template_staff Cấu trúc buổi/ca định kỳ và nhân sự.
class/subject; employee_id; staff_role
id; event_code; teaching_date; start_at; end_at;
schedule_events campus/location; activity_type; schedule_layer; Một hoạt động/buổi lịch thực tế.
status; is_online; company_id
id; event_id; employee_id; staff_role; is_primary; Một nhân sự thực hiện một event; cho phép nhiều
schedule_assignments
conversion_rule_version_id; payroll_eligibility; status staff/event.
id; event_id; period_index; start_at; end_at; Slot/tiết thuộc buổi; dùng kiểm tra overlap và tổng
event_periods
period_weight; class_id/subject_id tiết.
id; source_event_id; related_event_id;
event_links link_type(ORIGINAL/SUBSTITUTE/MAKEUP/RESC Liên kết ca gốc, thay, bù, đổi lịch.
HEDULE)
id; employee_id; date range; reason; status;
leave_requests / leave_affected_events Đơn nghỉ và danh sách ca bị ảnh hưởng.
approver; event/assignment ids
id; employee_id; date; start_at/end_at;
availability_slots Lịch khả dụng do nhân sự khai báo.
availability_status; source; submitted_at
id; requester; target; from_assignment;
shift_swap_requests Đề nghị đổi ca.
to_assignment; reason; status; approved_by
id; assignment_id; employee_id;
teaching_confirmations confirmation_status; confirmed_at; actual_periods; Xác nhận hoạt động thực tế.
note; verified_by
rule_code; version; effective dates; activity;
Quy tắc quy đổi có version; components cho nhiều
conversion_rules / versions / components credit_value; bucket; event_counter;
quỹ nếu có.
employment_type
id; departure_type; min_km; max_km; amount; Bậc CTP cấu hình. Dùng khoảng đóng/mở không
travel_allowance_rules
effective_from/to; approved_by chồng lấn.
from_location_id; to_location_id; distance_km;
distance_matrix Ma trận giữa các địa điểm để kiểm tra hành trình.
duration_minutes; source; checked_at
trip_id; employee_id; date/session; leg sequence;
Lưu hành trình và kết quả CTP theo từng
travel_trips / legs / allowance_items from/to; km; duration; rule_id; amount; override
chặng/chính sách.
reason
id; employee/contract type; activity_type; threshold; Đơn giá CTV và công thức ca lẻ; phải được xác
ctv_payment_rules
rate; calculation_method; effective dates nhận.
period_id; start/end; period_type; status; rule
pay_periods / payroll_runs Kỳ công và lần chạy đối soát.
snapshot; created_by; approved_by; locked_at
run_id; employee_id; source_assignment_id;
payroll_items / adjustments item_type; quantity; rate; amount; rule_snapshot; Dòng chi tiết và khoản điều chỉnh.
adjustment_reason
actor; entity; entity_id; action; before/after; reason;
audit_logs / notifications Lịch sử và thông báo.
created_at; channel; recipient; status
source_file; sheet; mapping_version; status; row_no;
import_batches / import_rows Quản lý migration/import.
raw_data; normalized_data; errors
8.4. Ràng buộc dữ liệu quan trọng
 employee_code là mã chuẩn duy nhất; alias được quản lý riêng. Không dùng full_name làm khóa.
 Khoảng hiệu lực phải thỏa valid_from <= valid_to; các assignment cùng lớp/môn/vai trò chính không được chồng lấn
nếu chính sách không cho phép.
 period_index nằm trong 1..6 theo cấu hình buổi; day_of_week dùng ISO 1..7 hoặc date-derived, không lưu cả hai
như dữ liệu độc lập nếu có thể tính.
 Event có end_at > start_at; start/end timezone rõ ràng; slot không vượt khỏi event nếu chưa có ngoại lệ.
 Không cho một nhân sự có hai assignment chồng thời gian trừ ngoại lệ được duyệt; tương tự với lớp và nguồn lực
có giới hạn.
 Các khoảng min_km/max_km trong bảng CTP không được chồng lấn, không có khoảng trống ngoài chủ đích.
 Payroll item phải liên kết nguồn hoặc có adjustment_reason; kỳ LOCKED không cho update/delete trực tiếp.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 16

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
 Tất cả số tiền dùng DECIMAL/INTEGER VND; không dùng FLOAT cho tiền hoặc số tiết.
9. TRẠNG THÁI VÀ NHẬT KÝ VÒNG ĐỜI
9.1. Lịch / Event
| Trạng thái       | Ý nghĩa   | Điều kiện/chuyển tiếp         |
| ---------------- | --------- | ----------------------------- |
| DRAFT            | Đang soạn | Chưa công bố; có thể sửa/hủy. |
| PENDING_APPROVAL | Chờ duyệt | Đã gửi duyệt; chờ approver.   |
APPROVED Đã duyệt Cho phép công bố hoặc lên kế hoạch vận hành.
| PUBLISHED | Đã công bố | Gửi tới các bên; sửa đổi lớn cần  |
| --------- | ---------- | --------------------------------- |
version/notification.
IN_PROGRESS Đang diễn ra Có thể sinh từ thời gian hiện tại nếu dùng.
COMPLETED Đã hoàn thành Có xác nhận; đủ điều kiện payroll nếu hợp lệ.
Có lý do và actor; không ghi nhận công trừ rule
| CANCELLED | Đã hủy |     |
| --------- | ------ | --- |
đặc biệt.
| REJECTED | Bị từ chối | Không được công bố; có thể tạo bản khác. |
| -------- | ---------- | ---------------------------------------- |
9.2. Nhãn / activity type tiêu chuẩn đề xuất
| Activity Type | Tag/label có thể đi kèm | Ghi chú                                      |
| ------------- | ----------------------- | -------------------------------------------- |
| TEACHING      | K/S/C/A                 | Ca giảng dạy chính.                          |
| SUBSTITUTE    | DT                      | Liên kết event gốc và nhân sự được thay.     |
| MAKEUP        | NB                      | Liên kết makeup obligation và ngày nghỉ gốc. |
OBSERVATION DG Dự giờ; cần xác định quy tắc có tính công/bận.
Sinh hoạt chuyên môn; mã quy đổi cần xác
| TRAINING_CM | CM  |     |
| ----------- | --- | --- |
nhận.
EVENT_WORKSHOP BCTH/BCCĐ/ĐP/HN/KI/BN/HT/TQ/CA Áp dụng rule tương ứng.
| TEACHER_LEAVE | LEAVE | Đơn nghỉ và các ca bị ảnh hưởng. |
| ------------- | ----- | -------------------------------- |
SCHOOL_OFF SCHOOL_OFF Trường báo nghỉ; tạo nghĩa vụ bù nếu có.
Ca đổi ngày/giờ; cần event link và tránh tính
| RESCHEDULED | RESCHEDULE |     |
| ----------- | ---------- | --- |
trùng.
9.3. Audit log bắt buộc
Trường audit Yêu cầu
actor_user_id Tài khoản thực hiện; nếu job hệ thống thì service actor.
CREATE/UPDATE/DELETE_SOFT/APPROVE/REJECT/PUBLISH/
action
CANCEL/LOCK/UNLOCK/EXPORT/OVERRIDE.
entity_type + entity_id Loại bản ghi và định danh.
before_json / after_json Giá trị trước/sau; loại bỏ hoặc che dữ liệu nhạy cảm theo chính sách.
Lý do bắt buộc cho override, hủy, sửa sau công bố, mở khóa hoặc
reason
điều chỉnh payroll.
timestamp + source Thời điểm, IP/device/session hoặc nguồn import/API nếu phù hợp.
10. YÊU CẦU GIAO DIỆN VÀ BÁO CÁO
10.1. Nguyên tắc UI/UX
 Thay thế lưới 23 dòng x 101 cột bằng thẻ Schedule Event và lưới theo ngày/buổi/tiết, có filter và drill-down.
 Màu sắc chỉ là lớp trực quan; mọi trạng thái phải có text/icon/badge và dữ liệu cấu trúc, không chỉ dùng màu.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 17

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
 Các thao tác nguy cơ cao (copy tuần, công bố lịch, hủy ca, override CTP, khóa kỳ) phải có preview/confirm và ghi log.
 Giao diện desktop tối ưu cho điều phối; mobile tối ưu lịch cá nhân, xác nhận, đơn nghỉ và bảng đối soát.
 Hỗ trợ tìm kiếm theo mã giáo viên, tên, trường, lớp, ngày; bộ lọc phải giữ trạng thái khi quay lại danh sách.
10.2. Màn hình vận hành trọng tâm
Màn hình Vai trò Thành phần và thao tác chính
KPI tổng tiết hôm nay, ca thay/bù, lớp thiếu giáo
viên, thử việc sắp hết hạn, cơ cấu môn/pháp
1. Dashboard vận hành Admin/Team Lead/HR/Payroll
nhân. Mỗi KPI phải có định nghĩa và link drill-
down.
Chọn tuần/tháng; filter địa
bàn/trường/campus/pháp nhân/nhân
2. Master Schedule Admin/Coordinator
sự/môn/trạng thái; sticky panel; lưới tuần; panel
chi tiết; preview copy; cảnh báo xung đột.
Ma trận rảnh/bận theo ngày/buổi/slot; bộ lọc
chứng chỉ, hợp đồng, địa bàn, availability,
3. TCS & điều động nhanh Coordinator
khoảng cách; lý do không phù hợp; chọn người
thay.
Kỳ công, tổng tiết theo bucket, event count, CTP,
4. Payroll & CTP Center HR/Payroll/Admin CTV; drill-down đến event/assignment/rule; cảnh
báo sai lệch; duyệt/khóa/xuất.
Lịch cá nhân ngày/tuần/tháng, xem chỉ
5. Teacher/CTV Portal Teacher/CTV đường/địa chỉ trường, xác nhận tiết, gửi nghỉ/đổi
ca, availability, bảng đối soát của mình.
Hồ sơ, hợp đồng, chứng chỉ, địa điểm xuất phát,
6. HR Profile 360 HR/Admin phân công, lịch sử, dữ liệu nhạy cảm có che và
quyền riêng.
Danh mục, mapping alias, import batch, lỗi cần
7. Master Data & Imports Admin/HR/Coordinator
xử lý, preview và commit.
10.3. Định nghĩa KPI và báo cáo
Báo cáo/KPI Định nghĩa bắt buộc phải cấu hình
Phân biệt scheduled / published / completed / payroll eligible; không
Tổng tiết trong ngày
dùng một nhãn “tổng tiết” chung.
Đếm event hay assignment? Đếm theo ca, tiết hay người? Xác định
Ca dạy thay/dạy bù
một định nghĩa thống nhất.
Lớp có assignment hiệu lực nhưng không có staff assignment phù
Lớp khuyết giáo viên
hợp cho một ngày/slot cụ thể.
Cơ cấu tiết theo môn Dựa trên credit bucket hoặc subject; nêu rõ event hỗn hợp.
Tổng item CTP approved, tách theo điểm xuất phát, ngày, nhân sự và
Tổng CTP
kỳ.
Tách >=2 và <2 tiết/buổi theo đúng rule; hiển thị số buổi, số tiết, đơn
CTV payroll
giá, số tiền.
Chỉ làm dashboard sau khi tổ chức định nghĩa mẫu số, định mức và
Năng suất/định mức
ngoại lệ.
10.4. Hành vi giao diện bắt buộc
 Khi tạo/sửa event: chọn trường → campus → lớp → môn → ngày → buổi/slot → nhân sự → activity type →
conversion code; danh sách phụ thuộc danh mục hợp lệ.
 Khi chọn nhân sự: hiển thị trạng thái hợp đồng, chứng chỉ, TCS và lịch trùng trước khi lưu.
 Khi copy tuần: hiển thị diff giữa tuần nguồn và tuần đích; có tùy chọn bỏ qua ca có xung đột, nhưng không tự động bỏ
qua nếu chưa xác nhận.
 Khi xem CTP: thể hiện điểm đi, điểm đến, số km, bậc phí, số tiền, rule version và nguồn khoảng cách.
 Khi drill-down payroll: hiển thị cả số tiết thực tế và số tiết quy đổi, mã quy đổi, quỹ cộng dồn và trạng thái xác nhận.
 Khi xem hồ sơ nhạy cảm: mặc định mask; thao tác reveal/export cần quyền bổ sung và có audit.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 18

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
11. MIGRATION, IMPORT/EXPORT VÀ CHUYỂN ĐỔI DỮ LIỆU
11.1. Nguồn chuyển đổi
| Nguồn | Phân loại                               | Xử lý                                   |
| ----- | --------------------------------------- | --------------------------------------- |
|       | Employee master, work status, contact,  | Mapping mã, chuẩn hóa tên, ngày tháng,  |
Workbook HR
|     | education/certification, assignment year data. | điện thoại, email, trạng thái; giữ raw. |
| --- | ---------------------------------------------- | --------------------------------------- |
Parse vùng lịch theo cấu trúc tuần; chuẩn
|     | Weekly schedule, ad-hoc notes, TCS, total  | hóa ngày/slot/trường/lớp/môn/pháp  |
| --- | ------------------------------------------ | ---------------------------------- |
Workbook Schedule
|     | period, CTV fee, MAIL. | nhân/employee code; không import công  |
| --- | ---------------------- | -------------------------------------- |
thức/màu làm sự thật.
Companies,
Là nguồn chuẩn sau sign-off; các giá trị chưa
| Danh mục mới được duyệt | schools/campuses/classes/subjects/conversio |     |
| ----------------------- | ------------------------------------------- | --- |
map đưa vào queue.
n rules/CTP rules.
|     | Hợp đồng, CCCD, bằng cấp, chứng chỉ (nếu  | Import file theo danh mục, hash, quyền truy  |
| --- | ----------------------------------------- | -------------------------------------------- |
Tệp đính kèm hồ sơ
|     | được cung cấp). | cập và chính sách lưu trữ. |
| --- | --------------- | -------------------------- |
11.2. Quy trình migration
21. Inventory: lập danh sách workbook, sheet, vùng dữ liệu, kỳ ngày, công thức, danh mục và chủ sở hữu.
22. Profiling: thống kê số dòng/unique, trùng mã, trùng tên, ô rỗng, lỗi công thức, định dạng ngày/tiền và dữ liệu nhạy
cảm.
23. Mapping: thiết lập bảng ánh xạ nhân sự alias, trường, campus, lớp, môn, pháp nhân, conversion code và loại hoạt
động.
24. Dry-run: import vào staging, không ảnh hưởng production; tạo báo cáo matched/unmatched/duplicates/errors.
25. Reconciliation: so sánh số ca/số tiết/số CTP/số CTV theo tuần và tháng với nguồn, ghi rõ chênh lệch đã giải
thích/chưa giải thích.
26. Business sign-off: Giáo vụ, HR và Kế toán ký xác nhận từng nhóm dữ liệu và mẫu tính.
27. Cut-over: chốt thời điểm ngừng cập nhật Excel, import delta cuối, kiểm tra totals, chuyển Webapp thành nguồn
chính.
28. Rollback: giữ nguyên workbook nguồn, backup database và phương án quay lại quy trình cũ trong thời gian pilot.
11.3. Quy tắc mapping dữ liệu
 Mã `HN007` và `GVHN007` chỉ được hợp nhất khi chủ dữ liệu xác nhận cùng một cá nhân; lưu alias để truy vết.
Mã tạm như `GV mới` không được coi là unique identity; cần đối soát bằng thông tin bổ sung và gán employee_code

chuẩn.
 Tên trường/phân hiệu phải tách school và campus; không loại bỏ hậu tố phân hiệu nếu nó phân biệt địa điểm dạy.
 Lớp dạng chuỗi/range (ví dụ `6A1-6A5`) phải parse thành từng class record sau xác nhận; không lưu chuỗi range
như khóa lớp.
 Các môn ghép như `STEM + AI` không tự chia thành hai credit nếu chưa có rule phân bổ; giữ raw value và chờ
mapping.
 Số tài khoản ngân hàng/CCCD đọc dưới dạng string; không ép kiểu số hoặc scientific notation; đối chiếu lại với bản
gốc.
 Các dòng có lỗi/thiếu ngày/nhân sự/trường không được tự chuyển thành lịch hợp lệ; đưa vào exception queue.
11.4. Import batch và exception queue
| Trạng thái row | Ý nghĩa | Hành động |
| -------------- | ------- | --------- |
IMPORTED Mapping và validation thành công. Có thể commit vào domain tables.
|     | Thiếu trường tùy chọn hoặc biến thể alias đã  | Cho phép commit nếu rule cho phép; hiển thị  |
| --- | --------------------------------------------- | -------------------------------------------- |
WARNING
|     | map. | cảnh báo. |
| --- | ---- | --------- |
Không tìm được
| UNMATCHED |     | Yêu cầu người quản lý dữ liệu mapping. |
| --------- | --- | -------------------------------------- |
employee/school/class/subject/partner.
|     | Trùng khóa hoặc có khả năng trùng giao  | Chọn bản ghi giữ lại hoặc đánh dấu duplicate  |
| --- | --------------------------------------- | --------------------------------------------- |
DUPLICATE
|     | dịch. | có lý do. |
| --- | ----- | --------- |
INVALID Sai định dạng hoặc vi phạm constraint. Sửa raw/mapping rồi chạy lại; không commit.
IGNORED Được chủ dữ liệu xác nhận không nhập. Lưu lý do và người xác nhận.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 19

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
12. YÊU CẦU PHI CHỨC NĂNG, BẢO MẬT VÀ VẬN HÀNH
Mã Nhóm Yêu cầu/tiêu chí đề xuất
CCCD, tài khoản ngân hàng và tài liệu cá nhân
phải được bảo vệ khi truyền và khi lưu; áp dụng
NFR-SEC-001 Bảo mật dữ liệu nhạy cảm
mã hóa/secret management theo kiến trúc được
duyệt.
Mask dữ liệu nhạy cảm mặc định; chỉ
NFR-SEC-002 Phân quyền trường dữ liệu
reveal/export với quyền rõ ràng và audit.
Mật khẩu băm bằng thuật toán hiện đại; hỗ trợ
NFR-SEC-003 Xác thực MFA/SSO nếu tổ chức yêu cầu; chống brute
force và session hijacking.
Không cho user nghiệp vụ sửa/xóa audit log;
NFR-SEC-004 Audit
quản trị audit retention.
Chỉ thu thập trường dữ liệu cần thiết; quy định
mục đích sử dụng, thời hạn lưu và quy trình xử
NFR-PRIV-001 Quyền riêng tư
lý yêu cầu chủ thể dữ liệu theo chính sách áp
dụng.
Đề xuất mục tiêu: 95% request đọc phổ biến <=
3 giây trong tải vận hành dự kiến; báo cáo lớn có
NFR-PERF-001 Hiệu năng
job/asynchronous. Cần xác nhận tải và môi
trường.
Tải tuần mặc định theo phạm vi lọc; phân
NFR-PERF-002 Lưới lịch/TCS trang/virtualization; tránh query N+1; có cache có
kiểm soát.
Có optimistic locking/version check; cảnh báo khi
NFR-CONC-001 Đồng thời
hai điều phối viên sửa cùng event.
Đề xuất mục tiêu uptime >= 99.5% theo tháng
NFR-AVL-001 Khả dụng loại trừ bảo trì có thông báo; cần doanh nghiệp
xác nhận SLA.
Backup tự động; kiểm thử restore định kỳ; mục
NFR-BCP-001 Backup/khôi phục
tiêu RPO/RTO phải được chốt trước go-live.
Hỗ trợ desktop phổ biến và màn hình điện thoại;
NFR-UX-001 Responsive
thao tác cốt lõi trên mobile không yêu cầu hover.
Bố cục rõ, tương phản đủ, trạng thái không chỉ
NFR-ACC-001 Truy cập biểu diễn bằng màu; hỗ trợ bàn phím ở form
chính.
Có log ứng dụng, metrics, tracing cho lỗi tính
NFR-LOG-001 Quan sát hệ thống toán và batch; không ghi plaintext dữ liệu nhạy
cảm.
Hỗ trợ thêm văn phòng, pháp nhân, môn, quy
NFR-EXT-001 Mở rộng
tắc và địa điểm mà không sửa schema cốt lõi.
FK, unique, check constraints; transaction đảm
NFR-DATA-001 Toàn vẹn
bảo atomic cho copy tuần, duyệt và khóa payroll.
Chính sách retention cho employee documents,
NFR-RET-001 Lưu trữ attendance, payroll, audit và backup do doanh
nghiệp phê duyệt.
LƯU Ý PHÁP LÝ VÀ AN TOÀN Các trường dữ liệu như CCCD, địa chỉ, tài khoản ngân hàng, hợp đồng và chứng chỉ là
dữ liệu cá nhân/nhạy cảm theo bối cảnh sử dụng. Chủ hệ thống cần rà soát căn cứ xử lý, thông báo, phân quyền, lưu trữ,
chia sẻ và thời hạn lưu theo quy định pháp luật Việt Nam áp dụng tại thời điểm triển khai. Đây là yêu cầu quản trị cần kiểm
tra pháp lý riêng, không phải ý kiến tư vấn pháp lý.
13. KIỂM THỬ VÀ TIÊU CHÍ NGHIỆM THU
13.1. Nguyên tắc kiểm thử
 Mọi FR có ít nhất một test case; các rule tính toán phải có test biên tại ngưỡng.
 Test bằng dữ liệu đã ẩn danh, bao gồm tình huống có lỗi/thiếu/alias từ workbook nguồn.
 Kiểm thử integration giữa scheduling, TCS, confirmation, conversion, CTP và payroll.
 Kiểm thử quyền với người dùng thuộc nhiều role và nhiều data scope.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 20

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
 Không nghiệm thu payroll khi công thức CTV dưới 2 tiết, CTP theo nhiều điểm hoặc các rule P0 chưa được ký xác
nhận.
13.2. Danh sách test/acceptance criteria
| ID  | Kịch bản | Tiêu chí đạt |
| --- | -------- | ------------ |
Import HN007 và GVHN007 đã được xác nhận cùng
AT-001 Mã nhân sự alias người → một employee, lưu cả alias, không
duplicate.
Dòng có mã GV mới không được tự tạo nhân sự
| AT-002 | Mã tạm |     |
| ------ | ------ | --- |
chuẩn; xuất hiện trong exception queue.
Nhân sự thiếu chứng chỉ/hết hạn không thể được
AT-003 Chứng chỉ gán lớp yêu cầu chứng chỉ bắt buộc, trừ override
được duyệt.
Không phân công ngoài thời hạn hợp đồng hoặc cho
| AT-004 | Hợp đồng |     |
| ------ | -------- | --- |
nhân sự đã offboard.
Copy chỉ lịch REGULAR; không copy
AT-005 Copy tuần ADHOC/DT/NB cũ; preview và chống duplicate khi
chạy lại.
Hai ca cùng nhân sự giao thời gian phải bị chặn
AT-006 Trùng giáo viên hoặc cảnh báo theo rule được cấu hình.
AT-007 Trùng lớp Hai ca của cùng lớp giao thời gian phải phát hiện.
Hai ca khác địa điểm không đủ travel duration phải
| AT-008 | Di chuyển | cảnh báo/chặn theo ngưỡng. |
| ------ | --------- | -------------------------- |
Ca gốc vẫn lưu; người nghỉ không có credit thực
AT-009 Dạy thay hiện; người thay được liên kết event gốc và tính
theo rule được duyệt.
AT-010 Từ chối dạy thay Người được chọn từ chối → ca trở lại hàng đợi điều
phối, thông báo Coordinator.
Ca gốc không được tính tiết đã dạy; tạo makeup
| AT-011 | Trường báo nghỉ |     |
| ------ | --------------- | --- |
obligation nếu chính sách yêu cầu.
Ca bù liên kết nghĩa vụ gốc; trạng thái obligation cập
| AT-012 | Dạy bù | nhật; không tính trùng nghĩa vụ. |
| ------ | ------ | -------------------------------- |
AT-013 TCS ngưỡng Tổng credit = 0.40 → TRỐNG; 0.41 → BẬN (theo
rule nguồn sau khi xác nhận).
Draft/cancelled không làm nhân sự BẬN;
| AT-014 | TCS trạng thái |     |
| ------ | -------------- | --- |
published/approved event phù hợp làm BẬN.
CTV khai báo không khả dụng không được gợi ý
| AT-015 | TCS availability |     |
| ------ | ---------------- | --- |
nhận ca, dù không có lịch dạy.
AT-016 Quy đổi K=1, S=1, C=1, A=1 và các mã half/event cho ra kết
quả theo rule version.
CM/TC/NB hoặc môn ghép chưa có mapping không
| AT-017 | Mã chưa xác nhận |     |
| ------ | ---------------- | --- |
được âm thầm tự tính; phải cảnh báo/giữ pending.
Các khoảng biên 12, 18, 24, 30, 50 km được tính
| AT-018 | CTP N |     |
| ------ | ----- | --- |
theo rule đóng/mở đã chốt.
Các khoảng biên 7, 12, 18, 24, 30 km được tính theo
| AT-019 | CTP V/K | rule đóng/mở đã chốt.                    |
| ------ | ------- | ---------------------------------------- |
| AT-020 | Online  | is_online=true → 0 km, CTP=0 theo nguồn. |
AT-021 CTP override Sửa CTP phải có lý do, approver, giá trị trước/sau
và audit.
Ca có >=2 tiết được áp dụng rate theo rule version
| AT-022 | CTV >=2 |     |
| ------ | ------- | --- |
sau xác nhận.
Ca 1 tiết áp dụng đúng khung ca lẻ đã được chủ
| AT-023 | CTV <2 | nghiệp vụ phê duyệt. |
| ------ | ------ | -------------------- |
AT-024 Tuần giao thoa tháng Báo cáo tháng chia dữ liệu theo teaching_date,
không theo tuần/cột tuần 0.
Lịch chưa completed/confirmed không tự động tính
| AT-025 | Xác nhận |     |
| ------ | -------- | --- |
payroll nếu rule không cho phép.
Kỳ LOCKED không thể sửa event/payroll item ảnh
| AT-026 | Khóa kỳ |     |
| ------ | ------- | --- |
hưởng; adjustment mới phải có liên kết.
AT-027 Snapshot rule Thay rate sau khi kỳ đã khóa không làm thay đổi kỳ
cũ.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 21

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
ID Kịch bản Tiêu chí đạt
Teacher/CTV không thể xem lịch/CCCD/ngân
AT-028 Phân quyền hàng/bảng công của người khác nếu không được
cấp.
Thay đổi ngày, nhân sự, conversion code, amount,
AT-029 Audit
status đều có actor/time/before-after/reason.
Chạy lại cùng import batch không tạo bản ghi trùng;
AT-030 Import re-run
row error được giữ và có thể xử lý riêng.
User không có quyền nhạy cảm không thể xuất
AT-031 Export
CCCD/tài khoản ngân hàng kể cả qua file export.
Hai người sửa cùng event: người thứ hai nhận
AT-032 Concurrent update
thông báo version conflict, không ghi đè âm thầm.
13.3. Điều kiện nghiệm thu UAT
 100% yêu cầu MUST được kiểm thử và pass, trừ ngoại lệ có phê duyệt bằng văn bản.
 Các quy tắc P0 đã được chủ nghiệp vụ ký xác nhận và có test case tương ứng.
 Không còn lỗi nghiêm trọng liên quan đến tính công, CTP, thù lao, trùng lịch, mất dữ liệu hoặc lộ dữ liệu nhạy cảm.
 Đối soát pilot: chọn tối thiểu các tuần bình thường, tuần giao thoa tháng, tuần có nghỉ/dạy thay/dạy bù và tuần có
nhiều sự kiện/CTV.
 HR, Giáo vụ, Kế toán và đại diện giáo viên/CTV xác nhận kết quả theo vai trò của mình.
 Có tài liệu hướng dẫn, phương án backup/restore, phân quyền production và quy trình hỗ trợ.
14. DANH SÁCH VẤN ĐỀ CẦN XÁC NHẬN
Danh sách này là register bắt buộc đóng trước khi phát triển phần liên quan. Tạm thời gán người quyết định theo vai trò
đề xuất; doanh nghiệp cần chỉ định người cụ thể.
ID Câu hỏi cần chốt Tác động Chủ trì đề xuất Hạn chốt
Định nghĩa đơn vị bản ghi lịch:
Ảnh hưởng schema, conflict,
P0-01 event/buổi, period hay một Product Owner + Giáo vụ Trước ERD final
payroll, CTP.
tiết?
Một buổi có thể nhiều giáo
Ảnh hưởng
P0-02 viên, nhiều lớp/môn hay Giáo vụ Trước ERD final
event/assignment/period.
không?
Công thức nhóm CTV dưới 2
P0-03 Ảnh hưởng tiền phải trả. Kế toán + Chủ nghiệp vụ Trước Payroll build
tiết/buổi và đúng ngưỡng 2.0.
CTP khi dạy nhiều trường
P0-04 trong buổi: số lần tính, chặng, Ảnh hưởng chi phí. Kế toán + Điều phối Trước CTP build
one-way/round-trip.
Nguồn khoảng cách: nhập
P0-05 tay, ma trận, bản đồ; quy trình Ảnh hưởng CTP và conflict. Điều phối Trước TCS/CTP build
cập nhật.
Mã CM, TC và giá trị âm trong
P0-06 workbook; mã BN; phân biệt Ảnh hưởng tiết và TCS. Team Lead + Kế toán Trước Rule Engine
business tag/conversion.
CDS/AI/STEM+AI và môn Ảnh hưởng quỹ tiết và báo
P0-07 Chủ chuyên môn Trước Rule Engine
ghép được tính vào quỹ nào? cáo.
TCS có tính Chủ Nhật không;
P0-08 cách xử lý DG/CM/event và Ảnh hưởng gợi ý nhân sự. Giáo vụ Trước TCS build
credit âm/0.
Lịch dự kiến/đã công bố/đã
P0-09 Ảnh hưởng payroll. Giáo vụ + Kế toán Trước Payroll build
thực hiện: điều kiện tính công.
Một tiết nghỉ được bù thành
Ảnh hưởng makeup
P0-10 nhiều ca hay một ca bù gộp Giáo vụ + Trường Trước Makeup build
obligation.
nhiều tiết?
Ai duyệt nghỉ, dạy thay, dạy
P0-11 bù, bàn giao, override CTP, Ảnh hưởng RBAC và audit. Ban quản lý Trước RBAC final
mở khóa kỳ?
Kỳ công là tháng dương lịch
P0-12 hay kỳ tài chính; cut-off và Ảnh hưởng payroll run. Kế toán Trước Payroll build
thanh toán.
Hồ sơ CTV và đơn giá theo
P1-01 từng người/hợp đồng/hoạt Ảnh hưởng HR và CTV fee. HR + Kế toán Trước pilot CTV
động.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 22

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
| ID  | Câu hỏi cần chốt | Tác động | Chủ trì đề xuất | Hạn chốt |
| --- | ---------------- | -------- | --------------- | -------- |
Quy tắc phân công lớp: một
P1-02 lớp có bao nhiêu GV chính/hỗ  Ảnh hưởng assignment. Giáo vụ Trước migration
trợ; effective date.
Danh mục trường/campus/lớp
P1-03 thực tế và nguồn authoritative. Ảnh hưởng migration. Giáo vụ Trước import
Thông tin nhà/văn phòng/điểm
P1-04 K nào dùng cho CTP; xử lý  Ảnh hưởng HR/CTP. HR + Kế toán Trước CTP pilot
thay đổi địa chỉ.
P1-05 Thời hạn lưu dữ liệu, tài liệu  Ảnh hưởng compliance. Ban quản lý + IT Trước go-live
nhân sự, audit, backup.
SSO/email/notification
| P1-06 |     | Ảnh hưởng tích hợp. | IT/Admin | Trước triển khai |
| ----- | --- | ------------------- | -------- | ---------------- |
provider và kênh gửi.
Mục tiêu tải, số user đồng
P1-07 Ảnh hưởng kiến trúc/infra. IT + Ban quản lý Trước sizing
thời, SLA, RPO/RTO.
P1-08 Đồng bộ Google Sheets hay  Ảnh hưởng tích hợp. Product Owner Trước MVP scope
chỉ import/export một chiều.
GPS/QR, tối ưu tuyến, phân
| P2-01 |     | Mở rộng. | Ban quản lý | Roadmap sau MVP |
| ----- | --- | -------- | ----------- | --------------- |
tích năng suất, mở chi nhánh.
15. ĐỀ XUẤT PHÂN KỲ TRIỂN KHAI
| Giai đoạn |     | Phạm vi                                          | Điều kiện vào/ra                                |     |
| --------- | --- | ------------------------------------------------ | ----------------------------------------------- | --- |
|           |     | Chốt P0, mapping danh mục, đơn vị dữ liệu lịch,  | Ra quyết định nghiệp vụ; ký rulebook; xác nhận  |     |
G0 - Business sign-off
|     |     | CTP, CTV, payroll, quyền duyệt. | ERD. |     |
| --- | --- | ------------------------------- | ---- | --- |
IAM, RBAC, HR profile, contracts, certificates,
| G1 - Foundation & HR |     |     | Import HR/master data; HR sign-off. |     |
| -------------------- | --- | --- | ----------------------------------- | --- |
master data, imports, alias mapping.
School assignments, handover, templates,
G2 - Assignments & Scheduling weekly schedule, ADHOC, conflict, publish,  Pilot lịch 2-4 tuần; Giáo vụ sign-off.
notifications.
|     |     | TCS, leave, substitute, school-off, makeup,  | Test tình huống ngoại lệ; xác nhận TCS và  |     |
| --- | --- | -------------------------------------------- | ------------------------------------------ | --- |
G3 - Availability & operational changes availability, shift swap, confirmations. nghiệp vụ.
|     |     | Conversion engine, CTP, CTV fee, payroll run,  | Đối soát song song với Excel ít nhất 1-2 kỳ theo  |     |
| --- | --- | ---------------------------------------------- | ------------------------------------------------- | --- |
G4 - Payroll & reporting reconciliation, lock, reports/export. lịch thực tế; Kế toán sign-off.
|                             |     | Mobile portal hoàn chỉnh, dashboard,           | Đạt UAT, đào tạo, backup/restore, vận hành  |     |
| --------------------------- | --- | ---------------------------------------------- | ------------------------------------------- | --- |
| G5 - Rollout & optimization |     | performance, route optimization, mở rộng pháp  |                                             |     |
support.
nhân/chi nhánh.
15.1. Điều kiện sẵn sàng phát triển
 P0 được giải quyết hoặc có quyết định tạm thời được phê duyệt và gắn hạn xử lý.
 ERD và data dictionary được BA/Tech Lead/DBA review.
 Rulebook có ví dụ tính tay và test cases cho conversion, TCS, CTP, CTV.
 Mẫu import/mapping cho nhân sự, trường, lớp, môn, pháp nhân và lịch tuần được xác nhận.
 Ma trận RBAC được chủ quy trình ký duyệt.
 Có mẫu UI wireframe cho Master Schedule, TCS, Payroll và Teacher Portal.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 23

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
PHỤ LỤC A. DANH MỤC DỮ LIỆU VÀ MÃ NGHIỆP VỤ
A.1. Danh mục môn học
| Mã đề xuất | Tên hiển thị |     | Ghi chú            |
| ---------- | ------------ | --- | ------------------ |
| KNS        | Kỹ năng sống |     | Mã quy đổi nguồn K |
| STEM       | STEM         |     | Mã quy đổi nguồn S |
Cần xác định là subject riêng hay nhóm/biến
STEM_ROBOTICS STEM Robotics
thể STEM
| CDS | Công dân số      |     | Mã quy đổi nguồn C |
| --- | ---------------- | --- | ------------------ |
| AI  | Trí tuệ nhân tạo |     | Mã quy đổi nguồn A |
OTHER Khác/chưa phân loại Chỉ dùng khi được cấu hình và có owner
A.2. Danh mục pháp nhân nguồn
| Code | Tên chuẩn đề xuất |     | Lưu ý                          |
| ---- | ----------------- | --- | ------------------------------ |
| GAIA | GAIA              |     | Chuẩn hóa biến thể hoa/thường. |
Không cho phép NEW G/NewG như code
| NEWG | NEWG |     | riêng nếu cùng pháp nhân. |
| ---- | ---- | --- | ------------------------- |
Xác nhận tên pháp lý đầy đủ và địa chỉ văn
8BC 8BC
phòng.
A.3. Danh mục activity_type đề xuất
| Code        | Tên                  | Mã/nhãn có thể gắn | Có cần payroll review? |
| ----------- | -------------------- | ------------------ | ---------------------- |
| TEACHING    | Giảng dạy chính      | K/S/C/A            | Theo conversion rule   |
| SUBSTITUTE  | Dạy thay             | DT                 | Có; gắn event gốc      |
| MAKEUP      | Dạy bù               | NB                 | Có; gắn nghĩa vụ bù    |
| OBSERVATION | Dự giờ               | DG                 | Cần xác nhận           |
| TRAINING_CM | Sinh hoạt chuyên môn | CM                 | Cần xác nhận           |
BCTH/BCCĐ/ĐP/HN/KI/BN/HT/
| EVENT_WORKSHOP | Chuyên đề/sự kiện |     | Có; theo rule từng mã |
| -------------- | ----------------- | --- | --------------------- |
TQ/CA
Không tính tiết dạy cho người nghỉ
| TEACHER_LEAVE | Nghỉ giáo viên | LEAVE |     |
| ------------- | -------------- | ----- | --- |
trừ chính sách riêng
Không tính tiết thực hiện; có thể tạo
| SCHOOL_OFF | Trường báo nghỉ | SCHOOL_OFF | obligation |
| ---------- | --------------- | ---------- | ---------- |
Bắt buộc duyệt rule trước khi
| OTHER | Khác | Theo cấu hình | payroll |
| ----- | ---- | ------------- | ------- |
A.4. Các mã/thuật ngữ còn cần mapping
| Mã/giá trị nguồn |     | Cần làm rõ |     |
| ---------------- | --- | ---------- | --- |
Nhãn dạy thay; không nên làm conversion code nếu không có hệ số
DT
riêng.
NB Nhãn dạy bù/ngày nghỉ gốc; làm rõ quan hệ với rule quy đổi.
Nghiệp vụ nhận lại lớp/bàn giao; không phải lịch dạy nếu chỉ là sự
NL
kiện HR/assignment.
DG Dự giờ; xác định có tính tiết và có làm bận TCS hay không.
Sinh hoạt chuyên môn; nguồn PDF nêu 0.0 nhưng workbook có biểu
CM
thức cần rà soát.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 24

SRS v2.0  |  WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
Mã/giá trị nguồn Cần làm rõ
Xuất hiện trong công thức Excel theo lần rà soát; cần giải nghĩa và
TC
xác nhận.
GV mới Mã tạm không được sử dụng làm unique key.
K - điểm khác Phải có danh mục location/địa chỉ và quy trình xác nhận người chịu
trách nhiệm.
PHỤ LỤC B. BỘ TEST DỮ LIỆU TÍNH TOÁN MẪU
B.1. TCS theo ngưỡng nguồn
| Tổng tiết quy đổi buổi | Kết quả theo ngưỡng | Ghi chú |
| ---------------------- | ------------------- | ------- |
Cần kết hợp availability, leave và các điều
| 0.00 | TRỐNG |     |
| ---- | ----- | --- |
kiện khác.
| 0.40 | TRỐNG | Bằng ngưỡng vẫn là TRỐNG theo PDF. |
| ---- | ----- | ---------------------------------- |
| 0.41 | BẬN   | Lớn hơn 0.4 là BẬN.                |
| 0.50 | BẬN   | Có thể là hỗ trợ teambuilding 0.5. |
| 1.00 | BẬN   | Một tiết quy đổi đầy đủ.           |
B.2. CTP - kiểm thử biên
| Điểm đi | KM     | Mức áp dụng theo nguồn |
| ------- | ------ | ---------------------- |
| N       | 11.9   | 0                      |
| N       | 12.0   | 30.000                 |
| N       | 18.0   | 40.000                 |
| N       | 24.0   | 60.000                 |
| N       | 30.0   | 80.000                 |
| N       | 50.0   | 120.000                |
| V/K     | 6.9    | 0                      |
| V/K     | 7.0    | 30.000                 |
| V/K     | 12.0   | 40.000                 |
| V/K     | 18.0   | 60.000                 |
| V/K     | 24.0   | 80.000                 |
| V/K     | 30.0   | 110.000                |
| Online  | Bất kỳ | 0                      |
Các kết quả ở bảng này là cách diễn giải khoảng dưới ngưỡng/đến ngưỡng theo văn bản PDF; chủ nghiệp vụ cần ký xác nhận chính
sách biên trước khi phát triển.
B.3. Các ca kiểm thử nghiệp vụ phức hợp
| Scenario | Dữ liệu đầu vào | Kết quả mong đợi |
| -------- | --------------- | ---------------- |
Sinh 4 ca hoạt động và một bản ghi/đề xuất
Template có 5 ca; ngày thứ Tư trường nghỉ;
S1 - Copy tuần có ngày nghỉ trường copy sang tuần mới. trạng thái trường nghỉ theo calendar; không copy
ca ADHOC tuần cũ.
|     | GV A có REGULAR event; leave approved; GV  | Event gốc giữ nguyên; assignment A ghi  |
| --- | ------------------------------------------ | --------------------------------------- |
S2 - Giáo viên nghỉ có người thay nghỉ/không thực hiện; assignment B
B đủ chứng chỉ và trống slot.
SUBSTITUTE liên kết event gốc.
|     | Một school-off obligation 2 tiết được xếp hai ca  | Obligation còn 1/2 sau ca đầu; FULFILLED sau  |
| --- | ------------------------------------------------- | --------------------------------------------- |
S3 - Dạy bù nhiều lần
|     | bù một tiết. | ca thứ hai; không tạo double credit. |
| --- | ------------ | ------------------------------------ |
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM  •  PHIÊN BẢN 2.0  |  Trang 25

SRS v2.0 | WEBAPP QUẢN LÝ NHÂN SỰ & ĐIỀU PHỐI LỊCH GIẢNG DẠY
Scenario Dữ liệu đầu vào Kết quả mong đợi
GV dạy trường A lúc 8:00-9:00, trường B lúc Conflict engine cảnh báo/chặn vì không đủ thời
S4 - Hai trường trong một buổi
9:10-10:00; thời gian di chuyển 25 phút. gian di chuyển 10 phút.
Báo cáo tháng 4 nhận event ngày 30/04; tháng 5
S5 - Tuần giao thoa tháng Event vào 30/04 và 01/05 trong cùng tuần.
nhận event ngày 01/05.
Rate CTV 130k tới 30/06; rule mới 140k từ Event trước 01/07 dùng 130k; từ 01/07 dùng
S6 - Rule đổi hiệu lực
01/07. 140k; payroll đã khóa không đổi.
PHỤ LỤC C. CHECKLIST PHÊ DUYỆT TRƯỚC PHÁT TRIỂN
☐ Chốt định nghĩa Schedule Event / Schedule Assignment / Period Slot.
☐ Chốt danh sách activity_type, business_tag, conversion_code và ý nghĩa CM/TC/BN/NB/DT/NL/DG.
☐ Chốt quỹ tiết KNS/STEM/CDS/AI và cách xử lý môn ghép STEM+AI.
☐ Chốt CTP theo buổi/nhiều trường, nguồn distance, điểm N/V/K và override.
☐ Chốt công thức CTV nhóm >=2 và <2 tiết/buổi, đơn giá theo hợp đồng và hiệu lực.
☐ Chốt TCS: Chủ Nhật, trạng thái nào chiếm lịch, availability khai báo, chứng chỉ, thời gian di chuyển.
☐ Chốt quy trình leave/substitute/school-off/makeup/handover và người duyệt.
☐ Chốt kỳ công, cut-off, đối soát, khóa/mở khóa và adjustment.
☐ Chốt phân quyền dữ liệu nhạy cảm và maker-checker.
☐ Chốt danh mục trường/campus/lớp/pháp nhân/môn và mapping alias.
☐ Chốt yêu cầu phi chức năng: tải, SLA, RPO/RTO, retention, tích hợp email/SSO.
☐ Ký duyệt ERD, Data Dictionary, Workflow, Rulebook, Wireframe, Migration Mapping và UAT plan.
PHÊ DUYỆT TÀI LIỆU
Vai trò phê duyệt Họ tên Chữ ký Ngày
Chủ nghiệp vụ / Product Owner
Đại diện Giáo vụ
Đại diện HR
Đại diện Kế toán/Payroll
Đại diện IT/Đơn vị phát triển
Khi được ký duyệt, các quy tắc P0 và phạm vi MVP trong tài liệu trở thành baseline phát triển. Mọi thay đổi tiếp theo phải được quản lý
theo change request.
TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM • PHIÊN BẢN 2.0 | Trang 26