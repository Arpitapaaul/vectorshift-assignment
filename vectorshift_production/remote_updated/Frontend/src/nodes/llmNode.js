import { useState } from 'react';
import { BaseNode } from './BaseNode';
export const LLMNode = ({ id }) => {
  const [model, setModel] = useState('gpt-4o');
  return (
    <BaseNode nodeType="llm"
      inputs={[{ id:`${id}-system`, label:'system' }, { id:`${id}-prompt`, label:'prompt' }]}
      outputs={[{ id:`${id}-response`, label:'response' }]}
      description="Large language model inference"
    >
      <div className="vs-field"><label className="vs-label">Model</label>
        <select className="vs-select" value={model} onChange={e=>setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select></div>
    </BaseNode>
  );
};
