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
  isBuyerMode?: boolean;
  onModeToggle?: (checked: boolean) => void;
}

const Header = ({ isBuyerMode: propsIsBuyerMode, onModeToggle: propsOnModeToggle }: HeaderProps) => {
  const { user, logout, isBuyerMode: contextIsBuyerMode, setIsBuyerMode } = useAuth();
  const router = useRouter();

  // Use context if available, otherwise use props
  const currentIsBuyerMode = contextIsBuyerMode !== undefined ? contextIsBuyerMode : propsIsBuyerMode!;
  const handleToggle = (checked: boolean) => {
    if (setIsBuyerMode) {
      setIsBuyerMode(checked);
    } else if (propsOnModeToggle) {
      propsOnModeToggle(checked);
    }
  };

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

    if (checked && user) {
      // If user is already a seller or admin, allow
      if (user.role === 'seller' || user.role === 'admin') {
        handleToggle(!checked);
        // Redirect to home if not already there
        if (window.location.pathname !== '/') {
          router.push('/');
        }
        return;
      }

      // If not, identify what is missing to guide the user
      const missingFields = [];
      if (!user.phone || user.phone === '') missingFields.push("Phone Number");
      if (!user.address || user.address === '') missingFields.push("Address");
      if (!user.photo || user.photo === 'user.png') missingFields.push("Profile Picture");
      if (!user.idProof || user.idProof === '') missingFields.push("ID Proof");

      if (missingFields.length > 0) {
        toast.error("Profile Incomplete", {
          description: `To become a seller, please add: ${missingFields.join(', ')}`,
          action: {
            label: "Update Profile",
            onClick: () => router.push('/profile')
          }
        });
        return;
      }
    }

    // Call the original toggle handler
    handleToggle(!checked);
    // Redirect to home if not already there
    if (window.location.pathname !== '/') {
      router.push('/');
    }
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
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("search") as string;
              if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }
            }} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search for products..."
                className="pl-10 bg-muted/50"
              />
            </form>
          </div>

          {/* Upload Button - Seller Mode Only - Outside actions container to prevent shifting */}
          {!currentIsBuyerMode && (
            <Button size="sm" className="hidden lg:flex gap-2" asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                <span>Upload Item</span>
              </Link>
            </Button>
          )}

          {/* Right Side Actions - Always ml-auto to stay on the right */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <Label htmlFor="mode-toggle" className="text-xs md:text-sm font-medium cursor-pointer min-w-[40px] text-center">
                {currentIsBuyerMode ? "Buy" : "Sell"}
              </Label>
              <Switch
                id="mode-toggle"
                checked={!currentIsBuyerMode}
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

            {currentIsBuyerMode && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
            )}


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
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get("search") as string;
            if (query.trim()) {
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }
          }} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search..."
              className="pl-10 bg-muted/50"
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
