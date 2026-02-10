function clamp(
  value: number,
  itemDimensionValue: number,
  maxDimensionValue: number
) {
  "worklet";
  const maxX = maxDimensionValue - itemDimensionValue;
  return Math.max(0, Math.min(value, maxX));
}

function round(translateValue: number, period: number) {
  "worklet";
  return Math.round(translateValue / period) * period;
}

export { clamp, round };
