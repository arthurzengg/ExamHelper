// year.js
document.addEventListener('DOMContentLoaded', function() {
    // 获取年份从URL参数
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    document.getElementById('year').textContent = year;

    // 更新链接 URL 或添加事件监听器
    // ...
});
