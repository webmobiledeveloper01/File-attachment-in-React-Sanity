import React, { useState } from 'react';
import './analyzermodel.css';
import { Link } from 'react-router-dom';
import { RightOutlined, ToolOutlined } from '@ant-design/icons';
import Switch from 'react-switch';
import { client } from '../client';
import { notifyError, notifySuccess } from '../utils/notifications';
import PopupModal from './popupModal';

function AnalyzerModel({ isCompletedAnalyzer, isUnderRepair, analyzerParameter, analyzerModel, analyzerId, analyzerKey, stationId, setOpenAnalyzer, analyzerSin, setStation, station }) {
    const [complitToggle, setComplitToggle] = useState(isCompletedAnalyzer);
    const [repairToggle, setRepairToggle] = useState(isUnderRepair);

    const updateAnalyzer = async (isUnderRepair, isComplited, message) => {
        try {
            await client.getDocument(stationId).then((value) => {
                value.analyzers.forEach(element => {
                    if (element.id == analyzerId) {
                        element.underRepair = isUnderRepair;
                        element.isCompleted = isComplited;
                    }
                    else return element;
                });
                client.patch(stationId)
                    .set({ analyzers: value.analyzers })
                    .commit()
                    .then((response) => {
                        notifySuccess(message)
                        const stationToUpdate = station.map((stationObj) => {
                            var temp = stationObj;
                            if (stationObj._id == response._id) {
                                temp.analyzers = response.analyzers;
                            }
                            return temp;
                        })
                        setStation(stationToUpdate)

                    })
                setOpenAnalyzer(false);
            });
        }
        catch {
            notifyError("Opps, something went wrong, try again..");
        }
    }

    const handleSave = () => {
        if (analyzerKey && stationId) {
            if (complitToggle === true && repairToggle === false) {
                updateAnalyzer(false, true, 'Analyzer complited!');
            }
            else if (repairToggle === true && complitToggle === false) {
                updateAnalyzer(true, false, 'Analyzer set to maintanance! ');
            }
            else if (complitToggle === false && repairToggle === false) {
                updateAnalyzer(false, false, 'Saved!');

            }
        }
    }

    const analyzerBody = (
        <div className='contentAnalyzer'>
            <Link to={`/analyzer/${analyzerId}`}>Name: {analyzerParameter?.toUpperCase()} <RightOutlined className='openAnalyzer' title='See analyzer' /></Link>
            <p>Model: {analyzerModel?.toUpperCase()}</p>
            <p className='sinForAnalyzer'> {analyzerSin}</p>
            <div className='analyzerStatus'>
                <label>
                    <span>Complite analyzer</span>
                    <Switch
                        offColor='#00ff99'
                        onHandleColor='#00ff99'
                        onChange={() => setComplitToggle(!complitToggle)}
                        checked={complitToggle}
                        disabled={repairToggle === true}
                    />
                </label>
                <label>
                    <span>Under Maintanance</span>
                    <Switch
                        checkedIcon={<ToolOutlined className='fixIcon' />}
                        offColor='#ffbf80'
                        onHandleColor='#ffbf80'
                        onChange={() => setRepairToggle(!repairToggle)}
                        checked={repairToggle}
                        disabled={complitToggle === true}
                    />
                </label>
            </div>
        </div>
    )

    return (
        <>
            <PopupModal
                closeModel={setOpenAnalyzer}
                title={`Analyzer ${analyzerParameter}`}
                btnText='Save'
                btnAction={handleSave}
                body={analyzerBody}
            />
        </>
    )
}

export default AnalyzerModel
