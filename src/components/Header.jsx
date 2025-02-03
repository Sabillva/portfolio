import ArrowRight from "../assets/right-arrow.svg";
import Logo from "../assets/logo.svg";
import MenuIcon from "../assets/menu.svg";
import { motion } from "framer-motion";


const navLinks = [
  {label: "Home", href: "#"},
  {label: "Features", href: "#features"},
  {label: "About", href: "#about"},
  {label: "Pricing", href: "#pricing"},
  {label: "Contact", href: "#contact"},
];

const boxVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

function Header() {
  return (
    <header className="headerr">
      <div className="header-text">
        <p className="top-text">Streamline your booking experience and enjoy hassle-free football matches</p>
        <div className="header">
          <p>Get started for free</p>
          <img className="right-arrow" src={ArrowRight} alt="right arrow" />
        </div>
      </div>

        <div className="container">
          <motion.div  initial="hidden" animate="visible" variants={boxVariants} className="navbarr">
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
           <motion.button whileHover={{ scale: 0.95 }}
  whileTap={{ scale: 0.9 }}
  transition={{ duration: 0.3 }} className="login">Log In</motion.button>
           <motion.button whileHover={{ scale: 0.95 }}
  whileTap={{ scale: 0.9 }}
  transition={{ duration: 0.3 }} className="signup">Sign Up</motion.button>
           </div>
          </motion.div>



        </div>
    </header>
  );
}

export default Header;
