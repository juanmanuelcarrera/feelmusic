'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet, Dimensions, Platform, AppState } from 'react-native';

import RNSimpleCompass from 'react-native-simple-compass';
import RNSensors from 'react-native-sensors';
import Sound from 'react-native-sound';

class PrototypeContainer extends Component {
	constructor(props) {
		super(props);
		Sound.setCategory("Playback");
		this.state = {
			bucle: 0,
			cuadricula: 0,
			contador: 0,
			sonido: 0,
			volume: 0,
			out: 0,
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

			if (Platform.OS === "ios") {
				if (acceleration.z < -0.7 )
					//reproducir sonido
					this.setState({ cont: 'ok' });
				if (acceleration.z > -0.7 && (acceleration.x > -0.2 && acceleration.x < 0.2))
					this.setState({ cont: 'no' });
					if(acceleration.x < -0.7){
						this.setState({ cont: 'ok' });
						if(this.state.bucle == 0)
							this.state.bucle = 1;
						else if(this.state.bucle == 1){
								this.state.bucle = 2;
						}
					}
					else if(acceleration.x > 0.7){
						this.setState({ cont: 'ok' });
						if(this.state.sonido == 0)
							this.state.sonido = 1;
					}
					else if(acceleration.x < 0.7){
						//this.setState({ cont: 'no' });
						if(this.state.sonido == 1)
							this.state.sonido = 0;
					}
			}
			else {
				if (acceleration.z > 7)
				//reproducir sonido
					this.setState({ cont: 'ok' });
				if (acceleration.z < 7 && (acceleration.x < 2 && acceleration.x > -2))
					this.setState({ cont: 'no' });
				if(acceleration.x > 7){
					this.setState({ cont: 'ok' });
					if(this.state.bucle == 0)
						this.state.bucle = 1;
					else if(this.state.bucle == 1){
							this.state.bucle = 2;
					}
				}
				else if(acceleration.x < -7){
					this.setState({ cont: 'ok' });
					if(this.state.sonido == 0)
						this.state.sonido = 1;
				}
				else if(acceleration.x > -7){
					//this.setState({ cont: 'no' });
					if(this.state.sonido == 1)
						this.state.sonido = 0;
				}
			}
			/*if (acceleration.z > (Platform.OS == "ios" ? 0.7 : 0))
				//reproducir sonido
				this.setState({ cont: 'ok' });
			if (acceleration.y > (Platform.OS == "ios" ? 0.7 : 0))
				this.setState({ cont: 'no' });*/
		});
		gyroscopeObservable.subscribe((gyroscope) =>
			this.setState({
				gyroscope
			})
		);
		AppState.addEventListener('change', (state) => {
      if(state === 'active'){
				this.setState({
					out: 0
				})
      }
			else if (state === 'background'){
				this.setState({
					out: 1
				})
			}
    });
	}

	//funciones en ec6
	detect() {
		(acceleration) => {
			if (acceleration.z > 7) cont = ok;
			if (acceleration.x > 7) bucle = 1;
			if (acceleration.x < -7) volume = 1;
		};
	}

	componentWillUnmount() {
		accelerationObservable.stop();
		gyroscopeObservable.stop();
		AppState.removeEventListener('change', (state) => {
      if(state === 'active'){
				this.setState({
					out: 0
				})
      }
			else if (state === 'background'){
				this.setState({
					out: 1
				})
			}
    });
	}

	render() {

		const { acceleration, gyroscope, cont } = this.state;;
		if(this.state.out == 0){
			if(this.state.cuadricula == 0){
				if(this.state.cont == 'ok') {
					if(this.state.zone == 1) {
						if(this.state.bucle == 2){
							sound1.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound1.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound1.setNumberOfLoops(-1);
							sound1.play();
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 2){
							sound2.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound2.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound2.setNumberOfLoops(-1);
							sound2.play();
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 2){
							sound3.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound3.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound3.setNumberOfLoops(-1);
							sound3.play();
						}
					}
					else if (this.state.zone == 4) {
						if(this.state.bucle == 2){
							sound4.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound4.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound4.setNumberOfLoops(-1);
							sound4.play();
						}
				}
			}else {
				if(this.state.bucle >= 1)
				this.state.bucle = 0;
				if(this.state.sonido == 1)
				this.state.sonido = 0;
			}
		}
			if(this.state.cuadricula == 1){
				sound5.setVolume(0.5);
				sound6.setVolume(0.5);
				sound7.setVolume(0.5);
				sound8.setVolume(0.5);
				if(this.state.cont == 'ok') {
					if(this.state.zone == 1) {
						if(this.state.bucle == 2){
							sound5.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound5.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound5.setNumberOfLoops(-1);
							sound5.play();
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 2){
							sound6.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound6.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound6.setNumberOfLoops(-1);
							sound6.play();
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 2){
							sound7.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound7.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound7.setNumberOfLoops(-1);
							sound7.play();
						}
					}
					else if (this.state.zone == 4) {
						if(this.state.bucle == 2){
							sound8.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound8.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound8.setNumberOfLoops(-1);
							sound8.play();
						}
				}
			}else {
				if(this.state.bucle >= 1)
				this.state.bucle = 0;
				if(this.state.sonido == 1)
				this.state.sonido = 0;
			}
			}
			if(this.state.cuadricula == 2){
				if(this.state.cont == 'ok') {
					if(this.state.zone == 1) {
						if(this.state.bucle == 2){
							sound9.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound9.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound9.setNumberOfLoops(-1);
							sound9.play();
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 2){
							sound10.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound10.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound10.setNumberOfLoops(-1);
							sound10.play();
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 2){
							sound11.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound11.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound11.setNumberOfLoops(-1);
							sound11.play();
						}
					}
					else if (this.state.zone == 4) {
						if(this.state.bucle == 2){
							sound12.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound12.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound12.setNumberOfLoops(-1);
							sound12.play();
						}
				}
			}else {
				if(this.state.bucle >= 1)
				this.state.bucle = 0;
				if(this.state.sonido == 1)
				this.state.sonido = 0;
			}
			}
			if(this.state.cuadricula == 3){
				sound13.setVolume(0.5);
				sound14.setVolume(0.5);
				sound15.setVolume(0.5);
				sound16.setVolume(0.5);
				if(this.state.cont == 'ok') {
					if(this.state.zone == 1) {
						if(this.state.bucle == 2){
							sound13.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound13.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound13.setNumberOfLoops(-1);
							sound13.play();
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 2){
							sound14.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound14.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound14.setNumberOfLoops(-1);
							sound14.play();
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 2){
							sound15.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound15.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound15.setNumberOfLoops(-1);
							sound15.play();
						}
					}
					else if (this.state.zone == 4) {
						if(this.state.bucle == 2){
							sound16.stop();
							this.state.bucle = 0;
						}
						else if(this.state.bucle == 0){
							if(this.state.sonido == 1){
									sound16.play();
							}
						}
						else if(this.state.bucle == 1) {
							sound16.setNumberOfLoops(-1);
							sound16.play();
						}
				}
			}else {
				if(this.state.bucle >= 1)
				this.state.bucle = 0;
				if(this.state.sonido == 1)
				this.state.sonido = 0;
			}
			}
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
							this.state.out = 1;
							Actions.pop();
						}}
					>
						<Icon name="arrow-back" />
						<Text>Back</Text>
					</Button>
					<Text>{acceleration.x + '/' + acceleration.y + '/' + acceleration.z + '  cont = ' + cont}</Text>
					<Text>{'  sonido  = ' + this.state.sonido}</Text>
					<Text>{'  bucle  = ' + this.state.bucle}</Text>
					<Button
						onPress={() => {
							sound2.setVolume(0.3);
							sound2.play();
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

var sound5 = new Sound(require('./../samples/sample1.mp3'), (error) => {


var sound6 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound7 = new Sound(require('./../samples/sample3.wav'), (error) => {


var sound8 = new Sound(require('./../samples/sample4.wav'), (error) => {


var sound9 = new Sound(require('./../samples/sample5.wav'), (error) => {


var sound10 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample6


var sound11 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample7


var sound12 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample8


var sound13 = new Sound(require('./../samples/sample5.wav'), (error) => {


var sound14 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample6


var sound15 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample7


var sound16 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample8


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
