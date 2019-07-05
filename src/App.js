import React from 'react';
import './App.css';
import RepoLookup from './components/RepoLookup/RepoLookup';

function App() {
  return (
    <div className="App">
      <header>
        <h1>GitHub Repository Lookup</h1>
      </header>
      <RepoLookup />
    </div>
  );
}

export default App;
