"use client";

import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import logo from "../../public/logo.png"

const Footer = () => {
  const footerLinks = {
    "About": ["About Us", "Careers", "Press", "Blog"],
    "Support": ["Help Center", "Safety Tips", "Contact Us", "FAQs"],
    "Legal": ["Terms of Service", "Privacy Policy", "Cookie Policy"],
  };

  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src={logo} alt="Dosro Bazar" width={144} height={48} className="h-12 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted marketplace for buying, selling, and bidding on quality items.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dosro Bazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

