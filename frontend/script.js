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
    // 设置初始文本，这个选项也可以在fromTextArea中配置
    myCodeMirror.setOption("value", initValue);
    // 编辑器按键监听
    myCodeMirror.on("keypress", function() {
        // 显示智能提示
        myCodeMirror.showHint(); // 注意，注释了CodeMirror库中show-hint.js第131行的代码（阻止了代码补全，同时提供智能提示）
    });
};

function executeCode() {
    var code = editor.getValue();

    fetch('http://127.0.0.1:5000/run', {
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
