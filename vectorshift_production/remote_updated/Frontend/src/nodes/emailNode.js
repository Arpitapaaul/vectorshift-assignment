import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const EmailNode = ({ id, data }) => {
  const [to, setTo] = useState(data?.to||'');
  const [subject, setSubject] = useState(data?.subject||'');
  return (
    <BaseNode nodeType="email"
      inputs={[{ id:`${id}-body`, label:'body' }, { id:`${id}-recipient`, label:'to' }]}
      outputs={[{ id:`${id}-status`, label:'status' }]}>
      <div className="vs-field"><label className="vs-label">To</label>
        <input className="vs-input" value={to} onChange={e=>setTo(e.target.value)} placeholder="user@example.com"/></div>
      <div className="vs-field"><label className="vs-label">Subject</label>
        <input className="vs-input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Email subject"/></div>
    </BaseNode>
  );
};
