# VectorShift Assignment

## Overview

This project is a React Flow based Pipeline Builder developed as part of the VectorShift Frontend Assignment.

The application allows users to create workflow pipelines by adding different node types and connecting them visually. The system validates the graph structure and checks whether the pipeline forms a valid Directed Acyclic Graph (DAG).

---

## Features

- Drag and drop node creation
- Multiple node types
  - Input
  - Output
  - LLM
  - Text
  - API
  - Database
  - Email
  - Math
  - Condition
- Connect nodes using React Flow
- Pipeline validation
- DAG verification
- Auto-layout support
- Modern dark themed UI
- State management using Zustand

---

## Tech Stack

### Frontend
- React.js
- React Flow
- Zustand
- JavaScript
- CSS

### Backend
- Python
- FastAPI

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Arpitapaaul/vectorshift-assignment.git
```

### Frontend Setup

```bash
cd Frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## Project Structure

```text
vectorshift-assignment
│
├── backend
│   └── main.py
│
├── Frontend
│   ├── public
│   ├── src
│   │   ├── nodes
│   │   │   ├── BaseNode.js
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── apiNode.js
│   │   │   ├── databaseNode.js
│   │   │   ├── emailNode.js
│   │   │   ├── mathNode.js
│   │   │   ├── conditionNode.js
│   │   │   └── textNode.js
│   │   │
│   │   ├── App.js
│   │   ├── store.js
│   │   ├── ui.js
│   │   ├── toolbar.js
│   │   ├── submit.js
│   │   └── index.css
│   │
│   └── package.json
│
└── README.md
```

---

## How It Works

1. Add nodes from the toolbar.
2. Connect nodes using connection handles.
3. Build a workflow pipeline.
4. Click Submit Pipeline.
5. The system analyzes:
   - Total Nodes
   - Total Edges
   - DAG Validity
6. Results are displayed in a Pipeline Analysis modal.

---

## Example Pipeline

Input → LLM → Output

This workflow takes user input, sends it to an LLM node, and displays the result through the Output node.

---

## Author

**Arpita Paul**

Final Year B.Tech Student

Frontend Developer | Python Developer | AI & ML Enthusiast
