import React from 'react';
import { StrictMode } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";

const provider = new AuthProvider(
  "xar_test_68084c1ef9a540f3574311ccc497ac512c7b3faa", //required
{
  network: "testnet",
  alwaysVisible: true,
  setWindowProvider: true,
  position: "right",
  theme: "dark"
}); //See SDK Reference Guide for optional parameters

function getLibrary(provider) {
  console.log(provider)
  return new Web3ReactProvider(provider);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Web3ReactProvider getLibrary={getLibrary}>
  //   <App />
  // </Web3ReactProvider>
  <StrictMode>
    <ProvideAuth provider={provider}>
      <App />
    </ProvideAuth>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
