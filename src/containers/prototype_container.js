'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet, Dimensions } from 'react-native';

import RNSimpleCompass from 'react-native-simple-compass';
import RNSensors from 'react-native-sensors';
import Sound from 'react-native-sound';

class PrototypeContainer extends Component {
	constructor(props) {
		super(props);
		Sound.setCategory('Playback');
		this.state = {
			times: 0,
			acceleration: {
				x: 'unknown',
				y: 'unknown',
				z: 'unknown'
			},
			gyroscope: {
				x: 'unknown',
				y: 'unknown',
				z: 'unknown'
			},
			cont: 'no',
			currentDegree: 0,
			zone: 1,
			zone1Color: 'green',
			zone2Color: 'red',
			zone3Color: 'blue',
			zone4Color: 'yellow'
		};

		var newZone;

		RNSimpleCompass.start(10, (degree) => {
			if (degree >= 0 && degree < 90) {
				newZone = 1;
			} else if (degree >= 90 && degree < 180) {
				newZone = 2;
			} else if (degree >= 180 && degree < 270) {
				newZone = 3;
			} else {
				newZone = 4;
			}
			this.setState({
				currentDegree: degree,
				zone: newZone
			});
		});
	}

	componentWillMount() {
		accelerationObservable.subscribe((acceleration) => {
			this.setState({ acceleration });
			if (acceleration.z > 7)
				//reproducir sonido
				this.setState({ cont: 'ok' });
			if (acceleration.y > 7) this.setState({ cont: 'no' });
		});
		gyroscopeObservable.subscribe((gyroscope) =>
			this.setState({
				gyroscope
			})
		);
	}

	//funciones en ec6
	detect() {
		(acceleration) => {
			if (acceleration.z > 7) cont = ok;
		};
	}

	componentWillUnmount() {
		accelerationObservable.stop();
		gyroscopeObservable.stop();
	}

	render() {
		const { acceleration, gyroscope, cont, times } = this.state;
		if (this.state.cont == 'ok') {
			if (this.state.zone == 1) {
				if (this.state.times <= 10) {
					sound1.play();
					this.state.times += 1;
				}
			} else if (this.state.zone == 2) {
				if (this.state.times <= 10) {
					sound2.play();
					this.state.times += 1;
				}
			} else if (this.state.zone == 3) {
				if (this.state.times <= 10) {
					sound3.play();
					this.state.times += 1;
				}
			} else if (this.state.zone == 4) {
				if (this.state.times <= 10) {
					sound4.play();
					this.state.times += 1;
				}
			}
		} else if (this.state.cont == 'no') {
			this.state.times = 0;
		}
		return (
			<Container>
				<Header>
					<Body>
						<Title>FeelMusic App - Compass</Title>
					</Body>
				</Header>
				<Content padder contentContainerStyle={{}}>
					<Button
						onPress={() => {
							sound1.stop(), sound2.stop();
							sound3.stop();
							sound4.stop();
							Actions.pop();
						}}
					>
						<Icon name="arrow-back" />
						<Text>Back</Text>
					</Button>
					<Text>{acceleration.x + '/' + acceleration.y + '/' + acceleration.z + '  cont = ' + cont}</Text>
					<Text>{'  times = ' + times}</Text>
					<Button
						onPress={() => {
							sound1.setVolume(0.3);
							sound1.play();
						}}
					>
						<Text>sound 1</Text>
					</Button>
					<Button
						onPress={() => {
							sound2.play();
						}}
					>
						<Text>sound 2</Text>
					</Button>
					<Text> Degrees: {this.state.currentDegree} </Text>
					<Text> Zone: {this.state.zone} </Text>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								padding: 0
							}}
						>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'green',
										borderTopLeftRadius: circleSize,
										opacity: this.state.zone == 1 ? 1 : 0.3
									}
								]}
							/>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'red',
										borderTopRightRadius: circleSize,
										opacity: this.state.zone == 2 ? 1 : 0.3
									}
								]}
							/>
						</View>
						<View
							style={{
								flexDirection: 'row',
								padding: 0
							}}
						>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'blue',
										borderBottomLeftRadius: circleSize,
										opacity: this.state.zone == 4 ? 1 : 0.3
									}
								]}
							/>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'yellow',
										borderBottomRightRadius: circleSize,
										opacity: this.state.zone == 3 ? 1 : 0.3
									}
								]}
							/>
						</View>
					</View>
				</Content>
			</Container>
		);
	}
}

const circleSize = Dimensions.get('window').width * 0.4;

const styles = StyleSheet.create({
	circle: {
		width: circleSize,
		height: circleSize
	}
});

var sound1 = new Sound(require('./../samples/sample1.mp3'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound2 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound3 = new Sound(require('./../samples/sample3.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound4 = new Sound(require('./../samples/sample4.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

const { Accelerometer, Gyroscope } = RNSensors;
const accelerationObservable = new Accelerometer({
	updateInterval: 500 // defaults to 100ms
});

const gyroscopeObservable = new Gyroscope({
	updateInterval: 2000 // defaults to 100ms
});

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);
