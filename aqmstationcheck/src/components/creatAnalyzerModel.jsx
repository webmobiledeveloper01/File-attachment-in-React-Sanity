import React, { useState } from 'react';
import './creatAnalyzerModel.css';
import getParameters from '../utils/parameters.json';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { imageUploader, fileUploader } from '../utils/helperFunctions';
import { MdDelete } from 'react-icons/md';
import Spinner from './Spinner';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/notifications';
import { client } from '../client';
import PopupModal from './popupModal';


function CreatAnalyzerModel({ analyzers, setAnalyzers, creatAnalyzer, setCreateAnalyzer, userId, }) {
    const [parameter, setParameter] = useState("");
    const [image, setImage] = useState(null);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [sin, setSin] = useState("");
    const [manual, setManual] = useState("");
   // const [uploading, setUploading] = useState("");
    const [note, setNote] = useState("");
    const [displayParameter, setDisplayParameter] = useState(false);
    const [attachment, setAttachment] = useState("");
    const [attachmentFile, setAttachmentFile] = useState("");

    const createAnalyzer = () => {
        if (parameter && image && make && model && sin) {
            console.log('attachment', attachment);
            const doc = {
                _type: 'analyzers',
                analyzerParameter: parameter.toUpperCase(),
                analyzerMake: make,
                model,
                sin,
                note,
                manual,
                stationBelong: '',
                attachments: {

                    _type: 'document',
                   // _id: attachmentFile?.uploadId,
                    name: attachmentFile.originalFilename.toLowerCase(),
                    type: 'analyzer_File',
                    file: {
                        _type: 'file',
                        asset: {
                            _type: "reference",
                            _ref: attachmentFile?._id,
                          }
                    },
                    userId,
                    
                    /*_type: 'document',
                     file: attachment,
                     name: attachmentFile.originalFilename.toLowerCase(),
                     type: 'analyzer_File',
                    
                     //url: attachment.url,
                     userId,*/
                },
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: image?._id
                    }
                },

                addedBy: {
                    _type: 'postedBy',
                    _ref: userId
                },
                
            };
            console.log("doc", doc);

            client.create(doc).then((promise) => {
                if (analyzers) {
                    setAnalyzers([...analyzers, promise])
                }
                else {
                    setAnalyzers(promise)
                }
                notifySuccess('Analyzer was created!')
                setTimeout(() => {
                    setCreateAnalyzer(false)
                }, 4000)

            })
        }
        else {
            notifyError("Make sure that form is filled up")
        }
    }

    const checkUserOption = (e) => {
        if (e.target.value === "Enter parameter") {
            setParameter("")
            setDisplayParameter(true)
        }
        else {
            setDisplayParameter(false)
        }
    }

    /*const uploadAttachment = async (e) => {
        const fileList = [...e.target.files];
        console.log(fileList);
        const validFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (validFileTypes.includes(fileList[0].type)) {
            setAttachment(fileList)
        }
        else {
            notifyError('Incorrect file type!')
        }

    }*/

   // const fileUploader = async (file) => {
   //     const validFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        /*const uploadedFiles = await Promise.all(currentFile.filter((file) =>
        validFileTypes.includes(file.type)).map(async (file) => {
            setUploading(true);
            return await client.assets.upload('file', file)
                .then(async (asset) => {
                    return await client.create({
                        _type: 'attachments',
                        name: file.name.toLowerCase(),
                        file: asset,
                        type: 'analyzer_File',
                       
                        userId,
                     
                    }, { visibility: "sync" }).then((item) => {
                        const new_file = {
                            key: item?._id,
                            url: item?.file?.url,
                            name: item?.name
                        }
                        setUploading(false);
                        return new_file
                    })
                });
        }))
        .catch(error => {
            console.log(error)
        });*/
   // }

    const createAnalyzerBody = (
        <>
            <form className='createAnalyzer'>
                <div className='analyzerChild'>
                    <label> Parameter</label>
                    <select
                        onChange={(e) => { setParameter(e.target.value); checkUserOption(e) }}
                        required
                        defaultValue={'select'}
                    >
                        <option value='select' disabled>Select</option>
                        {
                            getParameters.map((value) => {
                                return (
                                    <option
                                        key={value.id}
                                    >
                                        {value.parameter}
                                    </option>
                                )
                            })
                        }
                        <option>Enter parameter</option>
                    </select>
                </div>
                <div className={displayParameter === true ? 'analyzerChild' : 'hide'} id='userParameter'>
                    <label></label>
                    <input
                        maxLength={20}
                        placeholder='Enter your parameter'
                        value={parameter}
                        onChange={(e) => setParameter(e.target.value)}
                    />
                </div>

                <div className='analyzerChild'>
                    <label>Make</label>
                    <input
                        placeholder='Enter make'
                        onChange={(e) => setMake(e.target.value)}
                        maxLength={30}
                        required
                        value={make}
                    />
                </div>
                <div className='analyzerChild'>
                    <label>Model</label>
                    <input
                        placeholder='Enter model name'
                        onChange={(e) => setModel(e.target.value)}
                        maxLength={50}
                        required
                        value={model}
                    />
                </div>
                <div className='analyzerChild'>
                    <label>SIN</label>
                    <input
                        placeholder='Enter sin'
                        onChange={(e) => setSin(e.target.value)}
                        maxLength={50}
                        required
                        value={sin}
                    />
                </div>
                <div className='analyzerChild'>
                    <label className='analyzerNote'>Note</label>
                    <input
                        placeholder='Enter note'
                        onChange={(e) => setNote(e.target.value)}
                        value={note}
                        maxLength={100}
                    />
                </div>
                <div className='analyzerChild'>
                    <label className='manual'>Manual</label>
                    <input
                        placeholder='Past link'
                        onChange={(e) => setManual(e.target.value)}
                        required
                        value={manual}
                    />
                </div>
                {
                    isFileLoading && <Spinner />
                }
                <div className='analyzerChild'>
                    
                    <label className='attachment'>Attachments</label>
                    <div className='dropZone'>
                        {
                            !attachment ? (
                                <>
                                    <input
                                        accept=".pdf,.xls,.xlsx,.doc,.docx"
                                        type='file'
                                        className='uploaderBtn'
                                        name='upload_new_file'
                                        placeholder='Add File'
                                        onChange={(e) => fileUploader(e, setAttachment, setAttachmentFile, setIsFileLoading)}
                                        value={attachment}
                                    />
                                    <div className='overlayLayer'>Upload File (Word, Excel, PDF)</div>
                                </>

                            )
                                :
                                <>
                                    <MdDelete
                                        className='resetAttachment'
                                        onClick={() => setAttachment("")}
                                        title="Reset Attachment"
                                    />
                                    <p>Added: {attachmentFile?.originalFilename}</p>
                                </> 
                                
                        }

                    </div>

                </div>
                {
                    isImageLoading && <Spinner />
                }
                <div className='analyzer_img'>

                    {
                        !image ? (
                            <>
                                <div>
                                    <p>Add Image</p>
                                    <AiOutlineCloudUpload className='UploadIcon' />
                                    <input
                                        type='file'
                                        name='upload_new_image'
                                        onChange={(e) => imageUploader(e, setImage, setIsImageLoading)}
                                    />
                                </div>
                            </>


                        )
                            :
                            (
                                <>
                                    <MdDelete
                                        className='resetImage'
                                        onClick={() => setImage(null)}
                                        title="Reset Image"
                                    />
                                    <img src={image?.url} alt={`analyzer's image`} />
                                </>

                            )
                    }
                </div>
            </form>
            <ToastContainer />
        </>
    )

    return (
        <PopupModal
            closeModel={setCreateAnalyzer}
            title={'Create Analyzer'}
            btnText={'Submit'}
            body={createAnalyzerBody}
            btnAction={createAnalyzer}
        />
    )
}

export default CreatAnalyzerModel

