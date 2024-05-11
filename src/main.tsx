import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
