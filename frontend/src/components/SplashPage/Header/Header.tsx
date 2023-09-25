import { Link } from "react-router-dom";
import logo from "../../../assets/ticket.png"
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
                <div>
                    <Link to={"/signup"}>
                        Sign Up
                    </Link>
                </div>
                <div>
                    <Link to={"/login"}>
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;