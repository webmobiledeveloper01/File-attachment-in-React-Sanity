import React from 'react';
import './popupModal.css'


function PopupModal({ closeModel, title, btnText, body, btnAction, setPassEntered }) {

    const close = () => {
        closeModel(false);
        if (setPassEntered) {
            setPassEntered("")
        }

    }

    return (
        <>
            <div className='overlay_Styles' onClick={() => close()}>
                <div className='modal_Style' onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <h4>{title}</h4>
                    <div className='modal_body'>
                        {body}
                    </div>
                    <div className='modal_allBtn'>
                        <button onClick={() => close()}>Close</button>
                        <button onClick={btnAction}>{btnText}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PopupModal;

