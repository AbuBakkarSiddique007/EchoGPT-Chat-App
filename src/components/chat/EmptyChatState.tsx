import { BrandLogo } from "@/components/brand/BrandLogo";

export function EmptyChatState() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 blur-2xl"
          style={{ background: "var(--echo-aura-violet)" }}
          aria-hidden="true"
        />
        <BrandLogo className="size-11" />
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">
        What are we building today?
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-2">
        Ask anything, or start from a suggestion below. EchoGPT routes your prompt to the
        right model automatically.
      </p>
    </div>
  );
}
