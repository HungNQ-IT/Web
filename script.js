// Trạng thái bài thi
let currentTest = null;
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;
let timerInterval = null;
let timeRemaining = 600; // 10 phút = 600 giây
let startTime = null;

// Khởi tạo trang web
document.addEventListener('DOMContentLoaded', function() {
    // Thêm event listener cho nút "Bắt đầu ngay" ở hero section
    const heroButton = document.querySelector('.hero .btn-primary');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Bắt đầu bài thi
function startTest(category) {
    currentTest = category;
    currentQuestionIndex = 0;
    selectedAnswer = null;
    score = 0;
    timeRemaining = 600; // 10 phút
    startTime = Date.now();
    
    // Ẩn tất cả các trang, chỉ hiện trang làm bài
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('testPage').classList.add('active');
    
    // Reset timer display
    document.getElementById('timer').style.color = '';
    document.getElementById('timer').style.animation = '';
    
    // Hiển thị câu hỏi đầu tiên
    loadQuestion();
    
    // Bắt đầu đếm ngược
    startTimer();
}

// Tải câu hỏi
function loadQuestion() {
    const questions = questionDatabase[currentTest];
    if (!questions || currentQuestionIndex >= questions.length) {
        finishTest();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    selectedAnswer = null;
    
    // Hiển thị câu hỏi
    document.getElementById('questionText').textContent = question.question;
    
    // Hiển thị các lựa chọn
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        const optionLabel = document.createElement('span');
        optionLabel.textContent = String.fromCharCode(65 + index) + '. ' + option;
        button.appendChild(optionLabel);
        button.onclick = () => selectAnswer(index);
        button.setAttribute('aria-label', `Lựa chọn ${String.fromCharCode(65 + index)}: ${option}`);
        optionsContainer.appendChild(button);
    });
    
    // Ẩn explanation box
    const explanationBox = document.getElementById('explanationBox');
    explanationBox.classList.add('hidden');
    explanationBox.innerHTML = '';
    
    // Hiển thị nút "Kiểm tra đáp án", ẩn nút "Câu tiếp theo"
    document.getElementById('submitBtn').classList.remove('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
    
    // Cập nhật progress
    updateProgress();
}

// Chọn đáp án
function selectAnswer(index) {
    if (document.getElementById('submitBtn').classList.contains('hidden')) {
        return; // Đã kiểm tra đáp án rồi
    }
    
    selectedAnswer = index;
    
    // Cập nhật UI
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Kiểm tra đáp án
function checkAnswer() {
    if (selectedAnswer === null) {
        alert('Vui lòng chọn một đáp án!');
        return;
    }
    
    const questions = questionDatabase[currentTest];
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    if (isCorrect) {
        score++;
    }
    
    // Hiển thị kết quả
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Hiển thị explanation
    const explanationBox = document.getElementById('explanationBox');
    explanationBox.classList.remove('hidden');
    explanationBox.classList.remove('correct', 'incorrect');
    explanationBox.classList.add(isCorrect ? 'correct' : 'incorrect');
    explanationBox.innerHTML = `
        <div class="explanation-title">
            <span>${isCorrect ? '✓' : '✗'}</span>
            <span>${isCorrect ? 'Đúng rồi!' : 'Sai rồi!'}</span>
        </div>
        <p>${question.explanation}</p>
    `;
    
    // Ẩn nút "Kiểm tra đáp án", hiện nút "Câu tiếp theo"
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
    
    // Nếu là câu hỏi cuối, đổi text nút thành "Xem kết quả"
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('nextBtn').textContent = 'Xem kết quả';
    }
}

// Câu hỏi tiếp theo
function nextQuestion() {
    const questions = questionDatabase[currentTest];
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishTest();
    }
}

// Kết thúc bài thi
function finishTest() {
    clearInterval(timerInterval);
    
    // Tính thời gian đã làm
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Ẩn trang làm bài, hiện trang kết quả
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('testPage').classList.remove('active');
    document.getElementById('exercisesPage').classList.remove('active');
    document.getElementById('statsPage').classList.remove('active');
    document.getElementById('guidePage').classList.remove('active');
    document.getElementById('resultsPage').classList.add('active');
    
    // Hiển thị kết quả
    const questions = questionDatabase[currentTest];
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    document.getElementById('scoreValue').textContent = `${score}/${totalQuestions}`;
    document.getElementById('percentValue').textContent = `${percentage}%`;
    document.getElementById('timeValue').textContent = timeString;
    
    // Xác định category để lưu (nếu là bài tập về nhà, lưu thông tin đặc biệt)
    let categoryToSave = currentTest;
    let homeworkIdToSave = null;
    let homeworkTitleToSave = null;
    
    if (currentTest && currentTest.startsWith('homework_')) {
        categoryToSave = 'homework';
        homeworkIdToSave = currentTest.replace('homework_', '');
        // Lấy thông tin bài tập về nhà
        const homeworks = getHomeworks();
        const homework = homeworks.find(h => h.id === homeworkIdToSave);
        if (homework) {
            homeworkTitleToSave = homework.title;
        }
    }
    
    // Lưu kết quả vào localStorage
    saveTestResult(categoryToSave, score, totalQuestions, timeElapsed, percentage, homeworkIdToSave, homeworkTitleToSave);
    
    // Reset biến bài tập về nhà
    if (currentHomeworkId) {
        currentHomeworkId = null;
        currentHomeworkTitle = null;
    }
}

// Bắt đầu timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishTest();
        }
    }, 1000);
}

