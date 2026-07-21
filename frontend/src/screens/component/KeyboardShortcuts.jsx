import { useEffect, useCallback, useState } from 'react';
import './KeyboardShortcuts.css';

const SHORTCUTS = [
    { keys: ['Ctrl', 'K'], description: 'Open Search', category: 'Navigation' },
    { keys: ['Shift', '?'], description: 'Show Keyboard Shortcuts', category: 'Help' },
    { keys: ['G', 'H'], description: 'Go to Home', category: 'Navigation' },
    { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
    { keys: ['G', 'C'], description: 'Go to Courses', category: 'Navigation' },
    { keys: ['G', 'L'], description: 'Go to Learning Hub', category: 'Navigation' },
    { keys: ['G', 'B'], description: 'Go to Batches', category: 'Navigation' },
    { keys: ['G', 'P'], description: 'Go to Playground', category: 'Navigation' },
    { keys: ['G', 'A'], description: 'Go to Analytics', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close any modal / overlay', category: 'General' },
];

export default function KeyboardShortcuts({ onOpenSearch, navigate }) {
    const [showHelp, setShowHelp] = useState(false);
    const [pendingG, setPendingG] = useState(false);

    const handleKey = useCallback((e) => {
        // Don't fire when typing in inputs / textareas
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;

        // Ctrl+K → open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            onOpenSearch?.();
            return;
        }

        // Shift+? → toggle help
        if (e.shiftKey && e.key === '?') {
            e.preventDefault();
            setShowHelp(prev => !prev);
            return;
        }

        // Esc → close help
        if (e.key === 'Escape') {
            setShowHelp(false);
            return;
        }

        // "G then X" two-key combos
        if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            setPendingG(true);
            setTimeout(() => setPendingG(false), 1000); // 1s window
            return;
        }

        if (pendingG) {
            setPendingG(false);
            const routes = {
                h: '/',
                d: '/dashboard',
                c: '/course',
                l: '/learning-hub',
                b: '/batches',
                p: '/playground',
                a: '/analytics',
            };
            if (routes[e.key]) {
                navigate?.(routes[e.key]);
            }
        }
    }, [onOpenSearch, navigate, pendingG]);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    if (!showHelp) return null;

    const categories = [...new Set(SHORTCUTS.map(s => s.category))];

    return (
        <>
            <div className="ks-overlay" onClick={() => setShowHelp(false)} />
            <div className="ks-modal" role="dialog" aria-label="Keyboard Shortcuts">
                <div className="ks-header">
                    <h3>⌨️ Keyboard Shortcuts</h3>
                    <button className="ks-close" onClick={() => setShowHelp(false)}>×</button>
                </div>
                <div className="ks-body">
                    {categories.map(cat => (
                        <div key={cat} className="ks-category">
                            <h4 className="ks-cat-title">{cat}</h4>
                            {SHORTCUTS.filter(s => s.category === cat).map((s, i) => (
                                <div key={i} className="ks-row">
                                    <span className="ks-desc">{s.description}</span>
                                    <span className="ks-keys">
                                        {s.keys.map((k, j) => (
                                            <span key={j}>
                                                <kbd className="ks-key">{k}</kbd>
                                                {j < s.keys.length - 1 && <span className="ks-plus">+</span>}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
