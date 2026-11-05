
<!-- page 1 -->
TÀI LIỆU ĐẶC TẢ
YÊU CẦU PHẦN MỀM
SOFTWARE REQUIREMENTS SPECIFICATION
WEBAPP QUẢN LÝ NHÂN SỰ &
ĐIỀU PHỐI LỊCH GIẢNG DẠY
VĂN PHÒNG HÀ NỘI

| THUỘC TÍNH | GIÁ TRỊ |
|---|---|
| Mã tài liệu | SRS-HR-SCHED-HN-002 |
| Phiên bản | 2.0 - Bản baseline đề xuất để thẩm định |
| Ngày lập | 04/11/2026 |
| Trạng thái | DRAFT FOR BUSINESS REVIEW - Chưa được chủ nghiệp vụ phê duyệt |
| Đơn vị áp dụng | Văn phòng Hà Nội |
| Nguồn đầu vào | SRS v1.0 PDF; workbook lịch 26-27; workbook thông tin giáo viên VP Hà Nội |

LƯU Ý PHÊ DUYỆT Tài liệu này là bản đặc tả v2 được tổng hợp và mở rộng từ tài liệu/ dữ liệu đính kèm. Các nội dung có
nhãn CẦN XÁC NHẬN hoặc ĐỀ XUẤT V2 phải được chủ nghiệp vụ xác nhận trước khi chốt thiết kế chi tiết và phát triển
chính thức.

<!-- page 2 -->

## KIỂM SOÁT TÀI LIỆU

| Mục | Nội dung |
|---|---|
| Mục đích | Làm căn cứ thống nhất nghiệp vụ, dữ liệu, chức năng, quy tắc tính toán, kiểm thử và nghiệm thu Webapp. |
| Đối tượng đọc | Chủ nghiệp vụ, Ban quản lý, Giáo vụ, HR, Kế toán, Product Owner, BA, UI/UX, Backend, Frontend, QA và đơn vị triển khai. |
| Phạm vi phiên bản | Mô tả baseline nghiệp vụ và thiết kế logic cho VP Hà Nội; chưa thay thế quyết định phê duyệt nghiệp vụ của doanh nghiệp. |
| Ngôn ngữ | Tiếng Việt; tên bảng/trường, enum và mã kỹ thuật sử dụng tiếng Anh không dấu. |
| Nguyên tắc cập nhật | Mọi thay đổi ảnh hưởng đến công, lương, CTP, dữ liệu lịch hoặc quyền truy cập phải có mã thay đổi, người duyệt và ngày hiệu lực. |

Lịch sử phiên bản

| Phiên bản | Ngày | Người soạn | Nội dung |
|---|---|---|---|
| 1.0 | Theo tài liệu gốc | Tài liệu nguồn | Đặc tả ý tưởng hệ thống, phân hệ, một phần schema và quy tắc tính. |
| 2.0 | 04/11/2026 | OpenAI - bản hỗ trợ soạn thảo | Chuẩn hóa yêu cầu; bổ sung workflow, state, RBAC, data model, rulebook, migration, NFR, test và danh sách cần xác nhận. |

Trạng thái thông tin trong tài liệu

| Nhãn | Ý nghĩa | Cách sử dụng |
|---|---|---|
| [NGUỒN] | Nội dung đã nêu trong PDF/Excel đính kèm. | Giữ thuật ngữ và giá trị nguồn; vẫn phải xác nhận nếu nguồn có mâu thuẫn. |
| [ĐỀ XUẤT V2] | Thiết kế khuyến nghị nhằm biến ý tưởng thành đặc tả triển khai. | Là baseline đề xuất; Product Owner/chủ nghiệp vụ phê duyệt hoặc điều chỉnh. |
| [CẦN XÁC NHẬN] | Nguồn chưa đủ rõ, thiếu công thức hoặc mâu thuẫn. | Không hardcode và không tự suy diễn trong code trước khi có quyết định. |
| [MVP] | Phạm vi ưu tiên cho bản triển khai đầu tiên. | Đưa vào kế hoạch release; các tính năng ngoài MVP vẫn phải được thiết kế mở rộng. |


## MỤC LỤC

| PHẦN | PHẦN |
|---|---|
| 1. Tổng quan và bối cảnh hệ thống | 10. Yêu cầu giao diện và báo cáo |
| 2. Mục tiêu, phạm vi và giả định | 11. Migration, import/export và chuyển đổi dữ liệu |
| 3. Thuật ngữ và mô hình nghiệp vụ | 12. Yêu cầu phi chức năng, bảo mật và vận hành |
| 4. Vai trò, người dùng và phân quyền | 13. Kiểm thử và tiêu chí nghiệm thu |
| 5. Quy trình nghiệp vụ TO-BE | 14. Danh sách vấn đề cần xác nhận |
| 6. Yêu cầu chức năng | 15. Đề xuất phân kỳ triển khai |
| 7. Quy tắc nghiệp vụ và công thức tính | Phụ lục A. Danh mục dữ liệu và mã nghiệp vụ |
| 8. Mô hình dữ liệu và quy tắc toàn vẹn | Phụ lục B. Bộ test dữ liệu tính toán mẫu |
| 9. Trạng thái và nhật ký vòng đời | Phụ lục C. Checklist phê duyệt trước phát triển |


<!-- page 3 -->

## 1. TỔNG QUAN VÀ BỐI CẢNH HỆ THỐNG

### 1.1. Mục đích tài liệu
Tài liệu xác định yêu cầu đối với Webapp quản lý hồ sơ nhân sự, năng lực giảng dạy, phân công trường/lớp, điều phối
lịch tuần, xử lý lịch phát sinh, tra cứu lịch trống/bận (TCS), tính tiết quy đổi, công tác phí (CTP), thù lao CTV và đối soát
công theo kỳ. Tài liệu là căn cứ chung để thống nhất giữa đơn vị vận hành và đội xây dựng phần mềm.

### 1.2. Bối cảnh vận hành
Hệ thống phục vụ hoạt động đào tạo các môn Kỹ năng sống (KNS), STEM/STEM Robotics, Công dân số (CDS) và Trí
tuệ nhân tạo (AI) tại các trường Tiểu học và THCS trên địa bàn Hà Nội. Các pháp nhân được nêu trong tài liệu nguồn
gồm GAIA, NEWG và 8BC. Dữ liệu hiện được quản lý phân tán ở workbook hồ sơ giáo viên và workbook điều phối lịch
giảng dạy.

### 1.3. Hiện trạng dữ liệu nguồn đã rà soát

| Nguồn | Cấu trúc/quan sát | Hàm ý với hệ thống mới |
|---|---|---|
| THÔNG TIN GIÁO VIÊN VP HÀ NỘI.xlsx | 03 sheet: 20 hồ sơ đang làm việc, 12 hồ sơ đã nghỉ việc và phân công xuống trường theo năm học. Có 6 hồ sơ đang dùng mã tạm “GV mới”; 9/20 hồ sơ đang làm việc có official_date và 13/20 có company_email trong snapshot rà soát. | Cần data profiling, chuẩn hóa mã/alias, phân biệt nhân sự với tài khoản và phân công có hiệu lực theo thời gian. |
| LỊCH HÀ NỘI - NH - 26-27 (1).xlsx | Workbook có 41 sheet: 36 sheet tuần và các sheet phụ trợ/tổng hợp TCS, TỔNG TIẾT, CTV, MAIL. Có 17 mã CTV khác nhau xuất hiện trong lịch tuần được rà soát. | Cần nhập theo batch, mapping các trường dữ liệu và kiểm thử đối soát. Không dùng bố cục lưới làm mô hình database. |
| Lỗi công thức trong snapshot đã rà soát | Trong snapshot rà soát có 228 ô #VALUE! ở sheet TCS và 28 ô #N/A ở sheet TỔNG TIẾT. | Kết quả công thức chỉ dùng đối soát tham khảo; dữ liệu lịch gốc và quy tắc đã xác nhận mới là nguồn tính lại. |
| Mã nhân sự và danh mục | Có mã HN007/GVHN007; giá trị mã tạm như GV mới; tên trường, pháp nhân, môn học có biến thể. | Cần bảng alias và hàng đợi mapping chưa xác định; không tự ghép theo tên gần giống. |
| Danh sách CTV | CTV xuất hiện trong workbook lịch nhưng hồ sơ CTV chưa được thể hiện thành một danh mục hồ sơ đầy đủ trong workbook HR được cung cấp. | Cần mô-đun hồ sơ CTV hoặc hồ sơ nhân sự có loại quan hệ/hợp đồng riêng. |

NGUYÊN TẮC MIGRATION Không import trực tiếp ô tổng hợp, màu sắc hoặc kết quả công thức như dữ liệu chuẩn.
Import bản ghi nguồn, giữ nguyên giá trị gốc, mapping sang danh mục chuẩn, ghi lỗi và đối soát trước khi cut-over.

### 1.4. Các điểm nghẽn cần giải quyết
 Ma trận lịch tuần quá rộng, nhiều ô trống, khó tra cứu và thao tác trên điện thoại.
 Nhân bản sheet thủ công, khó quản lý lịch sử thay đổi và tuần giao thoa tháng.
 Tên nhân sự, trường, phân hiệu, pháp nhân, lớp, môn học được nhập tự do dẫn đến sai lệch.
 Quy ước màu sắc đang mang ý nghĩa nghiệp vụ nhưng không phải dữ liệu có cấu trúc.
 TCS phụ thuộc công thức tra cứu phức tạp; kết quả dễ lỗi và khó truy nguyên.
 Tổng tiết, CTP và thù lao CTV cần được tính thống nhất từ dữ liệu lịch đã xác nhận.

## 2. MỤC TIÊU, PHẠM VI VÀ GIẢ ĐỊNH

### 2.1. Mục tiêu
 Tập trung dữ liệu nhân sự, trường/cơ sở, lớp, môn học, pháp nhân, chứng chỉ, lịch phân công và lịch giảng dạy trong
một nguồn dữ liệu chuẩn.
 Cho phép quản lý lịch cố định và lịch phát sinh theo từng ngày/tuần, có kiểm tra xung đột và lịch sử thay đổi.
 Tự động hóa TCS, quy đổi tiết, CTP và tổng hợp thù lao theo bộ quy tắc có phiên bản và hiệu lực.
 Quản lý vòng đời đơn nghỉ, dạy thay, dạy bù, bàn giao lớp và xác nhận tiết thực tế.
 Cho phép HR, Giáo vụ, Kế toán và giáo viên sử dụng góc nhìn phù hợp với quyền hạn.
 Loại bỏ phụ thuộc vào thao tác copy sheet; cho phép drill-down từ báo cáo về giao dịch gốc.

<!-- page 4 -->

### 2.2. Phạm vi trong release mục tiêu

| Nhóm phạm vi | Bao gồm |
|---|---|
| HR & hồ sơ năng lực | Hồ sơ giáo viên/CTV, trạng thái làm việc, hợp đồng, chứng chỉ, thông tin liên hệ, thông tin phục vụ CTP, lịch sử thay đổi. |
| Master data | Pháp nhân, trường, phân hiệu, lớp, môn học, địa điểm, năm học, lịch hoạt động/nghỉ của trường. |
| School assignment | Phân công người phụ trách theo trường/lớp/môn/vai trò, thời gian hiệu lực, nhận lại lớp/bàn giao. |
| Scheduling | Lịch mẫu/định kỳ, lịch theo tuần, lịch phát sinh, copy tuần, kiểm tra xung đột, công bố và hủy/sửa lịch. |
| Availability & leave | TCS, lịch rảnh khai báo, đơn nghỉ phép, điều động dạy thay, đổi ca. |
| Makeup & events | Trường báo nghỉ, nghĩa vụ dạy bù, dạy bù, dự giờ, chuyên môn, sự kiện/chuyên đề. |
| Time & payroll | Xác nhận tiết thực hiện, tiết quy đổi, CTP, thù lao CTV, kỳ công, đối soát, duyệt và khóa kỳ. |
| Reporting & export | Dashboard, báo cáo theo giáo viên/trường/môn/pháp nhân/kỳ, xuất Excel theo quyền. |
| Administration | RBAC, audit log, thông báo, import batch và quản lý lỗi dữ liệu. |


### 2.3. Ngoài phạm vi hoặc chưa cam kết trong baseline
 Tính lương tổng thể bao gồm thuế, bảo hiểm, khấu trừ hoặc tích hợp phần mềm kế toán/ERP: chưa có đủ yêu cầu
