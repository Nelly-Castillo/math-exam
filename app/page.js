"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function HomePage() {
  const router = useRouter();
    useEffect(() => {
    router.push("/login"); 
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
      </div>
    </div>
  );
}


