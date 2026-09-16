"use client";
import { ErrorState } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <ErrorState message="Please try again." retry={reset} />;
}
