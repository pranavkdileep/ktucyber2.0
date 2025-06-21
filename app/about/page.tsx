"use client";
import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Share2, 
  Target, 
  Heart, 
  ArrowRight,
  GraduationCap,
  Download,
  Upload,
  Star
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: BookOpen, label: "Study Materials", value: "10,000+" },
    { icon: Users, label: "Active Students", value: "5,000+" },
    { icon: Download, label: "Downloads", value: "50,000+" },
    { icon: GraduationCap, label: "Universities", value: "100+" }
  ];

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Share your notes, assignments, and study materials with just a few clicks."
    },
    {
      icon: BookOpen,
      title: "Organized Content",
      description: "Find materials organized by subjects, universities, and document types."
    },
    {
      icon: Share2,
      title: "Community Driven",
      description: "Built by students, for students. Help each other succeed academically."
    },
    {
      icon: Star,
      title: "Quality Content",
      description: "Curated study materials from top students and verified sources."
    }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Platform Creators",
      description: "Passionate developers creating tools to enhance student learning experience."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111418] mb-4">
            About KTU Cyber
          </h1>
          <p className="text-lg text-[#60758a] max-w-3xl mx-auto leading-relaxed">
            Empowering students through collaborative learning and seamless study material sharing
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                To create a comprehensive platform where students can easily access, share, and 
                collaborate on study materials, fostering a community of knowledge sharing and 
                academic excellence.
              </p>
            </div>
            <div className="flex justify-center">
              <Target size={120} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-[#f0f2f5] rounded-lg">
                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-[#111418] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#60758a]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* What We Offer Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#111418] text-center mb-8">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-[#111418] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#60758a] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111418] text-center mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-[#60758a] leading-relaxed">
              <p className="text-lg">
                KTU Cyber was born from a simple observation: students were struggling to find 
                quality study materials and often had to rely on scattered resources across 
                different platforms. We saw an opportunity to create a centralized, 
                student-friendly platform that would make academic resources more accessible.
              </p>
              <p className="text-lg">
                Our platform focuses on Kerala Technological University (KTU) and other 
                universities, providing a space where students can upload, download, and 
                share study materials including notes, assignments, previous year questions, 
                and project reports.
              </p>
              <p className="text-lg">
                What started as a simple file-sharing idea has evolved into a comprehensive 
                learning ecosystem where students help each other succeed. Every upload, 
                every download, and every interaction contributes to building a stronger 
                academic community.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#111418] text-center mb-8">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#111418] mb-3">
                Collaboration
              </h3>
              <p className="text-[#60758a]">
                We believe in the power of students helping students. Knowledge shared is knowledge multiplied.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#111418] mb-3">
                Community
              </h3>
              <p className="text-[#60758a]">
                Building a supportive community where every student can thrive and achieve their academic goals.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#111418] mb-3">
                Excellence
              </h3>
              <p className="text-[#60758a]">
                Committed to providing high-quality resources and maintaining the highest standards of content.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#111418] text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Be part of a growing community of students who believe in collaborative learning. 
            Share your knowledge and access thousands of study materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#111418] transition-colors"
            >
              Browse Materials
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-[#111418] mb-4">
            Have Questions?
          </h2>
          <p className="text-[#60758a] mb-6">
            We'd love to hear from you. Get in touch with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@ktucyber.com"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Email Us
            </a>
            <Link
              href="/contact"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}