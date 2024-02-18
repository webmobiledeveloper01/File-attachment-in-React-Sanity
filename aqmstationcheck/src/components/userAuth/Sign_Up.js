import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./sign_up.css";
import { ToastContainer } from 'react-toastify';
import { getUsersEmailQuery } from '../../utils/queries';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { uploadImageFunc } from '../../utils/helperFunctions';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { DeleteOutlined } from '@ant-design/icons';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { client } from '../../client';
import Spinner from '../Spinner'
import { notifyError, notifySuccess } from '../../utils/notifications';
import emailjs from '@emailjs/browser'


const Sign_Up =({setNewUser}) => {

    const navigate = useNavigate();
    const ref =useRef();
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [wrongType, setWrongType] = useState(false);
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [systemPass, setSystemPass] = useState("");
    const passForAuth = process.env.REACT_APP_AUTH_PASSWORD;
    const [show, setShow] = useState(false);
    const type = show ? "text" : "password";
    const buttonType = show ? <FaEye /> : <FaEyeSlash />;

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_wuqxioj', 'template_p31e4f8', ref.current, '0lCv8iZyK1pEp-5YF')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

    }

    const signUpUser = (e) => {
        e.preventDefault();
        if (!userName) {
            notifyError('Enter your name!');
        }
        else if (!userPassword) {
            notifyError('Create password!');
        }
        else if (!userEmail) {
            notifyError('Enter email address!');
        }
        else if (!systemPass) {
            notifyError('Enter organization password!');
        }
        else if (userImage == null) {
            notifyError('Select image!');
        }
        else {
            let checkEmail = validator.isEmail(userEmail);
            if (checkEmail === true) {
                const hashedPassword = bcrypt.hashSync(userPassword, 10);
                let machedEmail = allUsers.find(value => value.email === userEmail);
                if (machedEmail) {
                    notifyError('This email address is already in system! Try a new one or login');
                }
                else if (systemPass !== passForAuth) {
                    notifyError('Organization password is not correct, try again or contact your supervisor');
                }
                else {
                    const userObj = {
                        _type: 'user',
                        userName: userName,
                        image: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: userImage?._id
                            }
                        },
                        email: userEmail,
                        password: hashedPassword,
                        status: 'user'
                    };
                    sendEmail(e);
                    client.create(userObj)
                        .then((promise) => {
                            setNewUser(promise)
                            notifySuccess('User has been created! It may take some time until user becomes visible in the system');
                            sendEmail(e);
                            setTimeout(() => {
                                navigate('/login')
                            }, 6000)
                        })
                        .catch((err) => {
                            notifyError(err);
                        })
                }
            }
            else {
                notifyError('Email is not valid! Make sure to use the right format');
            }
        }
    }
    

    useEffect(() => {
        const query = getUsersEmailQuery();
        client.fetch(query)
            .then((data) => {
                setAllUsers(data);
            })
    }, []);

  return (
    <form ref={ref} className='user-form'>
        <ToastContainer />
        <div className='image-section'>
        {
            wrongType === true &&
            <p>Incorrect image type! Use png, svg, jpeg, gif, tiff</p>
        }
        {
            loading && <Spinner message="image loading.."/>
        }
        {
            !userImage && !loading &&
            <label className='userImgUploader'>
                <div className='imageUploadBtn'>
                    <AiOutlineCloudUpload />
                    <p>Select Image</p>
                </div>
                <input
                    required
                    type='file'
                    onChange={(e) => uploadImageFunc(e, setWrongType, setLoading, setUserImage)}
                    className='inputUploader'
                    name='user-image-uploader'
                />
            </label>
        }
        {
            userImage && 
            <div className='display-user-img'>
                <img
                    src={userImage?.url}
                    alt='user-image'
                />
                <DeleteOutlined 
                    className='reset-user-image'
                    onClick={() => setUserImage(null)}
                />
            </div>
        }
        </div>
    <label htmlFor="name">Full Name</label>
    <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder='Full Name'
        type="text"
        name="name"
        required
        maxLength={70}
    />

    <label htmlFor="email"> Email </label>
        <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder='Email'
            type="email"
            name="email"
            maxLength={70}
            required
        />
         <label htmlFor="password"> Password </label>
        <div className='password-section'>
        <input
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder='Password'
            type={type}
            maxLength={50}
            name="password"
            required
        />
         <span onClick={() => setShow(!show)}>{buttonType}</span>
        </div>
         <label htmlFor="organization password"> Organization Password </label>
        <input
            value={systemPass}
            onChange={(e) => setSystemPass(e.target.value)}
            placeholder='Organization Password'
            type="text"
            name='organization password'
            maxLength={50}
            required
        />
        <div className='button-section'>
            <button onClick={(e) => signUpUser(e)} type="submit" value="Send">Submit</button>
            <Link to='/login'> Already have account? </Link>
        </div>
        
    </form>
  )
}

export default Sign_Up;
