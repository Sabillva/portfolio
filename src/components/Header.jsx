import ArrowRight from "../assets/right-arrow.svg";
import Logo from "../assets/logo.svg";
import MenuIcon from "../assets/menu.svg";

function Header() {
  return (
    <header className="headerr">
      <div className="header-text">
        <p></p>
        <div className="header">
          <p>Get started for free</p>
          <img className="right-arrow" src={ArrowRight} alt="right arrow" />
        </div>
      </div>
      <div className="navbar">
        <div className="container">
          <div className="navbarr">
            <img className="logo" src={Logo} alt="logo" />
            <img className="menu" src={MenuIcon} alt="menu" />
            <nav className="nav-links">
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Customers</a>
              <a href="#">Updates</a>
              <a href="#">Help</a>
              <button>Get for free</button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
