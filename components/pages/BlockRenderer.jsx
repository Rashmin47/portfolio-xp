/* eslint-disable @next/next/no-img-element */

export default function BlockRenderer({ blocks = [] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return <p key={index}>{block.text}</p>;

          case "h2":
            return <h2 key={index}>{block.text}</h2>;

          case "h3":
            return <h3 key={index}>{block.text}</h3>;

          case "ul":
            return (
              <ul key={index}>
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "code":
            return (
              <pre key={index}>
                <code>{block.code || block.text}</code>
              </pre>
            );

          case "quote":
            return <blockquote key={index}>{block.text}</blockquote>;

          case "img":
            return (
              <figure key={index} className="my-6 space-y-2">
                <img
                  src={block.src}
                  alt={block.alt || ""}
                  className="w-full h-auto rounded-[14px] border border-ink/10 dark:border-paper/10"
                />
                {block.caption && (
                  <figcaption className="font-mono text-xs text-muted text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
