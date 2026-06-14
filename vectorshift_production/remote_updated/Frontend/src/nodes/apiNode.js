import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const ApiNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method||'GET');
  const [url, setUrl] = useState(data?.url||'');
  return (
    <BaseNode nodeType="api"
      inputs={[{ id:`${id}-body`, label:'body' }, { id:`${id}-headers`, label:'headers' }]}
      outputs={[{ id:`${id}-response`, label:'response' }, { id:`${id}-status`, label:'status' }]}>
      <div className="vs-field"><label className="vs-label">Method</label>
        <select className="vs-select" value={method} onChange={e=>setMethod(e.target.value)}>
          <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
        </select></div>
      <div className="vs-field"><label className="vs-label">URL</label>
        <input className="vs-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/endpoint"/></div>
    </BaseNode>
  );
};