// Cập nhật hiển thị timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Cảnh báo khi thời gian sắp hết
    if (timeRemaining <= 60) {
        document.getElementById('timer').style.color = '#ef4444';
        document.getElementById('timer').style.animation = 'pulse 1s infinite';
    }
}

// Cập nhật progress bar
function updateProgress() {
    const questions = questionDatabase[currentTest];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    document.getElementById('questionNumber').textContent = `Câu ${currentQuestionIndex + 1}/${totalQuestions}`;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Làm lại bài thi
function retakeTest() {
    if (currentTest) {
        startTest(currentTest);
    }
}

// Về trang chủ
function goHome() {
    clearInterval(timerInterval);
    showPage('homePage');
}

// Hiển thị trang
function showPage(pageId) {
    // Ẩn tất cả các trang
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Hiện trang được chọn
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Cập nhật navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Nếu là trang thống kê hoặc bài tập, cập nhật dữ liệu
    if (pageId === 'statsPage') {
        updateStatsPage();
    } else if (pageId === 'exercisesPage') {
        updateExercisesPage();
    }
}

// Cập nhật trang bài tập
function updateExercisesPage() {
    const stats = getStats();
    document.getElementById('totalTests').textContent = stats.totalTests;
    document.getElementById('averageScore').textContent = stats.averageScore + '%';
    document.getElementById('totalTime').textContent = Math.floor(stats.totalTime / 60) + ' phút';
    
    // Cập nhật danh sách bài tập về nhà
    updateHomeworkList();
    updateHomeworkExercises();
    
    // Thiết lập lại event listeners khi chuyển đến trang bài tập
    setupHomeworkButtons();
}

// Cập nhật trang thống kê
function updateStatsPage() {
    const stats = getStats();
    
    // Cập nhật tổng quan
    document.getElementById('statsTotalTests').textContent = stats.totalTests;
    document.getElementById('statsAverageScore').textContent = stats.averageScore + '%';
    document.getElementById('statsTotalTime').textContent = Math.floor(stats.totalTime / 60) + ' phút';
    document.getElementById('statsCompletionRate').textContent = stats.completionRate + '%';
    
    // Cập nhật thành tích theo chủ đề
    document.getElementById('mathTestsCount').textContent = stats.mathTests;
    document.getElementById('mathAverageScore').textContent = stats.mathAverage + '%';
    document.getElementById('readingTestsCount').textContent = stats.readingTests;
    document.getElementById('readingAverageScore').textContent = stats.readingAverage + '%';
    
    // Cập nhật lịch sử bài làm
    updateRecentTests();
}

// Cập nhật lịch sử bài làm gần đây
function updateRecentTests() {
    const recentTests = getRecentTests();
    const container = document.getElementById('recentTestsList');
    
    if (recentTests.length === 0) {
        container.innerHTML = '<p class="no-data">Chưa có bài làm nào. Hãy bắt đầu luyện tập ngay!</p>';
        return;
    }
    
    container.innerHTML = recentTests.slice(0, 10).map(test => {
        let categoryName = '';
        if (test.homeworkTitle) {
            categoryName = `📚 ${test.homeworkTitle}`;
        } else if (test.category === 'math') {
            categoryName = '📐 Toán học';
        } else if (test.category === 'reading') {
            categoryName = '📖 Đọc hiểu';
        } else if (test.category === 'homework') {
            categoryName = test.homeworkTitle ? `📚 ${test.homeworkTitle}` : '📚 Bài tập về nhà';
        } else {
            categoryName = '📝 Bài tập';
        }
        
        return `
            <div class="recent-test-item">
                <div class="recent-test-info">
                    <strong>${categoryName}</strong>
                    <span>${new Date(test.date).toLocaleString('vi-VN')}</span>
                </div>
                <div class="recent-test-score">${test.percentage}%</div>
            </div>
        `;
    }).join('');
}

// Lấy thống kê
function getStats() {
    const tests = JSON.parse(localStorage.getItem('satTests') || '[]');
    const totalTests = tests.length;
    
    if (totalTests === 0) {
        return {
            totalTests: 0,
            averageScore: 0,
            totalTime: 0,
            completionRate: 0,
            mathTests: 0,
            mathAverage: 0,
            readingTests: 0,
            readingAverage: 0
        };
    }
    
    const totalScore = tests.reduce((sum, test) => sum + test.percentage, 0);
    const averageScore = Math.round(totalScore / totalTests);
    const totalTime = tests.reduce((sum, test) => sum + test.timeElapsed, 0);
    const completionRate = 100; // Giả sử tất cả bài đều hoàn thành
    
    const mathTests = tests.filter(t => t.category === 'math');
    const readingTests = tests.filter(t => t.category === 'reading');
    
    const mathAverage = mathTests.length > 0 
        ? Math.round(mathTests.reduce((sum, t) => sum + t.percentage, 0) / mathTests.length)
        : 0;
    
    const readingAverage = readingTests.length > 0
        ? Math.round(readingTests.reduce((sum, t) => sum + t.percentage, 0) / readingTests.length)
        : 0;
    
    return {
        totalTests,
        averageScore,
        totalTime,
        completionRate,
        mathTests: mathTests.length,
        mathAverage,
        readingTests: readingTests.length,
        readingAverage
    };
}

// Lấy bài làm gần đây
function getRecentTests() {
    const tests = JSON.parse(localStorage.getItem('satTests') || '[]');
    return tests.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Lưu kết quả bài thi
function saveTestResult(category, score, total, timeElapsed, percentage, homeworkId = null, homeworkTitle = null) {
    const tests = JSON.parse(localStorage.getItem('satTests') || '[]');
    const testResult = {
        category,
        score,
        total,
        timeElapsed,
        percentage,
        date: new Date().toISOString()
    };
    
    if (homeworkId) {
        testResult.homeworkId = homeworkId;
        testResult.homeworkTitle = homeworkTitle;
    }
    
    tests.push(testResult);
    localStorage.setItem('satTests', JSON.stringify(tests));
}

// Xóa thống kê
function clearStats() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả thống kê?')) {
        localStorage.removeItem('satTests');
        updateStatsPage();
        updateExercisesPage();
        alert('Đã xóa thống kê thành công!');
    }
}

