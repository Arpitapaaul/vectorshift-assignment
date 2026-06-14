import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const ConditionNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.operator||'==');
  return (
    <BaseNode nodeType="condition"
      inputs={[{ id:`${id}-value`, label:'value' }, { id:`${id}-compare`, label:'compare' }]}
      outputs={[{ id:`${id}-true`, label:'true' }, { id:`${id}-false`, label:'false' }]}>
      <div className="vs-field"><label className="vs-label">Operator</label>
        <select className="vs-select" value={op} onChange={e=>setOp(e.target.value)}>
          <option value="==">Equal (==)</option>
          <option value="!=">Not Equal (!=)</option>
          <option value=">">Greater Than (&gt;)</option>
          <option value="<">Less Than (&lt;)</option>
          <option value=">=">Greater or Equal (≥)</option>
          <option value="<=">Less or Equal (≤)</option>
          <option value="contains">Contains</option>
        </select></div>
    </BaseNode>
  );
};
