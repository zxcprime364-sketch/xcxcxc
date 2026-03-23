import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  tooltip: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  tooltipPosition?: "top" | "bottom";
};

export function TooltipButton({
  onClick,
  tooltip,
  disabled,
  className,
  children,
  tooltipPosition = "top",
}: Props) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "cursor-pointer text-white/80 hover:text-white",
          className,
        )}
      >
        {children}
      </button>
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50",
          tooltipPosition === "top" ? "-top-8" : "top-full mt-2",
        )}
      >
        {tooltip}
      </span>
    </div>
  );
}
