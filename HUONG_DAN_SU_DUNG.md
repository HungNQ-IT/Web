# Hướng dẫn sử dụng - Quản lý bài tập về nhà

## Cách 1: Cập nhật thủ công bằng file JSON (Khuyến nghị)

### Bước 1: Mở file `homeworks.json`
- File `homeworks.json` nằm trong cùng thư mục với các file HTML, CSS, JS
- Mở file này bằng trình soạn thảo văn bản (Notepad, VS Code, v.v.)

### Bước 2: Thêm hoặc chỉnh sửa bài tập
File có định dạng như sau:
```json
[
  {
    "id": "hw_001",
    "title": "Tên bài tập",
    "description": "Mô tả bài tập",
    "timeLimit": 3600,
    "questions": [
      {
        "id": 1,
        "question": "Câu hỏi?",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "Giải thích đáp án"
      }
    ]
  }
]
```

**Lưu ý:**
- `id`: Mã định danh duy nhất cho bài tập (không được trùng)
- `title`: Tên bài tập
- `description`: Mô tả bài tập
- `timeLimit`: Thời gian làm bài (tính bằng giây, ví dụ: 3600 = 60 phút)
- `questions`: Mảng các câu hỏi
  - `id`: Số thứ tự câu hỏi
  - `question`: Nội dung câu hỏi
  - `options`: Mảng 4 đáp án (A, B, C, D)
  - `correct`: Chỉ số đáp án đúng (0 = A, 1 = B, 2 = C, 3 = D)
  - `explanation`: Giải thích đáp án

### Bước 3: Lưu file và tải lại trên web
1. Lưu file `homeworks.json`
2. Mở trang web
3. Vào trang "Bài tập"
4. Nhấn nút "🔄 Tải lại từ file"
5. Bài tập sẽ tự động hiển thị

## Cách 2: Sử dụng giao diện quản lý

### Bước 1: Mở quản lý bài tập
- Vào trang "Bài tập"
- Nhấn nút "📚 Quản lý bài tập về nhà"

### Bước 2: Upload file JSON
1. Nhấn "📤 Chọn file JSON"
2. Chọn file JSON bài tập (định dạng giống như trên)
3. File sẽ được tự động thêm vào hệ thống

### Bước 3: Tạo bài tập mới từ form
1. Điền tên bài tập
2. Điền mô tả (tùy chọn)
3. Điền thời gian (phút)
4. Nhấn "Tạo bài tập"
5. File JSON sẽ được tải xuống
6. Mở file, thêm câu hỏi, sau đó upload lại

## Cách 3: Xuất và chỉnh sửa bài tập

1. Vào "Quản lý bài tập về nhà"
2. Tìm bài tập cần chỉnh sửa
3. Nhấn "📥 Xuất" để tải file JSON
4. Chỉnh sửa file
5. Upload lại file đã chỉnh sửa

## Ví dụ câu hỏi

```json
{
  "id": 1,
  "question": "Nếu 2x + 5 = 15, giá trị của x là bao nhiêu?",
  "options": ["3", "5", "7", "10"],
  "correct": 1,
  "explanation": "Giải:\n2x + 5 = 15\n2x = 15 - 5\n2x = 10\nx = 5"
}
```

## Lưu ý quan trọng

1. **File JSON phải hợp lệ**: Đảm bảo cú pháp JSON đúng, không có lỗi
2. **ID không trùng lặp**: Mỗi bài tập phải có ID duy nhất
3. **Đáp án đúng**: Chỉ số `correct` phải là 0, 1, 2 hoặc 3 (tương ứng với A, B, C, D)
4. **Thời gian**: Tính bằng giây (ví dụ: 3600 = 60 phút)
5. **Tải lại**: Sau khi cập nhật file, nhớ nhấn "🔄 Tải lại từ file" để cập nhật

## Xóa bài tập

1. Vào "Quản lý bài tập về nhà"
2. Tìm bài tập cần xóa
3. Nhấn "🗑️ Xóa"
4. Xác nhận xóa

