"use client";

import { Search, Bell, Heart, User, Menu, Upload, LogOut, MessageCircle } from "lucide-react";
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
import { useState, useEffect } from "react";
import { getNotifications } from "../lib/api";
import { resolvePhotoUrl } from "../lib/image-utils";

interface HeaderProps {
  isBuyerMode?: boolean;
  onModeToggle?: (checked: boolean) => void;
}

const Header = ({ isBuyerMode: propsIsBuyerMode, onModeToggle: propsOnModeToggle }: HeaderProps) => {
  const { user, logout, isBuyerMode: contextIsBuyerMode, setIsBuyerMode } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchNotificationsData = async () => {
        try {
          const response = await getNotifications();
          if (response.success) {
            setNotifications(response.data);
          }
        } catch (err) {
          // Silent catch to prevent error overlays when session expires
        }
      };

      fetchNotificationsData();

      // Listen for manual update events
      window.addEventListener('notificationsUpdated', fetchNotificationsData);

      // Poll for new notifications every 15 seconds for a "live" feel
      const interval = setInterval(fetchNotificationsData, 15000);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsUpdated', fetchNotificationsData);
      };
    }
  }, [user]);

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
    if (!user) return null;
    router.push('/profile');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Dosro Bazar" width={60} height={60} className="h-12 w-auto cursor-pointer" />
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

          {/* Mode Toggle - Moved outside of right side actions to act as a primary separator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 w-[88px] md:w-[94px] justify-center mx-2">
            <Label htmlFor="mode-toggle-desktop" className="text-xs md:text-sm font-medium cursor-pointer min-w-[28px] text-center">
              {currentIsBuyerMode ? "Buy" : "Sell"}
            </Label>
            <Switch
              id="mode-toggle-desktop"
              checked={!currentIsBuyerMode}
              onCheckedChange={handleModeChange}
            />
          </div>

          {/* Right Side Actions - Always ml-auto to stay on the right */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">

            {/* Upload Button Component (Seller Mode) OR Favorites Component (Buyer Mode) */}
            <div className="hidden md:flex items-center w-[130px] justify-end">
              {!currentIsBuyerMode ? (
                <Button size="sm" className="flex gap-2 w-full" asChild>
                  <Link href="/upload">
                    <Upload className="h-4 w-4" />
                    <span>Upload Item</span>
                  </Link>
                </Button>
              ) : (
                user && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/favorites">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                )
              )}
            </div>

            {/* Mobile-only Upload/Favorites */}
            <div className="flex items-center lg:hidden">
              <div className="flex items-center gap-2 px-2 py-1 mr-1 rounded-lg bg-muted/50 justify-center">
                <Switch
                  id="mode-toggle-mobile"
                  checked={!currentIsBuyerMode}
                  onCheckedChange={handleModeChange}
                  className="scale-90"
                />
              </div>

              {!currentIsBuyerMode ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/upload">
                    <Upload className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                user && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/favorites">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                )
              )}
            </div>



            {/* Action Buttons */}
            {user && (
              <>
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/messages">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </Link>
                </Button>
              </>
            )}


            {user ? (
              <>
                <Button onClick={() => userProfile()} variant="ghost" size="sm" className="gap-2">
                  {user.photo && resolvePhotoUrl(user.photo, true) ? (
                    <div className="relative h-6 w-6 rounded-full overflow-hidden border">
                      <Image
                        src={resolvePhotoUrl(user.photo, true)!}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized={resolvePhotoUrl(user.photo)?.startsWith('http')}
                      />
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
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
