import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import io from 'socket.io-client';
import './ReactotronConfig';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      subData: null,
      error: null,
    };
  }

  componentDidMount() {
    this.connectToSocket();
  }

  connectToSocket = () => {
    this.client = io.connect('http://localhost:3000',{
      pingTimeout: 3000,
      transports: ['websocket'],
      allowUpgrades: false,
      cookie: false
    });
    this.client.on('sport-list', this.handleSportList);
    this.client.on('get-sport', this.handleSubSportList);
    this.client.on('connect_error', this.handleConnectError)
  };

  handleSportList = data => {
    this.setState({ data })
  };


  handleSubSportList = subData => {
    this.setState({ subData })
  };

  handleConnectError = error => {
    this.setState({ error });
  };


  onPress = id => {
    if (!this.state.subData || id !== this.state.subData.meta.id) {
      this.client.emit('get-sport', {id});
    }

    if (this.state.subData && id === this.state.subData.meta.id) {
      this.setState({ subData: null });
    }
  };


  renderListItem = ({item}) =>
    <TouchableOpacity onPress={() => this.onPress(item.id)}>
      <View>
        <Text style={styles.item}>{ item.name }</Text>
        { this.renderSubListItem(item.id) }
      </View>
    </TouchableOpacity>;


  renderSubListItem = id => {
    const { subData } = this.state;

    if (!subData) {
      return null;
    }

    const { response, meta } = subData;

    if (id !== meta.id) {
      return null;
    }

    return (
      <FlatList
        data={response}
        keyExtractor={ (_, index) => String(index) }
        renderItem={({item}) => <Text>{ item }</Text>}
        extraData={subData}
        initialNumToRender={40}
      />
    );
  };


  render() {

    return (
      <ScrollView style={styles.scrollView}>
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={this.state.data}
          keyExtractor={ item => String(item.id) }
          renderItem={this.renderListItem}
          extraData={this.state.subData}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 70,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    fontFamily: 'Verdana',
    fontSize: 18,
    padding: 20,
  },
});
