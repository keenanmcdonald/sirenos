import React from 'react';
import { Redirect } from "react-router-dom";
import languages from '../languages';
import Button from '@material-ui/core/Button';
import '../css/hi.css';
import blob from '../img/blob-2.png';
import siren from '../img/siren-1.png'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import countdown from 'countdown';
import cookie from 'cookie';

const cookies = cookie.parse(document.cookie);

const Hi = props => {
  const [text, setText] = React.useState(null);
  const [io, setio] = React.useState(null);
  const [cookieLang, setCookieLang] = React.useState(null);
  const [auth, setAuth] = React.useState(false)
  const [red, setRed] = React.useState(false)
  const [startTime, setStartTime] = React.useState(null)
  const [endTime, setEndTime] = React.useState(null)
  const [completed, setCompleted] = React.useState(0);
  const [state, setState] = React.useState({
    scrollHeight: 0,
    open: false,
    agreed: false
  })

  React.useEffect(() => {
    const checkAuth = () => {
      if(props.language != null){
        // if data is in redux, use it.
        setText(languages.types[props.language].hi)
        setio(languages.types[props.language].io)
        setCookieLang(languages.types[props.language].cookie)
        setAuth(true)
        } else if (cookies["lang_id"] >= 0){
          // if data is in cookie, use it.
          setText(languages.types[cookies["lang_id"]].hi);
          setio(languages.types[cookies["lang_id"]].io);
          setCookieLang(languages.types[cookies["lang_id"]].cookie);
          setAuth(true);
      }else {
        console.log('set state called b/c default')
        setAuth(false)
      }
    }
    checkAuth()
    window.addEventListener("scroll", scrollChange);
  }, [props.language, cookies["lang_id"]])

  // cool scroll effect
  const blobStyle = { 
    transform: `translate(0px, ${- state.scrollHeight/2}px)` 
  };
  const sirenStyle = { 
    transform: `translate(0px, ${- state.scrollHeight/5}px)` 
  };
  const scrollChange = () => {
    const y = window.scrollY;
    setState({scrollHeight: y})
  }
  // *** 
  

  

  // Material UI
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({open: false})
  };

  const checkSpecialLang = () => {
    switch(props.language ? props.language : cookies["lang_id"]){
      case 3:
        return'zh'
      case 4:
        return 'hi'
    }
    switch(cookies["lang_id"] ? cookies["lang_id"] : props.language){
      case 3:
        return'zh'
      case 4:
        return 'hi'
    }
  }

  const handleAgree = () => {
    console.log('Me llamaron?')
    // document.cookie = `lang_id=${props.language}; max-age= ${365*24*60*60}`;
    setState({open: true, agreed: true})
    setTimeout(() => {setRed(true); setStartTime(new Date()); setEndTime(new Date().getTime() + 5000)}, 5000)
    console.log(countdown(startTime, endTime))
  }
  const handleDisagree = () => {
    setState({open: true, agreed: false})
  }

  const checkLang = () => {
    if (cookies["lang_id"] >= 0) {
      return true;
    }else {
      return false;
    }
  }

  const Content = () => {
    return(
      <div id={checkSpecialLang()} className="hi-container">
       <h1>{auth ? text[0] : null}</h1>
       <img style={sirenStyle} className='siren-img' src={siren} />
       <div className='intro'>
         <p>{auth ? text[1] : null}</p>
         <img style={blobStyle} src={blob} />
       </div>
       <p className="question">{auth ? text[2] : null}</p>
       <div className='io'>
        <Button color='secondary' className="agree-bttn-yes" variant="contained" onClick={handleAgree}>
          <p>{auth ? io.yes : null}</p>
        </Button>
        <Button color='secondary' className="agree-bttn-no" variant="contained" onClick={handleDisagree}>
          <p>{auth ? io.no : null}</p>
        </Button>
       </div>
       {auth ? 
          <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={state.agreed ? cookieLang.true : cookieLang.false}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
              <CircularProgress variant="static" value={completed} />
            </React.Fragment>
          }
        /> :
        null
       }
       
     </div>
    )
  }

  const Component = () => {
    return(   
      red
        ? <Redirect to='/track' />
        : <Content />
      )
  }

  return (
    <Component />
  );
}

export default Hi;