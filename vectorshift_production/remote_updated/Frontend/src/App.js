import { useRef } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './index.css';

function App() {
  const autoLayoutFn = useRef(null);
  const zoomFitFn    = useRef(null);
  const addNodeFn    = useRef(null);

  // These are "setter" refs: toolbar passes its action to UI via refs
  const registerAutoLayout = (fn) => { autoLayoutFn.current = fn; };
  const registerZoomFit    = (fn) => { zoomFitFn.current    = fn; };
  const registerAddNode    = (fn) => { addNodeFn.current    = fn; };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <PipelineToolbar
        onAutoLayout={() => autoLayoutFn.current && autoLayoutFn.current()}
        onZoomFit={() => zoomFitFn.current && zoomFitFn.current()}
        onAddNode={(type) => addNodeFn.current && addNodeFn.current(type)}
      />
      <PipelineUI
        onAutoLayout={registerAutoLayout}
        onZoomFit={registerZoomFit}
        onAddNode={registerAddNode}
      />
      <SubmitButton />
    </div>
  );
}

export default App;
