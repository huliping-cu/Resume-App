import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobDescriptionForm from './components/JobDescriptionForm';
import JDPage from './pages/JDPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobDescriptionForm />} />
        <Route path="/JD" element={<JDPage />} />
      </Routes>
    </Router>
  );
}

export default App;
