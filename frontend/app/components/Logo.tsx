"use client";

import Link from "next/link";
import { cn } from "@/app/helpers/utils";
import { bebasNeue } from "@/app/ui/fonts";
import { FiCpu } from "react-icons/fi";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-white transition-opacity hover:opacity-80",
        className
      )}
    >
      <FiCpu className="h-8 w-8" />
      <span className={`${bebasNeue.className} text-3xl tracking-wider`}>
        myApp
      </span>
    </Link>
  );
}
