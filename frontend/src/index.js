import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure App.js is in the same src directory
import './App.css';       // Ensure App.css exists for styling

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