// ===== HOMEWORK MANAGEMENT =====

// Toggle homework manager
function toggleHomeworkManager() {
    console.log('toggleHomeworkManager called');
    const manager = document.getElementById('homeworkManager');
    console.log('Manager element:', manager);
    if (manager) {
        const isHidden = manager.classList.contains('hidden');
        console.log('Is hidden:', isHidden);
        manager.classList.toggle('hidden');
        console.log('After toggle, is hidden:', manager.classList.contains('hidden'));
        
        // Scroll đến phần quản lý nếu đang mở
        if (!manager.classList.contains('hidden')) {
            setTimeout(() => {
                manager.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    } else {
        console.error('homeworkManager element not found!');
    }
}

// Đảm bảo hàm có thể gọi được từ global scope
window.toggleHomeworkManager = toggleHomeworkManager;

// Tải lại bài tập từ file
async function reloadHomeworksFromFile() {
    console.log('reloadHomeworksFromFile called');
    try {
        const response = await fetch('homeworks.json?t=' + Date.now()); // Thêm timestamp để tránh cache
        console.log('Response status:', response.status);
        if (response.ok) {
            const homeworksFromFile = await response.json();
            console.log('Loaded homeworks:', homeworksFromFile);
            const existingHomeworks = getHomeworks();
            
            // Merge bài tập từ file
            homeworksFromFile.forEach(hw => {
                const index = existingHomeworks.findIndex(existing => existing.id === hw.id);
                if (index >= 0) {
                    // Cập nhật nếu đã tồn tại
                    existingHomeworks[index] = hw;
                } else {
                    // Thêm mới nếu chưa có
                    existingHomeworks.push(hw);
                }
            });
            
            saveHomeworks(existingHomeworks);
            updateHomeworkList();
            updateHomeworkExercises();
            alert('Đã tải lại bài tập từ file homeworks.json thành công!');
        } else {
            alert('Không tìm thấy file homeworks.json. Vui lòng đảm bảo file tồn tại trong thư mục.');
        }
    } catch (error) {
        alert('Lỗi khi tải file: ' + error.message);
        console.error('Error loading homeworks:', error);
    }
}

// Đảm bảo hàm có thể gọi được từ global scope
window.reloadHomeworksFromFile = reloadHomeworksFromFile;

// Xử lý upload file
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const homeworkData = JSON.parse(e.target.result);
            addHomework(homeworkData);
            alert('Đã thêm bài tập thành công!');
            event.target.value = ''; // Reset input
        } catch (error) {
            alert('Lỗi: File JSON không hợp lệ. Vui lòng kiểm tra lại định dạng file.');
            console.error('Error parsing JSON:', error);
        }
    };
    reader.readAsText(file);
}

