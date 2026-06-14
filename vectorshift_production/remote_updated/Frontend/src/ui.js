import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls, Background, MiniMap,
  BackgroundVariant, useReactFlow, ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode    } from './nodes/inputNode';
import { LLMNode      } from './nodes/llmNode';
import { OutputNode   } from './nodes/outputNode';
import { TextNode     } from './nodes/textNode';
import { EmailNode    } from './nodes/emailNode';
import { DatabaseNode } from './nodes/databaseNode';
import { ApiNode      } from './nodes/apiNode';
import { MathNode     } from './nodes/mathNode';
import { ConditionNode} from './nodes/conditionNode';
import 'reactflow/dist/style.css';

// dagre auto-layout
let dagre;
try { dagre = require('@dagrejs/dagre'); } catch { dagre = null; }

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  email: EmailNode,
  database: DatabaseNode,
  api: ApiNode,
  math: MathNode,
  condition: ConditionNode,
};

const proOptions = { hideAttribution: true };
const GRID = 16;
const DEFAULT_EDGE = {
  type: 'smoothstep',
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
  style: { strokeWidth: 2 },
};

// Connection validation: allow anything for now but color invalid attempts red
const isValidConnection = (connection) => {
  if (connection.source === connection.target) return false;
  return true;
};

// ─── Context Menu ────────────────────────────────────────────────────────────
const CtxMenu = ({ x, y, nodeId, onClose, onDelete, onDuplicate, onCopy }) => {
  useEffect(() => {
    const h = () => onClose();
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, [onClose]);

  return (
    <div className="vs-ctx-menu" style={{ left: x, top: y }}>
      <div className="vs-ctx-item" onClick={() => { onDuplicate(nodeId); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Duplicate
        <span className="vs-ctx-shortcut">⌘D</span>
      </div>
      <div className="vs-ctx-item" onClick={() => { onCopy(nodeId); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
        <span className="vs-ctx-shortcut">⌘C</span>
      </div>
      <div className="vs-ctx-sep" />
      <div className="vs-ctx-item danger" onClick={() => { onDelete(nodeId); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
        </svg>
        Delete
        <span className="vs-ctx-shortcut">Del</span>
      </div>
    </div>
  );
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => msg ? <div className="vs-toast">{msg}</div> : null;

// ─── Dagre layout ────────────────────────────────────────────────────────────
function applyDagreLayout(nodes, edges) {
  if (!dagre) return { nodes, edges };
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach(n => g.setNode(n.id, { width: 280, height: 160 }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return {
    nodes: nodes.map(n => {
      const { x, y } = g.node(n.id);
      return { ...n, position: { x: x - 140, y: y - 80 } };
    }),
    edges,
  };
}

// ─── Inner component (needs ReactFlow context) ────────────────────────────────
const PipelineInner = ({ onAutoLayout, onZoomFit: registerZoomFit, onAddNode: registerAddNode }) => {
  const wrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { fitView } = useReactFlow();

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect,
          setNodes, setEdges } = useStore(s => ({
    nodes: s.nodes, edges: s.edges,
    getNodeID: s.getNodeID, addNode: s.addNode,
    onNodesChange: s.onNodesChange, onEdgesChange: s.onEdgesChange, onConnect: s.onConnect,
    setNodes: s.setNodes, setEdges: s.setEdges,
  }), shallow);

  const [ctx, setCtx]         = useState(null);
  const [clipboard, setClip]  = useState(null);
  const [toast, setToast]     = useState('');
  const toastTimer            = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  // Expose auto-layout to parent toolbar
  useEffect(() => {
    if (onAutoLayout) onAutoLayout(() => {
      const laid = applyDagreLayout(nodes, edges);
      setNodes(laid.nodes);
      setEdges(laid.edges);
      setTimeout(() => fitView({ padding: 0.2 }), 50);
      showToast('Auto layout applied');
    });
  }, [onAutoLayout, nodes, edges, setNodes, setEdges, fitView]);

  // Expose zoom-fit
  useEffect(() => {
    if (registerZoomFit) registerZoomFit(() => {
      fitView({ padding: 0.15 });
    });
  }, [registerZoomFit, fitView]);

  // Expose add-node from search
  useEffect(() => {
    if (registerAddNode) registerAddNode((type) => {
      const id = getNodeID(type);
      addNode({ id, type, position: { x: 200 + Math.random()*200, y: 200 + Math.random()*200 }, data: { id, nodeType: type } });
      showToast(`Added ${type} node`);
    });
  }, [registerAddNode, getNodeID, addNode]);

  // Drop from toolbar
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const bounds = wrapper.current.getBoundingClientRect();
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    const { nodeType: type } = JSON.parse(raw);
    if (!type) return;
    const pos = rfInstance.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const id = getNodeID(type);
    addNode({ id, type, position: pos, data: { id, nodeType: type } });
  }, [rfInstance, getNodeID, addNode]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Context menu
  const onNodeContextMenu = useCallback((e, node) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, nodeId: node.id });
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    showToast('Node deleted');
  }, [nodes, edges, setNodes, setEdges]);

  const duplicateNode = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const id = getNodeID(node.type);
    addNode({ ...node, id, selected: false, position: { x: node.position.x + 40, y: node.position.y + 40 }, data: { ...node.data, id } });
    showToast('Node duplicated');
  }, [nodes, getNodeID, addNode]);

  const copyNode = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) { setClip(node); showToast('Node copied — press ⌘V to paste'); }
  }, [nodes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const active = document.activeElement;
      const inInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');

      // Delete selected nodes
      if ((e.key === 'Delete' || e.key === 'Backspace') && !inInput) {
        const selected = nodes.filter(n => n.selected);
        if (selected.length) {
          const ids = new Set(selected.map(n => n.id));
          setNodes(nodes.filter(n => !ids.has(n.id)));
          setEdges(edges.filter(ed => !ids.has(ed.source) && !ids.has(ed.target)));
          showToast(`Deleted ${selected.length} node${selected.length > 1 ? 's' : ''}`);
        }
      }

      // Copy ⌘/Ctrl + C
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !inInput) {
        const sel = nodes.find(n => n.selected);
        if (sel) { setClip(sel); showToast('Node copied'); }
      }

      // Paste ⌘/Ctrl + V
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !inInput && clipboard) {
        const id = getNodeID(clipboard.type);
        addNode({ ...clipboard, id, selected: false,
          position: { x: clipboard.position.x + 40, y: clipboard.position.y + 40 },
          data: { ...clipboard.data, id } });
        showToast('Node pasted');
      }

      // Duplicate ⌘/Ctrl + D
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && !inInput) {
        e.preventDefault();
        const sel = nodes.find(n => n.selected);
        if (sel) duplicateNode(sel.id);
      }

      // Auto layout Shift+A
      if (e.shiftKey && e.key === 'A' && !inInput) {
        const laid = applyDagreLayout(nodes, edges);
        setNodes(laid.nodes);
        setEdges(laid.edges);
        setTimeout(() => fitView({ padding: 0.2 }), 50);
        showToast('Auto layout applied');
      }

      // Zoom fit Shift+F
      if (e.shiftKey && e.key === 'F' && !inInput) {
        fitView({ padding: 0.15 });
        showToast('Zoomed to fit');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nodes, edges, clipboard, setNodes, setEdges, addNode, getNodeID, duplicateNode, fitView]);

  const onConnectWrapped = useCallback((conn) => {
    onConnect({ ...conn, ...DEFAULT_EDGE });
  }, [onConnect]);

  return (
    <div ref={wrapper} style={{ flex: 1, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectWrapped}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapToGrid
        snapGrid={[GRID, GRID]}
        connectionLineType="smoothstep"
        isValidConnection={isValidConnection}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setCtx(null)}
        deleteKeyCode={null}   /* handled by custom keyboard listener */
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={DEFAULT_EDGE}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={GRID * 2}
          size={1.5}
          color="#2a2f44"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#6c63ff'}
          maskColor="rgba(11,13,18,0.8)"
          style={{ width: 160, height: 110 }}
        />
      </ReactFlow>

      {ctx && (
        <CtxMenu
          x={ctx.x} y={ctx.y} nodeId={ctx.nodeId}
          onClose={() => setCtx(null)}
          onDelete={deleteNode}
          onDuplicate={duplicateNode}
          onCopy={copyNode}
        />
      )}
      <Toast msg={toast} />
    </div>
  );
};

// ─── Public wrapper (provides ReactFlow context) ──────────────────────────────
export const PipelineUI = ({ onAutoLayout, onZoomFit, onAddNode }) => (
  <ReactFlowProvider>
    <PipelineInner
      onAutoLayout={onAutoLayout}
      onZoomFit={onZoomFit}
      onAddNode={onAddNode}
    />
  </ReactFlowProvider>
);