nguồn để đặc tả.
 GPS/QR điểm danh, tracking vị trí thời gian thực: chỉ là hướng mở rộng, chưa thuộc MVP.
 Tối ưu tuyến đường tự động bằng dữ liệu bản đồ thời gian thực: chỉ triển khai khi có quyết định tích hợp và nguồn dữ
liệu.
 Ứng dụng native iOS/Android riêng: baseline ưu tiên web responsive/PWA; cần xác nhận nếu có yêu cầu khác.
 Đồng bộ hai chiều với Google Sheets: mặc định không nằm trong phạm vi; Webapp là nguồn dữ liệu chính thức,
Excel/Sheets là kênh import/export.

### 2.4. Giả định và nguyên tắc
 Múi giờ vận hành: Asia/Ho_Chi_Minh; tiền tệ: VND; ngày giờ lưu và hiển thị theo quy ước thống nhất của hệ thống.
 Lịch làm việc có thể có Thứ Hai đến Chủ Nhật; TCS hiện tại được nguồn mô tả từ Thứ Hai đến Thứ Bảy. Phạm vi
Chủ Nhật cần xác nhận.
 Một giáo viên có thể mang nhiều vai trò hệ thống; một tài khoản có thể gắn một hoặc nhiều role và data scope.
 Lịch dự kiến, lịch được công bố và lịch thực tế hoàn thành là ba khái niệm khác nhau.
 Không xóa cứng lịch sử nhân sự, lịch dạy, bàn giao và kỳ công; dùng trạng thái, hiệu lực và audit log.

## 3. THUẬT NGỮ VÀ MÔ HÌNH NGHIỆP VỤ

| Thuật ngữ | Định nghĩa dùng trong SRS v2 |
|---|---|
| REGULAR | Lịch định kỳ/lịch chính được sinh từ lịch mẫu hoặc từ kế hoạch được phê duyệt. |
| ADHOC | Lịch phát sinh: dạy thay, dạy bù, dự giờ, chuyên môn, sự kiện, chuyên đề hoặc hoạt động ngoài định kỳ. |
| Schedule Event | Một hoạt động/buổi được xếp tại một thời điểm và địa điểm, có thể kéo dài một hoặc nhiều tiết. |
| Schedule Assignment | Phân công một nhân sự vào một Schedule Event với vai trò cụ thể (giáo viên chính, hỗ trợ, CTV, báo cáo viên...). |
| Period Slot | Tiết/slot thuộc một buổi; dùng để kiểm tra trùng giờ và tổng hợp tiết. |
| Conversion Code | Mã quy đổi dùng để xác định giá trị tiết và quỹ tiết được cộng. |
| Activity Type | Bản chất hoạt động như TEACHING, SUBSTITUTE, MAKEUP, OBSERVATION, TRAINING, EVENT, LEAVE, SCHOOL_OFF. |
| Business Tag | Nhãn vận hành DT, NB, NL, DG, CM...; không mặc nhiên đồng nghĩa với mã quy đổi. |


<!-- page 5 -->

| Thuật ngữ | Định nghĩa dùng trong SRS v2 |
|---|---|
| TCS | Teacher/Credential/Calendar Availability hoặc ma trận lịch trống/bận theo định nghĩa vận hành trong workbook. |
| CTP | Công tác phí di chuyển, tính theo điểm xuất phát, khoảng cách và bảng mức phí có hiệu lực. |
| Pay Period | Kỳ tổng hợp công/thù lao; có ngày bắt đầu, ngày kết thúc và trạng thái khóa. |
| Makeup Obligation | Nghĩa vụ dạy bù được tạo ra khi trường báo nghỉ/tiết gốc cần bù; được liên kết đến một hoặc nhiều ca bù. |
| Handover | Quy trình bàn giao trách nhiệm lớp/môn từ nhân sự cũ sang nhân sự mới, có thời gian hiệu lực. |


### 3.1. Mô hình đối tượng khái niệm

| Đối tượng | Quan hệ chính |
|---|---|
| Employee | Có thể có 1 tài khoản hoặc không; có nhiều mã alias, hợp đồng, chứng chỉ, địa điểm xuất phát và lịch sử công tác. |
| School / Campus / Class | Trường có thể có nhiều phân hiệu/cơ sở; cơ sở có nhiều lớp; lớp thuộc niên khóa và có thể thay đổi theo năm. |
| Assignment | Gắn nhân sự với trường/cơ sở/lớp/môn/vai trò trong khoảng hiệu lực. |
| Schedule Template | Định nghĩa lịch định kỳ; sinh ra nhiều Schedule Event theo ngày thực tế. |
| Schedule Event | Có nhiều Period Slot và một/nhiều Schedule Assignment; có thể liên kết event gốc/thay/bù. |
| Conversion Rule | Được áp dụng cho Assignment/hoạt động theo effective date; tạo snapshot kết quả quy đổi. |
| Travel Trip | Một chuyến/phiên di chuyển theo nhân sự và buổi, có thể bao gồm nhiều chặng; cách tính CTP cần chủ nghiệp vụ chốt. |
| Payroll Run | Tập hợp các dòng công/tiết/CTP/thù lao của một kỳ; khi khóa sẽ đóng băng snapshot quy tắc và dữ liệu. |

MÔ HÌNH LỊCH ĐỀ XUẤT V2 Không dùng một dòng lịch duy nhất để vừa đại diện hoạt động, vừa đại diện mọi giáo viên,
vừa đại diện mọi tiết. Tách Schedule Event, Schedule Assignment và Period Slot để hỗ trợ nhiều giáo viên trong một buổi,
nhiều tiết trong một buổi, và tính công theo nhân sự.

## 4. VAI TRÒ, NGƯỜI DÙNG VÀ PHÂN QUYỀN

### 4.1. Nhóm người dùng

| Role đề xuất | Đối tượng | Nhiệm vụ chính |
|---|---|---|
| SUPER_ADMIN | Quản trị kỹ thuật/hệ thống | Quản lý cấu hình hệ thống, tài khoản, role, tham số môi trường; không mặc nhiên xem dữ liệu nhạy cảm nếu không được cấp quyền. |
| ADMIN / TEAM_LEAD | Nhóm trưởng/chuyên môn | Duyệt phân công, cấu hình danh mục nghiệp vụ, duyệt nghỉ/bàn giao, phân công DG/CM, duyệt và khóa kỳ theo ủy quyền. |
| COORDINATOR | Giáo vụ/điều phối | Thiết lập kế hoạch năm học, copy lịch, điều phối ca, xử lý DT/NB, xem TCS, công bố lịch. |
| HR | Hành chính - nhân sự | Quản lý hồ sơ, hợp đồng, onboarding/offboarding, chứng chỉ, thông tin cá nhân và thông báo nhân sự. |
| PAYROLL | Kế toán lương/đối soát | Xem dữ liệu công và mức chi theo phạm vi, tạo/đối soát payroll run, xuất báo cáo, đề nghị điều chỉnh. |


<!-- page 6 -->

| Role đề xuất | Đối tượng | Nhiệm vụ chính |
|---|---|---|
| TEACHER | Giáo viên cơ hữu/báo cáo viên | Xem lịch cá nhân, cập nhật yêu cầu nghỉ/đổi ca, xác nhận hoạt động đã thực hiện, gửi phản hồi/đề nghị điều chỉnh. |
| COLLABORATOR | CTV | Cập nhật availability, xem lịch được phân công, xác nhận hoạt động, xem bảng đối soát CTV được phép. |
| SCHOOL_VIEWER (optional) | Đầu mối trường/đối tác nếu được cấp tài khoản | Chỉ xem lịch của trường/lớp được gán; chưa nằm trong role bắt buộc của nguồn, cần quyết định nếu triển khai. |


### 4.2. Nguyên tắc phân quyền
 RBAC kết hợp data scope: role quyết định hành động; data scope giới hạn pháp nhân, trường, lớp, nhân sự hoặc
đơn vị được truy cập.
 Một nhân sự có thể kiêm nhiệm nhiều vai trò. Không dùng một cột ENUM duy nhất trên employees để biểu diễn role
hệ thống.
 Tách quyền xem/sửa/xóa mềm/duyệt/công bố/khóa kỳ/xuất dữ liệu; quyền xuất CCCD, tài khoản ngân hàng là quyền
nhạy cảm riêng.
 Người tạo không được tự duyệt giao dịch nhạy cảm của chính mình trừ khi có chính sách maker-checker được phê
duyệt.
 Quyền hiệu lực có thời hạn và phải được thu hồi khi nhân sự thay đổi vị trí hoặc nghỉ việc.

### 4.3. Ma trận quyền baseline

| Chức năng | Admin | Giáo vụ | HR/Payroll | GV | CTV |
|---|---|---|---|---|---|
| Xem/sửa danh mục trường, lớp, môn, pháp nhân | Có | Theo phân công | Không | Không | Không |
| Xem/sửa hồ sơ HR đầy đủ | Theo quyền | Không | Có | Chỉ hồ sơ cá nhân giới hạn | Chỉ hồ sơ cá nhân giới hạn |
| Xem CCCD/tài khoản ngân hàng | Theo quyền nhạy cảm | Không | Có theo nhiệm vụ | Chỉ dữ liệu của mình nếu chính sách cho phép | Chỉ dữ liệu của mình nếu chính sách cho phép |
| Tạo/sửa lịch nháp | Có | Có | Không | Không | Không |
| Duyệt/công bố lịch | Có | Theo ủy quyền | Không | Không | Không |
| Tạo đơn nghỉ/đổi ca | Có thể | Có thể | Không | Có | Có |
| Duyệt nghỉ/dạy thay | Có | Theo ủy quyền | Không | Không | Không |
| Xem TCS toàn văn phòng | Có | Có | Theo quyền | Không | Không |
| Xác nhận tiết đã thực hiện | Theo quyền | Theo quyền | Không | Có lịch của mình | Có lịch của mình |
| Xem bảng công cá nhân | Có | Theo quyền | Có | Có của mình | Có của mình |
| Xem toàn bộ bảng công và đơn giá | Theo quyền | Không | Có theo phạm vi | Không | Không |
| Điều chỉnh công/CTP sau đối soát | Theo ủy quyền | Không | Đề nghị/duyệt theo tách quyền | Không | Không |
| Khóa/mở kỳ công | Theo phân quyền | Không | Có nếu được ủy quyền | Không | Không |
| Audit log | Có theo quyền | Log lịch trong phạm vi | Log HR/payroll theo quyền | Không | Không |

Ma trận trên là baseline đề xuất, không phải quyết định tổ chức đã được xác nhận. Cần chỉ định role nào được duyệt từng loại yêu cầu
và phạm vi dữ liệu cụ thể.

<!-- page 7 -->

## 5. QUY TRÌNH NGHIỆP VỤ TO-BE

### 5.1. Vòng đời nhân sự (HR Lifecycle)

| Bước | Vai trò | Xử lý và kết quả |
|---|---|---|
| HR-01 Tiếp nhận | HR | Tạo hồ sơ nhân sự, mã chuẩn, loại lao động, thông tin liên hệ, địa chỉ hiện tại, ngày nhận việc và tài liệu cần thiết. |
| HR-02 Xác thực | HR/Admin | Kiểm tra trùng CCCD/email/điện thoại/mã alias; trạng thái hồ sơ DRAFT → VERIFIED. |
| HR-03 Hợp đồng/thử việc | HR | Tạo hợp đồng, ngày bắt đầu/kết thúc, ngày chính thức dự kiến; hệ thống nhắc trước 7 ngày theo yêu cầu nguồn (cần cấu hình). |
| HR-04 Năng lực | HR/Team Lead | Ghi nhận bằng cấp/chứng chỉ, ngày cấp/hết hạn, file và trạng thái xác minh. |
| HR-05 Cấp tài khoản | Admin | Tạo user, gắn nhiều role và data scope; kích hoạt/khóa theo quy trình. |
| HR-06 Nghỉ việc | HR/Admin | Ghi ngày thôi việc; cảnh báo các lớp/ca sắp tới; tạo danh sách bàn giao; khóa đăng nhập nhưng giữ lịch sử. |
| HR-07 Lưu trữ | Hệ thống | Chuyển hồ sơ sang RESIGNED/ARCHIVED; bảo toàn giao dịch, payroll đã khóa và audit log. |


### 5.2. Phân công giáo viên xuống trường và bàn giao lớp
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

### 5.3. Thiết lập lịch định kỳ và copy tuần

