import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike'; // For C++ and Java
import 'codemirror/mode/go/go'; // For Go
import 'codemirror/mode/php/php'; // For PHP
import 'codemirror/mode/ruby/ruby'; // For Ruby
import 'codemirror/mode/sql/sql'; // For SQL
import 'codemirror/mode/cmake/cmake'; // For CMake, if needed
import 'codemirror/mode/markdown/markdown'; // For Markdown, if needed


const modes = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'text/x-c++src',
    java: 'text/x-java',
    c: 'text/x-csrc',
    csharp: 'text/x-csharp',
    clojure: 'text/x-clojure',
    go: 'text/x-go',
    php: 'text/x-php',
    ruby: 'text/x-ruby',
    sql: 'text/x-sql',
};

export const loadMode = (language) => {
    const mode = modes[language];
    if (!mode) {
        console.error(`Mode for language ${language} not found.`);
        return null;
    }
    return mode;
};
