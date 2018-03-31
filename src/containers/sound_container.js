'use strict';

import React, {Component} from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, Alert } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet } from "react-native";

import Sound from 'react-native-sound';

class SoundContainer extends Component {

  constructor(props) {
    super(props);
    Sound.setCategory('Playback');
    this.state = {
    };
  }

  render() {
    return (
        <Container>
            <Header>
                <Body>
                <Title>FeelMusic App - Compass</Title>
                </Body>
            </Header>
            <Content padder contentContainerStyle={{}}>
                <Button onPress={() => Actions.pop() }>
                    <Icon name='arrow-back' />
                    <Text>Back</Text>
                </Button>
                <Button onPress={() =>  {sound1.setVolume(0.3);
                  sound1.play();} }>
                    <Text>sound 1</Text>
                </Button>
                <Button onPress={() =>  {
                  sound2.play()} }>
                    <Text>sound 2</Text>
                </Button>
            </Content>
        </Container>
    );
  }
}

var sound1 = new Sound( require('./../samples/sample.mp3'), (error) => {
  if (error) {
    console.log('error occured', error)
  }
});

var sound2 = new Sound( require('./../samples/frog.wav'), (error) => {
  if (error) {
    console.log('error occured', error)
  }
});



function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SoundContainer);
