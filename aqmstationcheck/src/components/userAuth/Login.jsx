import React, { useState } from 'react';
import { getEmailQuery } from '../../utils/queries';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { userQuery } from '../../utils/queries';
import wspIcon from '../assets/wspIcon.jpg';
import { client } from '../../client';
import bcrypt from 'bcryptjs';
import { notifyError, infoToast } from '../../utils/notifications';

function Login({ setUser, newUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const type = show ? "text" : "password";
    const buttonType = show ? <FaEye /> : <FaEyeSlash />;
    const navigate = useNavigate();

    const getSelectedUser = (userId) => {
        const query = userQuery(userId);
        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }

    const encryptPasswprd = (userData, password) => {
        bcrypt.compare(password, userData[0]?.password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            else if (!isMatch) {
                notifyError(`Password doesn't match! Check password`);
            }
            else {
                localStorage.setItem('UserId', userData[0]?._id);
                getSelectedUser(userData[0]?._id)
                navigate('/')
            }
        })
    }

    const loginUser = async (e) => {

        e.preventDefault();
        if (!email || !password) {
            notifyError('Enter email and password!');
        }
        else {
            const findEmail = getEmailQuery(email);
            const userData = await client.fetch(findEmail);
            if (userData.length === 0) {
                notifyError('Cannot find entered email!');
            }
            else {
                if (newUser) {
                    if (newUser?._id === userData[0]?._id) {
                        encryptPasswprd(userData, password)
                    }
                    else {
                        infoToast("User info is saving into the system, try later...")
                    }
                }
                else {
                    encryptPasswprd(userData, password)
                }
            }
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className='innerLogin'>
                <div className='loginTitle'>Log i n </div>
                <img src={wspIcon} alt="icon" />
                <form className='loginForm'>
                    <label htmlFor="email"> Email </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        type="email"
                        name="email"
                        required
                    />
                    <label htmlFor="email"> Password </label>
                    <div className='loginPassword'>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            type={type}
                            name="password"
                            required
                        />
                        <span onClick={() => setShow(!show)}>{buttonType}</span>
                    </div>

                    <button onClick={(e) => loginUser(e)} >Login</button>
                    <Link className='signUpBtn' to="/signUp">Sign Up</Link>
                </form>
            </div>
        </div>
    )
}
export default Login;









