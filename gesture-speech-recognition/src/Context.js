import React, { createContext, useReducer } from "react";

let reducer = (state, action) => {
  switch (action.type) {
    case "updateData":
      const {
        pinky,
        ring,
        middle,
        index,
        thumb,
        x,
        y,
        z,
        predict
      } = state.data;

      pinky.push({ x: pinky.length, y: action.payload.pinky });
      ring.push({ x: ring.length, y: action.payload.ring });
      middle.push({ x: middle.length, y: action.payload.middle });
      index.push({ x: index.length, y: action.payload.index });
      thumb.push({ x: thumb.length, y: action.payload.thumb });
      x.push({ x: x.length, y: action.payload.x });
      y.push({ x: y.length, y: action.payload.y });
      z.push({ x: z.length, y: action.payload.z });

      const data = {
        pinky,
        ring,
        middle,
        index,
        thumb,
        x,
        y,
        z,
        predict: action.payload.predict
      };
      return { ...state, data };

    case "updateTab":
      console.log("Context", { ...state, tab: action.payload });
      return { ...state, tab: action.payload };
    default:
      return;
  }
};

const initialState = {
  loading: true,
  data: {
    pinky: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    ring: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    middle: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    index: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    thumb: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    x: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    y: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    z: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 }
    ],
    predict: "None"
  },
  tab: "tts"
};

const StateContext = createContext(initialState);

const StateProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StateContext.Provider>
  );
};

export { StateContext, StateProvider };
