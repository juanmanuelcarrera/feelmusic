import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configure_store'
import FeelMusicApp from './containers/feelmusic_app'

const store = configureStore({
    compass: {
        degrees: 0,
        zone: 0
    },
    sound: {
        paths: [
            "./../samples/sample1.mp3", 
            "./../samples/sample2.wav", 
            "./../samples/sample3.wav", 
            "./../samples/sample4.wav"
        ]
    }
  });

store.subscribe(() => {
    console.log("State:")
    console.log(store.getState())
})

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <FeelMusicApp />
            </Provider>
        );
    }
}