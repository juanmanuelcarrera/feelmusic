'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import RNSimpleCompass from 'react-native-simple-compass';

import { StyleSheet, Dimensions } from 'react-native';

class CompassContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
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

	render() {
		return (
			<Container>
				<Header>
					<Body>
						<Title>FeelMusic App - Compass</Title>
					</Body>
				</Header>
				<Content padder contentContainerStyle={{}}>
					<Button onPress={() => Actions.pop()}>
						<Icon name="arrow-back" />
						<Text>Back</Text>
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

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CompassContainer);
