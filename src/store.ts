import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './reducer/dataSlice';
import boardTabReducer from './reducer/boardTabSlice';
import modalReducer from './reducer/modalSlice';
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";
import db from './firebase'

const KEY = 'kanban-app-state';
export const loadState = async () => {
  try {
    let serializedState = undefined;

    await new Promise((resolve, reject) => {
      onSnapshot(collection(db, "seoulspice"), (snapshot) => {
        serializedState = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0]["boardTab"];
        resolve();
      }, reject);
    });

    if (!serializedState) return undefined;

    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Error fetching data:", e);
    return undefined;
  }
};

export const saveState = async (state: any) => {
  try {
    console.log("sss");
    if(!localStorage.getItem("email")){
      window.location.reload();
    }
    state = {"boardTab": JSON.stringify(state)}
    // const serializedState = JSON.stringify(state);
    const docRef = doc(db, "seoulspice", "SLO9uhcQ2R20DKTMYTBm");
    // localStorage.setItem(KEY, serializedState);

    setDoc(docRef, state);
  } catch (e) {
    console.error(e);
  }
};

// export const store = configureStore({
//   reducer: {
//     data: dataReducer,
//     boardTab: boardTabReducer,
//     modal: modalReducer,
//   },
//   preloadedState: loadState(),
// });

const initializeStore = async () => {
  const persistedState = await loadState();
  return configureStore({
    reducer: {
      data: dataReducer,
      boardTab: boardTabReducer,
      modal: modalReducer,
    },
    preloadedState: persistedState,
  });
};

export const storePromise = initializeStore(); // Store promise to ensure asynchronous initialization

export const getStore = async () => {
  return await storePromise; // Returns the configured store once it's initialized
};

export type RootState = ReturnType<ReturnType<typeof getStore>['getState']>;
export type AppDispatch = ReturnType<typeof getStore>['dispatch'];