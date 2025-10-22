import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav id="nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/clienti">Clienti</Link>
        </li>
        <li>
          <Link to="/conti">Conti</Link>
        </li>
        <li>
          <Link to="/transazioni">Transazioni</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
