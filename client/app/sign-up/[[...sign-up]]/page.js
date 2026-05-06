import { SignUp } from "@clerk/nextjs";
import { GoWorkflow } from "react-icons/go";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <GoWorkflow className="text-white" size={18} />
        </div>
        <span className="font-mono font-bold text-xl tracking-tighter">0123</span>
      </div>
      <SignUp />
    </div>
  );
}
