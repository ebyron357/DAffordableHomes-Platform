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

  /* Interior visual system (.dh-*). */
  ['masthead lede on navy', '#dbe6ef', '#102b4e'],
  ['masthead kicker gold on navy', '#e6bd55', '#102b4e'],
  /* Gold cannot meet AA anywhere in the teal range, so teal surfaces put the
     kicker in white instead. Both ends of the gradient are checked. */
  ['masthead kicker white on dark teal', '#ffffff', '#05616b'],
  ['masthead kicker white on teal', '#ffffff', '#077783'],
  ['feature link teal on white', '#077783', '#ffffff'],
  ['feature link teal on soft green-gray', '#077783', '#edf3f2'],
  /* Decorative icons, held to the text floor on purpose: one rule is easier
     to keep than two, and the darker values cost nothing visually. */
  ['feature icon green on its tint', '#315f2f', '#e8f3e5'],
  ['feature icon gold on its tint', '#7a5d17', '#f7efdb'],
  ['band lede on teal (92% white)', '#f2f4f5', '#077783'],
  ['status strip body on its wash', '#52616f', '#f2f7f5'],
  ['place county on navy', '#a9c0d3', '#102b4e'],
  ['gold CTA label on gold', '#16110a', '#bf922d'],

  /* /start campaign landing, now on the approved palette. */
  ['landing eyebrow on white', '#077783', '#ffffff'],
  ['landing eyebrow on the light band', '#077783', '#edf3f2'],
  ['landing eyebrow gold on navy', '#e6bd55', '#102b4e'],
  ['landing gold CTA label', '#102b4e', '#bf922d'],
  ['landing teal CTA label', '#102b4e', '#18a9b4'],
  ['landing body on white', '#10233f', '#ffffff'],
]
let failed = 0
for (const [name, foreground, background] of checks) {
  const value = ratio(foreground, background)
  const ok = value >= 4.5
  if (!ok) failed += 1
  console.log(`${name}: ${value.toFixed(2)}:1 ${ok ? 'PASS' : 'FAIL'}`)
}
if (failed > 0) {
  console.error(`\n${failed} pair(s) below WCAG 2.2 AA 4.5:1.`)
  process.exitCode = 1
}
