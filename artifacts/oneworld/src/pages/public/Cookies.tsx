import PublicLayout from "@/components/layout/PublicLayout";

export default function Cookies() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-20 prose prose-slate">
        <h1 className="text-4xl font-serif font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
        <h2>How We Use Cookies</h2>
        <p>OneWorld Van Lines uses cookies for essential site functionality, session management, and anonymous analytics. We do not use third-party advertising cookies.</p>
        <h2>Managing Cookies</h2>
        <p>You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. For analytics cookies, you may opt out by adjusting your browser privacy settings.</p>
        <h2>Contact</h2>
        <p>Questions? Email us at info@oneworldvanlines.com.</p>
      </div>
    </PublicLayout>
  );
}
