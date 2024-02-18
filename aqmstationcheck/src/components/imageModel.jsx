import React from 'react';
import './imageModel.css';
import PopupModal from './popupModal';

function ImageModel({ img, setModelDispay, modelDisplay }) {

    const modelBody = (
        <img
            src={img}
            alt='analyzer'
            style={{ maxWidth: "500px" }}
        />
    )


    return (
        <PopupModal
            closeModel={setModelDispay}
            openModel={modelDisplay}
            btnText="Save"
            body={modelBody}
            className='imageModel'
        />
    )
}

export default ImageModel;
