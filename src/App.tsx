import React from 'react';
import Router from './component/router';
import './worker/index';
import './core/normal'

const App: React.FC = () => {
  return (
    <div className="App">
      <Router />
    </div>
  );
};

export default App;
