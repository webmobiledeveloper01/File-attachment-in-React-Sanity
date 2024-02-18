import React, { useState } from 'react';
import Spinner from './Spinner';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import './UserProfile.css';
import { LogoutOutlined, CloseOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { userQuery } from '../utils/queries';
import { client } from '../client';
import { imageUploader } from '../utils/helperFunctions';
import { notifySuccess } from '../utils/notifications';
import { ToastContainer } from 'react-toastify';
import DropFile from './DropFile';

function UserProfile() {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const [updateImg, setUpdateImg] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sops, setSOPs] = useState(true);
    const [manuals, setManuals] = useState(false);

    const visibleSops = () => {
        setSOPs(true);
        setManuals(false);
    }

    const visibleMenuals = () => {
        setSOPs(false);
        setManuals(true);
    }


    const updateImageFun = (e) => {
        e.preventDefault();
        if (userId) {
            if (newImage) {
                client.patch(userId).set(({
                    image: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: newImage?._id
                        }
                    },
                }))
                    .commit()
                    .then(notifySuccess('Image was updated! It might take some time until changes will be visible') && setTimeout(() => {
                        window.location.reload();
                    }, 3000))
                    .catch((err) => {
                        console.error(err.message)
                    })
            }
        }
    }

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query)
            .then((userData) => {
                setUser(userData);
            })
    }, [userId])
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    if (!user) {
        <Spinner message="loading" />
    }

    return (
        <div className='userComponent'>
            <LogoutOutlined
                className='logoutIcon'
                title='logout'
                onClick={logout}
            />
            <ToastContainer />
            <div className='imageBannerBox'>
                <div className='userInfo'>
                    <h1>{user && user[0]?.userName}</h1>
                    <h2>Status: {user && user[0]?.status}</h2>
                </div>
                <div className='userImg'>
                    {
                        updateImg === true ?
                            <div>
                                <CloseOutlined onClick={() => (setUpdateImg(false), setNewImage(null))} className='closeIcon' />
                                <p>Change Image</p>
                                {
                                    newImage ? (
                                        <div className='displayNewImg'>
                                            <img src={newImage?.url} alt='Uploaded image' />
                                            <DeleteOutlined
                                                onClick={() => setNewImage(null)}
                                                className='removeImg'
                                                title='Reset Image'
                                            />
                                        </div>
                                    )
                                        :
                                        <div className='imageUploade'>
                                            <AiOutlineCloudUpload className='uploaderIcon' />
                                            <input
                                                type='file'
                                                onChange={(e) => imageUploader(e, setNewImage, setIsLoading)}
                                            />

                                        </div>
                                }
                                <button disabled={isLoading === true} onClick={(e) => updateImageFun(e)}>{isLoading === true ? 'Loading..' : 'Save'}</button>
                            </div>
                            :
                            <img
                                src={user && user[0]?.image?.asset.url}
                                alt="user_image"
                                onClick={() => setUpdateImg(true)}
                                title='Change Image'
                            />
                    }

                </div>
            </div>
            <div className='userContent'>
                <div className='userBtns'>
                    <button onClick={() => visibleSops()} className={`${sops === true && 'selectedBtn'}`}>SOPs</button>
                    <button onClick={() => visibleMenuals()} className={`${manuals === true && 'selectedBtn'}`}>Manuals</button>
                </div>
            </div>

            {
                manuals === true && (
                    <div className='filesBox'>
                        <h3>All Manuals</h3>
                        <DropFile
                            type="manual" userId={userId}
                            userName={user && user[0]?.userName}
                        />
                    </div>
                )
            }
            {
                sops === true && (
                    <div className='filesBox'>
                        <h3>All SOPs</h3>
                        <DropFile
                            type="sop"
                            userId={userId}
                            userName={user && user[0]?.userName}
                        />
                    </div>
                )
            }


        </div>
    )
}

export default UserProfile