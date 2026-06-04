import PublicLayout from "@/components/layout/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-20 prose prose-slate">
        <h1 className="text-4xl font-serif font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide when requesting a quote or using our services, including your name, phone number, email address, moving addresses, and move details. We may also collect technical data such as IP address and browser type through cookies and analytics tools.</p>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is used to provide moving services, send quote estimates, communicate about your move, and improve our platform. We do not sell your personal information to third parties.</p>

        <h2>3. Communications</h2>
        <p>By submitting a quote form or contacting us, you consent to receiving communications from OneWorld Van Lines via phone, text, email, or WhatsApp regarding your inquiry. You may opt out at any time by replying STOP or contacting us directly.</p>

        <h2>4. WhatsApp and SMS</h2>
        <p>If you contact us via WhatsApp or text, your phone number is used only to respond to your inquiry and send relevant service communications. We use WhatsApp Cloud API in compliance with Meta's business messaging policies.</p>

        <h2>5. Data Security</h2>
        <p>We use industry-standard security measures to protect your data. Our platform uses encrypted connections, access controls, and regular security reviews.</p>

        <h2>6. Third-Party Services</h2>
        <p>We may use third-party services including cloud hosting, analytics, and communication platforms. These providers are bound by their own privacy policies and applicable law.</p>

        <h2>7. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time. Contact us at info@oneworldvanlines.com to submit a data request.</p>

        <h2>8. Contact</h2>
        <p>Questions about this policy? Reach us at info@oneworldvanlines.com or call (660) 667-7770.</p>
      </div>
    </PublicLayout>
  );
}
