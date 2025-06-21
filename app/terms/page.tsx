"use client";
import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle, 
  Scale, 
  Clock,
  Mail,
  ArrowLeft
} from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "June 21, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing and using KTU Cyber, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service."
      ]
    },
    {
      id: "description",
      title: "2. Service Description",
      icon: Users,
      content: [
        "KTU Cyber is a study material sharing platform designed for students to upload, download, and share academic resources.",
        "We provide a platform for students to access notes, assignments, previous year questions, and other educational materials.",
        "The service is primarily focused on Kerala Technological University (KTU) and other educational institutions."
      ]
    },
    {
      id: "user-accounts",
      title: "3. User Accounts and Registration",
      icon: Shield,
      content: [
        "You must register for an account to upload or download materials from our platform.",
        "You are responsible for safeguarding the password and for maintaining the confidentiality of your account.",
        "You agree to provide accurate, current, and complete information during the registration process.",
        "You are responsible for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account."
      ]
    },
    {
      id: "content-guidelines",
      title: "4. Content Guidelines and User Conduct",
      icon: AlertTriangle,
      content: [
        "You may only upload content that you have the right to share or that is in the public domain.",
        "All uploaded materials must be educational in nature and relevant to academic studies.",
        "You must not upload copyrighted materials without proper authorization from the copyright holder.",
        "Prohibited content includes but is not limited to: inappropriate, offensive, defamatory, or illegal materials.",
        "You are solely responsible for the content you upload and share on the platform.",
        "We reserve the right to remove any content that violates these guidelines without prior notice."
      ]
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property Rights",
      icon: Scale,
      content: [
        "Users retain ownership of the content they upload, but grant KTU Cyber a license to display and distribute it on the platform.",
        "By uploading content, you represent that you have the necessary rights to share the material.",
        "If you believe your copyright has been infringed, please contact us immediately with details of the alleged infringement.",
        "We will investigate copyright claims and remove infringing content when appropriate.",
        "The KTU Cyber platform, including its design, features, and functionality, is owned by us and protected by copyright laws."
      ]
    },
    {
      id: "prohibited-uses",
      title: "6. Prohibited Uses",
      icon: AlertTriangle,
      content: [
        "You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.",
        "You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.",
        "You may not transmit any material that is abusive, harassing, tortious, defamatory, vulgar, obscene, or invasive of another's privacy.",
        "You may not impersonate or attempt to impersonate another user, person, or entity.",
        "You may not engage in any activity that disrupts or interferes with the service or servers connected to the service."
      ]
    },
    {
      id: "privacy",
      title: "7. Privacy Policy",
      icon: Shield,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.",
        "We collect and use your personal information in accordance with our Privacy Policy.",
        "By using our service, you consent to the collection and use of your information as outlined in our Privacy Policy."
      ]
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers and Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "The information on this platform is provided on an 'as-is' basis. We make no warranties regarding the accuracy or completeness of the content.",
        "We are not responsible for the quality, accuracy, or reliability of user-generated content.",
        "We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.",
        "We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages.",
        "Users download and use materials at their own risk and discretion."
      ]
    },
    {
      id: "termination",
      title: "9. Termination",
      icon: Clock,
      content: [
        "We may terminate or suspend your account and bar access to the service immediately, without prior notice, for any reason.",
        "Upon termination, your right to use the service will cease immediately.",
        "If you wish to terminate your account, you may simply discontinue using the service.",
        "All provisions which by their nature should survive termination shall survive, including ownership provisions and liability limitations."
      ]
    },
    {
      id: "changes",
      title: "10. Changes to Terms",
      icon: FileText,
      content: [
        "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.",
        "Your continued use of the service after changes are posted constitutes acceptance of the revised terms.",
        "We will make reasonable efforts to notify users of significant changes to these terms.",
        "It is your responsibility to check this page periodically for changes."
      ]
    },
    {
      id: "governing-law",
      title: "11. Governing Law",
      icon: Scale,
      content: [
        "These terms shall be governed by and construed in accordance with the laws of India.",
        "Any disputes arising from these terms or your use of the service shall be subject to the jurisdiction of Indian courts.",
        "If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect."
      ]
    },
    {
      id: "contact",
      title: "12. Contact Information",
      icon: Mail,
      content: [
        "If you have any questions about these Terms of Service, please contact us:",
        "Email: legal@ktucyber.com",
        "For general inquiries: contact@ktucyber.com",
        "We will respond to your inquiries within 48 hours during business days."
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
              Terms of Service
            </h1>
            <p className="text-lg text-[#60758a] mb-2">
              Please read these terms carefully before using KTU Cyber
            </p>
            <p className="text-sm text-[#60758a] flex items-center justify-center gap-2">
              <Clock size={16} />
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-[#111418] mb-2">
                Welcome to KTU Cyber
              </h2>
              <p className="text-[#60758a] leading-relaxed">
                These Terms of Service govern your use of the KTU Cyber platform. By using our service, 
                you agree to comply with these terms. Please read them carefully and contact us if you have any questions.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
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

        {/* Footer CTA */}
        <div className="mt-12 bg-[#111418] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Our Terms?
          </h3>
          <p className="text-lg opacity-90 mb-6">
            We're here to help. Contact our team if you need clarification on any of these terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@ktucyber.com"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail size={20} />
              Contact Legal Team
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#111418] transition-colors"
            >
              Support Center
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
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Privacy Policy
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
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}