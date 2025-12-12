"use client";

import { Smartphone, Laptop, Home, Car, Shirt, Book, Dumbbell, Gamepad2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area";

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "Computers", icon: Laptop },
  { name: "Home & Garden", icon: Home },
  { name: "Vehicles", icon: Car },
  { name: "Fashion", icon: Shirt },
  { name: "Books", icon: Book },
  { name: "Sports", icon: Dumbbell },
  { name: "Gaming", icon: Gamepad2 },
];

const CategoryNav = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="flex items-center gap-2 whitespace-nowrap hover:bg-primary/10 hover:text-primary"
              >
                <category.icon className="h-4 w-4" />
                <span className="text-sm">{category.name}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryNav;

