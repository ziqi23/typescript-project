import jwt from 'json-web-token'
import Header from "../../SplashPage/Header/Header";
import "./UserProfile.css"
import { useEffect } from 'react';
import { validateCurrentUser } from '../../../store/session';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

function UserProfile() {
    const user = useAppSelector(state => state.session.data);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken')
        console.log(token)
        dispatch(validateCurrentUser(token));
    }, [])
    return (
        <>
            <Header />
            <div className='absolute top-20'>
                <div className='user-profile-left'>
                    User Details
                </div>
                <div className='user-profile-right'>
                    Alert 1 - Set up time, event details, price history, threshold price & sections
                    Notified / Not yet
                </div>
            </div>
        </>
    )
}

export default UserProfile;