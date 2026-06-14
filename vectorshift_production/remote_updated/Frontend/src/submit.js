import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const ResultModal = ({ result, onClose }) => (
  <div className="vs-modal-overlay" onClick={onClose}>
    <div className="vs-modal" onClick={e => e.stopPropagation()}>
      <div className="vs-modal__header">
        <div className="vs-modal__icon">📊</div>
        <div>
          <div className="vs-modal__title">Pipeline Analysis</div>
          <div className="vs-modal__subtitle">Graph structure report</div>
        </div>
      </div>
      <div className="vs-stat-card">
        <span className="vs-stat-card__label">Nodes</span>
        <span className="vs-stat-card__value accent">{result.num_nodes}</span>
      </div>
      <div className="vs-stat-card">
        <span className="vs-stat-card__label">Edges</span>
        <span className="vs-stat-card__value accent">{result.num_edges}</span>
      </div>
      <div className="vs-stat-card">
        <span className="vs-stat-card__label">Valid DAG</span>
        <span className={`vs-stat-card__value ${result.is_dag ? 'green' : 'red'}`}>
          {result.is_dag ? '✓ Yes' : '✗ No'}
        </span>
      </div>
      {!result.is_dag && (
        <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, fontSize:12, color:'var(--red)', lineHeight:1.5 }}>
          ⚠ Pipeline contains a cycle. Execution may loop infinitely.
        </div>
      )}
      <button className="vs-modal__close" onClick={onClose}>Close</button>
    </div>
  </div>
);

export const SubmitButton = () => {
  const { nodes, edges } = useStore(s => ({ nodes: s.nodes, edges: s.edges }), shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setResult(await res.json());
    } catch (e) {
      setError('Backend unavailable. Start it with: uvicorn main:app --reload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="vs-statusbar">
        <span className="vs-statusbar__info">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
          &nbsp;·&nbsp;Del to delete · ⌘D duplicate · ⌘C/V copy/paste
        </span>
        {error && <span style={{ fontSize:12, color:'var(--red)' }}>{error}</span>}
        <button className="vs-btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span style={{ display:'inline-block', width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/>
              Analyzing…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Submit Pipeline
            </>
          )}
        </button>
      </div>
      {result && <ResultModal result={result} onClose={() => setResult(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};
