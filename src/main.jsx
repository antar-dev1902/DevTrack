import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import LearningPreferencesProvider from './context/LearningPreferencesProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LearningPreferencesProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </LearningPreferencesProvider>
    </Provider>
  </StrictMode>,
);
