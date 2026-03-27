import { Link } from "react-router";
import { Cloud } from "../components/Mascots";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-4">
      <div className="text-center">
        <Cloud className="w-32 h-32 mx-auto mb-6" />
        <h1 className="text-[#4A4238] text-4xl mb-4">404</h1>
        <p className="text-[#8a8378] mb-8">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-[#F5C71A] text-[#4A4238] rounded-full hover:bg-[#F5C71A]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
