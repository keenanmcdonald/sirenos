import React from 'react';
import moment from 'moment';
import galvanite from '../galvanite';
import revGeocoder from 'reverse-geocoding-google';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import languages from '../languages';
import cookie from 'cookie';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';

import '../css/sirenInfo.css';
const SirenInfo = (props) => {
  const cookies = cookie.parse(document.cookie);
  const source = "Primary";
  const [geoconfig, setGeoConfig] = React.useState({
    'latitude': props.currentUsrGeo.lat,
    'longitude': props.currentUsrGeo.lng,
    'key': galvanite.map_api_key
  });
  const [address, setAddress] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [iso, setiso] = React.useState(null);
  const [reCaptchaVar, setReCaptchaVar] = React.useState(false);

  React.useEffect(() => {
    if (geoconfig.latitude !== undefined || geoconfig.longitude !== undefined){
      revGeocoder.location(geoconfig, function (err, data){
        if (err) {
          console.log(err);
        }else {
          setAddress(data.results[0].formatted_address);
        }
      });
    }
    checkAuth()
  },[props.shouldBeVisible, props.sirenRes, iso, reCaptchaVar])

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  //Handle language
  const checkAuth = () => {
    if(props.language != null){
      // if data is in redux, use it.
      setiso(languages.types[props.language].iso);
      // setAuth(true)
    } else if (cookies["lang_id"] >= 0){
      // if data is in cookie, use it.
      setiso(languages.types[cookies["lang_id"]].iso);
      // setAuth(true)
    }else {
      // setAuth(false);
    }
  }

  // Handle data and add siren
  const handleMakeSiren = () => {
    const sirenPacket = {
      "lat": props.currentUsrGeo.lat, 
      "lng": props.currentUsrGeo.lng, 
      "date": moment().format("YYYY-MM-DD HH:mm:ss"), 
      "address": address, 
      "description": description, 
      "source": source
    }

    props.addSiren(sirenPacket);
  }

  const addSirenBtn = () => {
    if (description.length === 0 || !reCaptchaVar){
      return(
      <Button id="disabledAddBtn" variant="contained" disabled color="secondary">
        <AddCircleOutlineIcon />
        {props.text.addSiren}
      </Button>)
    }else {
      return(
      <Button onClick={handleMakeSiren} id="addBtn" variant="contained" color="secondary">
        <AddCircleOutlineIcon />
        {props.text.addSiren}
      </Button>)
    }
  }

  if (props.shouldBeVisible === false){
    return(
      <div className="siren-info-container">
        <span>
          <div className='field'>
            <p className='descriptor'>Siren ID:</p>
            <p className='value'>{props.sirenProps.sirenId}</p>
          </div>
          <div className='field'>
            <p className='descriptor'>{`${props.text.marker.date}: `}</p>
            <p className='value'>{moment(props.sirenProps.date).format('DD/MM/YYYY')}</p>
          </div>
        </span>
  
        <span>
          <div className='field'>
            <p className='value'>{props.sirenProps.address}</p>
          </div>
        </span>
  
        <span>
          <div className='field'>
            <p className='descriptor'>{`${props.text.marker.description}: `}</p>
            <p className='value'>{props.sirenProps.description}</p>
          </div>
        </span>
  
        <span>
          <div>
          </div>
        </span>
  
        <span>
          <div className='field'>
            <p className='descriptor'>{`${props.text.marker.source}: `}</p>
            <p className='value'>{props.sirenProps.source}</p>
          </div>
        </span>
      </div>
    )
  } else {
    return(
      
        <form className="siren-info-form-container" noValidate autoComplete="off">
          <span id="addressSpan">
            <div className='field'>
              <p className='value'>{address}</p>
            </div>
          </span>
    
          <span>
            <div className='field'>
              <TextField
              id="outlined-multiline-flexible"
              label={props.text.marker.description}
              multiline
              // rowsMax={4}
              value={description}
              onChange={handleChange}
              variant="outlined"
            />
            </div>
          </span>

          <span>
          <GoogleReCaptchaProvider
            reCaptchaKey={galvanite.reCaptcha}
            language={iso}
            id="recaptcha"
          >
            <GoogleReCaptcha onVerify={token => token ? setReCaptchaVar(true) : null} />
          </GoogleReCaptchaProvider>
          </span>
    
          <span>
            <div>
            </div>
          </span>
    
          <span id="addSirenSpan">
            {addSirenBtn()}
          </span>
        </form>
    )
  }
}

export default SirenInfo;