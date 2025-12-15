import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

export default function Signup() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md bg-[#2E2E2E] rounded-xl p-8 shadow-lg">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Lovely Prints"
            className="w-20 drop-shadow-[0_0_12px_rgba(245,130,32,0.7)] animate-pulse"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-[#F58220]">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-300 mt-1">
          Register using your campus details
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <input
            type="email"
            placeholder="Campus Email"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <input
            type="text"
            placeholder="Student ID"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <button
            type="button"
            onClick={() => navigate("/student/StudentDashboard")}
            className="w-full py-3 bg-[#F58220] hover:bg-[#C65A00] text-white font-semibold rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#FFBF8A] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
