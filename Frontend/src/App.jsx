import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './components/UserForm';
import AddSponsorshipForm from './components/AddSponsorshipForm'
import AddSupervisorForm from './components/AddSupervisorForm';
import AddProjectForm from './components/AddProjectForm';
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<>Hello from frontend</>} />
        <Route path="/add-user" element={<UserForm />} />
        <Route path="/add-sponsor" element={<AddSponsorshipForm />} />
        <Route path="/add-supervisor" element={<AddSupervisorForm />} />
        <Route path="/add-projects" element={<AddProjectForm />} />

      </Routes>
    </Router>
  );
};

export default App;
