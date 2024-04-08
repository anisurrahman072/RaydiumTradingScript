// Imports
require("dotenv").config();
const bs58 = require("bs58");

// Import utils
import RaydiumSwap from "../src/raydiumSwap/RaydiumSwap";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { SWAP_CONFIG_TO_BUY_WHALE } from "../src/raydiumSwap/swapConfig"; // Import the configuration

// Swap SOL & get WHALE
async function buyWhale(receiverWalletPrivateKey, solAmountToSwap) {
  if (Number(solAmountToSwap) <= 0) {
    return;
  }
  console.log(Number(solAmountToSwap));

  /**
   * The RaydiumSwap instance for handling swaps.
   */
  const raydiumSwap = new RaydiumSwap(
    process.env.RPC_URL,
    receiverWalletPrivateKey
  );
  console.log(`✅ Raydium swap initialized`);
  console.log(
    `✅ Swapping ${solAmountToSwap} of ${SWAP_CONFIG_TO_BUY_WHALE.tokenAAddress} for ${SWAP_CONFIG_TO_BUY_WHALE.tokenBAddress}...`
  );

  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */
  await raydiumSwap.loadPoolKeys(SWAP_CONFIG_TO_BUY_WHALE.liquidityFile);
  console.log(`✅ Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(
    SWAP_CONFIG_TO_BUY_WHALE.tokenAAddress,
    SWAP_CONFIG_TO_BUY_WHALE.tokenBAddress
  );
  console.log("✅ Found pool info");

  /**
   * Prepare the swap transaction with the given parameters.
   */
  const tx = await raydiumSwap.getSwapTransaction(
    SWAP_CONFIG_TO_BUY_WHALE.tokenBAddress,
    Number(solAmountToSwap),
    poolInfo,
    Number(process.env.TRANSACTION_PRIORITY_FEE_IN_LAMPORTS_FOR_SWAP),
    SWAP_CONFIG_TO_BUY_WHALE.useVersionedTransaction,
    SWAP_CONFIG_TO_BUY_WHALE.direction
  );
  console.log("✅ Built Transaction : ", tx);

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (process.env.EXECUTE_SWAP == "true") {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const txid = SWAP_CONFIG_TO_BUY_WHALE.useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(
          tx,
          SWAP_CONFIG_TO_BUY_WHALE.maxRetries
        )
      : await raydiumSwap.sendLegacyTransaction(
          tx,
          SWAP_CONFIG_TO_BUY_WHALE.maxRetries
        );

    console.log(
      `✅ SWAP Completed. Transaction ID: https://solscan.io/tx/${txid}`
    );
  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = SWAP_CONFIG_TO_BUY_WHALE.useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(tx)
      : await raydiumSwap.simulateLegacyTransaction(tx);

    console.log("✅ SWAP Simulated. Response: ", simRes);
  }
}

async function buy() {
  // Fund wallet 1
  await buyWhale(
    process.env.WALLET_1_PRIVATE_KEY,
    process.env.WALLET_1_BUY_WHALE_FOR_SOL_AMOUNT
  );

  // Fund wallet 2
  await buyWhale(
    process.env.WALLET_2_PRIVATE_KEY,
    process.env.WALLET_2_BUY_WHALE_FOR_SOL_AMOUNT
  );

  // Fund wallet 3
  await buyWhale(
    process.env.WALLET_3_PRIVATE_KEY,
    process.env.WALLET_3_BUY_WHALE_FOR_SOL_AMOUNT
  );

  // Fund wallet 4
  await buyWhale(
    process.env.WALLET_4_PRIVATE_KEY,
    process.env.WALLET_4_BUY_WHALE_FOR_SOL_AMOUNT
  );

  // Fund wallet 5
  await buyWhale(
    process.env.WALLET_5_PRIVATE_KEY,
    process.env.WALLET_5_BUY_WHALE_FOR_SOL_AMOUNT
  );
}

buy();
