// Imports
require("dotenv").config();
const bs58 = require("bs58");

// Import utils
import RaydiumSwap from "./raydiumSwap/RaydiumSwap";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { SWAP_CONFIG_TO_SELL_WHALE } from "./raydiumSwap/swapConfig"; // Import the configuration

// Swap WHALE & get SOL
async function sellWhale(receiverWalletPrivateKey, solAmountToSwap) {
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
    `✅ Swapping ${solAmountToSwap} of ${SWAP_CONFIG_TO_SELL_WHALE.tokenAAddress} for ${SWAP_CONFIG_TO_SELL_WHALE.tokenBAddress}...`
  );

  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */
  await raydiumSwap.loadPoolKeys(SWAP_CONFIG_TO_SELL_WHALE.liquidityFile);
  console.log(`✅ Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(
    SWAP_CONFIG_TO_SELL_WHALE.tokenAAddress,
    SWAP_CONFIG_TO_SELL_WHALE.tokenBAddress
  );
  console.log("✅ Found pool info");

  /**
   * Prepare the swap transaction with the given parameters.
   */
  const tx = await raydiumSwap.getSwapTransaction(
    SWAP_CONFIG_TO_SELL_WHALE.tokenBAddress,
    Number(solAmountToSwap),
    poolInfo,
    Number(process.env.TRANSACTION_PRIORITY_FEE_IN_LAMPORTS),
    SWAP_CONFIG_TO_SELL_WHALE.useVersionedTransaction,
    SWAP_CONFIG_TO_SELL_WHALE.direction
  );
  console.log("✅ Built Transaction : ", tx);

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (process.env.EXECUTE_SWAP == "true") {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const txid = SWAP_CONFIG_TO_SELL_WHALE.useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(
          tx,
          SWAP_CONFIG_TO_SELL_WHALE.maxRetries
        )
      : await raydiumSwap.sendLegacyTransaction(
          tx,
          SWAP_CONFIG_TO_SELL_WHALE.maxRetries
        );

    console.log(
      `✅ SWAP Completed. Transaction ID: https://solscan.io/tx/${txid}`
    );
  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = SWAP_CONFIG_TO_SELL_WHALE.useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(tx)
      : await raydiumSwap.simulateLegacyTransaction(tx);

    console.log("✅ SWAP Simulated. Response: ", simRes);
  }
}

async function sell() {
  // Fund wallet 1
  await sellWhale(
    process.env.WALLET_1_PRIVATE_KEY,
    process.env.WALLET_1_SELL_WHALE_AMOUNT
  );

  // Fund wallet 2
  await sellWhale(
    process.env.WALLET_2_PRIVATE_KEY,
    process.env.WALLET_2_SELL_WHALE_AMOUNT
  );

  // Fund wallet 3
  await sellWhale(
    process.env.WALLET_3_PRIVATE_KEY,
    process.env.WALLET_3_SELL_WHALE_AMOUNT
  );

  // Fund wallet 4
  await sellWhale(
    process.env.WALLET_4_PRIVATE_KEY,
    process.env.WALLET_4_SELL_WHALE_AMOUNT
  );

  // Fund wallet 5
  await sellWhale(
    process.env.WALLET_5_PRIVATE_KEY,
    process.env.WALLET_5_SELL_WHALE_AMOUNT
  );
}

sell();
