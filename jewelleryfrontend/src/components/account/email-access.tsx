"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Mail,
  Heart,
  CheckCircle2,
  User,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Use an email address shorter than 255 characters.")
    .email("Enter a valid email address, such as you@example.com."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(128, "Keep your password within 128 characters."),
});

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your name (at least 2 characters).")
      .max(100, "Keep your name within 100 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email address.")
      .max(254, "Use an email address shorter than 255 characters.")
      .email("Enter a valid email address, such as you@example.com."),
    password: z
      .string()
      .min(8, "Use at least 8 characters for your password.")
      .max(128, "Keep your password within 128 characters.")
      .refine(
        (value) => value.trim().length > 0,
        "Your password cannot contain only spaces.",
      ),
    confirmPassword: z
      .string()
      .min(1, "Please re-enter your password to confirm."),
    consent: z
      .boolean()
      .refine(
        (value) => value,
        "Please accept the terms and privacy policy to continue.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  consent?: boolean;
};

export function EmailAccess({ mode }: { mode: "signup" | "login" }) {
  const signup = mode === "signup";
  const [reviewEmail, setReviewEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(signup ? signupSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      consent: false,
    },
  });

  return (
    <main id="main" className="container page-shell access-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{signup ? "Create an account" : "Log in"}</span>
      </nav>
      <div className="access-layout">
        <div className="access-story">
          <div className="access-photo">
            <Image
              src="/images/necklace.webp"
              alt="Handcrafted pearl and kundan jewellery"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div className="access-story-copy">
            <span className="eyebrow">JEWELLERY &amp; YOU</span>
            <h2>A little more personal.</h2>
            <p>Your favourite pieces. Your everyday moments.</p>
            <span className="access-benefit">
              <Heart size={18} aria-hidden="true" /> Keep your favourites close
            </span>
          </div>
        </div>
        <section className="access-form-panel" aria-labelledby="access-heading">
          <span className="eyebrow">THE INDIAN JEWELLERY CIRCLE</span>
          <h1 id="access-heading">
            {signup ? "Create your account" : "Welcome back"}
          </h1>
          <p>
            {signup
              ? "Enter your name, email and password to get started."
              : "Enter your email and password to access your account."}
          </p>
          {reviewEmail ? (
            <div className="access-review" role="status">
              <CheckCircle2 size={28} aria-hidden="true" />
              <h2>{signup ? "Your account is ready" : "Welcome back"}</h2>
              <strong>{reviewEmail}</strong>
              <p>
                This preview has verified your{" "}
                {signup ? "account details" : "credentials"}. Live authentication
                and account {signup ? "creation" : "sign-in"} are currently in preview mode.
              </p>
              <button
                type="button"
                className="button secondary full"
                onClick={() => setReviewEmail("")}
              >
                {signup ? "Edit details" : "Back to login"}
              </button>
              <Link href="/collections" className="button full">
                Continue shopping <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit((values) => {
                setReviewEmail(values.email.toLowerCase());
                resetField("password");
                resetField("confirmPassword");
                setShowPassword(false);
                setShowConfirmPassword(false);
              })}
            >
              {signup && (
                <div className="access-field">
                  <label className="access-email-label" htmlFor="access-name">
                    Full name
                  </label>
                  <div className="access-email">
                    <User size={18} aria-hidden="true" />
                    <input
                      id="access-name"
                      autoComplete="name"
                      placeholder="Your full name"
                      maxLength={100}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "access-name-error" : undefined
                      }
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p
                      id="access-name-error"
                      className="form-error"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div className="access-field">
                <label className="access-email-label" htmlFor="access-email">
                  Email address
                </label>
                <div className="access-email">
                  <Mail size={18} aria-hidden="true" />
                  <input
                    id="access-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@example.com"
                    maxLength={254}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "access-email-error" : "access-email-help"
                    }
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p id="access-email-error" className="form-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
                <p id="access-email-help" className="access-help">
                  Use an email address you can access.
                </p>
              </div>

              <div className="access-field access-password-field">
                <div className="access-password-label-row">
                  <label
                    className="access-email-label"
                    htmlFor="access-password"
                  >
                    Password
                  </label>
                  {!signup && (
                    <Link href="/help/contact" className="access-forgot-link">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="access-email access-password">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    id="access-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    placeholder={signup ? "Create a password" : "Enter your password"}
                    maxLength={128}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password
                        ? "access-password-error access-password-help"
                        : "access-password-help"
                    }
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="access-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="access-password"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signup && (
                  <p id="access-password-help" className="access-help">
                    Use at least 8 characters. Your password is not saved in
                    this preview.
                  </p>
                )}
                {errors.password && (
                  <p
                    id="access-password-error"
                    className="form-error"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {signup && (
                <div className="access-field access-password-field">
                  <label
                    className="access-email-label"
                    htmlFor="access-confirm-password"
                  >
                    Re-enter password
                  </label>
                  <div className="access-email access-password">
                    <LockKeyhole size={18} aria-hidden="true" />
                    <input
                      id="access-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      maxLength={128}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "access-confirm-password-error"
                          : undefined
                      }
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="access-password-toggle"
                      aria-label={
                        showConfirmPassword
                          ? "Hide re-entered password"
                          : "Show re-entered password"
                      }
                      aria-controls="access-confirm-password"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="access-confirm-password-error"
                      className="form-error"
                      role="alert"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              {signup && (
                <div className="access-consent">
                  <input
                    id="access-consent"
                    type="checkbox"
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? "access-consent-error" : undefined
                    }
                    {...register("consent")}
                  />
                  <label htmlFor="access-consent">
                    I agree to the <Link href="/help/terms">Terms</Link> and{" "}
                    <Link href="/help/privacy">Privacy Policy</Link>.
                  </label>
                </div>
              )}
              {errors.consent && (
                <p
                  id="access-consent-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.consent.message}
                </p>
              )}

              <button
                type="submit"
                className="button full"
                disabled={isSubmitting}
              >
                {signup ? "Create account" : "Log in"}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="access-preview">
                Account preview: email verification and database auth will be
                available when the live store launches.
              </p>
            </form>
          )}
          <p className="access-switch">
            {signup ? "Already have an account?" : "New to Indian Jewellery?"}{" "}
            <Link href={signup ? "/login" : "/signup"}>
              {signup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
