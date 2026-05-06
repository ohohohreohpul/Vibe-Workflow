# 0123 — Node-Based AI Workflow Builder

**0123** is a node-based AI workflow builder for generative image and video pipelines. Designed for creators and developers who want a visual, modular pipeline editor to design, edit, and compose AI-generated content with precision.

<img width="1024" height="1024" alt="0123 — node-based AI workflow builder for generative image and video" src="https://github.com/user-attachments/assets/f603eb13-3b4f-4c9a-9a6a-c4cc3a94f7a6" />

---

## Sample Workflow UI

<img width="1468" height="764" alt="0123 workflow builder UI" src="https://github.com/user-attachments/assets/0eeff00f-7850-4d53-bbc9-68f6b1f8b7a4" />

---

## Features

- **Node-Based AI Workflow Editor** — Visual, modular pipelines for generative AI. Drag, connect, and compose nodes to build complex pipelines without writing code.
- **Generative Image & Video** — Integrated support for image and video generation powered by **MuAPI** (Vadoo AI).
- **Extensible Architecture** — Add new AI model nodes, connect external APIs, and build reusable workflow templates.
- **Custom Model Integration** — Connect LoRAs, custom diffusion models, or any external API as a workflow node.

---

## Use Cases

- **AI Image Generation Pipelines** — Build and automate multi-step image generation workflows visually.
- **Video Generation Workflows** — Sequence and automate video generation jobs.
- **Brand Asset Automation** — Produce high-volume generative assets with consistent style and structure.
- **Creative Exploration** — Experiment with generative art pipelines in a fast, visual environment.

---

## Project Structure

```text
0123/
├── client/              # Next.js frontend application
├── packages/
│   └── workflow-builder/ # Core node editor UI library
└── server/              # FastAPI backend
```

---

## Getting Started

### Prerequisites

For local development:
- **Node.js** (v20+)
- **Python** (v3.10+)
- **npm** (v7+ for workspaces support)

Or use **Docker** (see [Running with Docker](#running-with-docker)).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ohohohreohpul/Vibe-Workflow.git
   cd Vibe-Workflow
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

### Configuration

0123 uses **MuAPI** (Vadoo AI) for generative AI capabilities. You need an API key.

1. **Get your API Key** from [muapi.ai](https://muapi.ai) — sign up, navigate to **API Keys**, generate a key.

2. **Configure the Backend**:
   ```bash
   cd server
   cp .env.example .env
   # Open .env and set:
   # MU_API_KEY=your_actual_api_key_here
   ```

### Running the Project

**Frontend (Next.js):**
```bash
npm run dev:app
# Available at http://localhost:3000
```

**Backend (FastAPI):**
```bash
cd server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Running with Docker

### Prerequisites

- **Docker** (v20+)
- **Docker Compose** (v2+)

### Quick Start

1. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MuAPI key:
   ```bash
   MU_API_KEY=your_actual_api_key_here
   ```

2. **Start all services**:
   ```bash
   docker compose up --build
   ```

3. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Services

| Service | Image | Port |
|---------|-------|------|
| client | Node.js 24 Alpine | 3000 |
| server | Python 3.13 | 8000 |

### Stopping

```bash
docker compose down
```

---

## Development

- **Workflow-Builder Library** — To rebuild the core node editor:
  ```bash
  npm run build:lib
  ```
- **Client App** — Uses the local library. Rebuild the library after changes if not using a watcher:
  ```bash
  npm run dev:app
  ```

---

## License

© 2025 0123. All rights reserved.
