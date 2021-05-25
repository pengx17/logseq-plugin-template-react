import React, { useRef, useState } from "react";

const useAppVisible = () => {
  const [visible, setVisible] = useState(logseq.isMainUIVisible);
  React.useEffect(() => {
    const eventName = "ui:visible:changed";
    const handler = async ({ visible }: any) => {
      setVisible(visible);
    };
    logseq.on(eventName, handler);
    return () => {
      logseq.off(eventName, handler);
    };
  }, []);
  return visible;
};

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md top-0 bottom-0 left-0 right-0 fixed flex items-center justify-center"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} className="text-size-2em">
          Welcome to Logseq Plugins!
        </div>
      </main>
    );
  }
  return null;
}

export default App;
