'use strict';

import React, {Component} from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet } from "react-native";



import RNSensors from 'react-native-sensors';
const { Accelerometer, Gyroscope } = RNSensors;
const accelerationObservable = new Accelerometer({
  updateInterval: 500, // defaults to 100ms
});

const gyroscopeObservable = new Gyroscope({
  updateInterval: 2000, // defaults to 100ms
});


class SensorContainer extends Component {
 


  constructor(props) {
    super(props);
    this.state = {
	acceleration: {
        x: 'unknown',
        y: 'unknown',
        z: 'unknown',
      },
      gyroscope: {
        x: 'unknown',
        y: 'unknown',
        z: 'unknown',
      },
	cont : 'noo'
    };
  }



componentWillMount() {
    accelerationObservable
      .subscribe((acceleration) => { 
this.setState({acceleration,}); 
if (acceleration.z > 7)
	//reproducir sonido
	this.setState({cont: 'ok'});
if(acceleration.y > 7)	
	this.setState({cont: 'no'});	
});
	

	

    gyroscopeObservable
      .subscribe(gyroscope => this.setState({
        gyroscope,
      }));
  }

//funciones en ec6
detect(){
acceleration => {if(acceleration.z > 7)  cont= ok}
}

componentWillUnmount() {
    accelerationObservable.stop();
    gyroscopeObservable.stop();
  }


  render() {
const {
      acceleration,
      gyroscope,
	cont
    } = this.state;

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
                    <Text>Backo</Text>
                </Button>
<Text>
{acceleration.x + '/' + acceleration.y + '/' + acceleration.z + '  cont = ' + cont}
</Text>

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


export default connect(mapStateToProps, mapDispatchToProps)(SensorContainer);
