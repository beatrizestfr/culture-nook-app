import React from 'react';
import ReactDOM from 'react-dom/client';
// This loads the styles that apply to the whole app.
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React uses the root div from public/index.html as the place to show my app.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* App is the main component where routing and pages start. */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
