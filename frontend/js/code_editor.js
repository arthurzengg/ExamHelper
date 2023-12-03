var editor;

window.onload = function() {
    editor = CodeMirror.fromTextArea(document.getElementById("input"), {
        mode: "python",
        theme: "leetcode",
        keyMap: "sublime", // 快键键风格
        indentUnit: 4,
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        lineWrapping: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        foldGutter: true, // 启用行槽中的代码折叠
        matchBrackets: true, // 匹配结束符号，比如"]、}"
        autoCloseBrackets: true, // 自动闭合符号
        autofocus: true, // 自动聚焦
        styleActiveLine: true, // 显示选中行的样式
    });


    // 设置编辑器初始大小
    editor.setSize("auto", (document.documentElement.clientHeight - 600) + "px");

    // 添加窗口大小改变的监听器
    window.addEventListener('resize', () => {
        editor.setSize("auto", (document.documentElement.clientHeight - 600) + "px");
    });


    // 从 URL 获取参数并加载相应的代码
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    const examType = params.get('examType');
    const question = params.get('question');


    // 设置“Back”按钮的 href
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.href = `exam_questions_page.html?year=${year}&examType=${examType}`;
    }


    // 预加载指定题目代码
//    fetch(`http://127.0.0.1:5000/api/get_code?year=${year}&examType=${examType}&question=${question}`) // 本地
//    fetch(`http://47.251.37.134/api/get_code?year=${year}&examType=${examType}&question=${question}`)// 云
    fetch(`http://47.251.37.134/api/get_code/${year}/${examType}/${question}`)// 云
        .then(response => response.json())
        .then(data => {
            editor.setValue(data.code);
        })
        .catch(error => {
            console.error('Error:', error);
            editor.setValue('// Error loading code');
        });

    // 设置初始文本，这个选项也可以在fromTextArea中配置
//    editor.setOption("value", initValue);

    // 编辑器按键监听
    editor.on("keypress", function() {
        // 显示智能提示
        editor.showHint(); // 注意，注释了CodeMirror库中show-hint.js第131行的代码（阻止了代码补全，同时提供智能提示）
    });

};


function executeCode() {
    var code = editor.getValue();

//    fetch('http://127.0.0.1:5000/api/run', {  // 本地
    fetch('http://47.251.37.134/api/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'code=' + encodeURIComponent(code),
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('output').value = data;
    });
}
