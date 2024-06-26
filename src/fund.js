// Imports
require("dotenv").config();
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
const bs58 = require("bs58");

async function fundWallet(receiverPublicAddress, solAmountToFund) {
  if (Number(solAmountToFund) <= 0) {
    return;
  }

  // Parse data
  receiverPublicAddress = new PublicKey(receiverPublicAddress);

  // Create RPC Connection
  const connection = new Connection(process.env.QUICKNODE_RPC_URL, "confirmed"); // Only quick node can fund

  // Create Secret Array to Sign transaction
  let secretKey = bs58.decode(process.env.MASTER_WALLET_PRIVATE_KEY);
  const SIGNER = Keypair.fromSecretKey(new Uint8Array(secretKey));

  try {
    console.log(
      `🚀 Funding SOL: ${solAmountToFund} to wallet: ${receiverPublicAddress}. Please wait...........`
    );
    // Add some LAMPORTS for PRIORITY FEE
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Number(
        process.env.TRANSACTION_PRIORITY_FEE_IN_LAMPORTS_FOR_FUND
      ),
    });

    // Build transaction
    const transaction = new Transaction().add(addPriorityFee).add(
      SystemProgram.transfer({
        fromPubkey: SIGNER.publicKey,
        toPubkey: receiverPublicAddress,
        lamports: Math.floor(solAmountToFund * LAMPORTS_PER_SOL), // 1000000000 LAMPORTS == 1 SOL
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      SIGNER,
    ]);

    console.log(
      `✅ ✅ Completed funding SOL: ${solAmountToFund} to Wallet: ${receiverPublicAddress}. SIGNATURE: `,
      signature
    );
  } catch (error) {
    console.log(
      `❌ ❌ ERROR OCCURRED WHILE FUNDING SOL ${solAmountToFund} to Wallet: ${receiverPublicAddress}. ERROR: `,
      error
    );
  }
}

async function fund() {
  // Fund wallet 1
  await fundWallet(
    process.env.WALLET_1_PUBLIC_KEY,
    process.env.FUND_SOL_TO_WALLET_1
  );

  // Fund wallet 2
  await fundWallet(
    process.env.WALLET_2_PUBLIC_KEY,
    process.env.FUND_SOL_TO_WALLET_2
  );

  // Fund wallet 3
  await fundWallet(
    process.env.WALLET_3_PUBLIC_KEY,
    process.env.FUND_SOL_TO_WALLET_3
  );

  // Fund wallet 4
  await fundWallet(
    process.env.WALLET_4_PUBLIC_KEY,
    process.env.FUND_SOL_TO_WALLET_4
  );

  // Fund wallet 5
  await fundWallet(
    process.env.WALLET_5_PUBLIC_KEY,
    process.env.FUND_SOL_TO_WALLET_5
  );
}

fund();
