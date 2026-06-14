import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-','input_'));
  const [type, setType] = useState(data?.inputType || 'Text');
  return (
    <BaseNode nodeType="customInput" inputs={[]} outputs={[{ id:`${id}-value`, label:'value' }]}>
      <div className="vs-field"><label className="vs-label">Name</label>
        <input className="vs-input" value={name} onChange={e=>setName(e.target.value)} placeholder="input_name" /></div>
      <div className="vs-field"><label className="vs-label">Type</label>
        <select className="vs-select" value={type} onChange={e=>setType(e.target.value)}>
          <option>Text</option><option>File</option><option>Number</option><option>Boolean</option>
        </select></div>
    </BaseNode>
  );
};
