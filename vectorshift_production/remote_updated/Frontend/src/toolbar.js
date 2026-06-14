import { useState, useRef, useEffect } from 'react';
import { DraggableNode } from './draggableNode';
import { NODE_META } from './nodes/BaseNode';

const GROUPS = [
  { label: 'Core',         types: ['customInput','customOutput','llm','text'] },
  { label: 'Integrations', types: ['email','api','database'] },
  { label: 'Logic',        types: ['math','condition'] },
];

export const PipelineToolbar = ({ onAutoLayout, onZoomFit, onAddNode }) => {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const allTypes = Object.keys(NODE_META);
  const results = search.length > 0
    ? allTypes.filter(t => NODE_META[t].label.toLowerCase().includes(search.toLowerCase()))
    : [];

  useEffect(() => {
    setShowResults(search.length > 0 && results.length > 0);
  }, [search, results.length]);

  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setShowResults(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="vs-toolbar">
      {/* Logo */}
      <div className="vs-toolbar__logo">
        <div className="vs-toolbar__logo-mark">V</div>
        <span className="vs-toolbar__logo-text">VectorShift</span>
      </div>

      <div className="vs-divider" />

      {/* Node groups */}
      {GROUPS.map(g => (
        <div key={g.label} className="vs-toolbar__group">
          <span className="vs-toolbar__group-label">{g.label}</span>
          <div className="vs-toolbar__nodes">
            {g.types.map(t => <DraggableNode key={t} type={t} />)}
          </div>
        </div>
      ))}

      {/* Right actions */}
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
        {/* Search */}
        <div className="vs-search" ref={searchRef} style={{ position:'relative', transition:'width 0.2s' }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search nodes…"
            onFocus={() => search && setShowResults(true)}
          />
          {showResults && (
            <div className="vs-search-results">
              {results.map(t => {
                const m = NODE_META[t];
                return (
                  <div key={t} className="vs-search-result-item"
                    onMouseDown={() => { onAddNode && onAddNode(t); setSearch(''); setShowResults(false); }}>
                    <div className="vs-search-result-icon"
                      style={{ background:`${m.color}22`, border:`1px solid ${m.color}44`, color:m.color }}>
                      {m.icon}
                    </div>
                    {m.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="vs-divider" />

        {/* Auto layout */}
        <button className="vs-icon-btn" title="Auto layout (Shift+A)" onClick={onAutoLayout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/>
            <rect x="9" y="15" width="6" height="6" rx="1"/>
            <path d="M6 9v3M18 9v3M12 15V12M6 12h12"/>
          </svg>
        </button>

        {/* Zoom to fit */}
        <button className="vs-icon-btn" title="Zoom to fit (Shift+F)" onClick={onZoomFit}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
