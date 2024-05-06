import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CitationsContextProvider } from './context/CitationContext'
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CitationsContextProvider>
        <App />
      </CitationsContextProvider>
    </AuthContextProvider>
  </React.StrictMode >
);