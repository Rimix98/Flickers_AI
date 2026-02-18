import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ждем полной загрузки DOM перед рендерингом
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

function initApp() {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
}
