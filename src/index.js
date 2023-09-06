import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { Web3ReactProvider } from '@web3-react/core';
import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";

const provider = new AuthProvider(
  "xar_test_e8594125dd04911a91d2f3e58e645e3d0ef33f05", //required
{
  network: "testnet",
  alwaysVisible: true,
  setWindowProvider: true,
  position: "right",
  theme: "dark"
}); //See SDK Reference Guide for optional parameters

// function getLibrary(provider) {
//   console.log(provider)
//   return new Web3ReactProvider(provider);
// }

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth provider={provider}>
      <App />
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
