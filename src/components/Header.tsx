import { Link } from "react-router-dom";
import logo from "../assets/ticket.png"
import "./Header.css"

function Header() {

    return (
        <div className="homepage-header">
            <div className="homepage-header-left">
                <Link to={"/"}>
                    <img src={logo}></img>
                </Link>
            </div>
            <div className="homepage-header-right">
                <div>Sign Up</div>
                <div>Log in</div>
            </div>
        </div>
    )
}

export default Header;