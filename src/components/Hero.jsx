
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-h1">Find and Book Football Fields Easily</h1>
        <p className="hero-p">
          Easily search, compare, and book your favorite football fields with
          just a few clicks. Find the perfect pitch based on location,
          availability, price, and amenities – all in one place!
        </p>
        <form className="hero-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="hero-input"
          />
          <button className="hero-signup" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
