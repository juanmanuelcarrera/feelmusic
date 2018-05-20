'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View, Footer, FooterTab, Tab, Tabs, TabHeading } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet, Dimensions, Platform, AppState } from 'react-native';

import RNSimpleCompass from 'react-native-simple-compass';
import RNSensors from 'react-native-sensors';
import Sound from 'react-native-sound';

import { AppRegistry, TouchableHighlight, PermissionsAndroid } from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';


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
			zone4Color: 'yellow',
			useSoundR1: false,
			useSoundR2: false,
			currentTime: 0.0,
			recording: false,
			paused: false,
			stoppedRecording: false,
			finished: false,
			audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
			hasPermission: undefined
		};
		
		var newZone;
	}
	
	//preparar ruta donde grabar
	prepareRecordingPath(audioPath){
		AudioRecorder.prepareRecordingAtPath(audioPath, {
			SampleRate: 22050,
			Channels: 1,
			AudioQuality: "Low",
			AudioEncoding: "aac",
			AudioEncodingBitRate: 32000
		});
	}
	//FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
	
	
	componentDidMount() {
		this._checkPermission().then((hasPermission) => {
			this.setState({ hasPermission });
			
			if (!hasPermission) return;
			
			this.prepareRecordingPath(this.state.audioPath);
			
			AudioRecorder.onProgress = (data) => {
				this.setState({currentTime: Math.floor(data.currentTime)});
			};
			
			AudioRecorder.onFinished = (data) => {
				// Android callback comes in the form of a promise instead.
				if (Platform.OS === 'ios') {
					this._finishRecording(data.status === "OK", data.audioFileURL);
				}
			};
		});
	}
	
	_checkPermission() {
		if (Platform.OS !== 'android') {
			return Promise.resolve(true);
		}
		
		const rationale = {
			'title': 'Microphone Permission',
			'message': 'AudioExample needs access to your microphone so you can record audio.'
		};
		
		return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
		.then((result) => {
			console.log('Permission result:', result);
			return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
		});
	}
	
	_renderButton(title, onPress, active) {
		var style = (active) ? styles.activeButtonText : styles.buttonText;
		
		return (
			<TouchableHighlight style={styles.button} onPress={onPress}>
			<Text style={style}>
			{title}
			</Text>
			</TouchableHighlight>
		);
	}
	
	_renderPauseButton(onPress, active) {
		var style = (active) ? styles.activeButtonText : styles.buttonText;
		var title = this.state.paused ? "RESUME" : "PAUSE";
		return (
			<TouchableHighlight style={styles.button} onPress={onPress}>
			<Text style={style}>
			{title}
			</Text>
			</TouchableHighlight>
		);
	}
	
	async _pause() {
		if (!this.state.recording) {
			console.warn('Can\'t pause, not recording!');
			return;
		}
		
		try {
			const filePath = await AudioRecorder.pauseRecording();
			this.setState({paused: true});
		} catch (error) {
			console.error(error);
		}
	}
	
	async _resume() {
		if (!this.state.paused) {
			console.warn('Can\'t resume, not paused!');
			return;
		}
		
		try {
			await AudioRecorder.resumeRecording();
			this.setState({paused: false});
		} catch (error) {
			console.error(error);
		}
	}
	
	async _stop() {
		if (!this.state.recording) {
			console.warn('Can\'t stop, not recording!');
			return;
		}
		
		this.setState({stoppedRecording: true, recording: false, paused: false});
		
		try {
			const filePath = await AudioRecorder.stopRecording();
			
			if (Platform.OS === 'android') {
				this._finishRecording(true, filePath);
			}
			return filePath;
		} catch (error) {
			console.error(error);
		}
	}
	
	async _play() {
		if (this.state.recording) {
			await this._stop();
		}
		
		// These timeouts are a hacky workaround for some issues with react-native-sound.
		// See https://github.com/zmxv/react-native-sound/issues/89.
		setTimeout(() => {
			var sound = new Sound(this.state.audioPath, '', (error) => {
				if (error) {
					console.log('failed to load the sound', error);
				}
			});
			
			setTimeout(() => {
				sound.play((success) => {
					if (success) {
						console.log('successfully finished playing');
					} else {
						console.log('playback failed due to audio decoding errors');
					}
				});
			}, 100);
		}, 100);
	}
	
	async _useR1() {
		if (this.state.recording) {
			await this._stop();
		}
		setTimeout(() => {
			soundR1 = new Sound(this.state.audioPath, '', (error) => {
				this.setState({useSoundR1: true, useSoundR2: false});
				
				if (error) {
					console.log('failed to load the sound', error);
				}
			});
		}, 100);
	}
	
	async _useR2() {
		if (this.state.recording) {
			await this._stop();
		}
		setTimeout(() => {
			soundR2 = new Sound(this.state.audioPath, '', (error) => {
				this.setState({useSoundR1: false, useSoundR2: true});
				if (error) {
					console.log('failed to load the sound', error);
				}
			});
		}, 100);
	}
	
	async _record() {
		if (this.state.recording) {
			console.warn('Already recording!');
			return;
		}
		
		if (!this.state.hasPermission) {
			console.warn('Can\'t record, no permission granted!');
			return;
		}
		
		if(this.state.stoppedRecording){
			this.prepareRecordingPath(this.state.audioPath);
		}
		
		this.setState({recording: true, paused: false});
		
		try {
			const filePath = await AudioRecorder.startRecording();
		} catch (error) {
			console.error(error);
		}
	}
	
	_finishRecording(didSucceed, filePath) {
		this.setState({ finished: didSucceed });
		console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
	}
	
	
	
	
	
	//FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
	
	componentWillMount() {
		RNSimpleCompass.start(10, (degree) => {
			if (degree >= 0 && degree < 90) {
				this.setState({zone: 1});
			} else if (degree >= 90 && degree < 180) {
				this.setState({zone: 2});
			} else if (degree >= 180 && degree < 270) {
				this.setState({zone: 3});
			} else {
				this.setState({zone: 4});
			}
			//this.props.setDegrees(degree);
		});

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

record() {
	() => {
		debug = 'hola';
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

/*
		if (this.state.zone == 1 && !this.state.useSoundR1 && !this.state.useSoundR1) {
			if (this.state.times <= 10) {
				sound1.play();
				this.state.times += 1;
			}
		} 
		else if (this.state.zone == 1 && this.state.useSoundR1 && !this.state.useSoundR1) {
			if (this.state.times <= 10) {
				soundR1.play();
				this.state.times += 1;
			}
		}
		else if (this.state.zone == 1 && !this.state.useSoundR1 && this.state.useSoundR1) {
			if (this.state.times <= 10) {
				soundR2.play();
				this.state.times += 1;
			}
		}
		else if (this.state.zone == 2) {
			if (this.state.times <= 10) {
				sound2.play();
				this.state.times += 1;
			}
		}
	*/

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
		
	} else if (this.state.cont == 'no') {
		this.state.times = 0;
	}
	
	return (
		<Container>
			<Header hasTabs>
				<Body>
					<Title>FeelMusic App - Compass</Title>
				</Body>
			</Header>		
			
			
			<Content contentContainerStyle={{}}>
				<Tabs initialPage={0} ref={(tabView) => { this.tabView = tabView }} tabBarUnderlineStyle={{opacity: 0}}>
					<Tab heading={ <TabHeading /> }>
					<View style={styles.container}>
				<View style={styles.controls}>
					{this._renderButton("RECORD", () => {this._record()}, this.state.recording )}
					{this._renderButton("PLAY", () => {this._play()} )}
					{this._renderButton("STOP", () => {this._stop()} )}
					{this._renderButton("USE R1", () => {this._useR1()} )}
					{this._renderButton("USE R2", () => {this._useR2()} )}
					{this._renderPauseButton(() => {this.state.paused ? this._resume() : this._pause()})}
					<Text style={styles.progressText}>{this.state.currentTime}s</Text>
				</View>
			</View>
					<Button
				onPress={() => {
					this._record()
				}}
				>
					<Text>Record</Text>
				</Button>
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
					soundR1.setVolume(0.3);
					soundR1.play();
				}}
				>
					<Text>sound R1</Text>
				</Button>
				<Button
				onPress={() => {
					soundR2.setVolume(0.3);
					soundR2.play();
				}}
				>
					<Text>sound R2</Text>
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
								opacity: this.state.cuadricula == 0 && this.state.zone == 1 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'red',
								borderTopRightRadius: circleSize,
								opacity: this.state.cuadricula == 0 && this.state.zone == 2 ? 1 : 0.3
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
								opacity: this.state.cuadricula == 0 && this.state.zone == 4 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'yellow',
								borderBottomRightRadius: circleSize,
								opacity: this.state.cuadricula == 0 && this.state.zone == 3 ? 1 : 0.3
							}
						]}
						/>
					</View>
				</View>
					</Tab>
					<Tab heading={ <TabHeading /> }>
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
								opacity: this.state.cuadricula == 1 && this.state.zone == 1 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'red',
								borderTopRightRadius: circleSize,
								opacity: this.state.cuadricula == 1 && this.state.zone == 2 ? 1 : 0.3
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
								opacity: this.state.cuadricula == 1 && this.state.zone == 4 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'yellow',
								borderBottomRightRadius: circleSize,
								opacity: this.state.cuadricula == 1 && this.state.zone == 3 ? 1 : 0.3
							}
						]}
						/>
					</View>
				</View>
					</Tab>
					<Tab heading={ <TabHeading /> }>
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
								opacity: this.state.cuadricula == 2 && this.state.zone == 1 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'red',
								borderTopRightRadius: circleSize,
								opacity: this.state.cuadricula == 2 && this.state.zone == 2 ? 1 : 0.3
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
								opacity: this.state.cuadricula == 2 && this.state.zone == 4 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'yellow',
								borderBottomRightRadius: circleSize,
								opacity: this.state.cuadricula == 2 && this.state.zone == 3 ? 1 : 0.3
							}
						]}
						/>
					</View>
				</View>
					</Tab>
					<Tab heading={ <TabHeading /> }>
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
								opacity: this.state.cuadricula == 3 && this.state.zone == 1 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'red',
								borderTopRightRadius: circleSize,
								opacity: this.state.cuadricula == 3 && this.state.zone == 2 ? 1 : 0.3
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
								opacity: this.state.cuadricula == 3 && this.state.zone == 4 ? 1 : 0.3
							}
						]}
						/>
						<View
						style={[
							styles.circle,
							{
								backgroundColor: 'yellow',
								borderBottomRightRadius: circleSize,
								opacity: this.state.cuadricula == 3 && this.state.zone == 3 ? 1 : 0.3
							}
						]}
						/>
					</View>
				</View>
					</Tab>
				</Tabs>
				
		</Content>
		<Footer>
			<FooterTab>
				<Button active={this.state.cuadricula == 0} onPress={() => { this.tabView.goToPage(0); this.setState({cuadricula: 0}); }}>
					<Text>One</Text>
				</Button>
				<Button active={this.state.cuadricula == 1} onPress={() => { this.tabView.goToPage(1); this.setState({cuadricula: 1}); }}>
					<Text>Two</Text>
				</Button>
				<Button active={this.state.cuadricula == 2} onPress={() => { this.tabView.goToPage(2); this.setState({cuadricula: 2}); }}>
					<Text>Three</Text>
				</Button>
				<Button active={this.state.cuadricula == 3} onPress={() => { this.tabView.goToPage(3); this.setState({cuadricula: 3}); }}>
					<Text>Four</Text>
				</Button>
			</FooterTab>
		</Footer>
	</Container>
	);
}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#2b608a",
	},
	controls: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	progressText: {
		paddingTop: 50,
		fontSize: 50,
		color: "#fff"
	},
	button: {
		padding: 20
	},
	disabledButtonText: {
		color: '#eee'
	},
	buttonText: {
		fontSize: 20,
		color: "#fff"
	},
	activeButtonText: {
		fontSize: 20,
		color: "#B81F00"
	}
	
});



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
var soundR1;
var soundR2;



var sound5 = new Sound(require('./../samples/sample1.mp3'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});
	
	
var sound6 = new Sound(require('./../samples/sample2.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});

var sound7 = new Sound(require('./../samples/sample3.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});
	
var sound8 = new Sound(require('./../samples/sample4.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});
		
var sound9 = new Sound(require('./../samples/sample5.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});
			
var sound10 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample6
	if (error) {
		console.log('error occured', error);
	}
});

var sound11 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample7
	if (error) {
		console.log('error occured', error);
	}
});

					
var sound12 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample8
	if (error) {
		console.log('error occured', error);
	}
});	
						
var sound13 = new Sound(require('./../samples/sample5.wav'), (error) => {
	if (error) {
		console.log('error occured', error);
	}
});
	
var sound14 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample6
	if (error) {
		console.log('error occured', error);
	}
});
		
var sound15 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample7
	if (error) {
		console.log('error occured', error);
	}
});	
			
var sound16 = new Sound(require('./../samples/sample5.wav'), (error) => {//aqui va el sample8
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
