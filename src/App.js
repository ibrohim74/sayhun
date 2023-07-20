import React, {useState,createContext } from 'react';
import {Link, BrowserRouter as Router, Routes, Route,Navigate} from "react-router-dom";
import Home from "./pages/home";
import HomeRu from "./ru/pages/homeRu";
import Lang from "./pages/lang";

const App = (e) => {
    return (
        <Router>
            <Routes>
                <Route path={'/home'} element={<Home/>} />
                <Route path={'/ru'} element={<HomeRu/>} />
                <Route path={'/*'} element={<Lang/>}  />
            </Routes>
        </Router>

    );
};

export default App;
