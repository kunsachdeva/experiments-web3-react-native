import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Web3 from 'web3';
var withDeployment = require('@melonproject/protocol/lib/utils/environment/withDeployment').withDeployment
var constructEnvironment = require('@melonproject/protocol/lib/utils/environment/constructEnvironment').constructEnvironment
import bip39 from 'react-native-bip39'
var getEnvironment = () => withDeployment(constructEnvironment({ endpoint: 'https://kovan.melonport.com', track: 'kyberPrice' }))
var Protocol = require('@melonproject/protocol')

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const provider = Platform.select({
  ios: 'https://kovan.infura.io',
  android: 'ws://10.0.2.2:8545'
});

export default class App extends Component {
  state = {
    accounts: 'EMPTY'
  }
  
  async componentWillMount() {
    var manager = await getEnvironment();
    var fundDetails = await Protocol.getFundDetails(manager, manager.deployment.melonContracts.ranking, manager.deployment.melonContracts.version)
    console.warn(fundDetails);
    return;
    this.web3  = new Web3(provider);
    this.web3.eth.getBlock('latest').then(console.warn).catch(console.warn);
    bip39.generateMnemonic().then(console.warn).catch(console.warn);
    var that = this;
    this.web3.eth.getAccounts(function(error,res) {
      if(!error) {
        console.warn(res);
        that.setState({
          accounts: JSON.stringify(res)
        })
      } else {
        console.warn(error);
        that.setState({
          accounts: 'error'
        })
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text>{this.state.accounts}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
