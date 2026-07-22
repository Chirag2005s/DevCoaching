import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Users, UserCheck, BookOpen, Library, FileText,
  CreditCard, ShieldCheck, Settings, Bot, Bell, ArrowRight, X
} from 'lucide-react';
import './CommandSearch.css';

const QUICK_SEARCH_ITEMS = [
  { id: 'overview', title: 'Dashboard Overview', category: 'Main', path: '/', icon: Search },
  { id: 'students', title: 'Student Directory', category: 'Users', path: '/students', icon: Users },
  { id: 'teachers', title: 'Teacher Directory', category: 'Users', path: '/teachers', icon: UserCheck },
  { id: 'courses', title: 'Course Management', category: 'Academics', path: '/courses', icon: BookOpen },
  { id: 'batches', title: 'Batch Management', category: 'Academics', path: '/batches', icon: Library },
  { id: 'exams', title: 'Exams & Quizzes', category: 'Academics', path: '/exams', icon: FileText },
  { id: 'calendar', title: 'Academic Calendar & Schedule', category: 'Academics', path: '/calendar', icon: BookOpen },
  { id: 'payments', title: 'Payments & Revenue', category: 'Administration', path: '/payments', icon: CreditCard },
  { id: 'ai', title: 'AI Learning Insights', category: 'Administration', path: '/ai', icon: Bot },
  { id: 'notifications', title: 'Notification Center', category: 'System', path: '/notifications', icon: Bell },
  { id: 'security', title: 'Security & RBAC Controls', category: 'System', path: '/security', icon: ShieldCheck },
  { id: 'settings', title: 'System Settings', category: 'System', path: '/settings', icon: Settings },
];

export default function CommandSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = QUICK_SEARCH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-search-overlay" onClick={onClose}>
      <div className="cmd-search-modal" onClick={e => e.stopPropagation()}>
        <div className="cmd-search-input-wrapper">
          <Search className="cmd-search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Type a command or search modules... (e.g. Students, AI, Security)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="cmd-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="cmd-search-results">
          {filtered.length === 0 ? (
            <div className="cmd-empty-state">No matching modules found.</div>
          ) : (
            filtered.map((item, index) => {
              const IconComp = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`cmd-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="cmd-item-left">
                    <div className="cmd-icon-box">
                      <IconComp size={16} />
                    </div>
                    <div className="cmd-item-details">
                      <span className="cmd-item-title">{item.title}</span>
                      <span className="cmd-item-badge">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="cmd-arrow" />
                </div>
              );
            })
          )}
        </div>

        <div className="cmd-search-footer">
          <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd> Select: <kbd>↵</kbd> Close: <kbd>ESC</kbd></span>
        </div>
      </div>
    </div>
  );
}
