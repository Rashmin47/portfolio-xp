/**
 * JsonLd
 * ------
 * Renders exactly one schema.org @graph per page. `data` is a single node or an
 * array of nodes; the @context is added here, so a page can never emit two
 * competing JSON-LD blocks and callers never hand-write an @context.
 */
export default function JsonLd({ data }) {
  const nodes = (Array.isArray(data) ? data : [data])
    .filter(Boolean)
    // Drop any stray @context so the graph has exactly one at the top level.
    .map(({ "@context": _context, ...node }) => node);

  const jsonString = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
