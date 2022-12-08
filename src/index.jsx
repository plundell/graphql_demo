import React, { StrictMode } from 'react';
import { ReactDOM } from 'react-dom';
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <div id="wrapper">
      <h1 id="title">Countries</h1>
      <input id="search" placeholder="Search..."></input>
      <div id="output"></div>
    </div>
  </StrictMode>
);
