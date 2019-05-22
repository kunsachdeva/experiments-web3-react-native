import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import Web3 from 'web3';
import bip39 from 'react-native-bip39'
var Protocol = require('@melonproject/protocol')
var web3Accounts = require("web3-eth-accounts")
var createToken = require('@melonproject/token-math').createToken
var createQuantity = require('@melonproject/token-math').createQuantity
var deposit = require('@melonproject/protocol/lib/contracts/dependencies/token/transactions/deposit').deposit;
var withPrivateKeySigner = require('@melonproject/protocol/lib/utils/environment/withPrivateKeySigner').withPrivateKeySigner
var withDeployment = require('@melonproject/protocol/lib/utils/environment/withDeployment').withDeployment
var constructEnvironment = require('@melonproject/protocol/lib/utils/environment/constructEnvironment').constructEnvironment
var setupInvestedTestFund = require('@melonproject/protocol/lib/tests/utils/setupInvestedTestFund').setupInvestedTestFund

var getEnvironment = () => withDeployment(constructEnvironment({ endpoint: 'https://kovan.infura.io', track: 'kyberPrice' }))
var getNewAccount = async () => (new web3Accounts((await getEnvironment()).eth.currentProvider)).create()
var getManager = async (privateKey) => await withPrivateKeySigner(await getEnvironment(), privateKey)
var getRichManager = async () => await getManager(PRIVATE_KEY)// has lots of ETH moneyz

const INITIAL_BALANCE = 1

var depositWeth = async (privateKey, amount = INITIAL_BALANCE) => {
  var manager = await getManager(privateKey);
  const weth = Protocol.getTokenBySymbol(manager, 'WETH');
  const quantity = createQuantity(weth, amount);
  console.warn(manager.wallet.address);

  await deposit(manager, quantity.token.address, undefined, {
    value: quantity.quantity.toString(),
  });
}

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
    accounts: 'EMPTY',
    t: ''
  }

  async componentWillMount() {
    console.warn(expect);
    
    // var manager = await getEnvironment();
    // var fundDetails = await Protocol.getFundDetails(manager, manager.deployment.melonContracts.ranking, manager.deployment.melonContracts.version)
    // console.warn(fundDetails);
    
    var account = await getNewAccount();//{ privateKey: '0xb6d47171479ec8c15c3fd248f2bc59fa5cb1a087cafcfecf878a444888ae1309' }
    var manager = await getManager(account.privateKey);
    this.setState({ t: account.privateKey })
    await Protocol.sendEth(await getRichManager(), { to: manager.wallet.address, howMuch: createQuantity('ETH', INITIAL_BALANCE + 0.3) })
    console.warn(manager.wallet.address);
    await depositWeth(account.privateKey);
    console.warn(manager.wallet.address);
    var newFund = await setupInvestedTestFund(manager)
    newFund.privateKey = account.privateKey
    console.warn(JSON.stringify(newFund));
    this.setState({ t: JSON.stringify(newFund) })
    return;
    this.web3 = new Web3(provider);
    this.web3.eth.getBlock('latest').then(console.warn).catch(console.warn);
    bip39.generateMnemonic().then(console.warn).catch(console.warn);
    var that = this;
    this.web3.eth.getAccounts(function (error, res) {
      if (!error) {
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
        <TextInput value={this.state.t}></TextInput>
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
