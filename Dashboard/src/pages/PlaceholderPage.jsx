import React from 'react';
import { Construction } from 'lucide-react';
import './PlaceholderPage.css';

export default function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <Construction className="placeholder-icon" size={64} />
        <h1>{title}</h1>
        <p>This module is currently under construction and will be available in the next phase.</p>
      </div>
    </div>
  );
}
