import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import EditorPage from "./pages/editorpage";

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              iconTheme: {
                primary: '#4aee88',
                secondary: 'white',
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
