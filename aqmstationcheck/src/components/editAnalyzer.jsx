import React from 'react';
import './editAnalyzer.css';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { RedoOutlined } from '@ant-design/icons'
import { client } from '../client';
import { ToastContainer } from 'react-toastify';
import { notifySuccess, notifyError } from '../utils/notifications';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { imageUploader } from '../utils/helperFunctions';
import Spinner from './Spinner';
import PopupModal from './popupModal';



export default function EditAnalyzer({ editAnalyzer, setEditAnalyzer, analyzer, analyzers, setAnalyzers, setAnalyzer }) {
    const [note, setNote] = useState(analyzer?.note);
    const [model, setModel] = useState(analyzer?.model);
    const [make, setMake] = useState(analyzer?.analyzerMake);
    const [newImage, setNewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setMake('');
        setModel('');
        setNote('')
    }

    const updateAnalyzer = (e) => {
        e.preventDefault();
        if (analyzer._id) {
            if (make && model) {
                try {
                    if (newImage === null) {
                        client.patch(analyzer._id).set({
                            analyzerMake: make,
                            note: note,
                            model: model,
                        })
                            .commit()
                            .then((promise) => {
                                setAnalyzers(analyzers.map(obj => {
                                    if (obj._id === promise._id) {
                                        return {
                                            ...obj,
                                            analyzerMake: make,
                                            note: note,
                                            model: model,
                                        }
                                    }
                                    return obj;
                                }))
                                setAnalyzer({
                                    ...analyzer,
                                    analyzerMake: make,
                                    note: note,
                                    model: model,
                                })
                                notifySuccess('Analyzer has been updated!')
                                setEditAnalyzer(false);

                            })
                            .catch((err) => {
                                console.error('Oh, you got an error: ' + err.message)
                            })
                    }
                    else {
                        client.patch(analyzer._id).set({
                            analyzerMake: make,
                            note: note,
                            model: model,
                            image: {
                                _type: 'image',
                                asset: {
                                    _type: 'reference',
                                    _ref: newImage?._id
                                }
                            },
                        })
                            .commit()
                            .then((promise) => {
                                setAnalyzers(analyzers.map(obj => {
                                    if (obj._id === promise._id) {
                                        return {
                                            ...obj,
                                            analyzerMake: make,
                                            note: note,
                                            model: model,
                                            image: promise.image
                                        }
                                    }
                                    return obj;
                                }))
                                setAnalyzer({
                                    ...analyzer,
                                    analyzerMake: make,
                                    note: note,
                                    model: model,
                                    image: promise.image
                                })
                                notifySuccess('Analyzer has been updated');
                                setEditAnalyzer(false);

                            })
                            .catch((err) => {
                                console.error('Oh, you got an error: ' + err.message)
                            })
                    }
                }
                catch {
                    notifyError('Opps, something went wrong, try again..');
                }
            }
            else {
                notifyError('Make sure the form is not empty!')
            }
        }
    }

    const editBody = (
        <>
            <form className='analyzerUpdateForm'>
                <RedoOutlined className='resetBtn' onClick={resetForm} title="reset form" />
                <div>
                    <label>Make: </label>
                    <input placeholder='Enter make' onChange={(e) => setMake(e.target.value)} value={make} />
                </div>
                <div>
                    <label>Model: </label>
                    <input placeholder='Enter model' onChange={(e) => setModel(e.target.value)} value={model} />
                </div>
                <div>
                    <label>Note</label>
                    <input onChange={(e) => setNote(e.target.value)} value={note} />
                </div>
                {
                    isLoading && <Spinner />
                }
                {
                    !newImage ?
                        (
                            <div className='editImg'>
                                <p className={{ fontWeight: 'bold' }}>Change Image</p>
                                <div className='imageUploader'>
                                    <AiOutlineCloudUpload className='uploaderIcon' />
                                    <input
                                        type='file'
                                        onChange={(e) => imageUploader(e, setNewImage, setIsLoading)}
                                        name='upload_new_image'
                                    />
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className='displayNewImg'>
                                <img
                                    src={newImage?.url}
                                    alt='Uploaded image'
                                    className='newUploadedImg'
                                />
                                <button
                                    onClick={() => setNewImage(null)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )
                }

            </form>
            <ToastContainer />
        </>
    )
    return (
        <PopupModal
            closeModel={setEditAnalyzer}
            openModel={editAnalyzer}
            title="Edit Analyzer"
            btnText="Save"
            btnAction={updateAnalyzer}
            body={editBody}
        />
    )
}


