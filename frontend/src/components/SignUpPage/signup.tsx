// import Icon from "../Homepage/Icon"
import { useState } from "react"
import { useAppDispatch } from "../../store/hooks"
import { useHistory } from "react-router-dom"
import { registerUser, startSession } from "../../store/session"
import Header from "../SplashPage/Header/Header"
import './signup.css'
// import { useDispatch } from "react-redux"
// import { login, signUpUser } from "../../store/session"
// import { csrfFetch } from "../../store/csrf"
// import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameErrors, setUsernameErrors] = useState('');
    const [emailErrors, setEmailErrors] = useState('');
    const [passwordErrors, setPasswordErrors] = useState('');
    const [serverErrors, setServerErrors] = useState('');
    const dispatch = useAppDispatch();
    const history = useHistory();

    function validateUsername(username : string) {
        if (username.length < 3 || username.length > 15) {
            return false;
        }
        return true;
    }

    function validateEmail(email : string) {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return true;
        }
        return false;
    }

    function validatePassword(password : string) {
        if (password.length < 6) {
            return false;
        }
        return true;
    }

    async function handleSubmit(e : any) {
        e.preventDefault()
        const validUsername = validateUsername(username);
        const validEmail = validateEmail(email);
        const validPassword = validatePassword(password);

        if (!validUsername) {
            setUsernameErrors('Username must be between 3-15 characters');
        }
        if (!validEmail) {
            setEmailErrors('Invalid email address');
        }
        if (!validPassword) {
            setPasswordErrors('Password must be at least 6 characters');

        }
        if (validUsername && validEmail && validPassword) {
            const res = dispatch(registerUser({username, email, password}))
            .unwrap()
            .then(() => {
                dispatch(startSession({credential: username, password})).then(() => {
                    history.push('/profile');
                })
            })
            .catch((err) => {
                setServerErrors(err.message);
                setUsernameErrors('');
                setEmailErrors('');
                setPasswordErrors('');
            })       
        }
    }

    return (
        <>
            <Header fill="bg-gray-900"/>
            <div className="login-main">
                <div className="login-field">
                    <h1>Sign up</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <ul>
                            {usernameErrors}
                        </ul>
                        <label>Email</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <ul>
                            {emailErrors}
                        </ul>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <ul>
                            {passwordErrors}
                        </ul>
                        <ul>
                            {serverErrors}
                        </ul>
                        <input type="submit" id="login-submit" value="Continue with password"></input>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup