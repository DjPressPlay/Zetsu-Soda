import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VendingMachine from './pages/VendingMachine';
import SharedCan from './pages/SharedCan';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vending-machine" element={<VendingMachine />} />
        <Route path="/share/:id" element={<SharedCan />} />
      </Routes>
    </Router>
  );
}
