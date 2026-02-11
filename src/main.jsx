import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { initStorage } from './services/storage';
import './styles/global.css';

initStorage();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='https://tuli-fisher.github.io/'>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
