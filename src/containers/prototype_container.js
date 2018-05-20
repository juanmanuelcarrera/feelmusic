'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet, Dimensions, Platform } from 'react-native';

import RNSimpleCompass from 'react-native-simple-compass';
import RNSensors from 'react-native-sensors';
import Sound from 'react-native-sound';

import {
  AppRegistry,
  TouchableHighlight,
  PermissionsAndroid
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';


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
		accelerationObservable.subscribe((acceleration) => {
			this.setState({ acceleration });

			if (Platform.OS === "ios") {
				if (acceleration.z < -0.7 )
					//reproducir sonido
					this.setState({ cont: 'ok' });
				if (acceleration.y < -0.7) 
					this.setState({ cont: 'no' });
			}
			else {
				if (acceleration.z > 7)
				//reproducir sonido
					this.setState({ cont: 'ok' });
				if (acceleration.y > 7) 
					this.setState({ cont: 'no' });
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
	}

	//funciones en ec6

	
	detect() {
		(acceleration) => {
			if (acceleration.z > 7) cont = ok;
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
	}

	render() {
		const { acceleration, gyroscope, cont, times, debug, useSoundR1, useSoundR2 } = this.state;
		if (this.state.cont == 'ok') {
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
			} else if (this.state.zone == 3) {
				if (this.state.times <= 10) {
					sound3.play();
					this.state.times += 1;
				}
			} else if (this.state.zone == 4 ) {
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

				<Content padder contentContainerStyle={{}}>
				<Button
						onPress={() => {
							this._record()
						}}
					>
						<Text>Record</Text>
					</Button>
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
