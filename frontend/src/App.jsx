import React from 'react';
import ReleaseList from './components/ReleaseList';
import CreateRelease from './components/CreateRelease';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Release Checklist Tool</h1>
      </header>
      <main>
        <CreateRelease />
        <ReleaseList />
      </main>
    </div>
  );
}

export default App;
