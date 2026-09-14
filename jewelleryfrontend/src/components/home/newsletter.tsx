"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
const schema = z.object({
  email: z.email("Please enter a valid email address."),
});
export function Newsletter() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <span className="eyebrow">SOMETHING BEAUTIFUL IS ALWAYS COMING</span>
          <h2>Join the Indian Jewellery Circle</h2>
          <p>New launches, little luxuries and inspiration, just for you.</p>
        </div>
        <form onSubmit={handleSubmit(() => setDone(true))} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="newsletter-input">
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <button type="submit" aria-label="Subscribe">
              Subscribe <ArrowRight size={17} />
            </button>
          </div>
          {errors.email && <p role="alert">{errors.email.message}</p>}
          {done && (
            <p role="status">
              Thank you for your interest. Subscriptions will open when our
              store launches.
            </p>
          )}
          <small>By subscribing, you agree to our privacy policy.</small>
        </form>
      </div>
    </section>
  );
}
