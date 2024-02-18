import React from 'react';
import './analyzerBox.css';
import { ToolOutlined, CheckOutlined } from '@ant-design/icons';

function AnalyzerBox({ isComplited, underRepair, analyzerParameter, onClick }) {

    let styleName;
    if (isComplited === true) {
        styleName = 'isComplited'
    }
    else if (underRepair === true) {
        styleName = 'isUnderRepair'
    }
    else {
        styleName = 'active'
    }
    return (
        <div onClick={onClick} className={styleName} title="Change analyzer status">
            {analyzerParameter === "PM2.5/10" ? 'PM' : analyzerParameter}
            {
                underRepair === true && (
                    <ToolOutlined className='toolIcon' />
                )
            }
            {
                isComplited === true && (
                    <CheckOutlined className='complitedIcon' />
                )
            }
        </div>
    )
}

export default AnalyzerBox