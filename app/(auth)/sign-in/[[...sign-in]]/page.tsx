import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignInPage() {
  const isClerkSet =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-50">
      <div className="mb-6 flex items-center gap-2 font-bold text-xl text-slate-900">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <span>CareerGrowth<span className="text-indigo-600">.AI</span></span>
      </div>

      {isClerkSet ? (
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Developer / Demo Mode Active</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clerk API keys are not yet configured. You can explore the full application using the built-in isolated test profile.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-200"
          >
            Enter Dashboard as Demo User
          </Link>
        </div>
      )}
    </div>
  );
}
