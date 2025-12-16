import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 sm:px-6">
      <div className="w-full max-w-md bg-[#2E2E2E] rounded-xl p-6 sm:p-8 shadow-lg">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img
            src={logo}
            alt="Lovely Prints"
            className="w-16 sm:w-20 drop-shadow-[0_0_12px_rgba(245,130,32,0.7)] animate-pulse"
          />
        </div>

        <h2 className="text-center text-xl sm:text-2xl font-bold text-[#F58220]">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-300 mt-1">
          Login to access digital print services
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <button
            type="button"
            onClick={() => navigate("/student")}
            className="w-full py-3 bg-[#F58220] hover:bg-[#C65A00] text-white font-semibold rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#FFBF8A] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
