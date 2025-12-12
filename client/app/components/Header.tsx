"use client";

import { Search, Bell, Heart, User, Menu, Upload, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../public/logo.png"
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  isBuyerMode: boolean;
  onModeToggle: (checked: boolean) => void;
}

const Header = ({ isBuyerMode, onModeToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleModeChange = (checked: boolean) => {
    // If trying to switch to Seller Mode (checked = true)
    if (checked && !user) {
      toast.error("Login Required", {
        description: "You need to be logged in to access Seller Mode",
        action: {
          label: "Login",
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    // Check if user has a phone number when switching to seller mode
    if (checked && user && (!user.phone || user.phone === '')) {
      toast.error("Phone Number Required", {
        description: "Please add your phone number to become a seller",
        action: {
          label: "Add Phone",
          onClick: () => router.push('/profile?highlight=phone')
        }
      });
      return;
    }

    // Call the original toggle handler
    onModeToggle(!checked);
  };

  const userProfile = () => {
    router.push('/profile');
    console.log(user)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Dosro Bazar" width={120} height={40} className="h-10 w-auto cursor-pointer" />
          </Link>

          {/* Search Bar - Hidden on mobile */}
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
          {/* Upload Button - Seller Mode Only */}
          {!isBuyerMode && (
            <Button size="sm" className="hidden md:flex gap-2 ml-auto" asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                <span>Upload Item</span>
              </Link>
            </Button>
          )}
          {/* Right Side Actions */}
          <div className={`flex items-center gap-2 md:gap-4 ${isBuyerMode ? 'ml-auto' : ''}`}>
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <Label htmlFor="mode-toggle" className="text-xs md:text-sm font-medium cursor-pointer">
                {isBuyerMode ? "Buy" : "Sell"}
              </Label>
              <Switch
                id="mode-toggle"
                checked={!isBuyerMode}
                onCheckedChange={handleModeChange}
              />
            </div>



            {/* Action Buttons */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button onClick={() => userProfile()} variant="ghost" size="sm" className="gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user.username?.split(' ')[0] || 'Profile'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/login">
                  <span>Login</span>
                </Link>
              </Button>
            )}

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
