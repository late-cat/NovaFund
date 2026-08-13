export function toStroops(xlm: string | number): bigint {
  const [whole, fraction = ""] = String(xlm).split(".");
  const fractionPadded = fraction.padEnd(7, "0").slice(0, 7);
  return BigInt(whole + fractionPadded);
}

export function fromStroops(stroops: bigint | string | number): string {
  const s = BigInt(stroops).toString().padStart(8, "0");
  const whole = s.slice(0, -7);
  const fraction = s.slice(-7).replace(/0+$/, "");
  return fraction.length > 0 ? `${whole}.${fraction}` : whole;
}

export async function fetchBalance(publicKey: string): Promise<number> {
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
    if (!res.ok) return 0;
    const data = await res.json();
    const balanceObj = data.balances?.find((b: any) => b.asset_type === "native");
    return balanceObj ? parseFloat(balanceObj.balance) : 0;
  } catch (e) {
    console.error("Failed to fetch balance", e);
    return 0;
  }
}

