import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { publicRoute } from "./routes/publicroute";
import { privateRoute } from "./routes/privateRoute";
import { Toaster } from "./components/Toaster/toaster";
import useAuth from "./context/useContext/useContext";

function App() {
  let token = localStorage.getItem('jwt')
  let { user } = useAuth()
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {publicRoute.map((items, index) => (
          <Route key={index} path={items.path} element={items.component} />
        ))}
        
        <Route
          element={user || token ? <Outlet /> : <Navigate to="/login" />}
        >
          {privateRoute.map((items, index) => {
            return (
              <Route key={index} path={items.path} element={items.component} />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
