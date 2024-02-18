import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './analyzers.css';
import Spinner from './Spinner';
import { ReadOutlined, WarningOutlined, PlusCircleFilled } from '@ant-design/icons';
import { IoMdSearch } from 'react-icons/io';
import wspIcon from './assets/wspIcon.jpg'

function Analyzers({ analyzers, setCreateAnalyzer }) {
    const [search, setSearch] = useState("");

    return (
        <div className='analyzerLayout'>
            {
                analyzers &&
                <div>
                    <table>
                        <caption className='tableTitle mobile'>
                            Analyzers
                            <PlusCircleFilled className='addAnalyzer' title='add new analyzer' onClick={() => setCreateAnalyzer(true)} />
                        </caption>
                        <caption className='tableSearch mobile'>
                            <IoMdSearch className='searchIcon' />
                            <input
                                type='text'
                                placeholder='Search Parameter/SIN'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Parameter/SIN</th>
                                <th>Station</th>
                                <th>Make</th>
                                <th>Read More</th>
                            </tr>
                        </thead>
                        {

                            analyzers?.filter((data) => {
                                let lookingFor = search.replace(/ /g, "").toLowerCase();
                                if (lookingFor === "") {
                                    return data;
                                }
                                else if (`${data.analyzerParameter}`.replace(/ /g, "").toLowerCase().includes(lookingFor) || `${data.sin}`.replace(/ /g, "").toLowerCase().includes(lookingFor)) {
                                    return data;
                                }
                            })
                                .map((val, key) => {
                                    return (
                                        <tbody key={key}>
                                            <tr>
                                                <td data-title="Image"><Link to={`/analyzer/${val._id}`}><img src={val?.image?.asset?.url ? val?.image?.asset?.url : wspIcon} width={70} /></Link></td>
                                                <td data-title="Parameter">
                                                    <span className='paramSin'>
                                                        {val.analyzerParameter}
                                                        <span>{val.sin}</span>
                                                    </span>
                                                </td>
                                                <td data-title="SIN" className='sinAnalyzer'>{val.sin}</td>
                                                <td data-title="Station">{val.stationBelong ? val.stationBelong : 'None'}</td>
                                                <td data-title="Make">{val.analyzerMake}</td>
                                                <td data-title="Read More"><Link to={`/analyzer/${val._id}`}><ReadOutlined className='btnReadMore' title='Open Analyzer' /></Link></td>
                                            </tr>

                                        </tbody>
                                    )
                                })
                        }
                    </table>
                    {
                        analyzers.length <= 0 && (
                            <span className='zeroAnalyzers'>No one analyzer has been created yet! Create a new one! <PlusCircleFilled className='addAnalyzer' title='Create Analyzer' onClick={() => setCreateAnalyzer(true)} style={{ fontSize: '25px' }} /></span>
                        )
                    }
                </div>
            }
        </div>
    )
}

export default Analyzers

