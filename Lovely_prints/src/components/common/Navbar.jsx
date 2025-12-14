import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px" }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/student">Student</Link>
      <Link to="/shop">Shop</Link>
    </nav>
  )
}

export default Navbar
