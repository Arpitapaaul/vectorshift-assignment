import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const MathNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.operation||'add');
  return (
    <BaseNode nodeType="math"
      inputs={[{ id:`${id}-a`, label:'a' }, { id:`${id}-b`, label:'b' }]}
      outputs={[{ id:`${id}-result`, label:'result' }]}>
      <div className="vs-field"><label className="vs-label">Operation</label>
        <select className="vs-select" value={op} onChange={e=>setOp(e.target.value)}>
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
          <option value="modulo">Modulo (%)</option>
          <option value="power">Power (^)</option>
        </select></div>
    </BaseNode>
  );
};
