"use client";

import React from "react";
import { LayoutGrid, Smartphone, Laptop, Home, Car, Shirt, Book, Dumbbell, Gamepad2, Sparkles, Baby } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area";

const categories = [
  { name: "All", icon: LayoutGrid },
  { name: "Electronics", icon: Smartphone },
  { name: "Computers", icon: Laptop },
  { name: "Home & Garden", icon: Home },
  { name: "Vehicles", icon: Car },
  { name: "Fashion", icon: Shirt },
  { name: "Health & Beauty", icon: Sparkles },
  { name: "Books", icon: Book },
  { name: "Toys & Hobbies", icon: Baby },
  { name: "Sports", icon: Dumbbell },
  { name: "Gaming", icon: Gamepad2 },
];

interface CategoryNavProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory = "All", onCategorySelect }) => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category.name;
              return (
                <Button
                  key={category.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-white shadow-md scale-105" 
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => onCategorySelect?.(category.name)}
                >
                  <category.icon className={`h-4 w-4 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryNav;

