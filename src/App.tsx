import { useRef, useState } from "react";

const useAppVisible = () => {
  const [visible, setVisible] = useState(logseq.isMainUIVisible);
  logseq.on("ui:visible:changed", async ({ visible }) => {
    setVisible(visible);
  });
  return visible;
};

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  if (visible) {
    return (
      <main
        className="backdrop-blur-md top-0 bottom-0 left-0 right-0 fixed"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} />
      </main>
    );
  }
  return null;
}

export default App;