| Bước | Mô tả | Kiểm soát bắt buộc |
|---|---|---|
| SC-01 Tạo template | Tạo lịch mẫu theo trường/cơ sở/lớp/môn, ngày trong tuần, buổi, tiết, khung giờ, nhân sự và vai trò. | Kiểm tra lớp tồn tại, assignment còn hiệu lực, chứng chỉ và thời lượng hợp lệ. |
| SC-02 Sinh tuần | Chọn tuần đích hoặc khoảng ngày để sinh lịch REGULAR từ template/tuần chuẩn. | Không copy ADHOC tạm thời, đơn nghỉ hoặc dạy thay cũ; không tạo trùng event. |
| SC-03 Preview | Hiển thị số ca tạo mới, ca bỏ qua, ca có thay đổi, xung đột và dữ liệu không map được. | Người dùng xác nhận trước khi ghi. Có thể hủy toàn bộ thao tác. |
| SC-04 Commit | Ghi lịch với batch_id, source_template/version và người tạo. | Idempotent: chạy lại cùng template/tuần không tạo duplicate. |
| SC-05 Duyệt/công bố | Admin/Coordinator được ủy quyền duyệt, công bố lịch cho các bên. | Sau công bố, chỉnh sửa quan trọng phải lưu version và thông báo. |


### 5.4. Kiểm tra xung đột lịch

| Loại xung đột | Điều kiện phát hiện | Kết quả xử lý |
|---|---|---|
| Nhân sự trùng giờ | Một nhân sự được gán hai hoạt động có khoảng thời gian giao nhau. | BLOCK nếu trùng tuyệt đối; cảnh báo/cho phép override chỉ khi có lý do và quyền. |
| Lớp trùng giờ | Cùng lớp/cùng môn hoặc cùng lớp có hai sự kiện không tương thích trong khoảng thời gian giao nhau. | BLOCK hoặc yêu cầu xác nhận theo chính sách trường. |


<!-- page 8 -->

| Loại xung đột | Điều kiện phát hiện | Kết quả xử lý |
|---|---|---|
| Địa điểm và di chuyển | Thời gian giữa hai hoạt động nhỏ hơn thời gian di chuyển tối thiểu giữa hai địa điểm. | WARNING/BLOCK theo mức cấu hình; nguồn khoảng cách/thời gian phải được xác định. |
| Chứng chỉ/điều kiện | Nhân sự thiếu chứng chỉ bắt buộc hoặc đã hết hạn tại ngày giảng dạy. | BLOCK mặc định; quyền override phải có lý do và phê duyệt. |
| Hợp đồng/trạng thái | Ngày dạy ngoài thời gian hợp đồng hoặc nhân sự đã nghỉ việc. | BLOCK, trừ ngoại lệ có phê duyệt và có hiệu lực pháp lý. |


### 5.5. Nghỉ phép và dạy thay (DT)

| Trạng thái đơn nghỉ | Ý nghĩa | Chuyển tiếp hợp lệ |
|---|---|---|
| DRAFT | Người gửi đang lập đơn. | SUBMITTED hoặc CANCELLED |
| SUBMITTED | Đã gửi chờ duyệt. | APPROVED, REJECTED, WITHDRAWN |
| APPROVED | Đã duyệt; các ca bị ảnh hưởng chuyển sang nhu cầu bố trí thay hoặc trạng thái phù hợp. | CLOSED sau khi xử lý; CANCEL_REQUESTED nếu muốn rút |
| REJECTED | Không được chấp thuận. | Có thể tạo đơn mới; không tự quay về APPROVED |
| WITHDRAWN | Người gửi rút trước khi duyệt. | Kết thúc |
| CLOSED | Đã xử lý xong, các ca liên quan đã được giải quyết. | Không sửa trực tiếp; mở case điều chỉnh nếu cần |

8. Giáo viên gửi đơn theo ngày/buổi/tiết, lý do và tài liệu đính kèm nếu có.
9. Giáo vụ/Approver xem các ca chịu ảnh hưởng và phê duyệt/từ chối.
10. Sau duyệt, hệ thống tạo danh sách ca cần dạy thay; ca gốc vẫn được giữ, không xóa.
11. TCS gợi ý nhân sự theo lịch rảnh, chứng chỉ, hợp đồng, địa bàn và khả năng di chuyển; kết quả chỉ là gợi ý, người
có quyền chọn và chịu trách nhiệm.
12. Khi phân công người thay, tạo Schedule Assignment mới loại SUBSTITUTE, liên kết event gốc và lưu nhân sự bị
thay.
13. Giáo viên thay xác nhận hoạt động thực tế; payroll ghi nhận đúng người thực hiện theo quy tắc đã duyệt.
14. Nếu người thay từ chối hoặc ca thay bị hủy, yêu cầu quay lại hàng đợi điều phối và gửi thông báo.

### 5.6. Trường báo nghỉ và dạy bù (NB)
15. Giáo vụ ghi nhận thông báo trường nghỉ, chọn các ca/lớp/ngày bị ảnh hưởng và bằng chứng/ghi chú.
16. Hệ thống chuyển ca gốc sang SCHOOL_OFF/CANCELLED_BY_SCHOOL theo trạng thái; không ghi nhận như tiết
đã dạy.
17. Tạo Makeup Obligation cho phần nội dung/tiết cần bù, liên kết tới ca gốc và trạng thái OPEN.
18. Khi xếp lịch bù, tạo event ADHOC với tag NB và liên kết một hoặc nhiều obligation; hỗ trợ bù một phần hoặc nhiều
ca nếu chủ nghiệp vụ cho phép.
19. Khi ca bù hoàn thành và được xác nhận, cập nhật obligation PARTIALLY_FULFILLED/FULFILLED; ngăn tính trùng
nghĩa vụ.
20. Báo cáo phải chỉ ra ngày nghỉ gốc, ca bù, nhân sự thực hiện và số tiết đã xử lý/còn lại.
CẦN XÁC NHẬN Một tiết gốc có thể được bù thành nhiều ca hay không; có được gộp nhiều tiết gốc vào một ca bù hay
không; ai có quyền xác nhận nghĩa vụ đã hoàn tất.

### 5.7. Sự kiện, chuyên đề, dự giờ và sinh hoạt chuyên môn
Các hoạt động BCTH, BCCĐ, ĐP, HN, KI, BN, HT, TQ, CA, DG, CM được tạo ở tầng ADHOC. Mỗi event phải có loại
hoạt động, người phụ trách, thời gian, địa điểm/online, đơn vị tổ chức, ghi chú, quy tắc quy đổi và bộ đếm sự kiện. Không
sử dụng màu sắc hoặc nội dung notes làm nguồn tính công.

### 5.8. Availability, TCS và đổi ca
 Availability khai báo của CTV/giáo viên được lưu theo tuần, ngày, buổi hoặc khoảng giờ; có trạng thái
DRAFT/SUBMITTED/APPROVED (nếu cần duyệt).
 TCS tính trạng thái từ lịch đã công bố/được duyệt và các hạn chế availability, leave, hợp đồng, chứng chỉ. Lịch
nháp/hủy không được tính bận.
 TCS cung cấp lý do vì sao nhân sự không khả dụng: trùng lịch, không có chứng chỉ, nghỉ, không có hợp đồng hiệu
lực, không đủ thời gian di chuyển.

<!-- page 9 -->
 Yêu cầu đổi ca phải ghi người đề nghị, ca hiện tại, ca mong muốn, người nhận đổi (nếu có), lý do và trạng thái phê
duyệt.
 Đổi ca chỉ có hiệu lực sau phê duyệt và cập nhật đồng bộ các phân công bị ảnh hưởng.

### 5.9. Xác nhận tiết dạy và xử lý sai lệch
 Sau hoạt động, nhân sự được phân công xác nhận đã thực hiện, vắng, không thực hiện hoặc báo sai thông tin.
 Giáo vụ có thể xác minh các ca bất thường, trường báo nghỉ, dạy thay hoặc sự kiện.
 Chỉ ca đủ điều kiện xác nhận mới được đưa vào payroll; lịch đã lên nhưng chưa diễn ra không tự động được coi là
công.
 Mọi sửa đổi sau xác nhận phải có lý do, người duyệt và audit log; kỳ đã khóa chỉ được điều chỉnh bằng payroll
adjustment.

### 5.10. Đối soát và khóa kỳ công

| Giai đoạn | Vai trò | Hành vi |
|---|---|---|
| OPEN | Hệ thống/Payroll | Thu thập các event/assignment đủ điều kiện trong kỳ. |
| RECONCILING | Payroll/HR | Kiểm tra tiết, quỹ môn, event counter, CTP, ca CTV; xem drill-down và cảnh báo. |
| REVIEWED | Người duyệt | Xác nhận dữ liệu đã kiểm tra; khóa các chỉnh sửa trực tiếp hoặc yêu cầu sửa trước duyệt. |
| APPROVED | Người có thẩm quyền | Duyệt kết quả công/thù lao. |
| LOCKED | Payroll/Admin được ủy quyền | Đóng băng snapshot dữ liệu và rule version; không sửa trực tiếp giao dịch nguồn ảnh hưởng kỳ. |
| PAID (optional) | Payroll | Ghi nhận ngày thanh toán/mã tham chiếu thanh toán nếu phạm vi bao gồm. |

Mặc định đề xuất: mỗi payroll run lưu snapshot rule version, đơn giá, kết quả tính và danh sách giao dịch nguồn. Mở
khóa là thao tác đặc quyền, phải có lý do và audit log. Nếu kỳ đã thanh toán, sai lệch xử lý qua adjustment ở kỳ hiện tại
hoặc theo chính sách kế toán được phê duyệt.

## 6. YÊU CẦU CHỨC NĂNG
Các yêu cầu dưới đây có mã để truy vết từ SRS sang thiết kế, test case và nghiệm thu. Mức ưu tiên: MUST = bắt buộc
cho vận hành cốt lõi; SHOULD = nên có trong release đầu; COULD = mở rộng.

### 6.1. Tài khoản và phân quyền

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-IAM-001 | MUST | Hệ thống cho phép tạo, kích hoạt, khóa và vô hiệu hóa tài khoản độc lập với hồ sơ nhân sự. |
| FR-IAM-002 | MUST | Một user có thể được gán nhiều role và một hoặc nhiều data scope; mọi thay đổi quyền được audit. |
| FR-IAM-003 | MUST | Hệ thống kiểm soát quyền xem/sửa/duyệt/công bố/xuất/khóa theo chức năng và dữ liệu. |
| FR-IAM-004 | SHOULD | Hỗ trợ đăng nhập qua email doanh nghiệp/SSO nếu hạ tầng được phê duyệt; nếu không thì dùng cơ chế đăng nhập nội bộ an toàn. |


### 6.2. Hồ sơ HR và năng lực

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-HR-001 | MUST | Tạo, sửa, xem và lưu trữ hồ sơ nhân sự; phân loại cơ hữu/CTV và trạng thái làm việc. |
| FR-HR-002 | MUST | Quản lý mã nhân sự chuẩn và nhiều mã alias; cấm trùng mã chuẩn. |


<!-- page 10 -->

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-HR-003 | MUST | Quản lý hợp đồng, ngày nhận việc, ngày chính thức, ngày hết hạn, ngày nghỉ việc và lịch sử hợp đồng. |
| FR-HR-004 | MUST | Quản lý bằng cấp/chứng chỉ theo loại, ngày cấp/hết hạn, file, trạng thái xác minh và người xác minh. |
| FR-HR-005 | MUST | Quản lý địa chỉ xuất phát mặc định, các điểm xuất phát thay thế và lịch sử hiệu lực phục vụ CTP. |
| FR-HR-006 | MUST | Offboarding khóa tài khoản, hiển thị ca/lớp tương lai cần bàn giao và giữ lịch sử. |
| FR-HR-007 | SHOULD | Nhắc HR trước 7 ngày tới hạn thử việc/hợp đồng theo cấu hình và người nhận. |
| FR-HR-008 | MUST | Hỗ trợ hồ sơ CTV và thuộc tính hợp đồng/đơn giá/availability riêng. |


### 6.3. Master data và phân công

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-MD-001 | MUST | Quản lý pháp nhân, trường, phân hiệu/campus, địa điểm, lớp, môn, năm học và lịch trường. |
| FR-MD-002 | MUST | Mỗi danh mục có mã duy nhất, trạng thái hoạt động, ngày hiệu lực và alias nếu cần. |
| FR-ASG-001 | MUST | Phân công giáo viên chính/hỗ trợ/CTV theo trường, campus, lớp, môn và khoảng hiệu lực. |
| FR-ASG-002 | MUST | Kiểm tra điều kiện chứng chỉ và hợp đồng tại thời điểm phân công. |
| FR-ASG-003 | MUST | Tạo, duyệt và tra cứu lịch sử bàn giao lớp; hỗ trợ nhiều lần bàn giao. |
| FR-ASG-004 | SHOULD | Báo cáo lớp/môn chưa có nhân sự phụ trách hoặc chưa có lịch tương ứng. |


