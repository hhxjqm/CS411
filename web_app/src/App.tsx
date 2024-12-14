import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { User as UserRouter, Login, Dashboard } from "./routes";
import UserContext from "./context/UserContext";
import { useState } from "react";
import { type User } from "./request/user";

function App() {
  const [login, setLogin] = useState<User>();

  return (
    <UserContext.Provider value={{login, setLogin}}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile/:id" element={<UserRouter/>}/>
      </Routes>
    </Router>
    </UserContext.Provider>
  );
}

export default App;