import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  marginRight: "8px",
  borderRadius: "8px",
  textDecoration: "none",
  color: isActive ? "white" : "#0f172a",
  background: isActive ? "#0ea5e9" : "#e2e8f0",
  fontWeight: 600,
});

export default function Navbar() {
  return (
    <nav style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
      <NavLink to="/" style={linkStyle} end>
        홈
      </NavLink>
      <NavLink to="/map" style={linkStyle}>
        지도
      </NavLink>
      <NavLink to="/favorites" style={linkStyle}>
        즐겨찾기
      </NavLink>
    </nav>
  );
}
