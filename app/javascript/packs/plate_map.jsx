import App from '../src/componentLoader/components/platemap/plate_map.js'
import ReactDOM from "react-dom";
import React, { Component } from 'react';

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render(<App />, document.getElementById('app'))
})
