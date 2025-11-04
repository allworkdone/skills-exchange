import { ReactNode, ElementType } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function ResponsiveContainer({ 
  children, 
  className = "", 
  as: Component = "div" 
}: ResponsiveContainerProps) {
  return (
    <Component className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: "auto" | "1" | "2" | "3" | "4" | "5" | "6";
  gap?: "sm" | "md" | "lg" | "none";
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = "auto", 
  gap = "md", 
  className = "" 
}: ResponsiveGridProps) {
  const gridClass = `grid ${
    cols === "1" ? "grid-cols-1" :
    cols === "2" ? "grid-cols-1 sm:grid-cols-2" :
    cols === "3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
    cols === "4" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
    cols === "5" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" :
    cols === "6" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6" :
    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  } ${
    gap === "sm" ? "gap-4" :
    gap === "lg" ? "gap-8" :
    gap === "none" ? "gap-0" :
    "gap-6"
  } ${className}`;

  return (
    <div className={gridClass}>
      {children}
    </div>
 );
}

interface ResponsiveTextProps {
  children: ReactNode;
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

export function ResponsiveText({ 
  children, 
  size = "base", 
 className = "" 
}: ResponsiveTextProps) {
  const textSize = `text-${
    size === "sm" ? "base sm:text-lg" :
    size === "lg" ? "xl md:text-2xl" :
    size === "xl" ? "2xl md:text-3xl lg:text-4xl" :
    size === "2xl" ? "3xl md:text-4xl lg:text-5xl" :
    size === "3xl" ? "4xl md:text-5xl lg:text-6xl" :
    "lg sm:text-xl"
  } ${className}`;

  return (
    <span className={textSize}>
      {children}
    </span>
  );
}
