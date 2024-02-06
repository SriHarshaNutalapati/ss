import { useEffect, useState } from 'react';
import Header from './layout/Header';
import Main from './layout/Main';
import Modals from './components/Modals';
import { getLocalData, hydrate, setBoardStatus } from './reducer/dataSlice';
import { closeModal, openModal } from './reducer/modalSlice';
import { toggleTheme } from './reducer/dataSlice';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { setTab } from './reducer/boardTabSlice';
import './App.scss';
import { loadState, getStore, saveState } from './store';
import GoogleButton from 'react-google-button';
import {signInWithPopup} from "firebase/auth";
import {auth,provider} from "./firebase";
import { throttle } from 'lodash';

const store = await getStore();

const App = () => {
  const dispatch = useAppDispatch();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const colorTheme = useAppSelector((state) => state.data.colorTheme);
  const handleColorTheme = () => {
    return colorTheme === 'dark' ? dispatch(toggleTheme('light')) : dispatch(toggleTheme('dark'));
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(closeModal);
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await import('./data/data.json');
        const data = response.boards;
        dispatch(getLocalData(data));
        dispatch(setTab(data[0].name));
        dispatch(setBoardStatus(data[0].name));
      } catch (err) {
        console.error(err);
      }
    };
    const loadData = async () => {
      const store = await getStore();
      const persistedState = await loadState();
      if (persistedState) {
        store.dispatch(hydrate(persistedState.data));
      }
      if (persistedState && persistedState.data.data.length === 0) {
        // fetchData();
      }
    };
  
    loadData();
    // fetchData();

    if(localStorage.getItem('email')) setIsSignedIn(true)

  }, []);

  if(isSignedIn){
    store.subscribe(
      throttle(() => {
        saveState(store.getState());
      }, 1000)
    );
  }

  const handleClick =()=>{
    if(localStorage.getItem('email')){
      window.location.reload();
      return;
    }
    signInWithPopup(auth,provider).then((data)=>{
        setIsSignedIn(data.user.email)
        localStorage.setItem("email",data.user.email);
    })
  }

  return (
    <div className={`App ${colorTheme}`}>
      <Header colorTheme={colorTheme} isSignedIn={isSignedIn}/>
      {isSignedIn?(
        <>
          <Main themeChange={handleColorTheme} />
          <Modals />
        </>
      ):(
        <div className='signinpage' style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#20212C", flexDirection: "column"}}>
          <h1 style={{color: "#fff"}}>Signin with google to continue</h1>
          <br />
          <GoogleButton onClick={handleClick}/>
        </div>
      )}

    </div>
  );
};

export default App;
