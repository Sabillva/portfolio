
const text = " A fast selection for football enthusiasts, efficient management for field owners";

function Introduction() {
    return (
        <section className="intro-section">
            <div className="intro-container">
                <div className="main-intro-layer">
                <div className="intro-layer">Introducing Layers</div>
                </div>

                <div className="intro-span">
                    <span>We are making it digital and easy to find and book football fields in Azerbaijan.</span>
                    <span className="span-text">{text}</span>
                    <span className="span-other-text"> – providing a convenient solution for both sides!</span>
                </div>

            </div>
        </section>
    );
}

export default Introduction;