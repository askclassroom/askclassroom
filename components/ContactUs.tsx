"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";

export default function ContactUs() {
    return (
        <section className="w-full py-24 px-6 lg:px-20 bg-[#F9FBFB]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

                {/* LEFT SIDE */}
                <div className="space-y-6">
                    <h2 className="text-5xl font-bold text-[#2c2c2c]">
                        Contact us
                    </h2>

                    <p className="text-gray-600 text-lg max-w-md">
                        Get in touch with us for any enquiries and questions about
                        TutorTalkAI, collaborations, or technical support.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-6 pt-6 text-gray-600">
                        <a
                            href="https://www.linkedin.com/company/"
                            target="_blank"
                            className="hover:text-[#02AAA0]"
                        >
                            <Linkedin />
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            className="hover:text-[#02AAA0]"
                        >
                            <Instagram />
                        </a>

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            className="hover:text-[#02AAA0]"
                        >
                            <Facebook />
                        </a>
                    </div>
                </div>

                {/* RIGHT SIDE INFO */}
                <div className="grid sm:grid-cols-2 gap-10 text-[#2c2c2c]">

                    {/* General */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">general inquiries</p>
                        <p className="font-semibold flex items-center gap-2">
                            <Mail size={16} /> tutortalkai@gmail.com
                        </p>
                        <p className="flex items-center gap-2 mt-1">
                            <Phone size={16} /> +91 91334 33463
                        </p>
                    </div>

                    {/* Founder */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">founder contact</p>
                        <p className="font-semibold flex items-center gap-2">
                            <Mail size={16} /> aryangupta.jiit@gmail.com
                        </p>
                        <p className="flex items-center gap-2 mt-1">
                            <Phone size={16} /> +91 9695910663
                        </p>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500 mb-2">address</p>
                        <p className="flex items-center gap-2">
                            <MapPin size={16} /> Hyderabad, Telangana
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className="mt-20 w-full">
                <div className="relative w-full h-[350px] rounded-2xl overflow-hidden">
                    <Image
                        src="/images/contact.jpg"
                        alt="Contact"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
}