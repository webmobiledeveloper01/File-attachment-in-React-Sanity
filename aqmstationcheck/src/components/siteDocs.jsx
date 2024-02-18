import React, { useState, useEffect } from 'react';
import { client } from '../client';
import { catchSiteDocs } from '../utils/queries';
import './siteDocs.css';
import { notifySuccess } from '../utils/notifications';
import Spinner from './Spinner';

function SiteDocs({ userId, userName, station_id }) {
    const [uploading, setUploading] = useState(false);
    const [siteDocs, setSiteDocs] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDocs = async () => {
        setLoading(true);
        const findAllDocs = catchSiteDocs(station_id);
        const data = await client.fetch(findAllDocs, { includeDrafts: true })
        let fileList = data.map((value) => {
            return {
                key: value?._id,
                url: value?.file?.url,
                name: value?.name,
                userName: value?.userName
            }
        })
        setSiteDocs(fileList)
        setFilteredDocs(fileList)
        setLoading(false);
    }

    useEffect(() => {
        fetchDocs();
    }, [])

    const uploadSiteFile = async (e) => {
        const fileList = [...e.target.files];
        console.log(fileList);
        await uploader(fileList)
    }

    const uploader = async (currentFile) => {
        const validFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const uploadedFiles = await Promise.all(currentFile.filter((file) =>
            validFileTypes.includes(file.type)).map(async (file) => {
                setUploading(true);
                return await client.assets.upload('file', file)
                    .then(async (asset) => {
                        return await client.create({
                            _type: 'stationFile',
                            name: file.name.toLowerCase(),
                            file: asset,
                            userId,
                            userName,
                            stationID: station_id
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
            });
        setSiteDocs([...siteDocs, ...uploadedFiles]);
        setFilteredDocs([...siteDocs, ...uploadedFiles]);
        notifySuccess('Site document was uploaded!')
    }

    if (loading === true) {
        return (
            <Spinner />
        )
    }

    const findSiteDocs = (e) => {
        let document = e.target.value;
        if (document.length !== 0) {
            setFilteredDocs(siteDocs.filter(file => file.name.includes(document.toLowerCase())))
        }
        else {
            setFilteredDocs(siteDocs)
        }
    }

    return (
        <div className='siteDocs'>
            {
                uploading === true ?
                    <>
                        <Spinner />
                        <p>Uploading..</p>
                    </>
                    :
                    <div className='drop_zone'>
                        <input
                            id="site-files"
                            accept=".pdf,.xls,.xlsx,.doc,.docx"
                            type='file'
                            className='upload_btn'
                            onChange={uploadSiteFile}
                        />
                        <div className='overlay-layer'>Upload File (Word, Excel, PDF)</div>
                    </div>
            }
            <h3>All station's docs <span>{filteredDocs?.length}</span></h3>
            <div className='searchDocsBox'>
                <input
                    type='text'
                    placeholder='Search'
                    name='searchFile'
                    className='searchSiteDocs'
                    onChange={(e) => { findSiteDocs(e) }}
                />
            </div>
            <div className='allSiteDocs'>
                {
                    filteredDocs?.length > 0 &&
                    filteredDocs?.map((file, index) => (
                        <div key={file.key} className='siteDocument'>
                            <span>{(index + 1)}&nbsp;</span>
                            <a href={file?.url} target="_blank" title={`Open: ${file?.name}`}>{file?.name.length > 20 ? file?.name?.slice(0, 19) : file?.name}</a>
                            <p>{file?.userName?.slice(0, 9)}</p>
                        </div>
                    ))

                }
                {
                    filteredDocs.length === 0 && (
                        <p>Nothing to show..</p>
                    )
                }
            </div>
        </div>
    )
}


export default SiteDocs;
