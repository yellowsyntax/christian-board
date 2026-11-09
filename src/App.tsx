import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-bar">
        <div className="app-bar__brand">
          <strong>Christian Board</strong>
          <span>Personal whiteboard</span>
        </div>
        <p className="app-bar__credit">
          Drawing canvas powered by{" "}
          <a
            href="https://excalidraw.com"
            target="_blank"
            rel="noreferrer"
          >
            Excalidraw
          </a>
        </p>
      </header>

      <main className="whiteboard">
        <Excalidraw />
      </main>
    </div>
  );
}

export default App;
