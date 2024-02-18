import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';
import { HomeOutlined, PlusOutlined, SecurityScanOutlined, LoadingOutlined, MenuOutlined, UpOutlined } from '@ant-design/icons';
import wspIcon from '../assets/userImage.png';
import { useState } from 'react';

function NavBar({ user }) {
    const userId = localStorage.getItem('UserId');
    const [openMenue, setOpenMenue] = useState(false);

    if (!user) {
        return <div><LoadingOutlined style={{ fontSize: '25px', marginTop: '10px' }} /></div>
    }

    return (
        <div className='navBox'>
            <MenuOutlined className={openMenue === false ? 'mobileMenueIcon' : 'hide'} onClick={() => setOpenMenue(true)} />
            <ul className={openMenue === false ? 'navigation' : 'navigation show'}>
                <li className='nav_list'>
                    <span className='front'><HomeOutlined style={{ fontSize: '20px' }} /></span>
                    <Link to="/" className='side'>Home</Link>
                </li>
                <li className='nav_list'>
                    <span className='front'><PlusOutlined style={{ fontSize: '20px' }} /></span>
                    <Link to="/newsite" className='side'>Add Site</Link>
                </li>
                <li className='nav_list'>
                    <span className='front'><SecurityScanOutlined style={{ fontSize: '20px' }} /></span>
                    <Link to="/analyzers" className='side'>Analyzers</Link>
                </li>
                <li className='nav_list user'>
                    <Link to={`/user-profile/${userId}`} title="See User Info">{`${user?.userName.slice(0, 7)}..`}</Link>
                    {
                        user?.image?.asset ? (
                            <img
                                src={user?.image?.asset.url}
                                alt='user'
                            />
                        ) :
                            (
                                <img
                                    src={wspIcon}
                                    alt='user'
                                />
                            )
                    }

                    <UpOutlined
                        className={openMenue === false ? 'closeMenue' : 'closeMenue show'}
                        onClick={() => setOpenMenue(false)}
                    />
                </li>
            </ul>
        </div>
    )
}

export default NavBar