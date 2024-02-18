import './addsite.css';
import { useEffect, useState } from 'react';
import {client} from '../client';
import Spinner from '../components/Spinner'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { notifyError, notifySuccess } from '../utils/notifications';
import {SearchOutlined } from '@ant-design/icons'
import validator from 'validator'
import CountUp from 'react-countup';
import { AnalyzerObject, uploadImageFunc } from '../utils/helperFunctions';
import { IoMdAdd } from "react-icons/io";
import { ToastContainer } from 'react-toastify';
import allNetworks from '../utils/networks.json'
import offices from '../utils/offices.json'


const AddSite = ({user, analyzers, setAnalyzers, setCreateAnalyzer, setStation, station}) => {
    const [wrongImageType, setWrongImageType] = useState(false);
    const [uploadImage, setUploadImage]= useState(null);
    const [loading, setLoading] = useState(false);
    const [stationName, setStationName] = useState("");
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [allAnalyzers, setAllAnalyzers] = useState(analyzers);
    const [analyzerArray, setAnalyzerArray] = useState([]);
    const [showCounter, setShowCounter] = useState(false);
    const [office, setOffice] = useState("");
    const [checkBoxValue, setCheckBoxValue ] = useState(null);
    const [network, setNetwork] = useState("");
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(true)
    const [imgError, setImgError] = useState(false);
    const [searchAnalyzer, setSearchAnalyzer] = useState("");

    useEffect(() => {
        setAllAnalyzers(analyzers)
    }, [analyzers])

    const addSiteToAnalyzer = (analyzerArray, stationName) => {
        if(analyzerArray?.length > 0 ){
            analyzerArray?.map((value) => {
                client.patch(value.id).set(({
                    stationBelong: stationName
                }))
                .commit()
                .catch((err) => {
                    console.log('Cannot add station name to analuzer: ' + err.message);
                })
            })
            setAnalyzers(
                analyzers?.map((value) => { //updating analyzer array with stationBelong name
                    let bID = false;
                    analyzerArray?.map(obj => {
                        if(obj.id === value._id) bID = true;
                    })
                    if(bID)
                        return {...value, stationBelong: stationName }
                    else
                        return value;
                })
            );
            
        } 
    }

    const handleOnchange = (e) => {
        const analyzer_id = e.target.value;
        const selectedAnalyze = allAnalyzers?.filter((val) => {
            if(val._id === analyzer_id){
                return val;
            }
        })
        
        const newAnalyzerObject = AnalyzerObject(analyzer_id, selectedAnalyze);
        setAnalyzerArray(analyzerArray.concat(newAnalyzerObject))

        const newAnalyzerList = allAnalyzers?.filter(val => val._id !== analyzer_id); // delete option from select
        setAllAnalyzers([...newAnalyzerList]);
    }

    const removeAnalyzer = (id) => {
        const newArray = analyzerArray.filter(analyzer => analyzer.id !== id);
        setAnalyzerArray(newArray);
        const updateArrayList = analyzers.filter(val => {
            if(val._id === id) {
                return val
            }
        })
        setAllAnalyzers(allAnalyzers.concat(updateArrayList));
    }


    const saveStation = (e) => {
        e.preventDefault();
        addSiteToAnalyzer(analyzerArray, stationName)
        if(!uploadImage){
            setImgError(true);
        }
        else {
            setImgError(false);
        }
        if(!isValid){
            notifyError('Address must be a link!')
        }
        else {
            if(stationName && uploadImage && address && office && network && analyzerArray) {
               const doc = {
                    _type: 'station',
                    title: stationName,
                    note,
                    address,
                    image: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: uploadImage?._id
                        }
                    },
                    isCompleted: false,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?._id
                    },
                    analyzers: analyzerArray,
                    officeType: office,
                    networkType: network
                };
                client.create(doc).then((promise) => {
                    if(station){
                        setStation([...station, promise]);
                    }
                    else {
                        setStation(promise);
                    }
                    setShowCounter(true)
                    notifySuccess("Station was created!");
                    setTimeout(() => { 
                        navigate('/');
                    }, 6000)
                    
                })
                addSiteToAnalyzer(analyzerArray, stationName) //add station name to analyzers 
    
            }
            else {
                notifyError("Make sure form is filled up!");
            }
        }
    }

    const handleInputChange = (item) => {
        if(item === checkBoxValue) {
            setCheckBoxValue(null)
        }
        else {
            setCheckBoxValue(item)
        }
    }

    if(!allAnalyzers) {
        return (
            <Spinner />
        )
    }

    const validateAddress = (e) => {
        const url = e.target.value;
       if(validator.isURL(url)){
        setIsValid(true);
        setAddress(url);
       }
       else {
        setIsValid(false);
       }
    }

    return (  
        <div className="newItemBox">
             {
                showCounter === true? 
                    <div className='counterUp'>
                    <p>Redirect to main page in 5 sec</p>
                    <CountUp 
                        className='counter'
                        end={5}
                        duration={5}
                    />
                    </div> 
                    :
                    ( 
                        <form className='newitemForm'>
                             <label>Station Name</label>
                             <input 
                                 placeholder='Enter station name'
                                 onChange={(e)=> setStationName(e.target.value)}
                                 maxLength={20}
                                 
                             />
                             <label className='stationNote'>Note</label>
                             <input 
                                 placeholder='Enter note'
                                 onChange={(e)=> setNote(e.target.value)}
                                 
                                 maxLength={80}
                             />
                               <label  className={`${!isValid && 'invalidAddress'}`}>Address</label>
                             <input 
                                className={`${!isValid && 'invalidAddress'} `}   
                                 type='url'
                                 placeholder='Station address link from Google/Apple map'
                                 onChange={(e)=> validateAddress(e)}
                                
                             />
                             <div className='analyzerList'>
                             <label>Select Analyzer</label>
                             <div className='lookForAnalyzer'>
                                <SearchOutlined className='searchAnalyzersIcon'/>
                                <input 
                                    placeholder='Search by parameter/sin'
                                    type='text'
                                    value={searchAnalyzer}
                                    onChange={(e)=>setSearchAnalyzer(e.target.value)}
                                />
                             </div>
                                 <select
                                     size={4}
                                     multiple={true}
                                     onChange={handleOnchange}
                                    
                                 >
                                     {
                                         allAnalyzers?.filter((value) => {
                                            let search = searchAnalyzer.replace(/ /g, "").toLowerCase();
                                            if(search === "") 
                                                return value;
                                            else if(`${value.sin}`.replace(/ /g, "").toLocaleLowerCase().includes(search) || `${value.analyzerParameter}`.replace(/ /g, "").toLocaleLowerCase().includes(search)) 
                                                return value;
                                         })
                                         .map((analyzer) => {
                                            if(analyzer.stationBelong === "" || analyzer.stationBelong === null) { //checkig if analyzer doesn't belong to other station, if belongs, do not display
                                                return ( 
                                                    <option
                                                        value={analyzer._id}
                                                        key={analyzer._id} 
                                                    >
                                                       {analyzer.analyzerParameter} - {analyzer.sin.slice(0, 20).toUpperCase()}
                                                    </option>
                                                )
                                            }
                                         })
                                     }
                                 </select>
                             </div>
                             <button className='addNewAnalyzer' onClick={() => setCreateAnalyzer(true)} title='Create Analyzer in system'><span class="text">Create Analyzer</span></button>
                             <div className='offices'>
                             <label>Select Office</label>
                                {
                                    offices.map((office) => (
                                      <div key={office.id} className='checkBoxContainer'>
                                        <input 
                                            type="checkbox" 
                                            value={office.name} 
                                            onChange={() => handleInputChange(office.name)}
                                            onClick={(e) =>  setOffice(e.target.value)}
                                            checked={checkBoxValue===office.name}    
                                        />
                                        <label>{office.name}</label>
                                      </div>
                                    ))
                                }
                             </div>
                             <div className='networksSelection'>
                                <select
                                    onChange={(e) => setNetwork(e.target.value)}
                                    required
                                    defaultValue={'select'}
                                >   
                                <option value='select' disabled>Select Network</option>
                                {
                                        allNetworks.map((value) => {
                                            if(value.name !== "All") {
                                                return(
                                                    <option
                                                        key={value.id}
                                                    >
                                                        {value.name}
                                                    </option>
                                                )
                                            }
                                        })
                                }
                                </select>
                             </div>
                             <div style={{width: '100%', marginTop: '1rem'}}>
                                 {analyzerArray && (
                                     <div className='selectedAnalyzers'> 
                                         {
                                             analyzerArray.map((val) => (
                                                 <div key={val._key} className="eachAnalyzer">
                                                 <p 
                                                     title='click to remove'
                                                     onClick={() => removeAnalyzer(val.id)}>
                                                     {val.analyzerParameter}-{val.model.slice(0, 5)} 
                                                 </p>
                                                 </div>
                                             ))
                                         }
                                     </div>
                                 )}
             
                             </div>
                            <div>
                            </div>
                            {
                                 loading && <Spinner />
                            }
                            {
                                 wrongImageType && <p>Wrong image type</p>
                            }
                            {
                                 !uploadImage?
                                 (
                                     <label className='uploadSection'>
                                        <div className={imgError === false? 'uploadImage' : 'uploadImage imgError'}>
                                         <div className='uploadBtn'>
                                             <AiOutlineCloudUpload className='uploadIcon'/>
                                             <p className={{fontWeight: 'bold'}}>
                                             Click to upload
                                             </p>
                                         </div>
                                         <input 
                                            required
                                             type='file'
                                             onChange={(e) => uploadImageFunc(e, setWrongImageType, setLoading, setUploadImage)}
                                             name='upload_image'
                                             className='imageInput'
                                         />
                                        </div>
                                    </label>
                                 )
                                 :
                                 (
                                     <div className='displayImage'>
                                         <img 
                                             src={uploadImage?.url}
                                             alt="uploaded_image"
                                             className='uploadedImage'
                                         />
                                         <button
                                             type='button'
                                             className='deleteImgBtn'
                                             onClick={() => setUploadImage(null)}
                                         >
                                            <MdDelete /> 
                                         </button>
                                     </div>
                                 )
                            }
                            <button onClick={saveStation} className='createStationBtn' title='Create station'>Add Station</button>
                           
                        </form>
                    )
               } 
         <ToastContainer  /> 
        </div>
    );
}

export default AddSite;