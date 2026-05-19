"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useLanguage } from "../context/LanguageContext";
import FooterLinkModal from "./FooterLinkModal";
import { getFooterLinks } from "../lib/api";

const Footer = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [categories, setCategories] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await getFooterLinks();
        if (res.success && res.data) {
          setLinks(res.data);
          
          // Sort links by order ascending
          const sorted = [...res.data].sort((a, b) => a.order - b.order);

          // Group by category
          const grouped: Record<string, any[]> = {
            "About Us": [],
            "Help Center": [],
            "Terms of Service": []
          };
          
          sorted.forEach((link) => {
            const cat = link.category;
            if (!grouped[cat]) {
              grouped[cat] = [];
            }
            grouped[cat].push(link);
          });
          
          setCategories(grouped);
        }
      } catch (err) {
        console.error("Failed to load footer links from backend:", err);
      }
    };
    fetchLinks();
  }, []);

  const gmailUrl = process.env.NEXT_PUBLIC_GMAIL_URL;
  const mailtoHref = gmailUrl
    ? (gmailUrl.includes("@") && !gmailUrl.startsWith("mailto:") ? `mailto:${gmailUrl}` : gmailUrl)
    : "#";

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "About Us": return t('about_us');
      case "Help Center": return t('help_center');
      case "Terms of Service": return t('terms_of_service');
      default: return category;
    }
  };

  const hasDynamicLinks = Object.values(categories).some(arr => arr.length > 0);
  const renderCategories = hasDynamicLinks 
    ? categories 
    : {
        "About Us": ["About Us", "Careers", "Press", "Blog"].map(title => ({ title })),
        "Help Center": ["Help Center", "Safety Tips", "Contact Us", "FAQs"].map(title => ({ title })),
        "Terms of Service": ["Terms of Service", "Privacy Policy", "Cookie Policy"].map(title => ({ title }))
      };

  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src={logo} alt="Dosro Bazar" width={192} height={192} className="h-48 w-48 mb-4 object-contain" />
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer_desc')}
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" asChild>
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a
                  href={process.env.NEXT_PUBLIC_X_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="flex items-center justify-center"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a
                  href={mailtoHref}
                  aria-label="Gmail"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(renderCategories).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{getCategoryTitle(category)}</h3>
              <ul className="space-y-2">
                {items.map((item: any) => (
                  <li key={item.title}>
                    <button
                      onClick={() => setActiveModal(item.title)}
                      className="text-sm text-left text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {item.title}
                    </button>
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

      <FooterLinkModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        pageKey={activeModal}
        links={links}
      />
    </footer>
  );
};

export default Footer;

