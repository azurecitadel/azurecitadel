import hljs from 'highlight.js';

function addCopyButtons(clipboard) {
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {

        var code = codeBlock.innerText;

        var copy = `<button class="btn m-2 p-2 tooltipped tooltipped-w" type="button" aria-label="Copy">
        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/></svg>
        </button>`;
        var copied = `<button class="btn m-2 p-2 tooltipped tooltipped-w tooltipped-no-delay" type="button" aria-label="Copied!">
        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
        </button>`;

        var div = document.createElement('div');
        div.setAttribute('class', 'copy-code-button position-absolute right-0 top-0');
        div.innerHTML = copy;
        div.addEventListener('click', function () {
            clipboard.writeText(code).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                div.blur();

                div.innerHTML = copied;

                setTimeout(function () {
                    div.innerHTML = copy;
                }, 2000);
            }, function (_) {
                div.innerText = 'Error';
            });
        });

        codeBlock.parentNode.parentNode.appendChild(div);
    });
}

window.addEventListener('DOMContentLoaded', function () {
    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
        hljs.highlightAll();
    }
});
