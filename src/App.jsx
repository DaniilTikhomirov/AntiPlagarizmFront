import React from 'react';
import './App.css';
import Table from "./Table/Table.jsx";
import HomeWorkList from "./HomeWorkList/HomeWorkList.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeWorkList />} />
          <Route path="/compare/:id" element={<Table />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
