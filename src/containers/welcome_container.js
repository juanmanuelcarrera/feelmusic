'use strict';

import React, {Component} from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title } from 'native-base';


import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';

import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginBottom: 20,
    },
});

class WelcomeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <Container>
            <Header>
                <Body>
                <Title>FeelMusic App</Title>
                </Body>
            </Header>
            <Content padder contentContainerStyle={{ justifyContent: 'center', flex: 1, flexDirection: 'column' }}>
                <Button onPress={() => Actions.sensor_container() } style={styles.button} full={true}>
                    <Icon name='speedometer' />
                    <Text>Sensors</Text>
                </Button>
                <Button onPress={() => Actions.sound_container() } style={styles.button} full={true}>
                    <Icon name='musical-notes' />
                    <Text>Music</Text>
                </Button>
                <Button onPress={() => Actions.compass_container() } style={styles.button} full={true}>
                    <Icon name='compass' />
                    <Text>Compass</Text>
                </Button>
                <Button onPress={() => Actions.prototype_container() } style={styles.button} full={true}>
                    <Icon name='compass' />
                    <Text>Prototype</Text>
                </Button>
            </Content>
        </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WelcomeContainer);
