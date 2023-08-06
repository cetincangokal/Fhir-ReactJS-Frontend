import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "../src/pages/Home";
import Settings from "../src/pages/Settings";
import Patient from "./pages/Patient";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/patient" exact element={<Patient />}></Route>
          <Route path="/settings" exact element={<Settings />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