### 6.4. Scheduling

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-SCH-001 | MUST | Tạo lịch mẫu REGULAR theo trường/lớp/môn/ngày/buổi/tiết/khung giờ/nhân sự. |
| FR-SCH-002 | MUST | Sinh lịch theo ngày hoặc tuần từ template/tuần gốc và ghi lại nguồn sinh. |
| FR-SCH-003 | MUST | Copy tuần có preview, kiểm tra xung đột, log kết quả và cơ chế chống tạo trùng. |
| FR-SCH-004 | MUST | Tạo, sửa, hủy event ADHOC; hỗ trợ SUBSTITUTE, MAKEUP, OBSERVATION, TRAINING, EVENT. |
| FR-SCH-005 | MUST | Kiểm tra trùng giờ nhân sự/lớp và thời gian di chuyển khi có dữ liệu đủ. |
| FR-SCH-006 | MUST | Lưu lịch sử phiên bản và người sửa; phân biệt DRAFT, PUBLISHED, CANCELLED, COMPLETED. |
| FR-SCH-007 | MUST | Hỗ trợ nhiều nhân sự trong một event và nhiều period slot trong một buổi. |
| FR-SCH-008 | SHOULD | Công bố lịch và gửi thông báo tới người chịu ảnh hưởng. |


<!-- page 11 -->

### 6.5. Leave, substitute, makeup, availability

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-LVM-001 | MUST | Tạo, gửi, duyệt, từ chối, rút đơn nghỉ; liên kết các ca bị ảnh hưởng. |
| FR-LVM-002 | MUST | Sinh nhu cầu dạy thay từ ca gốc; liên kết ca thay và nhân sự bị thay. |
| FR-LVM-003 | MUST | Ghi nhận trường báo nghỉ và tạo makeup obligation có trạng thái. |
| FR-LVM-004 | MUST | Liên kết ca dạy bù với obligation gốc; kiểm soát bù một phần/đủ theo chính sách. |
| FR-LVM-005 | SHOULD | Cho phép giáo viên/CTV khai báo availability theo ngày/buổi/khoảng giờ. |
| FR-LVM-006 | SHOULD | Tạo và duyệt yêu cầu đổi ca; chỉ áp dụng sau duyệt. |


### 6.6. TCS, conversion, CTP, CTV

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-CAL-001 | MUST | Tính TCS theo lịch đủ điều kiện, leave, availability, hợp đồng, chứng chỉ và ngày/khung giờ. |
| FR-CAL-002 | MUST | Hiển thị lý do bận/không phù hợp và bộ lọc nhân sự thay thế. |
| FR-CAL-003 | MUST | Quản lý conversion rules theo phiên bản, ngày hiệu lực và quỹ tiết/bộ đếm. |
| FR-CAL-004 | MUST | Tính tiết quy đổi và lưu snapshot đầu vào/đầu ra của mỗi assignment. |
| FR-CAL-005 | MUST | Quản lý bảng CTP theo điểm xuất phát, khoảng cách và thời gian hiệu lực. |
| FR-CAL-006 | MUST | Tính và lưu từng travel allowance item; cho phép override có lý do/phê duyệt. |
| FR-CAL-007 | MUST | Tính thù lao CTV theo buổi và rule version; tách ca >=2 tiết và <2 tiết. |
| FR-CAL-008 | MUST | Drill-down mọi chỉ số công/CTP/thù lao về event, assignment, period và rule đã áp dụng. |


### 6.7. Payroll và báo cáo

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-PAY-001 | MUST | Quản lý kỳ công theo start_date/end_date và loại kỳ. |
| FR-PAY-002 | MUST | Tạo payroll run, tổng hợp theo giáo viên/CTV/môn/quỹ tiết/event counter/CTP. |
| FR-PAY-003 | MUST | Đối soát và xử lý ngoại lệ trước khi duyệt/khóa kỳ. |
| FR-PAY-004 | MUST | Khóa kỳ và snapshot rule, dữ liệu, đơn giá; ngăn sửa trực tiếp sau khóa. |
| FR-PAY-005 | SHOULD | Tạo adjustment có liên kết payroll run gốc và lý do. |
| FR-RPT-001 | MUST | Dashboard KPI có định nghĩa công thức và thời điểm dữ liệu. |
| FR-RPT-002 | MUST | Báo cáo tuần/tháng theo ngày dạy thực tế; xử lý tuần giao thoa tháng bằng teaching_date. |
| FR-RPT-003 | MUST | Xuất báo cáo theo template/role; ghi audit log cho thao tác xuất dữ liệu. |


<!-- page 12 -->

### 6.8. Import, audit, notification

| Mã | Mức | Yêu cầu |
|---|---|---|
| FR-IMP-001 | MUST | Import workbook bằng batch, mapping cột/danh mục và xem trước kết quả trước khi commit. |
| FR-IMP-002 | MUST | Ghi từng dòng lỗi/cảnh báo; hỗ trợ sửa mapping và chạy lại mà không tạo bản ghi trùng. |
| FR-AUD-001 | MUST | Audit mọi thay đổi quan trọng với before/after, actor, timestamp, source, reason. |
| FR-NOT-001 | SHOULD | Thông báo lịch mới/đổi/hủy, nghỉ, dạy thay, dạy bù, nhắc HR và khóa kỳ. |
| FR-NOT-002 | SHOULD | Người dùng có thể xem trạng thái đã gửi/đã đọc; kênh email/push phụ thuộc tích hợp được duyệt. |


## 7. QUY TẮC NGHIỆP VỤ VÀ CÔNG THỨC TÍNH

### 7.1. Nguyên tắc quản lý rule
 Không hardcode mức quy đổi/đơn giá vào mã nguồn. Mỗi rule có version, effective_from/effective_to, trạng thái và
người duyệt.
 Khi tạo payroll run, snapshot rule version và kết quả tính để việc chỉnh rule tương lai không làm thay đổi kỳ đã khóa.
 Tách Activity Type, Business Tag, Conversion Code và Payroll Category thành các trường riêng.
 Mọi override bằng tay phải có giá trị trước/sau, lý do, người đề nghị, người duyệt và thời điểm.

### 7.2. Danh mục quy đổi tiết từ tài liệu gốc

| Mã quy đổi | Mô tả theo nguồn | Giá trị | Quỹ cộng dồn | Bộ đếm sự kiện |
|---|---|---|---|---|
| K | Dạy chính KNS | 1.00 | KNS | Không |
| S | Dạy chính STEM/STEM Robotics | 1.00 | STEM | Không |
| C | Dạy chính CDS | 1.00 | CDS | Không |
| A | Dạy chính AI | 1.00 | AI | Không |
| K/2 | Hỗ trợ teambuilding KNS | 0.50 | KNS | Không |
| S/2 | Hỗ trợ teambuilding STEM | 0.50 | STEM | Không |
| C/2 | Hỗ trợ teambuilding CDS | 0.50 | CDS | Không |
| A/2 | Hỗ trợ teambuilding AI | 0.50 | AI | Không |
| BCTH | Báo cáo viên tập huấn | 3.00 | KNS | +1 BCTH |
| BCTH/2 | Báo cáo viên tập huấn hệ số 2.0 | 2.00 | KNS | Không |
| BCCĐ | Báo cáo viên chuyên đề trường | 3.00 | KNS | +1 BCCĐ |
| ĐP | Điều phối chương trình/sự kiện | 3.00 | KNS | +1 ĐP |
| HN | Hoạt náo sự kiện | 2.00 | KNS | +1 HN |
| KI | Diễn xuất kịch/múa/nhảy | 2.00 | KNS | +1 KI |
| BN | Kỹ thuật âm thanh/bấm nhạc sự kiện | 2.00 | KNS | Không |
| HT | Hỗ trợ vận hành sự kiện | 1.00 | KNS | +1 HT |
| TQ | Trao tặng quà | 1.00 | KNS | Không |
| CA | Chụp ảnh tư liệu | 1.00 | KNS | Không |
| CM / trống | Sinh hoạt chuyên môn/dự giờ hoặc mã trống theo nguồn | 0.00 | NONE | Không |


<!-- page 13 -->
CẦN XÁC NHẬN - MÃ VÀ HỆ SỐ Nguồn Excel được mô tả có thể chứa CM = -0.01 và TC = -0.02 trong một số công
thức, trong khi PDF quy định CM/trống = 0.00. Cần chủ nghiệp vụ giải thích CM, TC, vai trò của số âm và xác nhận các mã
chuẩn trước khi import rule.

### 7.3. Tách loại hoạt động và mã quy đổi

| Trường | Ví dụ | Ý nghĩa |
|---|---|---|
| activity_type | TEACHING, SUBSTITUTE, MAKEUP, OBSERVATION, TRAINING_CM, EVENT_WORKSHOP, TEACHER_LEAVE, SCHOOL_OFF | Mô tả bản chất nghiệp vụ; dùng điều khiển workflow và điều kiện payroll. |
| business_tag | DT, NB, NL, DG, CM | Nhãn hiển thị/ghi chú điều phối. Không nhất thiết có giá trị quy đổi riêng. |
| conversion_code | K, S, C, A, K/2, BCTH, BCCĐ... | Chọn quy tắc tiết và quỹ cộng dồn. |
| status | DRAFT, PUBLISHED, CANCELLED, COMPLETED... | Vòng đời giao dịch. |
| payroll_eligibility | ELIGIBLE, NOT_ELIGIBLE, PENDING_REVIEW | Kết luận có được tính vào kỳ công hay không. |

Đề xuất: NB được quản lý như activity_type MAKEUP và/hoặc business_tag NB; mã quy đổi thực tế vẫn là K/S/C/A hoặc
mã event phù hợp. DT/NL/DG/CM cũng không được lưu chung trong conversion_code nếu chúng không định nghĩa hệ
số quy đổi độc lập. Cần chủ nghiệp vụ xác nhận phân loại cuối cùng.

### 7.4. Logic TCS
Theo PDF nguồn, trạng thái bận trong một buổi được xác định bằng tổng quỹ tiết quy đổi:
CÔNG THỨC NGUỒN Tổng tiết buổi = TTKNS + TTSTEM + TTCDS + TTAI. Nếu tổng > 0.4: BẬN. Nếu tổng <= 0.4:
TRỐNG.
Quy định triển khai đề xuất: TCS chỉ tính assignment thuộc event ở trạng thái hợp lệ và đã được duyệt/công bố; loại trừ
event đã hủy, draft, school-off và các ca không chiếm availability theo quy định. TCS cần có hai chế độ: (1) trạng thái
tổng quan theo buổi theo ngưỡng 0.4 của nguồn; (2) kiểm tra chính xác slot/time overlap để điều động. Không được coi
trạng thái TRỐNG theo ngưỡng buổi là bằng chứng chắc chắn rằng mọi tiết trong buổi đều trống.
CẦN XÁC NHẬN TCS Nguồn PDF nêu TCS từ Thứ Hai đến Thứ Bảy, trong khi lưới lịch có Thứ Hai đến Chủ Nhật. Cần
chốt Chủ Nhật; xác nhận các mã có credit âm/0; quy định sự kiện/CM/DG có làm bận hay không; và availability do CTV khai
báo có ưu tiên hơn lịch trống tính toán không.

### 7.5. Bảng CTP theo nguồn

| Điểm xuất phát | Khoảng cách | CTP (VND) |
|---|---|---|
| N - Nhà riêng | < 12 km | 0 |
| N - Nhà riêng | >=12 và <18 km | 30.000 |
| N - Nhà riêng | >=18 và <24 km | 40.000 |
| N - Nhà riêng | >=24 và <30 km | 60.000 |
| N - Nhà riêng | >=30 và <50 km | 80.000 |
| N - Nhà riêng | >=50 km | 120.000 |
| V - Văn phòng hoặc K - Khác | < 7 km | 0 |
| V - Văn phòng hoặc K - Khác | >=7 và <12 km | 30.000 |
| V - Văn phòng hoặc K - Khác | >=12 và <18 km | 40.000 |
| V - Văn phòng hoặc K - Khác | >=18 và <24 km | 60.000 |
| V - Văn phòng hoặc K - Khác | >=24 và <30 km | 80.000 |
| V - Văn phòng hoặc K - Khác | >=30 km | 110.000 |

