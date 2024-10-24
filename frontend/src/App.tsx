//import { DarkThemeToggle } from "flowbite-react";
import { useEffect } from "react";
import GlobalRouter from "./routes/GlobalRouter";
import {initFlowbite} from "flowbite";

function App() {

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <main className="min-h-screen items-center justify-center gap-2 dark:bg-gray-900">
      <GlobalRouter/>
    </main>
  );
}

export default App;
