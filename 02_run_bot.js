import { existsSync, readFileSync } from "fs";
import { config } from "dotenv";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
} from "@solana/web3.js";

import fetch from "cross-fetch";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";

import { searcherClient as jitoSearcherClient } from "jito-ts/dist/sdk/block-engine/searcher.js";
import { Bundle } from "jito-ts/dist/sdk/block-engine/types.js";

import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";


let TOKEN_MINT;
let BUYS_PER_SELL_INT;
let BUY_MIN_LAMPORTS_AMOUNT_INT;
let BUY_MAX_LAMPORTS_AMOUNT_INT;
let WALLET_COUNT_INT;
let ADDITIONAL_DELAY_SECONDS_INT;
let RPC_URL;
let SLIPPAGE_BPS;
let FEE_LAMPORTS;
let JITO_TIP_LAMPORTS;

const TIP_ACCOUNTS = [
  "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
  "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
  "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
  "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
  "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
  "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
  "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
  "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
].map((pubkey) => new PublicKey(pubkey));

function runPreflightValidation() {
  // Load environment variables
  const result = config();
  if (result.error) {
    console.error(`Missing file: .env\nPlease run the setup process.`);
    process.exit(1);
  }
  
  *** DOWNLOAD THE BOT FROM THE RELEASES PAGE! :) ***

}

function loadWallets() {
  const csvData = readFileSync("_CONFIDENTIAL_DO_NOT_SHARE.csv", "utf8");
  const lines = csvData.split("\n");
  const wallets = lines
    .slice(1)
    .filter((line) => line)
    .map((line) => {
      const [index, publicKey, privateKey] = line.split(",");
      return { index: parseInt(index, 10), publicKey, privateKey };
    });
  console.log("Wallets loaded successfully:", wallets.length);

  return wallets;
}

  *** DOWNLOAD THE BOT FROM THE RELEASES PAGE! :) ***

async function getSolBalanceInLamports(publicKey) {
  const url = RPC_URL;
  const data = {
    jsonrpc: "2.0",
    id: 1,
    method: "getBalance",
    params: [
      publicKey,
      {
        commitment: "confirmed",
      },
    ],
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, requestOptions);
  const responseData = await response.json();
  return responseData.result.value;
  }

    *** DOWNLOAD THE BOT FROM THE RELEASES PAGE! :) ***

function createTransferInstructions(
  amountLamports,
  sourceWalletPublicKey,
  destinationWalletPublicKey
) {
  const inx = [
    SystemProgram.transfer({
      fromPubkey: sourceWalletPublicKey,
      toPubkey: destinationWalletPublicKey,
      lamports: amountLamports,
    }),
  ];

  return inx;
}

function createTransaction(transferInx, payerWallet, blockhash) {
  const messageV0 = new TransactionMessage({
    payerKey: payerWallet.publicKey,
    recentBlockhash: blockhash,
    instructions: transferInx,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  return transaction;
}

  *** REDACTED - DOWNLOAD THE BOT FROM THE RELEASES PAGE! :) ***

async function sendBundleWithMultipleTxs(wallet, txs, connection, client) {
  const tipLamports = JITO_TIP_LAMPORTS;

  const blockhash = (await connection.getLatestBlockhash()).blockhash;

  let bundle = new Bundle(txs, txs.length + 1);
  bundle.addTipTx(wallet.payer, tipLamports, getRandomTipAccount(), blockhash);

  const resp = await client.sendBundle(bundle);
  console.log(
    `${new Date().toISOString()} Bundle requested: https://explorer.jito.wtf/bundle/${resp}`
  );
  }

const getRandomTipAccount = () =>
  TIP_ACCOUNTS[Math.floor(Math.random() * TIP_ACCOUNTS.length)];

  *** DOWNLOAD THE BOT FROM THE RELEASES PAGE! :) ***


async function runMain() {
  try {
    runPreflightValidation();
    setGlobalVariables();
    const { motherWallet, wallets } = initializeWallets();
    await runBot(motherWallet, wallets);
    console.log(`Exiting`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

runMain();