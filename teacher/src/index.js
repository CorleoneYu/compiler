import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MonkeyCompilerIDE from './MonkeyCompilerIDE';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MonkeyCompilerIDE />, document.getElementById('root'));
registerServiceWorker();
