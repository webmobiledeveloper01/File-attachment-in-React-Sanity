import React from 'react';
import { Circles } from 'react-loader-spinner';
import './Spinner.css';

function Spinner({ message }) {
    return (
        <div className='spinnerBody'>
            <Circles
                height="50"
                width="50"
                color="#4fa94d"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <p>{message}</p>
        </div>
    )
}

export default Spinner