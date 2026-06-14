import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-','output_'));
  const [type, setType] = useState(data?.outputType || 'Text');
  return (
    <BaseNode nodeType="customOutput" inputs={[{ id:`${id}-value`, label:'value' }]} outputs={[]}>
      <div className="vs-field"><label className="vs-label">Name</label>
        <input className="vs-input" value={name} onChange={e=>setName(e.target.value)} placeholder="output_name" /></div>
      <div className="vs-field"><label className="vs-label">Type</label>
        <select className="vs-select" value={type} onChange={e=>setType(e.target.value)}>
          <option>Text</option><option>Image</option><option>File</option>
        </select></div>
    </BaseNode>
  );
};
