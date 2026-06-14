import { NODE_META } from './nodes/BaseNode';

export const DraggableNode = ({ type }) => {
  const meta = NODE_META[type] || { label: type, icon: '◇', color: '#6c63ff' };

  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="vs-chip"
      style={{ '--chip-color': meta.color }}
      draggable
      onDragStart={onDragStart}
      title={`Drag to canvas to add ${meta.label} node`}
    >
      <div className="vs-chip__icon"
        style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}44`, color: meta.color }}>
        {meta.icon}
      </div>
      <span className="vs-chip__label">{meta.label}</span>
    </div>
  );
};
