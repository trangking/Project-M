import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./admin/index.js";
import Adminpanel from "./admin/adminpanel.js";
import Login from "./login/index.js"
import Member from "./member/index.js"


import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <App /> */}
    <Routes>
        
        <Route index element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/adminpanel" element={<Adminpanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member" element={<Member />} />
        
        
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
