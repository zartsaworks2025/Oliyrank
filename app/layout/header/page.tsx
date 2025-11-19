import Navbar from "./navbar"

export default function Header(){
    return (
        <header className="header">
            <div className="container">
                <div className="header-wrap">
                    <div className="header-logo">
                        <a href="/">
                            OliyRank
                        </a>
                    </div>

                    <Navbar />

                    <div className="header-button">
                        <button className="header-signin-btn">
                            Sign In
                        </button>
                        <button className="header-signup-btn">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}