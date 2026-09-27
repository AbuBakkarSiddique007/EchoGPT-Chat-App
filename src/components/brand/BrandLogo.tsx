import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-echogpt.svg"
      alt=""
      width={128}
      height={128}
      unoptimized
      className={cn("shrink-0", className)}
    />
  );
}
