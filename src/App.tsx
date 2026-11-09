import { useCallback, useEffect, useState } from "react";
import {
  Excalidraw,
  loadLibraryFromBlob,
  WelcomeScreen,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import "./App.css";

const LIBRARY_FILES = [
  "/libraries/stick-figures.excalidrawlib",
  "/libraries/software-architecture.excalidrawlib",
  "/libraries/storytelling.excalidrawlib",
] as const;

async function loadBundledLibraries(
  api: ExcalidrawImperativeAPI
): Promise<void> {
  const batches = await Promise.all(
    LIBRARY_FILES.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load library: ${path}`);
      }
      return loadLibraryFromBlob(await response.blob());
    })
  );

  await api.updateLibrary({
    libraryItems: batches.flat(),
    merge: true,
    openLibraryMenu: false,
  });
}

function App() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const handleApi = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
  }, []);

  useEffect(() => {
    if (!excalidrawAPI) return;

    let cancelled = false;

    loadBundledLibraries(excalidrawAPI).catch((error) => {
      if (!cancelled) {
        console.error(error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [excalidrawAPI]);

  return (
    <div className="app">
      <main className="whiteboard">
        <Excalidraw
          excalidrawAPI={handleApi}
          theme="dark"
          name="Christian Board"
          UIOptions={{
            welcomeScreen: true,
            canvasActions: {
              loadScene: true,
              saveToActiveFile: true,
              export: { saveFileToDisk: true },
            },
          }}
        >
          <WelcomeScreen>
            <WelcomeScreen.Hints.ToolbarHint>
              <p>Pick a tool and start sketching.</p>
            </WelcomeScreen.Hints.ToolbarHint>
            <WelcomeScreen.Hints.MenuHint>
              <p>Open the menu for export and scene tools.</p>
            </WelcomeScreen.Hints.MenuHint>
            <WelcomeScreen.Hints.HelpHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Logo>
                <div className="welcome-brand">
                  <span className="welcome-brand__mark">CO</span>
                  <strong>Christian Board</strong>
                </div>
              </WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                Your personal whiteboard
              </WelcomeScreen.Center.Heading>
              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItemLoadScene />
                <WelcomeScreen.Center.MenuItemHelp />
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </main>
    </div>
  );
}

export default App;
