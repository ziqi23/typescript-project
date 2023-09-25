import './login.css'
import { useState } from "react"
import { useAppDispatch } from "../../store/hooks"
import { startSession } from "../../store/session"
import { useHistory } from 'react-router-dom'
const Login = () => {
    const [credential, setCredential] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([''])
    const dispatch = useAppDispatch();
    const history = useHistory();

    async function handleSubmit(e : any) {
        e.preventDefault()
        dispatch(startSession({credential, password}))
            .then(() => history.push('/profile'))
            .catch(async (res) => {
                let data;
                try {
                    data = await res.clone().json()
                } catch {
                    data = await res.text()
                }
                if (data?.errors) setErrors(data.errors)
                else if (data) setErrors([data])
                else setErrors([res.statusText])
            })
    }

    return (
        <>
            <div className="homepage-header">
                <div className="homepage-header-inner">
                    <div className="homepage-nav-bar">
                        <div className="homepage-icon" style={{marginLeft: '15px'}}>
                        </div>
                    </div>
                </div>
            </div>
            <div className="login-main">
                <div className="login-field">
                    <h1>Log in</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Username or Email</label>
                        <input type="text" value={credential} onChange={(e) => setCredential(e.target.value)}></input>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <ul>
                            {errors.map((error, idx) => <div key={idx} className="error-message">{error}</div>)}
                        </ul>
                        <input type="submit" id="login-submit" value="Continue with password"></input>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login