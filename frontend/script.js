var editor;

window.onload = function() {
    editor = CodeMirror.fromTextArea(document.getElementById("input"), {
        mode: "python",
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
    });
};

function executeCode() {
    var code = editor.getValue();

    fetch('http://127.0.0.1:5000/', {
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
