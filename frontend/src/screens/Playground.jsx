import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiPlay, FiTrash2, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import './Playground.css';

const DEFAULT_CODE = `// Dev Coaching JS Playground
// Write your code below and click Run

const greeting = "Hello, Developer!";
console.log(greeting);

// Try mapping an array
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(n => n * n);
console.log("Squared numbers:", squared);
`;

export default function Playground() {
    const { user } = useContext(AuthContext);
    const [code, setCode] = useState(DEFAULT_CODE);
    const [output, setOutput] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const editorRef = useRef(null);

    // Trap console.log from evaluated code
    const runCode = () => {
        setOutput([]);
        const logs = [];
        
        // Mock console.log
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
            // Very basic sandbox (not secure for real production, but good enough for client-side demo)
            const fn = new Function('console', code);
            fn(mockConsole);
        } catch (err) {
            logs.push({ type: 'error', content: err.toString() });
        }

        setOutput(logs);
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
                    <p className="playground-subtitle">Write, test, and execute JavaScript right in your browser.</p>
                </div>

                <div className={`playground-workspace ${isFullscreen ? 'fullscreen' : ''}`} ref={editorRef}>
                    <div className="pg-toolbar">
                        <div className="pg-tabs">
                            <div className="pg-tab active">script.js</div>
                        </div>
                        <div className="pg-actions">
                            <button className="pg-btn icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                            <button className="pg-btn primary run-btn" onClick={runCode}>
                                <FiPlay /> Run Code
                            </button>
                        </div>
                    </div>

                    <div className="pg-panels">
                        <div className="pg-editor-panel">
                            <div className="pg-line-numbers">
                                {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>
                            <textarea
                                className="pg-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck="false"
                                placeholder="// Write JS here..."
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
