import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiCheck, FiSettings, FiX } from 'react-icons/fi';
import './ThemePicker.css';

const PALETTES = [
    { id: 'ocean', name: 'Ocean Blue', color: '#3b82f6' },
    { id: 'emerald', name: 'Emerald', color: '#10b981' },
    { id: 'sunset', name: 'Sunset', color: '#8b5cf6' },
    { id: 'ruby', name: 'Ruby', color: '#f43f5e' },
    { id: 'midnight', name: 'Midnight', color: '#eab308' },
];

export default function ThemePicker() {
    const { palette, changePalette } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="tp-container">
            <button
                className="tp-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Theme Settings"
                title="Theme Colors"
            >
                <FiSettings />
            </button>

            {isOpen && (
                <>
                    <div className="tp-overlay" onClick={() => setIsOpen(false)} />
                    <div className="tp-dropdown">
                        <div className="tp-header">
                            <h4>Theme Color</h4>
                            <button className="tp-close" onClick={() => setIsOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="tp-swatches">
                            {PALETTES.map((p) => (
                                <button
                                    key={p.id}
                                    className={`tp-swatch ${palette === p.id ? 'active' : ''}`}
                                    onClick={() => changePalette(p.id)}
                                    title={p.name}
                                >
                                    <div className="tp-color" style={{ backgroundColor: p.color }}>
                                        {palette === p.id && <FiCheck className="tp-check" />}
                                    </div>
                                    <span className="tp-label">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
