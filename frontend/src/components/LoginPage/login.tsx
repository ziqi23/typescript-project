import './login.css'
import { useState } from "react"
import { useAppDispatch } from "../../store/hooks"
import { startSession } from "../../store/session"
import { useHistory } from 'react-router-dom'
import Header from '../SplashPage/Header/Header'
const Login = () => {
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')
    const dispatch = useAppDispatch();
    const history = useHistory();

    async function handleSubmit(e : any) {
        e.preventDefault()
        dispatch(startSession({credential, password}))
        .then(() => {
            history.push('/profile');
        })
        .catch((err) => {
            setErrors('Invalid credentials');
        })
    }

    return (
        <>
            <Header fill="bg-gray-900"/>
            <div className="login-main">
                <div className="login-field">
                    <h1>Log in</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Username or Email</label>
                        <input type="text" value={credential} onChange={(e) => setCredential(e.target.value)}></input>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <ul>
                            {errors}
                        </ul>
                        <input type="submit" id="login-submit" value="Continue with password"></input>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login