Quy tắc nguồn: hoạt động online có is_online = true thì distance = 0 km và CTP = 0 đồng. Điểm xuất phát N/V/K và các
mức phí cần được cấu hình theo effective date thay vì cố định trong code.

<!-- page 14 -->

### 7.6. CTP - mô hình chặng di chuyển đề xuất
Đề xuất v2: tạo Travel Trip theo nhân sự/ngày/buổi, sau đó lưu một hoặc nhiều Travel Leg (điểm đi, điểm đến,
distance_km, duration_minutes, thứ tự, nguồn khoảng cách). Travel Allowance Item lưu kết quả áp dụng rule. Cho phép
chọn nguồn N/V/K và manual override có phê duyệt. Tuy nhiên, công thức xác định số lần được hưởng và chặng nào
được tính hiện chưa rõ từ nguồn, nên chưa được triển khai cứng.
CẦN XÁC NHẬN CTP Khi giáo viên dạy nhiều trường trong cùng buổi, tính CTP theo trường đầu tiên, trường xa nhất,
từng chặng hay một khoản cố định/buổi? CTP tính theo quãng đường một chiều hay cả hành trình? Ai chọn điểm K - Khác?
Có tính chặng giữa các trường không? Cự ly lấy theo ma trận nội bộ, Google Maps hay số km do quản trị nhập?

### 7.7. Thù lao CTV
Theo PDF nguồn: tổng hợp theo ca/buổi thực tế; nhóm từ 2 tiết/buổi trở lên áp dụng đơn giá mặc định 130.000 VND/tiết
(có thể cấu hình); nhóm dưới 2 tiết/buổi đưa vào quỹ riêng để áp dụng khung ca lẻ hoặc định mức hỗ trợ.

| Điều kiện | Nguồn xác định | Trạng thái đặc tả |
|---|---|---|
| Số tiết quy đổi/buổi >= 2 | Mức mặc định 130.000 VND/tiết. | Đã có trong PDF; cần chốt tính trên tiết thực tế hay tiết quy đổi và có hệ số môn/event không. |
| Số tiết quy đổi/buổi < 2 | Có khung thù lao ca lẻ/định mức riêng. | CẦN XÁC NHẬN: chưa có số tiền/công thức. |
| Đơn giá theo hợp đồng | CTV có thể có mức thù lao khác nhau. | ĐỀ XUẤT V2: rule theo CTV/loại hoạt động/hợp đồng/effective date. |
| Ca dạy thay, teambuilding, event | Chưa thấy công thức đầy đủ. | CẦN XÁC NHẬN. |

NGĂN TÍNH SAI TIỀN Không phát hành payroll CTV cho tới khi có quyết định bằng văn bản về công thức nhóm dưới 2
tiết/buổi, cách tính đúng ngưỡng 2 tiết, quy đổi 0.5/1.0/2.0/3.0 và mức giá theo hợp đồng.

### 7.8. Phân bổ theo tháng và tuần giao thoa
Báo cáo tháng phải nhóm theo teaching_date (ngày thực tế diễn ra) trong timezone Asia/Ho_Chi_Minh, không nhóm theo
tuần chứa ngày đầu tuần. Nếu một tuần giao thoa hai tháng, event/assignment/period được phân bổ theo ngày của từng
slot; nếu buổi kéo qua nửa đêm (nếu có) thì dùng start_at/end_at đầy đủ. Quy tắc kỳ công ngoài tháng dương lịch phải
được cấu hình bằng pay_period start_date/end_date.

### 7.9. Công thức tổng quát cho payroll

| Chỉ số | Cách tổng hợp đề xuất | Điều kiện |
|---|---|---|
| Tiết theo quỹ | SUM(credit_component.amount) group by employee, bucket, date range. | Chỉ từ assignment đủ điều kiện payroll và snapshot đã xác nhận. |
| Event counter | COUNT(DISTINCT qualifying assignment/event) theo event counter code. | Chỉ áp dụng các mã có bộ đếm và quy định đếm duy nhất. |
| CTP | SUM(travel_allowance_items.amount). | Chỉ item approved, có rule snapshot và không bị hủy. |
| CTV gross fee | SUM(payroll_items.amount) từ ctv_payment_rule snapshot. | Theo group_by buổi và rate effective date; chưa áp dụng nhóm dưới 2 nếu chưa chốt. |
| Net payable | Gross + allowances + adjustments - deductions (nếu có). | Các khoản thuế/khấu trừ ngoài phạm vi cho đến khi được đặc tả. |


## 8. MÔ HÌNH DỮ LIỆU VÀ QUY TẮC TOÀN VẸN

### 8.1. Nguyên tắc thiết kế dữ liệu
 PostgreSQL; PK UUID; FK rõ ràng; created_at/updated_at/created_by/updated_by cho các bảng giao dịch chính.
 Dùng bảng danh mục chuẩn thay cho free text. Lưu raw_value/raw_payload ở lớp import để đối soát.
 Dữ liệu có lịch sử và hiệu lực dùng effective_from/effective_to hoặc valid_from/valid_to.
 Không dùng JSONB cho danh sách lớp/chứng chỉ cần truy vấn, lọc, ràng buộc và audit; chỉ dùng JSONB cho
payload linh hoạt, không thay thế quan hệ.

<!-- page 15 -->
 Không lưu số tài khoản ngân hàng/CCCD dạng numeric; phải lưu chuỗi để giữ nguyên số 0 đầu và định dạng.
 Không mặc định TRUE cho chứng chỉ chưa xác minh. Trạng thái chứng chỉ phải thể hiện
UNKNOWN/PENDING/VERIFIED/EXPIRED/REVOKED.
 Các số liệu payroll phải có snapshot kết quả và rule version; dữ liệu nguồn vẫn được giữ riêng.

### 8.2. Mô hình ERD logic (mô tả quan hệ)

| Cụm | Bảng chính | Quan hệ |
|---|---|---|
| IAM | users, roles, permissions, user_roles, user_data_scopes | users N-N roles; roles N-N permissions; user có thể gắn nhiều scope. |
| HR | employees, employee_code_aliases, employment_contracts, employee_certificates, employee_documents, employee_locations | employee 1-N aliases/contracts/certificates/locations; user 0..1 hoặc 1..N tùy chính sách. |
| Master | companies, schools, school_campuses, classes, subjects, academic_years, locations, school_calendars | school 1-N campuses; campus 1-N classes; classes gắn academic_year. |
| Assignment | class_assignments, class_handover_events | employee N-N class/subject theo khoảng hiệu lực; handover liên kết assignment cũ/mới. |
| Scheduling | schedule_templates, template_events, template_staff, schedule_events, schedule_assignments, event_periods, event_links | template sinh event; event 1-N assignments/periods; event_links liên kết gốc/thay/bù. |
| Attendance/leave | leave_requests, leave_affected_events, availability_slots, shift_swap_requests, teaching_confirmations | leave/swap liên kết event/assignment; confirmation thuộc nhân sự và assignment. |
| Rules & CTP | conversion_rules, conversion_rule_versions, conversion_rule_components, travel_allowance_rules, distance_matrix, travel_trips, travel_legs, travel_allowance_items | rule version áp dụng theo ngày; trip N legs; item snapshot rule. |
| Payroll | pay_periods, payroll_runs, payroll_items, payroll_adjustments | pay period 1-N runs; run 1-N items/adjustments; item liên kết nguồn. |
| Governance | audit_logs, notifications, import_batches, import_rows | audit theo entity; import batch có nhiều row; notification theo user/target. |


### 8.3. Danh mục bảng đề xuất

| Bảng | Trường chính (tóm tắt) | Mục đích/ghi chú |
|---|---|---|
| employees | id UUID PK; employee_code UNIQUE; full_name; employment_type; work_status; phone; emails; dob; join_date; official_date; resign_date; address fields | Hồ sơ người. Không đặt role hệ thống tại đây. |
| employee_code_aliases | id; employee_id FK; alias_code; source_system; valid_from/to | Ánh xạ mã cũ như HN007 về mã chuẩn. alias_code UNIQUE theo nguồn. |
| users | id; employee_id FK nullable/unique; username/email; password_hash/identity_provider; status; last_login_at | Tài khoản đăng nhập. Khóa tài khoản không xóa employee. |
| roles / permissions / user_roles / role_permissions | id/code/name; permission_code; user_id; role_id; scope_id; effective dates | RBAC nhiều vai trò và phạm vi dữ liệu. |
| employment_contracts | id; employee_id; contract_type; start_date; end_date; probation_end; official_date; status; document_id | Hợp đồng CTV/cơ hữu, thời gian hiệu lực, đơn giá/hạn chế nếu áp dụng. |
| employee_certificates | id; employee_id; certificate_type_id; issue_date; expiry_date; status; verified_by; file_id | Chứng chỉ có thời hạn và trạng thái xác minh. |
| employee_locations | id; employee_id; location_id; location_type(N/V/K/OTHER); is_default; valid_from/to | Địa chỉ nhà/văn phòng/điểm khác phục vụ tính chuyến đi. |
| companies | id; code UNIQUE; full_name; office_location_id; status | GAIA, NEWG, 8BC và pháp nhân mở rộng. |
| schools | id; school_code UNIQUE; name; level; district; status | Đơn vị trường đối tác. |
| school_campuses | id; school_id; campus_code; name; address/location_id; status | Phân hiệu/cơ sở riêng, tránh gộp vào tên trường. |
| classes | id; campus_id; academic_year_id; class_code; grade; status | Lớp riêng, có unique theo campus/năm học. |
| subjects | id; code UNIQUE; name; subject_group; default_color; status | KNS, STEM, STEM Robotics, CDS, AI... |


<!-- page 16 -->

| Bảng | Trường chính (tóm tắt) | Mục đích/ghi chú |
|---|---|---|
| academic_years / school_calendars | id; name; start_date; end_date; school_id; campus_id; date; calendar_type | Niên khóa và ngày hoạt động/nghỉ/trường báo nghỉ. |
| class_assignments | id; employee_id; class_id; subject_id; role_type; valid_from/to; status; approved_by | Phân công theo từng lớp/môn/người trong khoảng hiệu lực. |
| class_handover_events | id; old_assignment_id; new_assignment_id; handover_date; reason; requested_by; approved_by; status | Lịch sử bàn giao nhiều lần. |
| schedule_templates | id; name; academic_year_id; school_id/campus_id; valid_from/to; status; version | Lịch mẫu định kỳ. |
| template_events / template_staff | template_id; weekday; session; period/time; class/subject; employee_id; staff_role | Cấu trúc buổi/ca định kỳ và nhân sự. |
| schedule_events | id; event_code; teaching_date; start_at; end_at; campus/location; activity_type; schedule_layer; status; is_online; company_id | Một hoạt động/buổi lịch thực tế. |
| schedule_assignments | id; event_id; employee_id; staff_role; is_primary; conversion_rule_version_id; payroll_eligibility; status | Một nhân sự thực hiện một event; cho phép nhiều staff/event. |
| event_periods | id; event_id; period_index; start_at; end_at; period_weight; class_id/subject_id | Slot/tiết thuộc buổi; dùng kiểm tra overlap và tổng tiết. |
| event_links | id; source_event_id; related_event_id; link_type(ORIGINAL/SUBSTITUTE/MAKEUP/RESC HEDULE) | Liên kết ca gốc, thay, bù, đổi lịch. |
| leave_requests / leave_affected_events | id; employee_id; date range; reason; status; approver; event/assignment ids | Đơn nghỉ và danh sách ca bị ảnh hưởng. |
| availability_slots | id; employee_id; date; start_at/end_at; availability_status; source; submitted_at | Lịch khả dụng do nhân sự khai báo. |
| shift_swap_requests | id; requester; target; from_assignment; to_assignment; reason; status; approved_by | Đề nghị đổi ca. |
| teaching_confirmations | id; assignment_id; employee_id; confirmation_status; confirmed_at; actual_periods; note; verified_by | Xác nhận hoạt động thực tế. |
| conversion_rules / versions / components | rule_code; version; effective dates; activity; credit_value; bucket; event_counter; employment_type | Quy tắc quy đổi có version; components cho nhiều quỹ nếu có. |
| travel_allowance_rules | id; departure_type; min_km; max_km; amount; effective_from/to; approved_by | Bậc CTP cấu hình. Dùng khoảng đóng/mở không chồng lấn. |
| distance_matrix | from_location_id; to_location_id; distance_km; duration_minutes; source; checked_at | Ma trận giữa các địa điểm để kiểm tra hành trình. |
| travel_trips / legs / allowance_items | trip_id; employee_id; date/session; leg sequence; from/to; km; duration; rule_id; amount; override reason | Lưu hành trình và kết quả CTP theo từng chặng/chính sách. |
| ctv_payment_rules | id; employee/contract type; activity_type; threshold; rate; calculation_method; effective dates | Đơn giá CTV và công thức ca lẻ; phải được xác nhận. |
| pay_periods / payroll_runs | period_id; start/end; period_type; status; rule snapshot; created_by; approved_by; locked_at | Kỳ công và lần chạy đối soát. |
| payroll_items / adjustments | run_id; employee_id; source_assignment_id; item_type; quantity; rate; amount; rule_snapshot; adjustment_reason | Dòng chi tiết và khoản điều chỉnh. |
| audit_logs / notifications | actor; entity; entity_id; action; before/after; reason; created_at; channel; recipient; status | Lịch sử và thông báo. |
| import_batches / import_rows | source_file; sheet; mapping_version; status; row_no; raw_data; normalized_data; errors | Quản lý migration/import. |