// Tạo bài tập từ form
function createHomeworkFromForm() {
    const title = document.getElementById('homeworkTitle').value.trim();
    const description = document.getElementById('homeworkDescription').value.trim();
    const time = parseInt(document.getElementById('homeworkTime').value);
    
    if (!title) {
        alert('Vui lòng nhập tên bài tập!');
        return;
    }
    
    if (!time || time < 1) {
        alert('Vui lòng nhập thời gian hợp lệ (ít nhất 1 phút)!');
        return;
    }
    
    // Tạo cấu trúc bài tập mặc định (giáo viên có thể chỉnh sửa sau)
    const homeworkData = {
        id: Date.now().toString(),
        title: title,
        description: description || 'Bài tập về nhà',
        timeLimit: time * 60, // Chuyển sang giây
        questions: [],
        createdAt: new Date().toISOString()
    };
    
    addHomework(homeworkData);
    
    // Reset form
    document.getElementById('homeworkTitle').value = '';
    document.getElementById('homeworkDescription').value = '';
    document.getElementById('homeworkTime').value = '';
    
    alert('Đã tạo bài tập thành công! Bạn có thể thêm câu hỏi bằng cách chỉnh sửa file JSON.');
    
    // Xuất file để giáo viên có thể chỉnh sửa
    exportHomework(homeworkData.id);
}

// Thêm bài tập
function addHomework(homeworkData) {
    const homeworks = getHomeworks();
    
    // Nếu chưa có ID, tạo mới
    if (!homeworkData.id) {
        homeworkData.id = Date.now().toString();
    }
    
    // Nếu đã tồn tại, cập nhật
    const index = homeworks.findIndex(h => h.id === homeworkData.id);
    if (index >= 0) {
        homeworks[index] = homeworkData;
    } else {
        homeworks.push(homeworkData);
    }
    
    saveHomeworks(homeworks);
    updateHomeworkList();
    updateHomeworkExercises();
}

// Lấy danh sách bài tập về nhà
function getHomeworks() {
    return JSON.parse(localStorage.getItem('satHomeworks') || '[]');
}

