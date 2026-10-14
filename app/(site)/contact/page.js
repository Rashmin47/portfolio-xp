import ContactForm from "@/components/site/ContactForm";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Rashmin Sharma.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Contact
      </h1>
      <p className="text-muted mb-8 leading-relaxed">
        Reach out using the form below, or connect directly via{" "}
        <a
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cobalt hover:underline dark:text-sky font-medium"
        >
          LinkedIn
        </a>{" "}
        or{" "}
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cobalt hover:underline dark:text-sky font-medium"
        >
          GitHub
        </a>.
      </p>
      <ContactForm />
    </section>
  );
}
