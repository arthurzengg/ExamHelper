document.addEventListener('DOMContentLoaded', function() {
    // 从 URL 获取年份和考试类型
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    const examType = params.get('examType');

    // 设置页面标题
    document.getElementById('exam-info').textContent = `${year} - ${examType}`;

//     获取并显示题目列表
    fetchQuestions(year, examType);

    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.href = `exam_page.html?year=${year}`;
    }
});

function fetchQuestions(year, examType) {
//    fetch(`http://127.0.0.1:5000/api/questions/${year}/${examType}`) //本地
    fetch(`http://47.251.37.134/api/questions/${year}/${examType}`) //云
        .then(response => response.json())
        .then(questions => {
            const questionsListDiv = document.getElementById('questions-list');
            questionsListDiv.innerHTML = ''; // 清空现有内容

            // 为每个题目创建链接
            questions.forEach(question => {
                const questionLink = document.createElement('a');
                questionLink.href = `/code_editor.html?year=${year}&examType=${examType}&question=${question}`; // 假设的 URL 结构
                questionLink.textContent = question;
                questionLink.classList.add('question-link');
                questionsListDiv.appendChild(questionLink);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            questionsListDiv.textContent = 'Error loading question data.';
        });
}
