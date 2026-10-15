import ContactForm from "@/components/pages/ContactForm";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Rashmin Sharma.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    // Same window gutter as the Finder/editor shells (p-4 sm:p-6)
    <div className="w-full p-4 sm:p-6">
      <SectionHeader number="01" label="CONTACT" />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-0">
        {/* Left Column: Short copy & Direct Links */}
        <div className="lg:col-span-5 lg:pr-10 lg:border-r lg:border-ink/10 dark:lg:border-paper/10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper">
              Get in touch
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Have an engineering problem to discuss, an ambitious project in mind,
              or want to collaborate? Send a message through the form or connect
              directly on GitHub and LinkedIn.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-paper/70 block font-semibold">
              Direct networks
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              {siteConfig.linkedin && (
                <Button variant="secondary" href={siteConfig.linkedin} arrow>
                  LinkedIn
                </Button>
              )}
              {siteConfig.github && (
                <Button variant="secondary" href={siteConfig.github} arrow>
                  GitHub
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: compose form, flat on the window surface */}
        <div className="lg:col-span-7 lg:pl-10 pt-8 lg:pt-0">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
