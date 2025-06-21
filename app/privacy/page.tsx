"use client";
import React from "react";
import Link from "next/link";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Share2, 
  Clock,
  Mail,
  ArrowLeft,
  Cookie,
  Globe,
  UserCheck,
  AlertCircle
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "June 21, 2025";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: Shield,
      content: [
        "At KTU Cyber, we are committed to protecting your privacy and personal information.",
        "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our study material sharing platform.",
        "By using our service, you consent to the data practices described in this policy.",
        "We encourage you to read this policy carefully and contact us if you have any questions."
      ]
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: Database,
      content: [
        "Personal Information: Name, email address, university details, and profile information you provide during registration.",
        "Academic Information: Course details, semester, university affiliation, and study preferences.",
        "Uploaded Content: Study materials, notes, assignments, and other documents you share on the platform.",
        "Usage Data: Information about how you interact with our platform, including pages visited and features used.",
        "Device Information: IP address, browser type, operating system, and device identifiers.",
        "Cookies and Tracking: Data collected through cookies and similar technologies to enhance your experience."
      ]
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: Eye,
      content: [
        "To provide and maintain our study material sharing service.",
        "To create and manage your user account and profile.",
        "To organize and categorize uploaded study materials.",
        "To recommend relevant content based on your academic interests and study patterns.",
        "To communicate with you about platform updates, new features, and important notices.",
        "To improve our platform's functionality and user experience.",
        "To prevent fraud, abuse, and ensure platform security.",
        "To comply with legal obligations and respond to lawful requests."
      ]
    },
    {
      id: "information-sharing",
      title: "4. Information Sharing and Disclosure",
      icon: Share2,
      content: [
        "Public Content: Study materials you upload are made available to other registered users as intended by the platform's purpose.",
        "Profile Information: Your name and university details may be visible to other users when you upload content.",
        "Service Providers: We may share information with trusted third-party service providers who assist in platform operations.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and safety.",
        "Business Transfers: Information may be transferred in connection with mergers, acquisitions, or asset sales.",
        "We do not sell your personal information to third parties for marketing purposes."
      ]
    },
    {
      id: "data-security",
      title: "5. Data Security",
      icon: Lock,
      content: [
        "We implement appropriate technical and organizational security measures to protect your information.",
        "All data transmission is encrypted using industry-standard SSL/TLS protocols.",
        "User passwords are encrypted and stored securely using advanced hashing algorithms.",
        "We regularly monitor our systems for potential vulnerabilities and security threats.",
        "Access to personal information is restricted to authorized personnel only.",
        "While we strive to protect your information, no method of transmission over the internet is 100% secure."
      ]
    },
    {
      id: "cookies",
      title: "6. Cookies and Tracking Technologies",
      icon: Cookie,
      content: [
        "We use cookies to enhance your browsing experience and platform functionality.",
        "Essential cookies are necessary for the platform to function properly and cannot be disabled.",
        "Performance cookies help us understand how users interact with our platform to improve services.",
        "Preference cookies remember your settings and customization choices.",
        "You can control cookie settings through your browser, but disabling some cookies may affect platform functionality.",
        "We do not use cookies for third-party advertising or tracking across other websites."
      ]
    },
    {
      id: "user-rights",
      title: "7. Your Rights and Choices",
      icon: UserCheck,
      content: [
        "Access: You can request access to the personal information we hold about you.",
        "Correction: You can update or correct your personal information through your account settings.",
        "Deletion: You can request deletion of your account and associated personal information.",
        "Data Portability: You can request a copy of your data in a machine-readable format.",
        "Withdrawal of Consent: You can withdraw consent for data processing where applicable.",
        "To exercise these rights, please contact us using the information provided in this policy."
      ]
    },
    {
      id: "data-retention",
      title: "8. Data Retention",
      icon: Clock,
      content: [
        "We retain your personal information for as long as your account is active or as needed to provide services.",
        "Uploaded study materials may be retained even after account deletion to maintain platform integrity for other users.",
        "We may retain certain information for legal compliance, dispute resolution, and platform security purposes.",
        "Anonymous usage data may be retained indefinitely for analytical and improvement purposes.",
        "You can request specific data deletion by contacting our support team."
      ]
    },
    {
      id: "international-transfers",
      title: "9. International Data Transfers",
      icon: Globe,
      content: [
        "Your information may be transferred to and processed in countries outside your residence.",
        "We ensure appropriate safeguards are in place when transferring data internationally.",
        "Data transfers comply with applicable privacy laws and regulations.",
        "We use standard contractual clauses and other legal mechanisms to protect transferred data."
      ]
    },
    {
      id: "children-privacy",
      title: "10. Children's Privacy",
      icon: AlertCircle,
      content: [
        "Our service is intended for users who are at least 13 years old.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected information from a child under 13, we will delete it promptly.",
        "Parents or guardians who believe their child has provided information should contact us immediately."
      ]
    },
    {
      id: "policy-changes",
      title: "11. Changes to This Privacy Policy",
      icon: AlertCircle,
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
        "We will notify users of significant changes via email or prominent platform notices.",
        "The updated policy will be posted on this page with a revised 'Last Updated' date.",
        "Your continued use of the platform after changes constitutes acceptance of the updated policy."
      ]
    },
    {
      id: "contact-us",
      title: "12. Contact Information",
      icon: Mail,
      content: [
        "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:",
        "Email: privacy@ktucyber.com",
        "Data Protection Officer: dpo@ktucyber.com",
        "General Support: contact@ktucyber.com",
        "We will respond to your privacy-related inquiries within 30 days."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111418] mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[#60758a] mb-2">
              Your privacy matters to us. Learn how we protect and use your information.
            </p>
            <p className="text-sm text-[#60758a] flex items-center justify-center gap-2">
              <Clock size={16} />
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-[#111418] mb-2">
                Your Privacy is Protected
              </h2>
              <p className="text-[#60758a] leading-relaxed">
                This Privacy Policy describes how KTU Cyber collects, uses, and protects your personal information 
                when you use our study material sharing platform. We are committed to maintaining the confidentiality 
                and security of your data.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <h2 className="text-xl font-semibold text-[#111418]">
                    {section.title}
                  </h2>
                </div>
                <div className="ml-9">
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="text-[#60758a] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Rights Summary */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#111418] mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Your Data Rights Summary
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-[#60758a]">Request access to your data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-[#60758a]">Correct inaccurate information</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-[#60758a]">Delete your account and data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-[#60758a]">Export your data</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-[#111418] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Your Privacy?
          </h3>
          <p className="text-lg opacity-90 mb-6">
            We're committed to transparency. Contact our privacy team if you have any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@ktucyber.com"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail size={20} />
              Contact Privacy Team
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#111418] transition-colors"
            >
              Data Protection Support
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-[#60758a] mb-4">
            Related Documents
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-[#60758a]">•</span>
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              About Us
            </Link>
            <span className="text-[#60758a]">•</span>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}