// Lưu danh sách bài tập về nhà
function saveHomeworks(homeworks) {
    localStorage.setItem('satHomeworks', JSON.stringify(homeworks));
}

// Cập nhật danh sách bài tập trong manager
function updateHomeworkList() {
    const homeworks = getHomeworks();
    const container = document.getElementById('homeworkList');
    
    if (homeworks.length === 0) {
        container.innerHTML = '<p class="no-data">Chưa có bài tập về nhà nào. Hãy thêm bài tập mới!</p>';
        return;
    }
    
    container.innerHTML = homeworks.map(homework => `
        <div class="homework-item">
            <div class="homework-item-header">
                <h4 class="homework-item-title">${homework.title}</h4>
                <div class="homework-item-actions">
                    <button class="btn-small btn-danger" onclick="deleteHomework('${homework.id}')">🗑️ Xóa</button>
                    <button class="btn-small btn-secondary" onclick="exportHomework('${homework.id}')">📥 Xuất</button>
                </div>
            </div>
            <p class="homework-item-description">${homework.description || 'Không có mô tả'}</p>
            <div class="homework-item-info">
                <span class="homework-item-questions">📊 ${homework.questions ? homework.questions.length : 0} câu hỏi</span>
                <span class="homework-item-time">⏱️ ${Math.floor((homework.timeLimit || 0) / 60)} phút</span>
            </div>
        </div>
    `).join('');
}

// Cập nhật danh sách bài tập để học sinh làm
function updateHomeworkExercises() {
    const homeworks = getHomeworks();
    const container = document.getElementById('homeworkExercisesGrid');
    const section = document.getElementById('homeworkExercises');
    
    if (homeworks.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    container.innerHTML = homeworks.map(homework => {
        const questionCount = homework.questions ? homework.questions.length : 0;
        const timeMinutes = Math.floor((homework.timeLimit || 0) / 60);
        
        return `
            <div class="homework-exercise-card">
                <div class="exercise-icon">📚</div>
                <h3>${homework.title}</h3>
                <div class="exercise-info">
                    <span class="info-item">📊 ${questionCount} câu hỏi</span>
                    <span class="info-item">⏱️ ${timeMinutes} phút</span>
                    <span class="info-item">📝 Bài tập về nhà</span>
                </div>
                <p class="exercise-description">${homework.description || 'Bài tập về nhà'}</p>
                <button class="btn-primary" onclick="startHomework('${homework.id}')">Bắt đầu làm bài</button>
            </div>
        `;
    }).join('');
}

// Xóa bài tập
function deleteHomework(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
        return;
    }
    
    const homeworks = getHomeworks();
    const filtered = homeworks.filter(h => h.id !== id);
    saveHomeworks(filtered);
    updateHomeworkList();
    updateHomeworkExercises();
    alert('Đã xóa bài tập thành công!');
}

