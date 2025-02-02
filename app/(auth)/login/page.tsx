// app/(auth)/login/page.tsx | The front page - A page for logging in to the application
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import Image from "next/image";
import Logo from "@/components/ui/Logo";
import LanguageToggleTransition from "@/components/themes_and_language/LanguageToggleTransition";
import MetronomeLoader from "@/components/loaders/MetronomeLoader";
import PulseLoader from "@/components/loaders/PulseLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check the session status and redirect if the user is already authenticated, else stop loading
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      router.push("/home");
    } else {
      setLoading(false);
    }
  }, [status, router]);

  // Function to handle the form submission (logging in)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/home"); // Redirect to the home page if the login is successful
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the session is still loading, return a loading animation
  if (loading) {
    return <PulseLoader />;
  }

  return (
    <PageWrapper>
      <div className="flex flex-1 items-center justify-center p-4">
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
                <div className="flex-none h-16 py-4">
                  <Logo />
                </div>

                <div className="flex-grow flex flex-col justify-center">
                  <div className="w-full max-w-md mx-auto space-y-6 px-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                        <LanguageToggleTransition
                          en="Welcome Back!"
                          da="Velkommen tilbage!"
                        />
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <LanguageToggleTransition
                          en="To start using our platform, please login with your account information."
                          da="For at begynde at bruge vores platform, skal du logge ind med dine kontoinformationer."
                        />
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          <LanguageToggleTransition
                            en="Email"
                            da="E-mail"
                          />
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent dark:text-white dark:border-[#4d4d4d] dark:bg-[#212121] dark:focus:ring-[#fb923c]"
                            placeholder="e.g. clarity@gmail.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            <LanguageToggleTransition
                              en="Password"
                              da="Adgangskode"
                            />
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent dark:text-white dark:border-[#4d4d4d] dark:bg-[#212121] dark:focus:ring-[#fb923c]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            >
                              {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center sm:justify-end xs:justify-center">
                        <button
                          type="button"
                          onClick={() => router.push("/forgot-password")}
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#5953e1] dark:hover:text-[#f59f0b] transition-colors"
                        >
                          <LanguageToggleTransition
                            en="Forgot password?"
                            da="Glemt adgangskode?"
                          />
                        </button>
                      </div>

                      {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:flex-1 h-10 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5953e1] transition-colors dark:bg-[#fb923c] dark:hover:bg-[#f59f0b] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <MetronomeLoader size={24} color="white" speed={1.25} />
                          ) : (
                            <LanguageToggleTransition
                              en="Login"
                              da="Log ind"
                            />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push("/signup")}
                          disabled={isSubmitting}
                          className="w-full sm:flex-1 h-10 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors dark:text-white dark:border-[#4d4d4d] dark:bg-[#212121] dark:hover:bg-[#333333] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <LanguageToggleTransition
                            en="Create Account"
                            da="Opret konto"
                          />
                        </button>
                      </div>
                    </form>
                  </div>
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

export default LoginPage;