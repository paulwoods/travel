import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddressManager } from './components/AddressManager';
import PathResults from './components/PathResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddressManager />} />
        <Route path="/path-results" element={<PathResults />} />
      </Routes>
    </Router>
  );
}

export default App;
