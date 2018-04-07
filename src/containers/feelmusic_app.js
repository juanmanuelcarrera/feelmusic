'use strict';

import { Root } from "native-base";

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';

import {View, Text} from 'react-native';
import { connect } from 'react-redux';

import {Scene, Router, Stack} from 'react-native-router-flux';

import WelcomeContainer from './welcome_container';
import CompassContainer from './compass_container';
import SoundContainer from './sound_container';
import SensorContainer from './sensor_container';
import PrototypeContainer from './prototype_container';

class FeelMusicApp extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  render() {
    const { state, actions } = this.props;

    return (
        <Root>
            <Router>
                <Stack key="root">
                    <Scene key="welcome_container" initial={true} component={WelcomeContainer} hideNavBar title="Welcome"/>
                    <Scene key="compass_container" component={CompassContainer}  hideNavBar title="Compass"/>
                    <Scene key="sound_container" component={SoundContainer}  hideNavBar title="Sound"/>
                    <Scene key="sensor_container" component={SensorContainer}  hideNavBar title="Sensor"/>
                    <Scene key="prototype_container" component={PrototypeContainer}  hideNavBar title="Prototype"/>
                </Stack>
            </Router>
        </Root>

    )
  }
}

export default FeelMusicApp;