// Xuất bài tập
function exportHomework(id) {
    const homeworks = getHomeworks();
    const homework = homeworks.find(h => h.id === id);
    
    if (!homework) {
        alert('Không tìm thấy bài tập!');
        return;
    }
    
    const dataStr = JSON.stringify(homework, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${homework.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Bắt đầu làm bài tập về nhà
function startHomework(id) {
    const homeworks = getHomeworks();
    const homework = homeworks.find(h => h.id === id);
    
    if (!homework) {
        alert('Không tìm thấy bài tập!');
        return;
    }
    
    if (!homework.questions || homework.questions.length === 0) {
        alert('Bài tập này chưa có câu hỏi! Vui lòng thêm câu hỏi trước.');
        return;
    }
    
    // Tạo category tạm thời cho bài tập về nhà
    const tempCategory = 'homework_' + id;
    questionDatabase[tempCategory] = homework.questions.map((q, index) => ({
        id: q.id || (index + 1),
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || 'Không có giải thích'
    }));
    
    // Lưu thông tin bài tập về nhà hiện tại
    currentHomeworkId = id;
    currentHomeworkTitle = homework.title;
    
    // Bắt đầu bài thi với category tạm thời
    currentTest = tempCategory;
    currentQuestionIndex = 0;
    selectedAnswer = null;
    score = 0;
    timeRemaining = homework.timeLimit || 3600; // Mặc định 1 giờ
    startTime = Date.now();
    
    // Ẩn tất cả các trang, chỉ hiện trang làm bài
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('testPage').classList.add('active');
    
    // Reset timer display
    document.getElementById('timer').style.color = '';
    document.getElementById('timer').style.animation = '';
    
    // Hiển thị câu hỏi đầu tiên
    loadQuestion();
    
    // Bắt đầu đếm ngược
    startTimer();
}

// Biến để lưu thông tin bài tập về nhà hiện tại
let currentHomeworkId = null;
let currentHomeworkTitle = null;

// Utility: Thêm class hidden nếu chưa có trong CSS
if (!document.querySelector('style[data-hidden]')) {
    const style = document.createElement('style');
    style.setAttribute('data-hidden', 'true');
    style.textContent = '.hidden { display: none !important; }';
    document.head.appendChild(style);
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function() {
    // Load bài tập từ file homeworks.json
    loadHomeworksFromFile();
    
    // Thiết lập event listeners cho các nút (sau khi DOM đã load)
    setupHomeworkButtons();
    
    console.log('Page loaded, functions available:', typeof toggleHomeworkManager, typeof reloadHomeworksFromFile);
});

// Thiết lập event listeners cho các nút bài tập
function setupHomeworkButtons() {
    // Đợi một chút để đảm bảo DOM đã render hoàn toàn
    setTimeout(function() {
        const toggleBtn = document.getElementById('toggleHomeworkBtn');
        const reloadBtn = document.getElementById('reloadHomeworkBtn');
        
        if (toggleBtn) {
            // Đảm bảo nút có thể click được
            toggleBtn.style.pointerEvents = 'auto';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.zIndex = '1000';
            toggleBtn.style.position = 'relative';
            
            // Thêm listener mới (không cần xóa cũ vì dùng addEventListener)
            toggleBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle button clicked via onclick');
                toggleHomeworkManager();
                return false;
            };
            
            // Cũng thêm addEventListener để đảm bảo
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle button clicked via addEventListener');
                toggleHomeworkManager();
            }, true);
            
            console.log('Toggle button event listener added', toggleBtn);
        } else {
            console.warn('Toggle button not found');
        }
        
        if (reloadBtn) {
            // Đảm bảo nút có thể click được
            reloadBtn.style.pointerEvents = 'auto';
            reloadBtn.style.cursor = 'pointer';
            reloadBtn.style.zIndex = '1000';
            reloadBtn.style.position = 'relative';
            
            // Thêm listener mới
            reloadBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Reload button clicked via onclick');
                reloadHomeworksFromFile();
                return false;
            };
            
            // Cũng thêm addEventListener để đảm bảo
            reloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Reload button clicked via addEventListener');
                reloadHomeworksFromFile();
            }, true);
            
            console.log('Reload button event listener added', reloadBtn);
        } else {
            console.warn('Reload button not found');
        }
    }, 200);
}

// Load bài tập từ file homeworks.json
async function loadHomeworksFromFile() {
    try {
        const response = await fetch('homeworks.json');
        if (response.ok) {
            const homeworksFromFile = await response.json();
            const existingHomeworks = getHomeworks();
            
            // Merge bài tập từ file vào localStorage (chỉ thêm nếu chưa có)
            homeworksFromFile.forEach(hw => {
                const exists = existingHomeworks.find(existing => existing.id === hw.id);
                if (!exists) {
                    existingHomeworks.push(hw);
                } else {
                    // Cập nhật nếu đã tồn tại (để có thể cập nhật bài tập)
                    const index = existingHomeworks.findIndex(existing => existing.id === hw.id);
                    existingHomeworks[index] = hw;
                }
            });
            
            saveHomeworks(existingHomeworks);
            updateHomeworkList();
            updateHomeworkExercises();
        }
    } catch (error) {
        console.log('Không tìm thấy file homeworks.json hoặc lỗi khi load:', error);
        // Nếu không có file, vẫn hoạt động bình thường với localStorage
    }
}

