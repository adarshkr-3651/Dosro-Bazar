"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Heart, User, Menu, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

import { AuthContext } from "../../context/AuthContext";
import logo from "../../public/logo.png";

interface HeaderProps {
  isBuyerMode: boolean;
  onModeToggle: (checked: boolean) => void;
}

const Header = ({ isBuyerMode, onModeToggle }: HeaderProps) => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used inside provider");

  const { activeUser, logout } = context;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <Image src={logo} alt="Dosro Bazar" className="h-10 w-auto" />
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-xl md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <Label htmlFor="mode-toggle" className="text-xs md:text-sm font-medium cursor-pointer">
                {isBuyerMode ? "Buy" : "Sell"}
              </Label>
              <Switch
                id="mode-toggle"
                checked={!isBuyerMode}
                onCheckedChange={(checked) => onModeToggle(!checked)}
              />
            </div>

            {/* Upload (Seller Only) */}
            {!isBuyerMode && (
              <Link href="/upload" passHref>
                <Button asChild size="sm" className="hidden md:flex gap-2">
                  <a>
                    <Upload className="h-4 w-4" />
                    <span>Upload Item</span>
                  </a>
                </Button>
              </Link>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Favourite */}
            <Link href="/favourite">
              <Button asChild variant="ghost" size="icon">
                <a>
                  <Heart className="h-5 w-5" />
                </a>
              </Button>
            </Link>

            {/* User */}
            {activeUser ? (
              <Button variant="ghost" size="icon" onClick={logout}>
                <User className="h-5 w-5 text-red-500" />
              </Button>
            ) : (
              <Link href="/login">
                <Button asChild variant="ghost" size="icon">
                  <a>
                    <User className="h-5 w-5" />
                  </a>
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
