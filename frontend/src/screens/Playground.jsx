import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiPlay, FiTrash2, FiMaximize2, FiMinimize2, FiCode } from 'react-icons/fi';
import './Playground.css';

const DEFAULT_CODES = {
    javascript: `// Dev Coaching JS Playground
// Write your code below and click Run

const greeting = "Hello, Developer!";
console.log(greeting);

// Try mapping an array
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(n => n * n);
console.log("Squared numbers:", squared);
`,
    python: `# Dev Coaching Python Playground
# Write your code below and click Run

def greet(name):
    print(f"Hello, {name}!")

greet("Developer")

# Try a list comprehension
numbers = [1, 2, 3, 4, 5]
squared = [n * n for n in numbers]
print("Squared numbers:", squared)
`,
    c: `// Dev Coaching C Playground
// Write your code below and click Run

#include <stdio.h>

int main() {
    printf("Hello, Developer!\\n");
    
    int numbers[] = {1, 2, 3, 4, 5};
    printf("Squared numbers: ");
    for(int i = 0; i < 5; i++) {
        printf("%d ", numbers[i] * numbers[i]);
    }
    printf("\\n");
    
    return 0;
}
`,
    cpp: `// Dev Coaching C++ Playground
// Write your code below and click Run

#include <iostream>
#include <vector>

int main() {
    std::cout << "Hello, Developer!" << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << "Squared numbers: ";
    for(int n : numbers) {
        std::cout << (n * n) << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
`
};

export default function Playground() {
    const { user } = useContext(AuthContext);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODES['javascript']);
    const [output, setOutput] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef(null);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(DEFAULT_CODES[newLang]);
        setOutput([]);
    };

    // Run Code using local sandbox for JS, and Piston API for others
    const runCode = async () => {
        setIsRunning(true);
        setOutput([]);
        const logs = [];
        
        if (language === 'javascript') {
            // Local JS Execution
            const mockConsole = {
                log: (...args) => {
                    logs.push({ 
                        type: 'log', 
                        content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') 
                    });
                },
                error: (...args) => {
                    logs.push({ 
                        type: 'error', 
                        content: args.map(a => String(a)).join(' ') 
                    });
                }
            };

            try {
                const fn = new Function('console', code);
                fn(mockConsole);
            } catch (err) {
                logs.push({ type: 'error', content: err.toString() });
            }

            setOutput(logs);
            setIsRunning(false);
        } else {
            // Remote Execution using Piston API (Free, no auth required)
            const versions = {
                'python': '3.10.0',
                'c': '10.2.0',
                'cpp': '10.2.0'
            };

            try {
                const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: language,
                        version: versions[language],
                        files: [{ content: code }]
                    })
                });

                const data = await res.json();
                
                if (data.run && data.run.output) {
                    // Split output by newlines and add to logs
                    const outputLines = data.run.output.split('\\n');
                    outputLines.forEach(line => {
                        if (line.trim()) {
                            logs.push({ type: data.run.code === 0 ? 'log' : 'error', content: line });
                        }
                    });
                    
                    if (logs.length === 0) {
                        logs.push({ type: 'log', content: '[Program finished with no output]' });
                    }
                } else if (data.message) {
                    logs.push({ type: 'error', content: data.message });
                } else {
                    logs.push({ type: 'error', content: 'Execution failed or timed out.' });
                }
            } catch (error) {
                logs.push({ type: 'error', content: 'Network error: Failed to reach execution server.' });
            }

            setOutput(logs);
            setIsRunning(false);
        }
    };

    const clearOutput = () => setOutput([]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            editorRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (!user) return (
        <div className="playground-page">
            <div className="container"><p>Please login to use the Playground.</p></div>
        </div>
    );

    return (
        <div className="playground-page">
            <div className="container">
                <div className="playground-header">
                    <h1 className="playground-title">Code <span>Playground</span></h1>
                    <p className="playground-subtitle">Write, test, and execute code right in your browser.</p>
                </div>

                <div className={`playground-workspace ${isFullscreen ? 'fullscreen' : ''}`} ref={editorRef}>
                    <div className="pg-toolbar">
                        <div className="pg-tabs">
                            <div className="pg-tab active">
                                <FiCode style={{ marginRight: '6px' }} />
                                main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'c'}
                            </div>
                        </div>
                        <div className="pg-actions">
                            <select 
                                className="pg-lang-select" 
                                value={language} 
                                onChange={handleLanguageChange}
                                disabled={isRunning}
                            >
                                <option value="javascript">JavaScript (Node)</option>
                                <option value="python">Python 3</option>
                                <option value="c">C (GCC)</option>
                                <option value="cpp">C++ (GCC)</option>
                            </select>

                            <button className="pg-btn icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                            <button className="pg-btn primary run-btn" onClick={runCode} disabled={isRunning}>
                                {isRunning ? 'Running...' : <><FiPlay /> Run Code</>}
                            </button>
                        </div>
                    </div>

                    <div className="pg-panels">
                        <div className="pg-editor-panel">
                            <div className="pg-line-numbers">
                                {code.split('\\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>
                            <textarea
                                className="pg-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck="false"
                                placeholder="// Write code here..."
                            />
                        </div>
                        
                        <div className="pg-output-panel">
                            <div className="pg-output-header">
                                <span>Console Output</span>
                                <button className="pg-btn text" onClick={clearOutput} title="Clear Console">
                                    <FiTrash2 /> Clear
                                </button>
                            </div>
                            <div className="pg-terminal">
                                {output.length === 0 ? (
                                    <div className="pg-terminal-empty">Run your code to see output here.</div>
                                ) : (
                                    output.map((log, i) => (
                                        <div key={i} className={`pg-log type-${log.type}`}>
                                            <span className="pg-prompt">{'>'}</span> {log.content}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
