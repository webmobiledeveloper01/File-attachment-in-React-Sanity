import React, { useEffect, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import './analyzersTable.css';
import { client } from '../client';
import { notifyError, notifySuccess } from '../utils/notifications';
import { Link } from 'react-router-dom';


function AnalyzersTable({ analyzers, setAddAnalyzer, stationData, user, setStationAnalyzers, stationAnalyzers, setAnalyzers, station, setStation, stationId }) {

    const updateAnalyzerInfo = (id) => {
        client.patch(id).set({ stationBelong: '' }).commit().catch((err) => {
            console.error('Oh, you got an error: ' + err.message)
        })
    }

    const removeAnalyzer = (e, id) => {
        e.preventDefault();

        if (user.status.toLowerCase() == "admin") {
            const newStationAnalyzers = stationAnalyzers.filter(analyzer => analyzer.id !== id);
            const lineToRemove = ['analyzers[id=="' + id + '"]'];
            if (id) {
                client.patch(stationData?._id).unset(lineToRemove).commit()
                    .then(() => {
                        setStationAnalyzers(newStationAnalyzers)
                        notifySuccess('Analyzer has been removed.  It may take time until it disappears from the system');
                        updateAnalyzerInfo(id);
                        setAnalyzers(analyzers?.map(value => {
                            if (value._id === id) {
                                return { ...value, stationBelong: '' }
                            }
                            else return value;
                        }));
                        setStation(station.map(value => {
                            if (value._id === stationId?.stationId) {
                                return { ...value, analyzers: newStationAnalyzers }
                            }
                            else {
                                return value;
                            }
                        }))

                    })
            }
            else {
                notifyError('Removing failed, try again..')
            }
        }
        else {
            notifyError(`You do not have permition to remove analyzer. Contact admin`)
        }
    }

    return (
        <div className='tableLayout'>
            <table className='analyzersList'>
                <caption>
                    Analyzers
                    <PlusOutlined className='adding' onClick={() => setAddAnalyzer(true)} />
                </caption>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Make</th>
                        <th>Complited</th>
                        <th>Maintenance</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stationAnalyzers?.length === 0 ?

                            <span className='addFistAnalyzer' onClick={() => setAddAnalyzer(true)}>Add analyzer</span>

                            :
                            stationAnalyzers?.map((analyzer, key) => (
                                <tr key={key}>
                                    <td data-title='Parameter'>
                                        <Link to={`/analyzer/${analyzer.id}`}>{analyzer.analyzerParameter === "PM2.5/10" ? "PM" : analyzer.analyzerParameter}</Link>
                                        <DeleteOutlined
                                            title='Delete Analyzer'
                                            className='removeAnalyzer'
                                            onClick={(e) => removeAnalyzer(e, analyzer.id)}
                                        />

                                    </td>
                                    <td data-title="Make">{analyzer.model}</td>
                                    <td data-title="Complited">{analyzer.isCompleted === true ? "Yes" : "No"}</td>
                                    <td data-title="Maintenance">{analyzer.underRepair === true ? "Yes" : "No"}</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>

    )
}

export default AnalyzersTable
