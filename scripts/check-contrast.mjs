const luminance = (hex) => {
  const rgb = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255)
  const linear = rgb.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}
const ratio = (foreground, background) => {
  const a = luminance(foreground.replace('#', ''))
  const b = luminance(background.replace('#', ''))
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
const checks = [
  ['secondary CTA text on secondary surface', '#315f2f', '#e8f3e5'],
  ['secondary CTA surface against navy band', '#e8f3e5', '#102b4e'],
  ['consultation eyebrow on navy', '#b5dfe0', '#102b4e'],
  ['process numerals on page background', '#315f2f', '#f7f9f8'],
  ['primary CTA text on navy', '#ffffff', '#102b4e'],
]
for (const [name, foreground, background] of checks) {
  const value = ratio(foreground, background)
  console.log(`${name}: ${value.toFixed(2)}:1 ${value >= 4.5 ? 'PASS' : 'FAIL'}`)
}