### 8.4. Ràng buộc dữ liệu quan trọng
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

<!-- page 17 -->
 Tất cả số tiền dùng DECIMAL/INTEGER VND; không dùng FLOAT cho tiền hoặc số tiết.

## 9. TRẠNG THÁI VÀ NHẬT KÝ VÒNG ĐỜI

### 9.1. Lịch / Event

| Trạng thái | Ý nghĩa | Điều kiện/chuyển tiếp |
|---|---|---|
| DRAFT | Đang soạn | Chưa công bố; có thể sửa/hủy. |
| PENDING_APPROVAL | Chờ duyệt | Đã gửi duyệt; chờ approver. |
| APPROVED | Đã duyệt | Cho phép công bố hoặc lên kế hoạch vận hành. |
| PUBLISHED | Đã công bố | Gửi tới các bên; sửa đổi lớn cần version/notification. |
| IN_PROGRESS | Đang diễn ra | Có thể sinh từ thời gian hiện tại nếu dùng. |
| COMPLETED | Đã hoàn thành | Có xác nhận; đủ điều kiện payroll nếu hợp lệ. |
| CANCELLED | Đã hủy | Có lý do và actor; không ghi nhận công trừ rule đặc biệt. |
| REJECTED | Bị từ chối | Không được công bố; có thể tạo bản khác. |


### 9.2. Nhãn / activity type tiêu chuẩn đề xuất

| Activity Type | Tag/label có thể đi kèm | Ghi chú |
|---|---|---|
| TEACHING | K/S/C/A | Ca giảng dạy chính. |
| SUBSTITUTE | DT | Liên kết event gốc và nhân sự được thay. |
| MAKEUP | NB | Liên kết makeup obligation và ngày nghỉ gốc. |
| OBSERVATION | DG | Dự giờ; cần xác định quy tắc có tính công/bận. |
| TRAINING_CM | CM | Sinh hoạt chuyên môn; mã quy đổi cần xác nhận. |
| EVENT_WORKSHOP | BCTH/BCCĐ/ĐP/HN/KI/BN/HT/TQ/CA | Áp dụng rule tương ứng. |
| TEACHER_LEAVE | LEAVE | Đơn nghỉ và các ca bị ảnh hưởng. |
| SCHOOL_OFF | SCHOOL_OFF | Trường báo nghỉ; tạo nghĩa vụ bù nếu có. |
| RESCHEDULED | RESCHEDULE | Ca đổi ngày/giờ; cần event link và tránh tính trùng. |


### 9.3. Audit log bắt buộc

| Trường audit | Yêu cầu |
|---|---|
| actor_user_id | Tài khoản thực hiện; nếu job hệ thống thì service actor. |
| action | CREATE/UPDATE/DELETE_SOFT/APPROVE/REJECT/PUBLISH/ CANCEL/LOCK/UNLOCK/EXPORT/OVERRIDE. |
| entity_type + entity_id | Loại bản ghi và định danh. |
| before_json / after_json | Giá trị trước/sau; loại bỏ hoặc che dữ liệu nhạy cảm theo chính sách. |
| reason | Lý do bắt buộc cho override, hủy, sửa sau công bố, mở khóa hoặc điều chỉnh payroll. |
| timestamp + source | Thời điểm, IP/device/session hoặc nguồn import/API nếu phù hợp. |


## 10. YÊU CẦU GIAO DIỆN VÀ BÁO CÁO

### 10.1. Nguyên tắc UI/UX
 Thay thế lưới 23 dòng x 101 cột bằng thẻ Schedule Event và lưới theo ngày/buổi/tiết, có filter và drill-down.
 Màu sắc chỉ là lớp trực quan; mọi trạng thái phải có text/icon/badge và dữ liệu cấu trúc, không chỉ dùng màu.

<!-- page 18 -->
 Các thao tác nguy cơ cao (copy tuần, công bố lịch, hủy ca, override CTP, khóa kỳ) phải có preview/confirm và ghi log.
 Giao diện desktop tối ưu cho điều phối; mobile tối ưu lịch cá nhân, xác nhận, đơn nghỉ và bảng đối soát.
 Hỗ trợ tìm kiếm theo mã giáo viên, tên, trường, lớp, ngày; bộ lọc phải giữ trạng thái khi quay lại danh sách.

### 10.2. Màn hình vận hành trọng tâm

| Màn hình | Vai trò | Thành phần và thao tác chính |
|---|---|---|
| 1. Dashboard vận hành | Admin/Team Lead/HR/Payroll | KPI tổng tiết hôm nay, ca thay/bù, lớp thiếu giáo viên, thử việc sắp hết hạn, cơ cấu môn/pháp nhân. Mỗi KPI phải có định nghĩa và link drill- down. |
| 2. Master Schedule | Admin/Coordinator | Chọn tuần/tháng; filter địa bàn/trường/campus/pháp nhân/nhân sự/môn/trạng thái; sticky panel; lưới tuần; panel chi tiết; preview copy; cảnh báo xung đột. |
| 3. TCS & điều động nhanh | Coordinator | Ma trận rảnh/bận theo ngày/buổi/slot; bộ lọc chứng chỉ, hợp đồng, địa bàn, availability, khoảng cách; lý do không phù hợp; chọn người thay. |
| 4. Payroll & CTP Center | HR/Payroll/Admin | Kỳ công, tổng tiết theo bucket, event count, CTP, CTV; drill-down đến event/assignment/rule; cảnh báo sai lệch; duyệt/khóa/xuất. |
| 5. Teacher/CTV Portal | Teacher/CTV | Lịch cá nhân ngày/tuần/tháng, xem chỉ đường/địa chỉ trường, xác nhận tiết, gửi nghỉ/đổi ca, availability, bảng đối soát của mình. |
| 6. HR Profile 360 | HR/Admin | Hồ sơ, hợp đồng, chứng chỉ, địa điểm xuất phát, phân công, lịch sử, dữ liệu nhạy cảm có che và quyền riêng. |
| 7. Master Data & Imports | Admin/HR/Coordinator | Danh mục, mapping alias, import batch, lỗi cần xử lý, preview và commit. |


### 10.3. Định nghĩa KPI và báo cáo

| Báo cáo/KPI | Định nghĩa bắt buộc phải cấu hình |
|---|---|
| Tổng tiết trong ngày | Phân biệt scheduled / published / completed / payroll eligible; không dùng một nhãn “tổng tiết” chung. |
| Ca dạy thay/dạy bù | Đếm event hay assignment? Đếm theo ca, tiết hay người? Xác định một định nghĩa thống nhất. |
| Lớp khuyết giáo viên | Lớp có assignment hiệu lực nhưng không có staff assignment phù hợp cho một ngày/slot cụ thể. |
| Cơ cấu tiết theo môn | Dựa trên credit bucket hoặc subject; nêu rõ event hỗn hợp. |
| Tổng CTP | Tổng item CTP approved, tách theo điểm xuất phát, ngày, nhân sự và kỳ. |
| CTV payroll | Tách >=2 và <2 tiết/buổi theo đúng rule; hiển thị số buổi, số tiết, đơn giá, số tiền. |
| Năng suất/định mức | Chỉ làm dashboard sau khi tổ chức định nghĩa mẫu số, định mức và ngoại lệ. |


### 10.4. Hành vi giao diện bắt buộc
 Khi tạo/sửa event: chọn trường → campus → lớp → môn → ngày → buổi/slot → nhân sự → activity type →
conversion code; danh sách phụ thuộc danh mục hợp lệ.
 Khi chọn nhân sự: hiển thị trạng thái hợp đồng, chứng chỉ, TCS và lịch trùng trước khi lưu.
 Khi copy tuần: hiển thị diff giữa tuần nguồn và tuần đích; có tùy chọn bỏ qua ca có xung đột, nhưng không tự động bỏ
qua nếu chưa xác nhận.
 Khi xem CTP: thể hiện điểm đi, điểm đến, số km, bậc phí, số tiền, rule version và nguồn khoảng cách.
 Khi drill-down payroll: hiển thị cả số tiết thực tế và số tiết quy đổi, mã quy đổi, quỹ cộng dồn và trạng thái xác nhận.
 Khi xem hồ sơ nhạy cảm: mặc định mask; thao tác reveal/export cần quyền bổ sung và có audit.

<!-- page 19 -->

## 11. MIGRATION, IMPORT/EXPORT VÀ CHUYỂN ĐỔI DỮ LIỆU

### 11.1. Nguồn chuyển đổi

| Nguồn | Phân loại | Xử lý |
|---|---|---|
| Workbook HR | Employee master, work status, contact, education/certification, assignment year data. | Mapping mã, chuẩn hóa tên, ngày tháng, điện thoại, email, trạng thái; giữ raw. |
| Workbook Schedule | Weekly schedule, ad-hoc notes, TCS, total period, CTV fee, MAIL. | Parse vùng lịch theo cấu trúc tuần; chuẩn hóa ngày/slot/trường/lớp/môn/pháp nhân/employee code; không import công thức/màu làm sự thật. |
| Danh mục mới được duyệt | Companies, schools/campuses/classes/subjects/conversio n rules/CTP rules. | Là nguồn chuẩn sau sign-off; các giá trị chưa map đưa vào queue. |
| Tệp đính kèm hồ sơ | Hợp đồng, CCCD, bằng cấp, chứng chỉ (nếu được cung cấp). | Import file theo danh mục, hash, quyền truy cập và chính sách lưu trữ. |


### 11.2. Quy trình migration
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

### 11.3. Quy tắc mapping dữ liệu
 Mã `HN007` và `GVHN007` chỉ được hợp nhất khi chủ dữ liệu xác nhận cùng một cá nhân; lưu alias để truy vết.
 Mã tạm như `GV mới` không được coi là unique identity; cần đối soát bằng thông tin bổ sung và gán employee_code
chuẩn.
 Tên trường/phân hiệu phải tách school và campus; không loại bỏ hậu tố phân hiệu nếu nó phân biệt địa điểm dạy.
 Lớp dạng chuỗi/range (ví dụ `6A1-6A5`) phải parse thành từng class record sau xác nhận; không lưu chuỗi range
như khóa lớp.
 Các môn ghép như `STEM + AI` không tự chia thành hai credit nếu chưa có rule phân bổ; giữ raw value và chờ
mapping.
 Số tài khoản ngân hàng/CCCD đọc dưới dạng string; không ép kiểu số hoặc scientific notation; đối chiếu lại với bản
gốc.
 Các dòng có lỗi/thiếu ngày/nhân sự/trường không được tự chuyển thành lịch hợp lệ; đưa vào exception queue.

### 11.4. Import batch và exception queue

| Trạng thái row | Ý nghĩa | Hành động |
|---|---|---|
| IMPORTED | Mapping và validation thành công. | Có thể commit vào domain tables. |
| WARNING | Thiếu trường tùy chọn hoặc biến thể alias đã map. | Cho phép commit nếu rule cho phép; hiển thị cảnh báo. |
| UNMATCHED | Không tìm được employee/school/class/subject/partner. | Yêu cầu người quản lý dữ liệu mapping. |
| DUPLICATE | Trùng khóa hoặc có khả năng trùng giao dịch. | Chọn bản ghi giữ lại hoặc đánh dấu duplicate có lý do. |
| INVALID | Sai định dạng hoặc vi phạm constraint. | Sửa raw/mapping rồi chạy lại; không commit. |
| IGNORED | Được chủ dữ liệu xác nhận không nhập. | Lưu lý do và người xác nhận. |


