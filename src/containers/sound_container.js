'use strict';

import React, {Component} from 'react';
import { Container, Header, Content, Button, Icon, Text, Body, Title } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { StyleSheet } from "react-native";

class SoundContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
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
                <Button onPress={() => Actions.pop() }>
                    <Icon name='arrow-back' />
                    <Text>Back</Text>
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


export default connect(mapStateToProps, mapDispatchToProps)(SoundContainer);