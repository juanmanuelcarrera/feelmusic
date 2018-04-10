'use strict';

import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title, View } from 'native-base';

import { connect } from 'react-redux';

import RNSimpleCompass from 'react-native-simple-compass';

import { StyleSheet, Dimensions } from 'react-native';
import { setZone, setDegrees } from '../actions/actions';

import { Actions } from 'react-native-router-flux';


const circleSize = Dimensions.get('window').width * 0.4;

const styles = StyleSheet.create({
	circle: {
		width: circleSize,
		height: circleSize
	}
});

// Super comentario
class CompassContainer extends Component {
	constructor(props) {
		super(props);		
	}

	componentWillMount() {
		RNSimpleCompass.start(10, (degree) => {
			if (degree >= 0 && degree < 90) {
				this.props.setZone(1);
			} else if (degree >= 90 && degree < 180) {
				this.props.setZone(2);
			} else if (degree >= 180 && degree < 270) {
				this.props.setZone(3);
			} else {
				this.props.setZone(4);
			}
			this.props.setDegrees(degree);
		});
	}


	componentWillUnmount() {
		RNSimpleCompass.stop();
	}

	render() {
		const { zone, degrees } = this.props;

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
					<Text> Degrees: {degrees} </Text>
					<Text> Zone: {zone} </Text>
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
										opacity: zone == 1 ? 1 : 0.3
									}
								]}
							/>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'red',
										borderTopRightRadius: circleSize,
										opacity: zone == 2 ? 1 : 0.3
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
										opacity: zone == 4 ? 1 : 0.3
									}
								]}
							/>
							<View
								style={[
									styles.circle,
									{
										backgroundColor: 'yellow',
										borderBottomRightRadius: circleSize,
										opacity: zone == 3 ? 1 : 0.3
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

const mapStateToProps = state => ({
	zone: state.compass.zone,
	degrees: state.compass.degrees
  })
  
const mapDispatchToProps = dispatch => {  
	return {
		setZone: zone => {
			dispatch(setZone(zone))
		},
		setDegrees: degrees => {
			dispatch(setDegrees(degrees));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CompassContainer);
