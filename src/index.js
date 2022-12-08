import React from 'react';
import ReactDOM from 'react-dom';
import "./style.css";

React.render(
  <React.StrictMode>
    <div id="wrapper">
      <h1 id="title">Countries</h1>
      <input id="search" placeholder="Search..."></input>
      <div id="output"></div>
    </div>
  </React.StrictMode>
, document.getElementById('root'));
