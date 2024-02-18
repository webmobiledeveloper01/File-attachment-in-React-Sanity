import React, { useEffect, useState } from 'react';
import { CloseOutlined, FolderAddOutlined } from '@ant-design/icons';
import './selectAnalyzer.css';
import { AnalyzerObject } from '../utils/helperFunctions';
import { client } from '../client';
import { notifyError, notifySuccess } from '../utils/notifications';

const SelectAnalyzer = ({ setStationAnalyzers, stationAnalyzers, setAddAnalyzer, analyzers, stationId, stationName, station, setStation, setAnalyzers, setCreateAnalyzer }) => {

    const [newAnalyzer, setNewAnalyzer] = useState(false);
    const [allAnalyzers, setAllAnalyzers] = useState(stationAnalyzers);
    const [defaultText, setDefaultText] = useState('');
    const [selectedAnalyzerID, setSelectedAnalyzerID] = useState(null);
    let ids;

    if (stationAnalyzers) {
        ids = stationAnalyzers?.map(value => value.id);
    }

    const handleSelected = (e) => {
        e.preventDefault();
        const analyzer_id = e.target.value;
        let index = ids?.indexOf(analyzer_id);

        if (index === -1 || index === undefined) {
            setNewAnalyzer(true);
            const selected = analyzers?.filter((analyzer) => {
                if (analyzer._id === analyzer_id) {
                    return analyzer;
                }
            })
            const analyzerObject = AnalyzerObject(analyzer_id, selected);
            setSelectedAnalyzerID(analyzer_id);

            if (allAnalyzers === null) {
                setAllAnalyzers([analyzerObject]);//if station doesn't have analyzers & we create a new one & it must be array type, otherwise error will be thrown in sanity studio
            }
            else {
                setAllAnalyzers(allAnalyzers?.concat(analyzerObject));
            }

        }
        else {
            setNewAnalyzer(false);
        }
    }

    useEffect(() => {
        if (analyzers.length == 0) {
            setDefaultText('No Analyzers in system');
        }
        else {
            setDefaultText('Select');
        }
    }, [defaultText])



    const addAnalyzer = (e) => {
        e.preventDefault();
        if (newAnalyzer === true) {
            if (stationId?.stationId) {
                try {
                    client.patch(stationId?.stationId).set({
                        analyzers: allAnalyzers
                    }).commit()
                        .then(() => {
                            setStationAnalyzers(allAnalyzers); //update station's analyzers 
                            notifySuccess('Analyzer was added!');

                            setStation(station.map(obj => {
                                if (obj._id === stationId?.stationId) {
                                    return { ...obj, analyzers: allAnalyzers }
                                }
                                else return obj;
                            }))
                            setAnalyzers(analyzers.map(value => {
                                if (value._id === selectedAnalyzerID) {
                                    return { ...value, stationBelong: `${stationName}` };
                                }
                                else {
                                    return value;
                                }
                            }))
                            setAddAnalyzer(false);
                        })
                        .catch((err) => {
                            console.error('Oh, you got an error: ' + err.message);
                        })
                }
                catch {
                    notifyError('Opps, something went wrong, try again..');
                }
            }
            if (selectedAnalyzerID) { //adding station name to analyzer
                client.patch(selectedAnalyzerID).set(({ stationBelong: stationName })).commit().catch((err) => {
                    console.log('Cannot add station name to analyzer: ' + err.message);
                })
            }
        }
        else {
            notifyError('This analyzer is already added to the station, select a different one!');
        }
    }

    return (
        <div className='modelBox'>
            <CloseOutlined
                className='closeModel'
                onClick={() => setAddAnalyzer(false)}
                title='Close'
            />
            <FolderAddOutlined
                className='createAnalyzerOpt'
                title='Create Analyzer'
                onClick={() => setCreateAnalyzer(true)}
            />
            <label>Select Analyzer</label>
            <select
                onChange={handleSelected}
                required
                defaultValue={'select'}
            >
                <option value='select' disabled>{defaultText}</option>
                {
                    analyzers?.map((analyzer) => {
                        if (analyzer?.stationBelong === "" || analyzer?.stationBelong === null) {
                            return (
                                <option
                                    value={analyzer?._id}
                                    key={analyzer?._id}
                                >
                                    {analyzer?.analyzerParameter}-{analyzer?.model.slice(0, 5).toUpperCase()}-{analyzer?.sin}
                                </option>
                            )
                        }

                    })
                }
            </select>
            <button
                title='Save changes'
                onClick={addAnalyzer}
            >
                Save
            </button>
        </div>
    )
}

export default SelectAnalyzer;