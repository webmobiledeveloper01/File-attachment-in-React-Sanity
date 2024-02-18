import React, { useEffect, useState } from 'react';
import { getFiles } from '../utils/queries';
import { client } from '../client';
import './DropFile.css';
import Spinner from './Spinner';
import { notifySuccess } from '../utils/notifications';


function DropFile({ type, userId, userName }) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [list, setList] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, [])

    const fetchFiles = async () => {
        setLoading(true);
        const findFiles = getFiles(type)
        const data = await client.fetch(findFiles, { includeDrafts: true })
        setList(data);
        let fileList = data.map((item) => {
            return {
                key: item?._id,
                url: item?.file?.url,
                name: item?.name,
                userName: item?.userName
            }
        })
        setFiles(fileList);
        setFilteredFiles(fileList)
        setLoading(false)
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        e.dataTransfer.dropEffect = 'copy';
    }

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const fileList = [...e.dataTransfer.files];
        upload(fileList);
    };

    const handleFileInput = async (e) => {
        const fileList = [...e.target.files];
        await upload(fileList);
    };

    const searchHandler = (e) => {
        let value = e.target.value;
        if (value.length !== 0) {
            setFilteredFiles(files.filter(file => file.name.includes(value)))
        }
        else {
            setFilteredFiles(files);
        }
    }

    const upload = async (fileList) => {
        const validFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const uploadedFiles = await Promise.all(fileList.filter((file) =>
            validFileTypes.includes(file.type)).map(async (file) => {
                setUploading(true);
                return await client.assets.upload('file', file)
                    .then(async (asset) => {
                        return await client.create({
                            _type: type,
                            name: file.name,
                            file: asset,
                            userId,
                            userName
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
            }));
        notifySuccess(`${type} record was created! It can take some time until it will become visible`);
        setFiles([...files, ...uploadedFiles]);
        setFilteredFiles([...files, ...uploadedFiles]);
    }

    return (
        <div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className='drop-zone'
                style={{
                    border: `3px dashed ${dragging === true ? 'red' : 'green'}`
                }}
            >
                {uploading &&
                    <>
                        <Spinner />
                        <p>Uploading</p>
                    </>
                }
                <p>Click or drag and drop files here to upload (Word, Excel, PDF)</p>
                <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.xls,.xlsx,.doc,.docx"
                    multiple
                    className='fileUploadingInput'
                    onChange={handleFileInput}
                />
            </div>
            <div className='file-list-container'>
                <input
                    type='text'
                    placeholder='Search'
                    name='search'
                    className='file-search'
                    onChange={(e) => { searchHandler(e) }}
                />
                <div className='allFiles'>
                    {
                        filteredFiles.length > 0 && filteredFiles.map((file, index) => (
                            <div key={file.key} className='fileList'>
                                <span>{(index + 1)}&nbsp;</span>
                                <a href={file.url} target="_blank" title='open document'>{file.name.slice(0, 25)}</a>
                                {file?.userName ?
                                    <div className='postedByName'>Author: {file?.userName.slice(0, 10)}</div> : ""
                                }
                            </div>
                        ))
                    }
                    {
                        loading ?
                            <Spinner />
                            :
                            !filteredFiles.length > 0 && <p style={{ color: 'black' }}>No Files</p>
                    }
                </div>

            </div>
        </div>
    )
}

export default DropFile