<!-- page 20 -->

## 12. YÊU CẦU PHI CHỨC NĂNG, BẢO MẬT VÀ VẬN HÀNH

| Mã | Nhóm | Yêu cầu/tiêu chí đề xuất |
|---|---|---|
| NFR-SEC-001 | Bảo mật dữ liệu nhạy cảm | CCCD, tài khoản ngân hàng và tài liệu cá nhân phải được bảo vệ khi truyền và khi lưu; áp dụng mã hóa/secret management theo kiến trúc được duyệt. |
| NFR-SEC-002 | Phân quyền trường dữ liệu | Mask dữ liệu nhạy cảm mặc định; chỉ reveal/export với quyền rõ ràng và audit. |
| NFR-SEC-003 | Xác thực | Mật khẩu băm bằng thuật toán hiện đại; hỗ trợ MFA/SSO nếu tổ chức yêu cầu; chống brute force và session hijacking. |
| NFR-SEC-004 | Audit | Không cho user nghiệp vụ sửa/xóa audit log; quản trị audit retention. |
| NFR-PRIV-001 | Quyền riêng tư | Chỉ thu thập trường dữ liệu cần thiết; quy định mục đích sử dụng, thời hạn lưu và quy trình xử lý yêu cầu chủ thể dữ liệu theo chính sách áp dụng. |
| NFR-PERF-001 | Hiệu năng | Đề xuất mục tiêu: 95% request đọc phổ biến <= 3 giây trong tải vận hành dự kiến; báo cáo lớn có job/asynchronous. Cần xác nhận tải và môi trường. |
| NFR-PERF-002 | Lưới lịch/TCS | Tải tuần mặc định theo phạm vi lọc; phân trang/virtualization; tránh query N+1; có cache có kiểm soát. |
| NFR-CONC-001 | Đồng thời | Có optimistic locking/version check; cảnh báo khi hai điều phối viên sửa cùng event. |
| NFR-AVL-001 | Khả dụng | Đề xuất mục tiêu uptime >= 99.5% theo tháng loại trừ bảo trì có thông báo; cần doanh nghiệp xác nhận SLA. |
| NFR-BCP-001 | Backup/khôi phục | Backup tự động; kiểm thử restore định kỳ; mục tiêu RPO/RTO phải được chốt trước go-live. |
| NFR-UX-001 | Responsive | Hỗ trợ desktop phổ biến và màn hình điện thoại; thao tác cốt lõi trên mobile không yêu cầu hover. |
| NFR-ACC-001 | Truy cập | Bố cục rõ, tương phản đủ, trạng thái không chỉ biểu diễn bằng màu; hỗ trợ bàn phím ở form chính. |
| NFR-LOG-001 | Quan sát hệ thống | Có log ứng dụng, metrics, tracing cho lỗi tính toán và batch; không ghi plaintext dữ liệu nhạy cảm. |
| NFR-EXT-001 | Mở rộng | Hỗ trợ thêm văn phòng, pháp nhân, môn, quy tắc và địa điểm mà không sửa schema cốt lõi. |
| NFR-DATA-001 | Toàn vẹn | FK, unique, check constraints; transaction đảm bảo atomic cho copy tuần, duyệt và khóa payroll. |
| NFR-RET-001 | Lưu trữ | Chính sách retention cho employee documents, attendance, payroll, audit và backup do doanh nghiệp phê duyệt. |

LƯU Ý PHÁP LÝ VÀ AN TOÀN Các trường dữ liệu như CCCD, địa chỉ, tài khoản ngân hàng, hợp đồng và chứng chỉ là
dữ liệu cá nhân/nhạy cảm theo bối cảnh sử dụng. Chủ hệ thống cần rà soát căn cứ xử lý, thông báo, phân quyền, lưu trữ,
chia sẻ và thời hạn lưu theo quy định pháp luật Việt Nam áp dụng tại thời điểm triển khai. Đây là yêu cầu quản trị cần kiểm
tra pháp lý riêng, không phải ý kiến tư vấn pháp lý.

## 13. KIỂM THỬ VÀ TIÊU CHÍ NGHIỆM THU

### 13.1. Nguyên tắc kiểm thử
 Mọi FR có ít nhất một test case; các rule tính toán phải có test biên tại ngưỡng.
 Test bằng dữ liệu đã ẩn danh, bao gồm tình huống có lỗi/thiếu/alias từ workbook nguồn.
 Kiểm thử integration giữa scheduling, TCS, confirmation, conversion, CTP và payroll.
 Kiểm thử quyền với người dùng thuộc nhiều role và nhiều data scope.

<!-- page 21 -->
 Không nghiệm thu payroll khi công thức CTV dưới 2 tiết, CTP theo nhiều điểm hoặc các rule P0 chưa được ký xác
nhận.

### 13.2. Danh sách test/acceptance criteria

| ID | Kịch bản | Tiêu chí đạt |
|---|---|---|
| AT-001 | Mã nhân sự alias | Import HN007 và GVHN007 đã được xác nhận cùng người → một employee, lưu cả alias, không duplicate. |
| AT-002 | Mã tạm | Dòng có mã GV mới không được tự tạo nhân sự chuẩn; xuất hiện trong exception queue. |
| AT-003 | Chứng chỉ | Nhân sự thiếu chứng chỉ/hết hạn không thể được gán lớp yêu cầu chứng chỉ bắt buộc, trừ override được duyệt. |
| AT-004 | Hợp đồng | Không phân công ngoài thời hạn hợp đồng hoặc cho nhân sự đã offboard. |
| AT-005 | Copy tuần | Copy chỉ lịch REGULAR; không copy ADHOC/DT/NB cũ; preview và chống duplicate khi chạy lại. |
| AT-006 | Trùng giáo viên | Hai ca cùng nhân sự giao thời gian phải bị chặn hoặc cảnh báo theo rule được cấu hình. |
| AT-007 | Trùng lớp | Hai ca của cùng lớp giao thời gian phải phát hiện. |
| AT-008 | Di chuyển | Hai ca khác địa điểm không đủ travel duration phải cảnh báo/chặn theo ngưỡng. |
| AT-009 | Dạy thay | Ca gốc vẫn lưu; người nghỉ không có credit thực hiện; người thay được liên kết event gốc và tính theo rule được duyệt. |
| AT-010 | Từ chối dạy thay | Người được chọn từ chối → ca trở lại hàng đợi điều phối, thông báo Coordinator. |
| AT-011 | Trường báo nghỉ | Ca gốc không được tính tiết đã dạy; tạo makeup obligation nếu chính sách yêu cầu. |
| AT-012 | Dạy bù | Ca bù liên kết nghĩa vụ gốc; trạng thái obligation cập nhật; không tính trùng nghĩa vụ. |
| AT-013 | TCS ngưỡng | Tổng credit = 0.40 → TRỐNG; 0.41 → BẬN (theo rule nguồn sau khi xác nhận). |
| AT-014 | TCS trạng thái | Draft/cancelled không làm nhân sự BẬN; published/approved event phù hợp làm BẬN. |
| AT-015 | TCS availability | CTV khai báo không khả dụng không được gợi ý nhận ca, dù không có lịch dạy. |
| AT-016 | Quy đổi | K=1, S=1, C=1, A=1 và các mã half/event cho ra kết quả theo rule version. |
| AT-017 | Mã chưa xác nhận | CM/TC/NB hoặc môn ghép chưa có mapping không được âm thầm tự tính; phải cảnh báo/giữ pending. |
| AT-018 | CTP N | Các khoảng biên 12, 18, 24, 30, 50 km được tính theo rule đóng/mở đã chốt. |
| AT-019 | CTP V/K | Các khoảng biên 7, 12, 18, 24, 30 km được tính theo rule đóng/mở đã chốt. |
| AT-020 | Online | is_online=true → 0 km, CTP=0 theo nguồn. |
| AT-021 | CTP override | Sửa CTP phải có lý do, approver, giá trị trước/sau và audit. |
| AT-022 | CTV >=2 | Ca có >=2 tiết được áp dụng rate theo rule version sau xác nhận. |
| AT-023 | CTV <2 | Ca 1 tiết áp dụng đúng khung ca lẻ đã được chủ nghiệp vụ phê duyệt. |
| AT-024 | Tuần giao thoa tháng | Báo cáo tháng chia dữ liệu theo teaching_date, không theo tuần/cột tuần 0. |
| AT-025 | Xác nhận | Lịch chưa completed/confirmed không tự động tính payroll nếu rule không cho phép. |
| AT-026 | Khóa kỳ | Kỳ LOCKED không thể sửa event/payroll item ảnh hưởng; adjustment mới phải có liên kết. |
| AT-027 | Snapshot rule | Thay rate sau khi kỳ đã khóa không làm thay đổi kỳ cũ. |


<!-- page 22 -->

| ID | Kịch bản | Tiêu chí đạt |
|---|---|---|
| AT-028 | Phân quyền | Teacher/CTV không thể xem lịch/CCCD/ngân hàng/bảng công của người khác nếu không được cấp. |
| AT-029 | Audit | Thay đổi ngày, nhân sự, conversion code, amount, status đều có actor/time/before-after/reason. |
| AT-030 | Import re-run | Chạy lại cùng import batch không tạo bản ghi trùng; row error được giữ và có thể xử lý riêng. |
| AT-031 | Export | User không có quyền nhạy cảm không thể xuất CCCD/tài khoản ngân hàng kể cả qua file export. |
| AT-032 | Concurrent update | Hai người sửa cùng event: người thứ hai nhận thông báo version conflict, không ghi đè âm thầm. |


### 13.3. Điều kiện nghiệm thu UAT
 100% yêu cầu MUST được kiểm thử và pass, trừ ngoại lệ có phê duyệt bằng văn bản.
 Các quy tắc P0 đã được chủ nghiệp vụ ký xác nhận và có test case tương ứng.
 Không còn lỗi nghiêm trọng liên quan đến tính công, CTP, thù lao, trùng lịch, mất dữ liệu hoặc lộ dữ liệu nhạy cảm.
 Đối soát pilot: chọn tối thiểu các tuần bình thường, tuần giao thoa tháng, tuần có nghỉ/dạy thay/dạy bù và tuần có
nhiều sự kiện/CTV.
 HR, Giáo vụ, Kế toán và đại diện giáo viên/CTV xác nhận kết quả theo vai trò của mình.
 Có tài liệu hướng dẫn, phương án backup/restore, phân quyền production và quy trình hỗ trợ.

## 14. DANH SÁCH VẤN ĐỀ CẦN XÁC NHẬN
Danh sách này là register bắt buộc đóng trước khi phát triển phần liên quan. Tạm thời gán người quyết định theo vai trò
đề xuất; doanh nghiệp cần chỉ định người cụ thể.

| ID | Câu hỏi cần chốt | Tác động | Chủ trì đề xuất | Hạn chốt |
|---|---|---|---|---|
| P0-01 | Định nghĩa đơn vị bản ghi lịch: event/buổi, period hay một tiết? | Ảnh hưởng schema, conflict, payroll, CTP. | Product Owner + Giáo vụ | Trước ERD final |
| P0-02 | Một buổi có thể nhiều giáo viên, nhiều lớp/môn hay không? | Ảnh hưởng event/assignment/period. | Giáo vụ | Trước ERD final |
| P0-03 | Công thức nhóm CTV dưới 2 tiết/buổi và đúng ngưỡng 2.0. | Ảnh hưởng tiền phải trả. | Kế toán + Chủ nghiệp vụ | Trước Payroll build |
| P0-04 | CTP khi dạy nhiều trường trong buổi: số lần tính, chặng, one-way/round-trip. | Ảnh hưởng chi phí. | Kế toán + Điều phối | Trước CTP build |
| P0-05 | Nguồn khoảng cách: nhập tay, ma trận, bản đồ; quy trình cập nhật. | Ảnh hưởng CTP và conflict. | Điều phối | Trước TCS/CTP build |
| P0-06 | Mã CM, TC và giá trị âm trong workbook; mã BN; phân biệt business tag/conversion. | Ảnh hưởng tiết và TCS. | Team Lead + Kế toán | Trước Rule Engine |
| P0-07 | CDS/AI/STEM+AI và môn ghép được tính vào quỹ nào? | Ảnh hưởng quỹ tiết và báo cáo. | Chủ chuyên môn | Trước Rule Engine |
| P0-08 | TCS có tính Chủ Nhật không; cách xử lý DG/CM/event và credit âm/0. | Ảnh hưởng gợi ý nhân sự. | Giáo vụ | Trước TCS build |
| P0-09 | Lịch dự kiến/đã công bố/đã thực hiện: điều kiện tính công. | Ảnh hưởng payroll. | Giáo vụ + Kế toán | Trước Payroll build |
| P0-10 | Một tiết nghỉ được bù thành nhiều ca hay một ca bù gộp nhiều tiết? | Ảnh hưởng makeup obligation. | Giáo vụ + Trường | Trước Makeup build |
| P0-11 | Ai duyệt nghỉ, dạy thay, dạy bù, bàn giao, override CTP, mở khóa kỳ? | Ảnh hưởng RBAC và audit. | Ban quản lý | Trước RBAC final |
| P0-12 | Kỳ công là tháng dương lịch hay kỳ tài chính; cut-off và thanh toán. | Ảnh hưởng payroll run. | Kế toán | Trước Payroll build |
| P1-01 | Hồ sơ CTV và đơn giá theo từng người/hợp đồng/hoạt động. | Ảnh hưởng HR và CTV fee. | HR + Kế toán | Trước pilot CTV |


