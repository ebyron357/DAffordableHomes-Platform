/**
 * One JSON-LD block.
 *
 * `<` is escaped so a value that happens to contain `</script>` (a CMS string,
 * say) cannot close the element early. Every structured-data block outside the
 * root layout should render through this rather than repeating the escape.
 */
export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  )
}
