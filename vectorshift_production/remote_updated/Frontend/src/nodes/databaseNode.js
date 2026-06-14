import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const DatabaseNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.operation||'SELECT');
  const [table, setTable] = useState(data?.table||'');
  return (
    <BaseNode nodeType="database"
      inputs={[{ id:`${id}-query`, label:'query' }]}
      outputs={[{ id:`${id}-result`, label:'result' }, { id:`${id}-error`, label:'error' }]}>
      <div className="vs-field"><label className="vs-label">Operation</label>
        <select className="vs-select" value={op} onChange={e=>setOp(e.target.value)}>
          <option>SELECT</option><option>INSERT</option><option>UPDATE</option><option>DELETE</option>
        </select></div>
      <div className="vs-field"><label className="vs-label">Table</label>
        <input className="vs-input" value={table} onChange={e=>setTable(e.target.value)} placeholder="table_name"/></div>
    </BaseNode>
  );
};
