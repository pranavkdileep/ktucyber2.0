"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  ArrowLeft,
  Linkedin,
  Instagram,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "contact@ktucyber.com",
      link: "mailto:contact@ktucyber.com"
    },
    // {
    //   icon: MessageSquare,
    //   title: "Support Center",
    //   description: "Browse our help articles and FAQs",
    //   contact: "Get instant answers",
    //   link: "/support"
    // },
    {
      icon: Clock,
      title: "Response Time",
      description: "We typically respond to inquiries within",
      contact: "24 hours",
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      name: "LinkedIn",
      description: "Connect with us professionally",
      url: "https://www.linkedin.com/in/pranavkdileep",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Instagram,
      name: "Instagram",
      description: "Follow us for updates and behind-the-scenes",
      url: "https://www.instagram.com/pranavkdileep/",
      color: "bg-pink-600 hover:bg-pink-700"
    },
    {
      icon: MessageCircle,
      name: "WhatsApp Channel",
      description: "Join our channel for instant updates",
      url: "https://whatsapp.com/channel/0029VaaAhdE8PgsBEeFUwo2W",
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'content', label: 'Content Issues' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
              Contact Us
            </h1>
            <p className="text-lg text-[#60758a] max-w-2xl mx-auto">
              Have a question, suggestion, or need help? We'd love to hear from you. 
              Get in touch and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[#111418] mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#111418] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#111418] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[#111418] mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#111418] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Brief subject of your message"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#111418] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle size={20} />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={20} />
                    <span>Failed to send message. Please try again or email us directly.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Social Media */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#111418] mb-4">
                Other Ways to Reach Us
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-[#111418]">{method.title}</h4>
                        <p className="text-sm text-[#60758a] mb-1">{method.description}</p>
                        {method.link ? (
                          <Link
                            href={method.link}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            {method.contact}
                          </Link>
                        ) : (
                          <span className="font-medium text-[#111418]">{method.contact}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#111418] mb-4">
                Connect on Social Media
              </h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                      <div className={`p-2 rounded-full text-white ${social.color} transition-colors`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#111418] group-hover:text-blue-600 transition-colors">
                          {social.name}
                        </h4>
                        <p className="text-sm text-[#60758a]">{social.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQ Link
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#111418] mb-2">
                Quick Answers
              </h3>
              <p className="text-[#60758a] text-sm mb-4">
                Looking for immediate help? Check our frequently asked questions for instant answers.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                View FAQ
                <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </div> */}
          </div>
        </div>

        {/* Office Info */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-[#111418] mb-4">
            KTU Cyber Team
          </h3>
          <p className="text-[#60758a] max-w-2xl mx-auto mb-6">
            We're a dedicated team of students and developers passionate about creating 
            the best study material sharing platform for the academic community.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#60758a]">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>Email responses within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}