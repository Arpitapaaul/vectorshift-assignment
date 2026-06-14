import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_META } from './BaseNode';

const VAR_RE = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
function extractVars(text) {
  const vars = [], seen = new Set();
  let m; VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(text)) !== null)
    if (!seen.has(m[1])) { seen.add(m[1]); vars.push(m[1]); }
  return vars;
}

const color = NODE_META.text.color;

// Same row-centered handle positioning used by BaseNode: each handle sits
// at 50% of its own port row, so it tracks that row instead of a fixed
// "pixels from top" offset that breaks when the textarea grows/shrinks.
const HANDLE_STYLE = { top: '50%', transform: 'translateY(-50%)' };

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const ref = useRef(null);
  const vars = extractVars(text);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = Math.max(72, ref.current.scrollHeight) + 'px';
  }, [text]);

  // Pair detected {{variables}} (inputs, left) with the single text output
  // (right) row-by-row, exactly like BaseNode does for its inputs/outputs.
  const portRowCount = Math.max(vars.length, 1);
  const portRows = Array.from({ length: portRowCount }, (_, i) => ({
    input: vars[i] ? { id: `${id}-${vars[i]}`, label: vars[i] } : null,
    output: i === 0 ? { id: `${id}-output`, label: 'out' } : null,
  }));

  return (
    <div className="vs-node" style={{ minWidth: 'var(--node-w)', maxWidth: 340 }}>
      {/* Header */}
      <div className="vs-node__header" style={{ background: `linear-gradient(135deg, ${color}18 0%, transparent 80%)` }}>
        <div className="vs-node__icon" style={{ background:`${color}22`, border:`1px solid ${color}44`, color }}>T</div>
        <span className="vs-node__title">Text</span>
      </div>

      {/* Body */}
      <div className="vs-node__body">
        <div className="vs-field">
          <label className="vs-label">Content</label>
          <textarea
            ref={ref}
            className="vs-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text… use {{variable}} for inputs"
          />
        </div>
        {vars.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {vars.map(v => (
              <span key={v} className="vs-var-pill">{'{{' + v + '}}'}</span>
            ))}
          </div>
        )}
      </div>

      {/* Connection ports — detected {{variables}} (left) & text output (right) */}
      <div className="vs-node__ports">
        {portRows.map((row, i) => (
          <div className="vs-port-row" key={`port-row-${i}`}>
            <div className="vs-port vs-port--in">
              {row.input && (
                <>
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={row.input.id}
                    title={row.input.label}
                    style={HANDLE_STYLE}
                  />
                  <span className="vs-port__label">{row.input.label}</span>
                </>
              )}
            </div>
            <div className="vs-port vs-port--out">
              {row.output && (
                <>
                  <span className="vs-port__label">{row.output.label}</span>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={row.output.id}
                    style={HANDLE_STYLE}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
