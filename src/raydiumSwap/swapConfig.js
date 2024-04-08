//////// BUY config (Swap "SOL" & get "WHALE")
export const SWAP_CONFIG_TO_BUY_WHALE = {
  useVersionedTransaction: true,
  tokenAAddress: "So11111111111111111111111111111111111111112", // Token to swap for the other, SOL in this case
  tokenBAddress: "kub2QX17qMx6jLuyG5gR4kSmmbiRtvUHt4gxqNd4wZB", // WHALE address (User will receive WHALE in his account)
  direction: "in", // Swap direction: 'in' or 'out'
  liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
  maxRetries: 20,
};

///////// SELL config (SWAP "WHALE" & get "SOL")
export const SWAP_CONFIG_TO_SELL_WHALE = {
  useVersionedTransaction: true,
  tokenAAddress: "kub2QX17qMx6jLuyG5gR4kSmmbiRtvUHt4gxqNd4wZB", // Token to swap for the other, WHALE in this case
  tokenBAddress: "So11111111111111111111111111111111111111112", // SOL address (User will receive SOL in his account)
  direction: "in", // Swap direction: 'in' or 'out'
  liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
  maxRetries: 20,
};
