import React from 'react';
import ReactDOM from 'react-dom/client';
import StartRating from './StartRating';
// import './index.css';
// import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StartRating defaultRating={4} maxRating={5} messages={['Terrible', 'Bad', 'Okey', 'Good', 'Amazing']} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
