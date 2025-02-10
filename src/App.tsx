import AlertList from "./components/AlertList";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <AlertList />
      </div>
    </ThemeProvider>
  );
}

export default App;
