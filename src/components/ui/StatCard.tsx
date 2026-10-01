import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
  icon?: React.ReactNode;
  href?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType,
  description,
  icon,
  href,
}: StatCardProps) {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  const cardContent = (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs text-card-foreground transition hover:shadow-md ${
        href ? "cursor-pointer hover:border-primary" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {value}
        </span>
        <span
          className={`inline-flex items-center text-xs font-medium ${
            isPositive
              ? "text-success"
              : isNegative
              ? "text-error"
              : "text-muted-foreground"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
          ) : isNegative ? (
            <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
          ) : (
            <Minus className="mr-0.5 h-3.5 w-3.5" />
          )}
          {change}
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:-translate-y-0.5">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
