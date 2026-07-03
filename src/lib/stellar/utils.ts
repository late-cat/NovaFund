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
