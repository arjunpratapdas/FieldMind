import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FieldMindApp from './FieldMindApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FieldMindApp />
  </React.StrictMode>
);