<!-- page 23 -->

| ID | Câu hỏi cần chốt | Tác động | Chủ trì đề xuất | Hạn chốt |
|---|---|---|---|---|
| P1-02 | Quy tắc phân công lớp: một lớp có bao nhiêu GV chính/hỗ trợ; effective date. | Ảnh hưởng assignment. | Giáo vụ | Trước migration |
| P1-03 | Danh mục trường/campus/lớp thực tế và nguồn authoritative. | Ảnh hưởng migration. | Giáo vụ | Trước import |
| P1-04 | Thông tin nhà/văn phòng/điểm K nào dùng cho CTP; xử lý thay đổi địa chỉ. | Ảnh hưởng HR/CTP. | HR + Kế toán | Trước CTP pilot |
| P1-05 | Thời hạn lưu dữ liệu, tài liệu nhân sự, audit, backup. | Ảnh hưởng compliance. | Ban quản lý + IT | Trước go-live |
| P1-06 | SSO/email/notification provider và kênh gửi. | Ảnh hưởng tích hợp. | IT/Admin | Trước triển khai |
| P1-07 | Mục tiêu tải, số user đồng thời, SLA, RPO/RTO. | Ảnh hưởng kiến trúc/infra. | IT + Ban quản lý | Trước sizing |
| P1-08 | Đồng bộ Google Sheets hay chỉ import/export một chiều. | Ảnh hưởng tích hợp. | Product Owner | Trước MVP scope |
| P2-01 | GPS/QR, tối ưu tuyến, phân tích năng suất, mở chi nhánh. | Mở rộng. | Ban quản lý | Roadmap sau MVP |


## 15. ĐỀ XUẤT PHÂN KỲ TRIỂN KHAI

| Giai đoạn | Phạm vi | Điều kiện vào/ra |
|---|---|---|
| G0 - Business sign-off | Chốt P0, mapping danh mục, đơn vị dữ liệu lịch, CTP, CTV, payroll, quyền duyệt. | Ra quyết định nghiệp vụ; ký rulebook; xác nhận ERD. |
| G1 - Foundation & HR | IAM, RBAC, HR profile, contracts, certificates, master data, imports, alias mapping. | Import HR/master data; HR sign-off. |
| G2 - Assignments & Scheduling | School assignments, handover, templates, weekly schedule, ADHOC, conflict, publish, notifications. | Pilot lịch 2-4 tuần; Giáo vụ sign-off. |
| G3 - Availability & operational changes | TCS, leave, substitute, school-off, makeup, availability, shift swap, confirmations. | Test tình huống ngoại lệ; xác nhận TCS và nghiệp vụ. |
| G4 - Payroll & reporting | Conversion engine, CTP, CTV fee, payroll run, reconciliation, lock, reports/export. | Đối soát song song với Excel ít nhất 1-2 kỳ theo lịch thực tế; Kế toán sign-off. |
| G5 - Rollout & optimization | Mobile portal hoàn chỉnh, dashboard, performance, route optimization, mở rộng pháp nhân/chi nhánh. | Đạt UAT, đào tạo, backup/restore, vận hành support. |


### 15.1. Điều kiện sẵn sàng phát triển
 P0 được giải quyết hoặc có quyết định tạm thời được phê duyệt và gắn hạn xử lý.
 ERD và data dictionary được BA/Tech Lead/DBA review.
 Rulebook có ví dụ tính tay và test cases cho conversion, TCS, CTP, CTV.
 Mẫu import/mapping cho nhân sự, trường, lớp, môn, pháp nhân và lịch tuần được xác nhận.
 Ma trận RBAC được chủ quy trình ký duyệt.
 Có mẫu UI wireframe cho Master Schedule, TCS, Payroll và Teacher Portal.

<!-- page 24 -->

## PHỤ LỤC A. DANH MỤC DỮ LIỆU VÀ MÃ NGHIỆP VỤ
A.1. Danh mục môn học

| Mã đề xuất | Tên hiển thị | Ghi chú |
|---|---|---|
| KNS | Kỹ năng sống | Mã quy đổi nguồn K |
| STEM | STEM | Mã quy đổi nguồn S |
| STEM_ROBOTICS | STEM Robotics | Cần xác định là subject riêng hay nhóm/biến thể STEM |
| CDS | Công dân số | Mã quy đổi nguồn C |
| AI | Trí tuệ nhân tạo | Mã quy đổi nguồn A |
| OTHER | Khác/chưa phân loại | Chỉ dùng khi được cấu hình và có owner |

A.2. Danh mục pháp nhân nguồn

| Code | Tên chuẩn đề xuất | Lưu ý |
|---|---|---|
| GAIA | GAIA | Chuẩn hóa biến thể hoa/thường. |
| NEWG | NEWG | Không cho phép NEW G/NewG như code riêng nếu cùng pháp nhân. |
| 8BC | 8BC | Xác nhận tên pháp lý đầy đủ và địa chỉ văn phòng. |

A.3. Danh mục activity_type đề xuất

| Code | Tên | Mã/nhãn có thể gắn | Có cần payroll review? |
|---|---|---|---|
| TEACHING | Giảng dạy chính | K/S/C/A | Theo conversion rule |
| SUBSTITUTE | Dạy thay | DT | Có; gắn event gốc |
| MAKEUP | Dạy bù | NB | Có; gắn nghĩa vụ bù |
| OBSERVATION | Dự giờ | DG | Cần xác nhận |
| TRAINING_CM | Sinh hoạt chuyên môn | CM | Cần xác nhận |
| EVENT_WORKSHOP | Chuyên đề/sự kiện | BCTH/BCCĐ/ĐP/HN/KI/BN/HT/ TQ/CA | Có; theo rule từng mã |
| TEACHER_LEAVE | Nghỉ giáo viên | LEAVE | Không tính tiết dạy cho người nghỉ trừ chính sách riêng |
| SCHOOL_OFF | Trường báo nghỉ | SCHOOL_OFF | Không tính tiết thực hiện; có thể tạo obligation |
| OTHER | Khác | Theo cấu hình | Bắt buộc duyệt rule trước khi payroll |

A.4. Các mã/thuật ngữ còn cần mapping

| Mã/giá trị nguồn | Cần làm rõ |
|---|---|
| DT | Nhãn dạy thay; không nên làm conversion code nếu không có hệ số riêng. |
| NB | Nhãn dạy bù/ngày nghỉ gốc; làm rõ quan hệ với rule quy đổi. |
| NL | Nghiệp vụ nhận lại lớp/bàn giao; không phải lịch dạy nếu chỉ là sự kiện HR/assignment. |
| DG | Dự giờ; xác định có tính tiết và có làm bận TCS hay không. |
| CM | Sinh hoạt chuyên môn; nguồn PDF nêu 0.0 nhưng workbook có biểu thức cần rà soát. |


<!-- page 25 -->

| Mã/giá trị nguồn | Cần làm rõ |
|---|---|
| TC | Xuất hiện trong công thức Excel theo lần rà soát; cần giải nghĩa và xác nhận. |
| GV mới | Mã tạm không được sử dụng làm unique key. |
| K - điểm khác | Phải có danh mục location/địa chỉ và quy trình xác nhận người chịu trách nhiệm. |


## PHỤ LỤC B. BỘ TEST DỮ LIỆU TÍNH TOÁN MẪU
B.1. TCS theo ngưỡng nguồn

| Tổng tiết quy đổi buổi | Kết quả theo ngưỡng | Ghi chú |
|---|---|---|
| 0.00 | TRỐNG | Cần kết hợp availability, leave và các điều kiện khác. |
| 0.40 | TRỐNG | Bằng ngưỡng vẫn là TRỐNG theo PDF. |
| 0.41 | BẬN | Lớn hơn 0.4 là BẬN. |
| 0.50 | BẬN | Có thể là hỗ trợ teambuilding 0.5. |
| 1.00 | BẬN | Một tiết quy đổi đầy đủ. |

B.2. CTP - kiểm thử biên

| Điểm đi | KM | Mức áp dụng theo nguồn |
|---|---|---|
| N | 11.9 | 0 |
| N | 12.0 | 30.000 |
| N | 18.0 | 40.000 |
| N | 24.0 | 60.000 |
| N | 30.0 | 80.000 |
| N | 50.0 | 120.000 |
| V/K | 6.9 | 0 |
| V/K | 7.0 | 30.000 |
| V/K | 12.0 | 40.000 |
| V/K | 18.0 | 60.000 |
| V/K | 24.0 | 80.000 |
| V/K | 30.0 | 110.000 |
| Online | Bất kỳ | 0 |

Các kết quả ở bảng này là cách diễn giải khoảng dưới ngưỡng/đến ngưỡng theo văn bản PDF; chủ nghiệp vụ cần ký xác nhận chính
sách biên trước khi phát triển.
B.3. Các ca kiểm thử nghiệp vụ phức hợp

| Scenario | Dữ liệu đầu vào | Kết quả mong đợi |
|---|---|---|
| S1 - Copy tuần có ngày nghỉ trường | Template có 5 ca; ngày thứ Tư trường nghỉ; copy sang tuần mới. | Sinh 4 ca hoạt động và một bản ghi/đề xuất trạng thái trường nghỉ theo calendar; không copy ca ADHOC tuần cũ. |
| S2 - Giáo viên nghỉ có người thay | GV A có REGULAR event; leave approved; GV B đủ chứng chỉ và trống slot. | Event gốc giữ nguyên; assignment A ghi nghỉ/không thực hiện; assignment B SUBSTITUTE liên kết event gốc. |
| S3 - Dạy bù nhiều lần | Một school-off obligation 2 tiết được xếp hai ca bù một tiết. | Obligation còn 1/2 sau ca đầu; FULFILLED sau ca thứ hai; không tạo double credit. |


<!-- page 26 -->

| Scenario | Dữ liệu đầu vào | Kết quả mong đợi |
|---|---|---|
| S4 - Hai trường trong một buổi | GV dạy trường A lúc 8:00-9:00, trường B lúc 9:10-10:00; thời gian di chuyển 25 phút. | Conflict engine cảnh báo/chặn vì không đủ thời gian di chuyển 10 phút. |
| S5 - Tuần giao thoa tháng | Event vào 30/04 và 01/05 trong cùng tuần. | Báo cáo tháng 4 nhận event ngày 30/04; tháng 5 nhận event ngày 01/05. |
| S6 - Rule đổi hiệu lực | Rate CTV 130k tới 30/06; rule mới 140k từ 01/07. | Event trước 01/07 dùng 130k; từ 01/07 dùng 140k; payroll đã khóa không đổi. |


## PHỤ LỤC C. CHECKLIST PHÊ DUYỆT TRƯỚC PHÁT TRIỂN
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

## PHÊ DUYỆT TÀI LIỆU

| Vai trò phê duyệt | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| Chủ nghiệp vụ / Product Owner |  |  |  |
| Đại diện Giáo vụ |  |  |  |
| Đại diện HR |  |  |  |
| Đại diện Kế toán/Payroll |  |  |  |
| Đại diện IT/Đơn vị phát triển |  |  |  |

Khi được ký duyệt, các quy tắc P0 và phạm vi MVP trong tài liệu trở thành baseline phát triển. Mọi thay đổi tiếp theo phải được quản lý
theo change request.