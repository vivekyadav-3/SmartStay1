import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-[0%] left-[0%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
        <SignIn routing="hash" signUpUrl="/register" fallbackRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
