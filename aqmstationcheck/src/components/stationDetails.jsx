import React, { useState } from 'react';
import './stationDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../client';
import { notifyError, notifySuccess } from '../utils/notifications';
import { DeleteOutlined } from '@ant-design/icons';
import Spinner from './Spinner';
import UserImageIcon from './assets/userImage.png';
import StationInfo from './stationInfo';
import { ToastContainer } from 'react-toastify';
import SiteDocs from './siteDocs';
import { v4 as uuidv4 } from 'uuid';


function StationDetails({ userId, user, analyzers, setAnalyzers, station, setStation, setCreateAnalyzer }) {
    const stationId = useParams();
    const navigate = useNavigate();
    const [stationData, setStationData] = useState(station?.find(value => value._id === stationId?.stationId));
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [addingNote, setAddingNote] = useState(false)
    const [addAnalyzer, setAddAnalyzer] = useState(false);
    let currentTime = new Date().toLocaleString();
    const [stationAnalyzers, setStationAnalyzers] = useState(station?.find(value => value._id === stationId?.stationId)?.analyzers);
    const [isEdit, setIsEdit] = useState(false);
    const [editNote, setEditNote] = useState(station?.find(value => value._id === stationId?.stationId)?.note);
    const [editAddress, setEditAddress] = useState(station?.find(value => value._id === stationId?.stationId)?.address);
    const [editTitle, setEditTitle] = useState(station?.find(value => value._id === stationId?.stationId)?.title);
    const [showFiles, setShowFiles] = useState(false);

    if (station?.length === 0 || setStationData === undefined) {
        navigate('/')
    }

    const addNote = (e) => {
        e.preventDefault();
        setAddingNote(true);
        if (stationId?.stationId) {
            if (notes) {
                client
                    .patch(stationId?.stationId)
                    .setIfMissing({ comments: [] })
                    .insert('after', 'comments[-1]', [{
                        comment: notes,
                        commentTitle: noteTitle,
                        _key: uuidv4(),
                        _createdAt: currentTime,
                        postedBy: {
                            _type: 'postedBy',
                            _ref: userId
                        }
                    }])
                    .commit()
                    .then(item => {
                        setStationData({ ...stationData, comments: item.comments })
                        setStation(station?.map(value => {
                            if (value._id === stationId?.stationId) {
                                return { ...value, comments: item.comments }
                            }
                            else return value;
                        }))

                        setNotes("");
                        setNoteTitle("");
                        setAddingNote(false);
                        notifySuccess(`Your note is posted. Thank you!`);
                    })
            }
            else {
                notifyError('Make sure comment is not empty!')
            }
        }

    }
    const deleteNote = (id, e) => {
        e.preventDefault();
        const commentToRemove = ['comments[_key=="' + id + '"]']
        if (id) {
            const new_commentList = stationData.comments.filter(comment => comment._key !== id)

            client.patch(stationData?._id).unset(commentToRemove).commit()
                .then(() => {
                    setStationData({ ...stationData, comments: new_commentList });
                    setStation(station?.map(value => {
                        if (value._id === stationId?.stationId) {
                            return { ...value, comments: new_commentList }
                        }
                        else return value;
                    }))
                    notifySuccess('Comment has been removed!');
                })
        }
        else {
            notifyError('Removing comment failed, try again..');
        }
    }

    if (stationData === null || stationAnalyzers?.length < 0) {
        <Spinner message="Loading station's info" />
    }

    return (
        <div className='stationLayout'>
            <ToastContainer />
            <div className='stationMain'>
                <div className='stationPicture'>
                    <img src={stationData?.image?.asset?.url} />
                </div>
                <StationInfo
                    stationData={stationData}
                    setStationData={setStationData}
                    addAnalyzer={addAnalyzer}
                    setAddAnalyzer={setAddAnalyzer}
                    stationId={stationId}
                    isEdit={isEdit}
                    setStationAnalyzers={setStationAnalyzers}
                    stationAnalyzers={stationAnalyzers}
                    analyzers={analyzers}
                    editNote={editNote}
                    setEditNote={setEditNote}
                    setEditAddress={setEditAddress}
                    editAddress={editAddress}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    user={user}
                    setAnalyzers={setAnalyzers}
                    setStation={setStation}
                    station={station}
                    setIsEdit={setIsEdit}
                    setCreateAnalyzer={setCreateAnalyzer}
                />
            </div>
            <div className='stationAdditional'>
                <div>
                    <button className={showNotes === false ? 'stationNotesBtn' : 'stationNotesBtn close'} onClick={() => { setShowNotes(!showNotes); setShowFiles(false) }}>
                        {showNotes === false ? "Comments" : "Close"}
                    </button>
                    <button onClick={() => { setShowFiles(!showFiles); setShowNotes(false) }} className={showFiles === true ? 'stopEditing' : ''}>Documents</button>
                    <button onClick={(() => setIsEdit(!isEdit))} className={isEdit === true ? 'stopEditing' : ''}>{isEdit === true ? 'Close Editing' : 'Edit'}</button>
                </div>
                <div>

                </div>
                {
                    showNotes === true && (
                        <div className='allNotes'>
                            <div>
                                {

                                    stationData?.comments ? (
                                        [...stationData.comments]?.reverse()?.map((note, index) => (
                                            <div className='displayNote' key={index}>
                                                <p title={note?.commentTitle}>{note?.commentTitle?.slice(0, 30)}</p>
                                                <textarea value={note?.comment} disabled />
                                                <span>{note?.postedBy?.userName ? note?.postedBy?.userName?.slice(0, 10) : ""}</span>
                                                <span className='dataPosted'>{note._createdAt}</span>
                                                {
                                                    note?.postedBy?._id === userId || user.status === "admin" ? (
                                                        <DeleteOutlined
                                                            className='deleteNote'
                                                            onClick={(e) => deleteNote(note._key, e)}
                                                        />
                                                    ) : ""
                                                }
                                            </div>
                                        ))
                                    )
                                        :
                                        (
                                            <p>Nothing to show..</p>
                                        )
                                }
                            </div>
                            <form onSubmit={addNote}>
                                <div>
                                    <img src={!user?.image.asset.url ? UserImageIcon : user?.image.asset.url} alt="user image" title="User image" />
                                </div>
                                <div className='noteBody'>
                                    <label>Title</label>
                                    <input
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                        value={noteTitle}
                                        maxLength={32}
                                        required
                                        placeholder="Add note title"
                                    />
                                    <label>Comment</label>
                                    <input
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        maxLength={100}
                                        placeholder="Add station note "
                                    />
                                </div>

                                <button disabled={addingNote === true} >
                                    {addingNote ? 'Adding Note' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    )
                }
                {
                    showFiles === true && (
                        <SiteDocs
                            userId={user?._id}
                            userName={user?.userName}
                            station_id={stationData?._id}
                        />
                    )
                }
            </div>
        </div >
    )
}

export default StationDetails
