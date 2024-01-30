import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/Header";
import Main from "./components/main/Main";

function App() {
  return (
    <div className="flex flex-col min-h-screen light text-foreground bg-background">
      <BrowserRouter>
        <Header />
        <Main />
      </BrowserRouter>
    </div>
  );
}

export default App;
