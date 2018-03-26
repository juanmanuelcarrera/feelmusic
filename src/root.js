import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configure_store'
import FeelMusicApp from './containers/feelmusic_app'

const store = configureStore();
// store.subscribe(() => console.log(store.getState()))


export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <FeelMusicApp />
            </Provider>
        );
    }
}