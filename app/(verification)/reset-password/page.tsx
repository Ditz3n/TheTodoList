// app/(verification)/reset-password/page.tsx | A page for resetting a user's password after receiving a reset link
"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import Logo from "@/components/ui/Logo";
import ContentTransition from "@/components/layouts/ContentTransition";
import MetronomeLoader from "@/components/loaders/MetronomeLoader";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const token = searchParams ? searchParams.get("token") : null;

  // Function to handle the form submission (resetting the password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "Adgangskoderne matcher ikke");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", { // The reset-password API route is used to reset the user's password (app/api/reset-password.ts)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, language }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(language === "en" ? "Password reset successful" : "Adgangskode blev nulstillet");
        setTimeout(() => router.push("/login"), 2000); // Redirect to the login page after 2 seconds
      } else {
        setError(data.error || (language === "en" ? "Failed to reset password" : "Kunne ikke nulstille adgangskoden"));
      }
    } catch {
      setError(language === "en" ? "An error occurred" : "Der opstod en fejl");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there is no token in the URL, show an error message (invalid reset link)
  if (!token) {
    return (
      <PageWrapper>
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="text-center text-gray-700 dark:text-gray-200">
            {language === "en" ? "Invalid reset link" : "Ugyldigt nulstillingslink"}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-1 items-center justify-center p-4 py-8">
        <div className="w-full max-w-[1024px] bg-white dark:bg-[#272727] rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 md:p-8 h-full">
            <div className="flex flex-col md:flex-row md:space-x-8 h-full">
              
              {/* Left side - Image */}
              <div className="w-full md:w-5/12 lg:w-1/2 flex items-center justify-center order-2 md:order-1">
                <div className="w-full max-w-[300px] lg:max-w-md hidden md:block">
                  <Image
                    src="/images/undraw_woman.svg"
                    alt="Woman standing among flowers illustration"
                    width={300}
                    height={300}
                    className="w-full h-auto block dark:hidden"
                  />
                  <Image
                    src="/images/undraw_woman_dark.svg"
                    alt="Woman standing among flowers illustration"
                    width={300}
                    height={300}
                    className="w-full h-auto hidden dark:block"
                  />
                </div>
              </div>

              {/* Right side - Form */}
              <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col order-1 md:order-2">
                {/* Top Section - Logo */}
                <div className="flex-none h-16 py-4">
                  <Logo />
                </div>

                {/* Center Section - Takes up all remaining space */}
                <div className="flex-grow flex flex-col justify-center">
                  <ContentTransition>
                    <div className="w-full max-w-md mx-auto space-y-6 px-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                          {language === "en" ? "Set New Password" : "Angiv ny adgangskode"}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === "en" 
                            ? "Please enter your new password below."
                            : "Indtast venligst din nye adgangskode nedenfor."}
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {language === "en" ? "New Password" : "Ny adgangskode"}
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:border-[#4d4d4d] dark:bg-[#212121] dark:focus:ring-[#fb923c]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {language === "en" ? "Confirm Password" : "Bekræft adgangskode"}
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:border-[#4d4d4d] dark:bg-[#212121] dark:focus:ring-[#fb923c]"
                            />
                          </div>

                          {error && (
                            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                          )}
                          {message && (
                            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full h-10 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5953e1] transition-colors dark:bg-[#fb923c] dark:hover:bg-[#f59f0b] flex items-center justify-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <MetronomeLoader size={24} color="white" speed={1.25} />
                          ) : (
                            language === "en" ? "Reset Password" : "Nulstil adgangskode"
                          )}
                        </button>
                      </form>
                    </div>
                  </ContentTransition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom spacer to help with centering */}
      <div className="flex-none h-16"></div>
    </PageWrapper>
  );
};

// Main page component
// useSearchParams() should be wrapped in a suspense boundary at page "/reset-password".
// This is because the searchParams object is used to get the token from the URL query parameters.
// That's why the ResetPasswordForm component is wrapped in a Suspense component.
const ResetPasswordPage = () => {
  return (
    <PageWrapper>
      <Suspense fallback={<MetronomeLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </PageWrapper>
  );
};

export default ResetPasswordPage;