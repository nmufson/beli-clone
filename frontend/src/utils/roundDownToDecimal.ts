function roundDownToDecimal(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

export default roundDownToDecimal;
