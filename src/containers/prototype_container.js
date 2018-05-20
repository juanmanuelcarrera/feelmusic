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
		
		Sound.setCategory('Playback');
		this.state = {
			bucle: 0,
			cuadricula: 0,
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
				if (acceleration.z > -0.7)
					this.setState({ cont: 'no' });
				if(acceleration.x < -0.7){
					this.setState({ bucle: 1 });
					this.setState({ cont: 'ok' });
				}
				if(acceleration.x > 0.7){
					this.setState({ volume: 1 });
					this.setState({ cont: 'ok' });
				}
			}
			else {
				if (acceleration.z > 7)
				//reproducir sonido
					this.setState({ cont: 'ok' });
				if (acceleration.z < 7)
					this.setState({ cont: 'no' });
				if(acceleration.x > 7){
					this.setState({ bucle: 1 });
					this.setState({ cont: 'ok' });
				}
				if(acceleration.x < -7){
					this.setState({ volume: 1 });
					this.setState({ cont: 'ok' });
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
		const { acceleration, gyroscope, cont, times, out } = this.state;;
		if(this.state.out == 0){
			if(this.state.cuadricula == 0){
				if (this.state.cont == 'ok') {
					if (this.state.zone == 1) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound1.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound1.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound1.setVolume(1.0);
									sound1.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound1.setNumberOfLoops(-1);
							sound1.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound1.setVolume(0.5);
							sound1.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound2.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound2.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound2.setVolume(1.0);
									sound2.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound2.setNumberOfLoops(-1);
							sound2.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound2.setVolume(0.5);
							sound2.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound3.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound3.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound3.setVolume(1.0);
									sound3.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound3.setNumberOfLoops(-1);
							sound3.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound3.setVolume(0.5);
							sound3.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 4) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound4.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound4.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound4.setVolume(1.0);
									sound4.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound4.setNumberOfLoops(-1);
							sound4.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound4.setVolume(0.5);
							sound4.play();
							this.state.volume = 2;
						}
					}
				} else if (this.state.cont == 'no') {
					this.state.times = 0;
				}
			}
			if(this.state.cuadricula == 1){
				if (this.state.cont == 'ok') {
					if (this.state.zone == 1) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound5.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound5.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound5.setVolume(1.0);
									sound5.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound5.setNumberOfLoops(-1);
							sound5.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound5.setVolume(0.5);
							sound5.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound6.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound6.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound6.setVolume(1.0);
									sound6.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound6.setNumberOfLoops(-1);
							sound6.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound6.setVolume(0.5);
							sound6.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound7.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound7.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound7.setVolume(1.0);
									sound7.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound7.setNumberOfLoops(-1);
							sound7.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound7.setVolume(0.5);
							sound7.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 4) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound8.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound8.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound8.setVolume(1.0);
									sound8.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound8.setNumberOfLoops(-1);
							sound8.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound8.setVolume(0.5);
							sound8.play();
							this.state.volume = 2;
						}
					}
				} else if (this.state.cont == 'no') {
					this.state.times = 0;
				}
			}
			if(this.state.cuadricula == 2){
				if (this.state.cont == 'ok') {
					if (this.state.zone == 1) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound9.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound9.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound9.setVolume(1.0);
									sound9.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound9.setNumberOfLoops(-1);
							sound9.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound9.setVolume(0.5);
							sound9.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound10.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound10.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound10.setVolume(1.0);
									sound10.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound10.setNumberOfLoops(-1);
							sound10.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound10.setVolume(0.5);
							sound10.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound11.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound11.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound11.setVolume(1.0);
									sound11.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound11.setNumberOfLoops(-1);
							sound11.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound11.setVolume(0.5);
							sound11.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 4) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound12.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound12.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound12.setVolume(1.0);
									sound12.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound12.setNumberOfLoops(-1);
							sound12.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound12.setVolume(0.5);
							sound12.play();
							this.state.volume = 2;
						}
					}
				} else if (this.state.cont == 'no') {
					this.state.times = 0;
				}
			}
			if(this.state.cuadricula == 3){
				if (this.state.cont == 'ok') {
					if (this.state.zone == 1) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound13.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound13.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound13.setVolume(1.0);
									sound13.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound13.setNumberOfLoops(-1);
							sound13.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound13.setVolume(0.5);
							sound13.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 2) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound14.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound14.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound14.setVolume(1.0);
									sound14.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound14.setNumberOfLoops(-1);
							sound14.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound14.setVolume(0.5);
							sound14.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 3) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound15.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound15.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound15.setVolume(1.0);
									sound15.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound15.setNumberOfLoops(-1);
							sound15.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound15.setVolume(0.5);
							sound15.play();
							this.state.volume = 2;
						}
					} else if (this.state.zone == 4) {
						if(this.state.bucle == 0 || this.state.bucle == 2 || this.state.volume == 2 || this.state.volume == 0){
							if (this.state.times <= 7) {
								sound16.play();
								this.state.times += 1;
							}
							else{
								 if (this.state.bucle == 2){
									sound16.stop();
									this.state.bucle = 0;
								}
								if(this.state.volume == 2){
									sound16.setVolume(1.0);
									sound16.play();
									this.state.volume = 0;
								}
							}
						}
						if (this.state.bucle == 1){
							sound16.setNumberOfLoops(-1);
							sound16.play();
							this.state.bucle = 2;
						}
						if(this.state.volume == 1){
							sound16.setVolume(0.5);
							sound16.play();
							this.state.volume = 2;
						}
					}
				} else if (this.state.cont == 'no') {
					this.state.times = 0;
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
					<Text>{'  volume = ' + this.state.volume}</Text>
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

var sound5 = new Sound(require('./../samples/sample5.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound6 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound7 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound8 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound9 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound10 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound11 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound12 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound13 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound14 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound15 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound16 = new Sound(require('./../samples/sample2.wav'), (error) => {
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
