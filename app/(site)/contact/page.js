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
    <div className="w-full">
      <SectionHeader number="01" label="CONTACT" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Column: Short copy & Direct Links */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
              Get in touch
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Have an engineering problem to discuss, an ambitious project in mind,
              or want to collaborate? Send a message through the form or connect
              directly on GitHub and LinkedIn.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted block font-semibold">
              DIRECT NETWORKS
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

        {/* Right Column: Restyled Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.01] dark:bg-paper/[0.02]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
