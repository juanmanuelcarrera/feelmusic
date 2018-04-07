'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import RNSimpleCompass from 'react-native-simple-compass';

import { StyleSheet } from 'react-native';

class CompassContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDegree: 0,
			zone: 'One'
		};
	}

	componentDidMount() {
		const degree_update_rate = 3;
		RNSimpleCompass.start(degree_update_rate, (degree) => {
			this.setState({
				currentDegree: degree
			});
			//RNSimpleCompass.stop();
		});
		setInterval(() => {
			var currentDegree = this.state.currentDegree;
			var newZone = '';
			if (currentDegree >= 0 && currentDegree < 90) {
				newZone = 'One';
			} else if (currentDegree >= 90 && currentDegree < 180) {
				newZone = 'Two';
			} else if (currentDegree >= 180 && currentDegree < 270) {
				newZone = 'Three';
			} else {
				newZone = 'Four';
			}
			this.setState({
				zone: newZone
			});
		}, 20);
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
					<Text> {this.state.currentDegree} </Text>
					<Text> Zone: {this.state.zone} </Text>
					<Button onPress={() => Actions.pop()}>
						<Icon name="arrow-back" />
						<Text>Back</Text>
					</Button>
				</Content>
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CompassContainer);
