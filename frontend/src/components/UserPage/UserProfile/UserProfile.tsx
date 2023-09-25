import jwt from 'json-web-token'
import Header from "../../SplashPage/Header/Header";
import "./UserProfile.css"
import { useEffect } from 'react';
import { validateCurrentUser } from '../../../store/session';
import { useAppDispatch } from '../../../store/hooks';

function UserProfile() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken')
        console.log(token)
        dispatch(validateCurrentUser(token));
    }, [])
    return (
        <>
            <Header />
            <div>
                User Details
            </div>
            <div>
                Alert 1 - Set up time, event details, price history, threshold price & sections
                Notified / Not yet
            </div>
        </>
    )
}

export default UserProfile;