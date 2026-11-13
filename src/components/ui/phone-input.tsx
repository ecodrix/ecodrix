"use client";

import * as React from "react";
import PhoneInput, { type Country } from "react-phone-number-input";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";

export interface StyledPhoneProps {
  id?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  error?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * Custom input field — receives focus on tab
 */
const PhoneInputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={cn(
        "flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none selection:bg-accent/30 selection:text-accent-foreground",
        className,
      )}
    />
  ),
);
PhoneInputField.displayName = "PhoneInputField";

/**
 * Detect user's country from browser locale/timezone
 */
function detectCountry(): Country {
  if (typeof window === "undefined") return "IN";

  try {
    // Try Intl API timezone → country mapping
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzCountryMap: Record<string, Country> = {
      "Asia/Kolkata": "IN",
      "Asia/Calcutta": "IN",
      "America/New_York": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "America/Los_Angeles": "US",
      "Europe/London": "GB",
      "Europe/Berlin": "DE",
      "Europe/Paris": "FR",
      "Asia/Dubai": "AE",
      "Asia/Singapore": "SG",
      "Australia/Sydney": "AU",
      "Asia/Tokyo": "JP",
      "America/Toronto": "CA",
      "Asia/Shanghai": "CN",
      "Asia/Karachi": "PK",
      "Asia/Dhaka": "BD",
      "Asia/Colombo": "LK",
      "Africa/Lagos": "NG",
      "Africa/Nairobi": "KE",
      "Asia/Riyadh": "SA",
      "Asia/Kuwait": "KW",
      "Asia/Qatar": "QA",
      "Europe/Amsterdam": "NL",
      "Asia/Jakarta": "ID",
      "Asia/Manila": "PH",
      "Asia/Bangkok": "TH",
      "Asia/Kuala_Lumpur": "MY",
    };

    if (tzCountryMap[tz]) return tzCountryMap[tz];

    // Fallback: try navigator.language
    const lang = navigator.language || "";
    const parts = lang.split("-");
    if (parts.length >= 2 && parts[1].length === 2) {
      return parts[1].toUpperCase() as Country;
    }
  } catch {
    // Silent fallback
  }

  return "IN";
}

/**
 * Brand-synced phone input with global country selector.
 * - Tab skips country selector, goes directly to number input
 * - Country selector is click-only (tabIndex=-1)
 * - Default country auto-detected from user's locale
 */
export function StyledPhoneInput({
  id,
  className,
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
}: StyledPhoneProps) {
  // Client-only (the early-access form loads with ssr: false), so reading the
  // browser's locale here can't mismatch hydration.
  const [defaultCountry] = React.useState(detectCountry);

  return (
    <div className="w-full">
      <PhoneInput
        id={id}
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange as (value?: string) => void}
        inputComponent={PhoneInputField}
        placeholder={placeholder}
        countrySelectProps={{ "aria-label": "Country code" }}
        className={cn(
          "flex items-center w-full h-11 px-4 gap-2 rounded-md transition-all duration-200",
          // Country picker: themed through the library's own variables (its style.css sets these properties),
          // plus the divider and flag corners it doesn't style.
          "[--PhoneInputCountrySelect-marginRight:4px] [--PhoneInputCountrySelectArrow-marginLeft:2px] [--PhoneInputCountrySelectArrow-opacity:0.7] [--PhoneInputCountryFlag-height:14px] [--PhoneInputCountryFlag-aspectRatio:calc(20/14)]",
          "[&_.PhoneInputCountry]:gap-1.5 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-border [&_.PhoneInputCountry]:pr-2.5 [&_.PhoneInputCountryIcon]:overflow-hidden [&_.PhoneInputCountryIcon]:rounded-[2px] [&_.PhoneInputCountrySelectArrow]:text-subtle",
          "bg-elevated border border-border-strong",
          "hover:border-accent/40",
          "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25",
          error && "border-error ring-2 ring-error/25",
          className,
        )}
      />
    </div>
  );
}
