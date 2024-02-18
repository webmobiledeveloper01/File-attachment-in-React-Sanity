import React, { useState } from 'react';
import Station from './Station';
import Navigation from './nav/navigation';
import Spinner from './Spinner';
import './Stations.css';
import { EditOutlined, RedoOutlined } from '@ant-design/icons'
import AnalyzerModel from './analyzerModel';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/notifications';
import offices from '../utils/offices.json';
import { Link } from 'react-router-dom';
import PopupModal from './popupModal';
import allNetworks from '../utils/networks.json'
import { client } from '../client';

function Stations({ officeSelect, setOfficeSelect, station, loading, setStation, user, setNetworkSelect, networkSelect, analyzers, setAnalyzers }) {

    const [openAnalyzer, setOpenAnalyzer] = useState(false);
    const [analyzerInfo, setAnalyzerInfo] = useState({
        parameter: '',
        id: '',
        model: '',
        isCompleted: false,
        underRepair: false,
        key: '',
        stationId: '',
        sin: ''
    });
    const [openModel, setOpenModel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [disableSelect, setDisableSelect] = useState(false);
    const [passEntered, setPassEntered] = useState('');
    const pass = process.env.REACT_APP_PASSWORD_TO_RESET;


    const verifyPass = () => {
        if (passEntered.length > 0) {
            if (passEntered === pass) {
                const query = `
                    *[_type == 'station' && analyzers != null]{
                        _id,
                        analyzers,
                        officeType,
                        isCompleted
                    }
                `;
                // Execute the query and update any matching documents
                client.fetch(query).then((stations) => {
                    stations.forEach((stationItem) => {
                        if (stationItem.officeType === officeSelect) {
                            const updatedAnalyzers = stationItem.analyzers.map((analyzer) =>
                                analyzer.isCompleted !== undefined
                                    ? { ...analyzer, isCompleted: false, underRepair: false }
                                    : analyzer
                            );

                            client
                                .patch(stationItem._id)
                                .set({
                                    analyzers: updatedAnalyzers,
                                    isCompleted: false,
                                })
                                .commit()
                                .then((response) => {
                                    const updatedStations = station.map((stationObj) => {
                                        var temp = stationObj;
                                        if (stationObj._id == response._id) {
                                            temp.analyzers = response.analyzers;
                                        }
                                        return temp;
                                    });
                                    console.log(updatedStations);
                                    setStation(updatedStations)
                                    setOpenModel(false);
                                })
                                .catch((error) => {
                                    console.error('Reset failed!');
                                    notifyError('Reset failed!');
                                    setOpenModel(false);
                                    console.error(error);
                                });
                        }
                    });
                });
                notifySuccess('Reset completed!');
            }
            else {
                notifyError('Incorrect password!');
                console.log('incorrect password');
            }
        }
        else {
            notifyError('Enter password to reset!');
        }
    }

    const selectOffice = (e) => {
        setDisableSelect(true);
        e.preventDefault();
        notifySuccess('Office was selected!');
        setTimeout(() => {
            localStorage.setItem('Office', e.target.value);
            setOfficeSelect(e.target.value);
        }, 2000);
    }

    const changeOffice = () => {
        localStorage.removeItem('Network');
        localStorage.removeItem('Office');
        window.location.reload();
    }

    if (!officeSelect) {
        return (
            <div className='officeSelection'>
                <ToastContainer />
                <div className='topBanner'>
                    <h1> Select Office</h1>
                </div>
                <div className='bottomBanner'>
                    {
                        offices.map((office) => (
                            <div key={office.id}>
                                <button
                                    className={disableSelect === false ? 'selectOfficeBtn' : 'selectOfficeBtn disabled'}
                                    value={office.name}
                                    onClick={(e) => { selectOffice(e) }}
                                    disabled={disableSelect === true}
                                >
                                    {office.name}
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    const isFoundSite = station.some(element => {
        if (element.officeType === officeSelect) {
            return true;
        }
        return false;
    })

    const notifyBody = (
        <div>
            <p style={{ fontFamily: 'Oswald' }}>Enter Password</p>
            <input
                value={passEntered}
                onChange={(e) => setPassEntered(e.target.value)}
                placeholder='Enter password to reset'
                className='resetinput'
                type='password'
            />
        </div>
    )

    const handleSetNetwork = (name) => {
        localStorage.setItem('Network', name);
        setNetworkSelect(name);
    }

    const changeNetwork = () => {
        localStorage.removeItem('Network');
        setNetworkSelect("");
    }

    const allStationsBody = (
        <div className='showStations'>
            {
                isFoundSite === false &&
                <div>
                    <h2>Nothing to show...</h2>
                    <p>Add a new station <Link to={'/newsite'}>here</Link> or select different office</p>
                </div>
            }
            {
                loading === true ?
                    <Spinner message="Loading all stations.." />
                    :
                    !networkSelect && isFoundSite === true ? (
                        <div className='allNetworks'>
                            <h1>Choose Network within <span>{officeSelect} </span>office</h1>
                            <div className='networkBox'>
                                {
                                    allNetworks?.map((network) => {
                                        return (
                                            <div
                                                className='eachNetwork'
                                                key={network.id}
                                                onClick={() => handleSetNetwork(network.name)}
                                            >
                                                <span>
                                                    {network.name}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                        :
                        station?.filter((data) => {
                            let search = searchTerm.replace(/ /g, "").toLowerCase();
                            if (search === "") {
                                return data;
                            }
                            else if (`${data.title}`.replace(/ /g, "").toLowerCase().includes(search) || `${data.description}`.replace(/ /g, "").toLowerCase().includes(search) || `${data.postedBy.userName}`.replace(/ /g, "").toLowerCase().includes(search)) {
                                return data;
                            }
                        })
                            .filter((data) => {
                                if (networkSelect === 'All') {
                                    return data.officeType === officeSelect;
                                }
                                else if (networkSelect !== 'All' && data.officeType === officeSelect) {
                                    return data.networkType == networkSelect;
                                }
                            })
                            .map((stationData) => {
                                return (
                                    <div key={stationData._id}>
                                        <Station
                                            user={user}
                                            setAnalyzerInfo={setAnalyzerInfo}
                                            setOpenAnalyzer={setOpenAnalyzer}
                                            stationData={stationData}
                                            analyzers={stationData.analyzers}
                                            key={stationData._id}
                                            description={stationData.description}
                                            id={stationData._id}
                                            stationName={stationData.title}
                                            image={stationData.image}
                                            postedBy={stationData.postedBy}
                                            address={stationData.address}
                                            setStation={setStation}
                                            allStations={station}
                                            stationNetwork={stationData.networkType}
                                            setAnalyzers={setAnalyzers}
                                            allanalyzers={analyzers}
                                        />
                                        {
                                            openAnalyzer && < AnalyzerModel
                                                openAnalyzer={openAnalyzer}
                                                stationId={analyzerInfo?.stationId}
                                                analyzerId={analyzerInfo?.id}
                                                analyzerKey={analyzerInfo?.key}
                                                analyzerParameter={analyzerInfo?.parameter}
                                                analyzerSin={analyzerInfo?.sin}
                                                analyzerModel={analyzerInfo?.model}
                                                isCompletedAnalyzer={analyzerInfo?.isCompleted}
                                                isUnderRepair={analyzerInfo?.underRepair}
                                                setOpenAnalyzer={setOpenAnalyzer}
                                                setStation={setStation}
                                                station={station}
                                                setAnalyzerInfo={setAnalyzerInfo}
                                            />
                                        }
                                    </div>
                                )
                            }
                            )
            }
        </div>
    )

    return (
        <div className='stations'>
            {
                openModel &&
                <PopupModal
                    title={`Reset all stations within ${officeSelect}`}
                    openModel={openModel}
                    closeModel={setOpenModel}
                    body={notifyBody}
                    btnText="Yes"
                    btnAction={verifyPass}
                    setPassEntered={setPassEntered}
                />
            }
            <ToastContainer />
            <Navigation
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                btnText="Save"
                title="Some Title"
            />
            <div className='officeDisplay'>
                <h3>Current Office: <span>{officeSelect}</span>
                    <EditOutlined
                        className='changeOffice'
                        title='Change Office'
                        onClick={changeOffice}
                    />
                </h3>
            </div>
            {
                isFoundSite === true &&
                <div>
                    <button
                        className='resetAllAnalyzers'
                        title='Reset Stations'
                        onClick={() => setOpenModel(true)}
                    >
                        Reset
                    </button>
                    <RedoOutlined
                        className='mobileReset'
                        title='Reset Stations'
                        onClick={() => setOpenModel(true)}
                    />
                </div>
            }

            <div className='stationList'>
                {
                    networkSelect &&
                    <div className='currentNetwork'>
                        Selected Network: {networkSelect}
                        <button onClick={() => changeNetwork()}>Change</button>
                    </div>
                }
                {
                    allStationsBody
                }
            </div>
        </div>
    )
}

export default Stations



