// import Icon from "../Homepage/Icon"
import { useState } from "react"
import { useAppDispatch } from "../../store/hooks"
import { useHistory } from "react-router-dom"
import { registerUser } from "../../store/session"
import Header from "../SplashPage/Header/Header"
import './signup.css'
// import { useDispatch } from "react-redux"
// import { login, signUpUser } from "../../store/session"
// import { csrfFetch } from "../../store/csrf"
// import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [signUpErrors, setSignUpErrors] = useState([''])
    const dispatch = useAppDispatch();
    const history = useHistory();

    async function handleSubmit(e : any) {
        e.preventDefault()

        dispatch(registerUser({username, email, password}))
            .then(() => history.push('/profile'))
            .catch(async (res) => {
                let data;
                try {
                    data = await res.clone().json()
                } catch {
                    data = await res.text()
                }
                if (data?.errors) setSignUpErrors(data.errors)
                else if (data) setSignUpErrors([data])
                else setSignUpErrors([res.statusText])
        })            
    }

    return (
        <>
            <Header />
            <div className="login-main">
                <div className="login-field">
                    <h1>Sign up</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <label>Email</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <ul>
                            {signUpErrors.map((error, idx) => <div key={idx} className="error-message">{error}</div>)}
                        </ul>
                        <input type="submit" id="login-submit" value="Continue with password"></input>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup