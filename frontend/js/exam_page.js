document.addEventListener('DOMContentLoaded', function() {
    // 从 URL 获取年份参数
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');

    // 设置页面标题中的年份
    document.getElementById('year').textContent = year;

    // 获取并显示考试类型
    fetchExamTypes(year);
});

function fetchExamTypes(year) {
    fetch(`http://127.0.0.1:5000/api/exams/${year}`) // 本地
//    fetch(`http://139.224.191.124/api/exams/${year}`)
        .then(response => response.json())
        .then(examTypes => {
            const examsListDiv = document.getElementById('exams-list');
            examsListDiv.innerHTML = ''; // 清空现有内容

            // 为每种考试类型创建链接
            examTypes.forEach(examType => {
                const examLink = document.createElement('a');
                examLink.href = `/exam_questions_page.html?year=${year}&examType=${examType}`; // 假设的 URL 结构
                examLink.textContent = examType;
                examLink.classList.add('exam-link');
                examsListDiv.appendChild(examLink);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            examsContainer.textContent = 'Error loading exam data.';
        });
}
