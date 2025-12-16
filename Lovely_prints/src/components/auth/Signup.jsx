import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

export default function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState("student") // default

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
          Register as a student or shopkeeper
        </p>

        {/* Role Selection */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`w-1/2 py-2 rounded-md font-semibold transition ${
              role === "student"
                ? "bg-[#F58220] text-white"
                : "bg-[#121212] text-gray-300"
            }`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("shop")}
            className={`w-1/2 py-2 rounded-md font-semibold transition ${
              role === "shop"
                ? "bg-[#F58220] text-white"
                : "bg-[#121212] text-gray-300"
            }`}
          >
            Shopkeeper
          </button>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          {/* Student-only field */}
          {role === "student" && (
            <input
              type="text"
              placeholder="Student ID"
              className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
            />
          )}

          {/* Shopkeeper-only field */}
          {role === "shop" && (
            <input
              type="text"
              placeholder="Shop Name / Block Number"
              className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-[#121212] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F58220]"
          />

          {/* Submit */}
          <button
            type="button"
            onClick={() =>
              role === "student"
                ? navigate("/student")
                : navigate("/shop")
            }
            className="w-full py-3 bg-[#F58220] hover:bg-[#C65A00] text-white font-semibold rounded-md transition"
          >
            Sign Up as {role === "student" ? "Student" : "Shopkeeper"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FFBF8A] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
