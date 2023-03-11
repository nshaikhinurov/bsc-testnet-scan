/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React, { useState } from "react";
import "./App.css";

import { Transaction as web3coreTransaction } from "web3-core";
import bnbLogo from "src/assets/bnb-logo.png";
import { useForm } from "react-hook-form";
import { defaultTxHash } from "./consts";
import web3 from "./utils/web3";
import { TransactionDetails } from "./TransactionDetails";

export type Transaction = Omit<web3coreTransaction, "input"> & {
  input: Record<string, unknown>;
  additionalInfo?: Record<string, unknown>;
};
interface TxHashFormValues {
  txHash: string;
}

type Signature = {
  text_signature: string;
};

type SignaturePaginatedList = {
  count: number;
  results: Signature[];
};

function App() {
  const [state, setState] = useState<Transaction | null | undefined>();

  const { handleSubmit, register, formState } = useForm<TxHashFormValues>({
    defaultValues: {
      txHash: defaultTxHash,
    },
  });

  const { isSubmitting, errors } = formState;

  async function onSubmit({ txHash }: TxHashFormValues) {
    const tx = await web3.eth.getTransaction(txHash);

    if (!tx) {
      setState(null);
      return;
    }

    const decodedParams = await getDecodedParams(tx);

    let additionalInfo;
    if (decodedParams["1"]) {
      const possibleDataUri = decodedParams["1"] as string;
      if (
        possibleDataUri.startsWith("https://") &&
        possibleDataUri.endsWith(".json")
      ) {
        // FYI: this is not working because of CORS
        // const response = await fetch(possibleDataUri);
        // additionalInfo = (await response.json()) as Record<string, unknown>;
      }
    }

    setState({ ...tx, input: decodedParams, additionalInfo });
  }

  async function getDecodedParams(tx: web3coreTransaction) {
    const inputSignature = tx.input.slice(0, 10);
    const textSignature = await fetch(
      `https://www.4byte.directory/api/v1/signatures/?hex_signature=${inputSignature}`
    )
      .then((res) => res.json())
      .then((res) => (res as SignaturePaginatedList).results[0].text_signature);

    const types = textSignature.split("(")[1].split(")")[0].split(",");
    const { __length__, ...decodedParams } = web3.eth.abi.decodeParameters(
      types,
      tx.input.replace(inputSignature, "")
    );

    return decodedParams;
  }

  return (
    <div css={appStyles}>
      <header>
        <img className="logo" src={bnbLogo} alt="Binance Logo" />
        <h1>BNB Smartchain Scanner (testnet)</h1>
      </header>

      <form css={formStyles} onSubmit={handleSubmit(onSubmit)}>
        <span>Enter Tx Hash</span>
        <div css={{ display: "flex", flexFlow: "column" }}>
          <div>
            <input
              {...register("txHash", {
                required: true,
                minLength: 66,
                maxLength: 66,
              })}
              size={68}
            />
          </div>
          {errors.txHash && (
            <div css={{ color: "red" }}>
              {errors.txHash.type === "required" && "Tx Hash is required"}
              {errors.txHash.type === "minLength" && "Tx Hash is too short"}
              {errors.txHash.type === "maxLength" && "Tx Hash is too long"}
            </div>
          )}
        </div>
        <button type="submit">Search</button>
      </form>

      <TransactionDetails tx={state} isLoading={isSubmitting} />
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
  flex: "1 1 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "1em",
  padding: "1em",

  "& input": {
    padding: "0.5em 1em",
    fontFamily: '"Courier New", Courier, monospace',
  },

  "& button": {
    padding: "0.5em 1em",
    backgroundColor: "#f0b90b",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
