/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from "react";
import { Transaction } from "./App";

interface TransactionDetailsProps {
  tx?: Transaction | null;
  isLoading: boolean;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  tx,
  isLoading,
}) => {
  return (
    <div css={txDetailsStyles}>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : tx ? (
        <>
          <h2>Transaction Details</h2>
          <div css={txTableStyles}>
            <div>
              <b>Tx Hash:</b>
            </div>
            <div>{tx.hash}</div>

            <div>
              <b>Block Hash:</b>
            </div>
            <div>{tx.blockHash}</div>

            <div>
              <b>Block Number:</b>
            </div>
            <div>{tx.blockNumber}</div>

            <div>
              <b>From:</b>
            </div>
            <div>{tx.from}</div>

            <div>
              <b>To:</b>
            </div>
            <div>{tx.to}</div>

            <div>
              <b>Value:</b>
            </div>
            <div>{tx.value}</div>

            <div>
              <b>Gas:</b>
            </div>
            <div>{tx.gas}</div>

            <div>
              <b>Gas Price:</b>
            </div>
            <div>{tx.gasPrice}</div>

            <div>
              <b>Nonce:</b>
            </div>
            <div>{tx.nonce}</div>

            <div>
              <b>Input:</b>
            </div>
            <div>{JSON.stringify(tx.input, null, 2)}</div>

            <div>
              <b>Transaction Index:</b>
            </div>
            <div>{tx.transactionIndex}</div>
          </div>

          {tx.additionalInfo && (
            <>
              <h2>Additional Info</h2>
              <div>{JSON.stringify(tx.additionalInfo, null, 2)}</div>
            </>
          )}
        </>
      ) : (
        tx === null && <h2>Transaction not found</h2>
      )}
    </div>
  );
};

const txDetailsStyles = {
  padding: "1em 2em",

  "& h2": {
    margin: "0 0 0.5em 0",
  },
} as const;

const txTableStyles = {
  display: "grid",
  gridTemplateColumns: "15% 85%",
  gridGap: "0.5em",
} as const;
