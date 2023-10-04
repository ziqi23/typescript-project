import jwt from 'json-web-token'
import Header from "../../SplashPage/Header/Header";
import "./UserProfile.css"
import { useEffect, useState } from 'react';
import { validateCurrentUser } from '../../../store/session';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { AiOutlineDownload } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';

function UserProfile() {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [updatePhoto, setUpdatePhoto] = useState(false);
    const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
    const user = useAppSelector(state => state.session.data);
    const dispatch = useAppDispatch();
    const history = useHistory();
    // const getAlerts = async () => {
    //     // const res = await fetch(`/api/alerts/${1}`);
    //     const data = await res.json();
    //     console.log(data);
    // }

    // useEffect(() => {
    //     getAlerts();
    // })
    // useEffect(() => {
    //     const token = localStorage.getItem('jwtToken')
    //     console.log(token)
    //     dispatch(validateCurrentUser(token)).unwrap().catch(err => history.push('/'));
    // }, [])

    async function handlePanelClick(e : any) {
        e.preventDefault();
        setUploadPanelOpen(!uploadPanelOpen);
      }

    function handleDrag(e : any) {
        e.preventDefault();
        e.stopPropagation();
        const box = document.getElementsByClassName(
          "profile-picture-upload-panel"
        )[0];
        switch (e.type) {
          case "dragover":
            box.classList.add("drag-highlight");
            break;
          case "dragenter":
            box.classList.add("drag-highlight");
            break;
          case "drop":
            box.classList.remove("drag-highlight");
            // setPhotoFile(e.dataTransfer.files[0]);
            // const formData = new FormData();
            // formData.append("image", e.dataTransfer.files[0]);
            // setUploadPanelOpen(false);
            // dispatch(uploadImage(formData));
            break;
          case "dragleave":
            box.classList.remove("drag-highlight");
            break;
          default:
            break;
        }
      }

    //   function handleSubmit(e) {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("image", photoFile);
    //     setUploadPanelOpen(false);
    //     dispatch(uploadImage(formData));
    //   }

    return (
        <>
            <Header />
            <div className='flex absolute top-20'>
                <div className='user-profile-left'>
                    <div
                        className="profile-page-picture"
                        onMouseEnter={() => setUpdatePhoto(true)}
                        onMouseLeave={() => setUpdatePhoto(false)}
                    >
                        <img
                        className="profile-page-picture-file"
                        src="#"
                        alt="profile-avatar"
                        />
                        {updatePhoto && (
                        <div
                            className="profile-page-upload-panel-toggle"
                            onClick={handlePanelClick}
                        >
                            <h1>Update Picture</h1>
                        </div>
                        )}

                        {uploadPanelOpen && (
                        <div
                            className="profile-picture-upload-panel"
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrag}
                            onDragLeave={handleDrag}
                        >
                            <AiOutlineDownload className="profile-picture-dropbox-icon" />
                            <h1>Upload a new profile photo, or simply drag and drop.</h1>
                            {/* <form id="profile-picture-upload-form" onSubmit={handleSubmit}>
                            <input
                                accept="image/*"
                                type="file"
                                name="uploaded_file"
                                onChange={(e) => setPhotoFile(e.target.files[0])}
                            ></input>
                            <input type="submit"></input>
                            </form> */}
                        </div>
                        )}
                    </div>
                    <div className="profile-page-user-details">
                        <div>
                        <h1>
                            {/* User {user?.credential} */}
                        </h1>
                        </div>
                    </div>
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