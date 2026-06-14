import { Handle, Position } from 'reactflow';

export const NODE_META = {
  customInput: { label: 'Input',      icon: '↑', color: '#6c63ff' },
  customOutput:{ label: 'Output',     icon: '↓', color: '#22d3a5' },
  llm:         { label: 'LLM',        icon: '✦', color: '#fbbf24' },
  text:        { label: 'Text',       icon: 'T', color: '#f472b6' },
  email:       { label: 'Email',      icon: '✉', color: '#22d3ee' },
  api:         { label: 'API',        icon: '⚡', color: '#fb923c' },
  database:    { label: 'Database',   icon: '⬡', color: '#a78bfa' },
  math:        { label: 'Math',       icon: 'Σ', color: '#2dd4bf' },
  condition:   { label: 'Condition',  icon: '?', color: '#f87171' },
};

// Handles are centered vertically *within their own port row* (top: 50% of
// that row, not of the whole node). This is what lets the row's height grow
// or shrink with its label/content without the connector drifting away from
// it — no more hardcoded "pixels from top of node" offsets.
const HANDLE_STYLE = { top: '50%', transform: 'translateY(-50%)' };

export const BaseNode = ({
  id,
  nodeType = 'default',
  title,
  children,
  inputs  = [],   // [{ id, label }]
  outputs = [],   // [{ id, label }]
  description,
  minWidth,
  isValid,        // undefined = no indicator, true/false = show dot
}) => {
  const meta  = NODE_META[nodeType] || { label: title || 'Node', icon: '◇', color: '#6c63ff' };
  const color = meta.color;

  // Pair inputs/outputs row-by-row (input[i] <-> output[i]) so connection
  // points line up consistently regardless of how many a node has on
  // each side.
  const portRowCount = Math.max(inputs.length, outputs.length);
  const portRows = Array.from({ length: portRowCount }, (_, i) => ({
    input: inputs[i],
    output: outputs[i],
  }));

  return (
    <div
      className="vs-node"
      style={{ minWidth: minWidth || 'var(--node-w)' }}
    >
      {/* Header */}
      <div className="vs-node__header" style={{ background: `linear-gradient(135deg, ${color}18 0%, transparent 80%)` }}>
        <div
          className="vs-node__icon"
          style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
        >
          {meta.icon}
        </div>
        <span className="vs-node__title">{title || meta.label}</span>
        {isValid !== undefined && (
          <span
            className="vs-node__status"
            style={{
              background: isValid ? 'var(--green)' : 'var(--red)',
              boxShadow: `0 0 6px ${isValid ? 'var(--green)' : 'var(--red)'}`,
            }}
          />
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="vs-node__description">{description}</div>
      )}

      {/* Connection ports — inputs (left) & outputs (right), paired row by row.
          Each row is its own flex container, so handles stay aligned with
          their label even as the node resizes. */}
      {portRowCount > 0 && (
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
      )}

      {/* Body */}
      {children && <div className="vs-node__body">{children}</div>}
    </div>
  );
};
