export const formatTokenBalance = (balance: string, tokenId: string): string => {
  const numBalance = parseFloat(balance);
  if (isNaN(numBalance)) return balance;

  if (tokenId.toLowerCase() === "usdc") {
    return numBalance.toFixed(2);
  } else {
    return numBalance.toFixed(4);
  }
};
