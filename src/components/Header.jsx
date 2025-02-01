import ArrowRight from "../assets/right-arrow.svg";
import Logo from "../assets/logo.svg";
import MenuIcon from "../assets/menu.svg";

const navLinks = [
  {label: "Home", href: "#"},
  {label: "Features", href: "#features"},
  {label: "About", href: "#about"},
  {label: "Pricing", href: "#pricing"},
  {label: "Contact", href: "#contact"},
];

function Header() {
  return (
    <header className="headerr">
      {/* <div className="header-text">
        <p className="top-text">Streamline your workflow and boost your productivity</p>
        <div className="header">
          <p>Get started for free</p>
          <img className="right-arrow" src={ArrowRight} alt="right arrow" />
        </div>
      </div> */}

        <div className="container">
          <div className="navbarr">
          <div className="nav-item">
          <img className="logo" src={Logo} alt="logo" />
          </div>
          <div className="div-navlink">
            <nav className="navlink">
              {navLinks.map(link => (
                <a href={link.href} key={link.label}>{link.label}</a>
              ))}
            </nav>
          </div>
          <div className="nav-item-2">
           <img className="menu" src={MenuIcon} alt="menu" />
           <button className="login">Log In</button>
           <button className="signup">Sign Up</button>
           </div>
          </div>

        </div>
    </header>
  );
}

export default Header;
