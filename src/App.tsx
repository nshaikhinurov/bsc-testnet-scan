/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { Transaction } from "web3-core";
import bnbLogo from "src/assets/bnb-logo.png";

const web3 = new Web3(
  "https://bsc-testnet.nodereal.io/v1/bcf30c3c4c5148fb97e09d7c5e0cb33c"
);
const txHash =
  "0x38ffdc6a73122014246983a5200ede2055a9082805c8371e52895c8d97888fbc";

interface FormElements extends HTMLFormControlsCollection {
  txHashInput: HTMLInputElement;
}
interface TxHashFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function App() {
  const [state, setState] = useState<Transaction | null>(null);

  function handleSubmit(event: React.FormEvent<TxHashFormElement>) {
    event.preventDefault();

    const txHash = event.currentTarget.elements.txHashInput.value;
    web3.eth.getTransaction(txHash).then((tx) => {
      console.log(tx);

      setState(tx);
    });
  }

  return (
    <div css={appStyles}>
      <header>
        <img className="logo" src={bnbLogo} alt="Binance Logo" />
        <h1>BNB Smartchain Scanner (testnet)</h1>
      </header>

      <form css={formStyles} onSubmit={handleSubmit}>
        <span>Enter Tx Hash</span>
        <input type="text" id="txHashInput" defaultValue={txHash} />
        <button type="submit">Search</button>
      </form>

      {state && (
        <div>
          <h2>Transaction Details</h2>
          <p>Tx Hash: {state.hash}</p>
          <p>Block Hash: {state.blockHash}</p>
          <p>Block Number: {state.blockNumber}</p>
          <p>From: {state.from}</p>
          <p>To: {state.to}</p>
          <p>Value: {state.value}</p>
          <p>Gas: {state.gas}</p>
          <p>Gas Price: {state.gasPrice}</p>
          <p>Nonce: {state.nonce}</p>
          <p>Input: {state.input}</p>
          <p>Transaction Index: {state.transactionIndex}</p>
        </div>
      )}
    </div>
  );
}

export default App;

const appStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",

  "& header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1em",
    height: "100px",
    backgroundColor: "#f0b90b",
    color: "#fff",

    "& .logo": {
      height: "60px",
    },
  },
} as const;

const formStyles = {
  // width: "80%",
  flex: "1 1 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1em",
};
