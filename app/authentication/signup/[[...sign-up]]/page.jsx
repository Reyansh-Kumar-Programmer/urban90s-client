// app/authentication/signup.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp path="/authentication/signup" routing="path" signInUrl="/authentication/signup" />
    </div>
  );
}
