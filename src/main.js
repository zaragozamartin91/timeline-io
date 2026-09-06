import './style.css'
import { setupCounter } from './counter.js'

document.addEventListener('DOMContentLoaded', (event) => {
  // Your code here
  setupCounter(document.querySelector('#counter'))
});


setupCounter(document.querySelector('#counter'))
