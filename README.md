# react-native-fluxbone

A group of libraries that help with the FluxBone pattern.

### Caution

This is a work in progress and may not be a good idea.

### How to use:

```js
var FluxBone = require('react-native-fluxbone');
var React = require('react-native');

var {
  Store,
  Model,
  Dispatcher,
} = FluxBone;

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

// Create a custom store by extending from Store
var ExampleStore = Store.extend({
  // Avoid a bunch of boilerplate by using a dispatcherEvents hash
  dispatcherEvents: {
    'example:load': 'handleExampleLoad'
  },

  handleExampleLoad: function (text) {
    this.fetch({
      url: 'http://localhost:3000/api/example/' + text
    }).then(function (responseData) {
      // Trigger custom events if necessary on completion
      // NOTE: The standard backbone collection "sync" events also fire
      this.trigger('example:load:complete', responseData);
    }.bind(this), function () {
      // Trigger custom events if necessary on completion
      // NOTE: The standard backbone collection "error" events also fire
      this.trigger('example:load:error');
    }.bind(this));
  }
});

// Instantiate a store
var exampleStore = new ExampleStore();

// Create a screen to interact with
var ExampleScreen = React.createClass({
  displayName: 'ExampleScreen',

  getInitialState: function () {
    return {
      term: '',
      results: null
    }
  },

  componentDidMount: function () {
    // Subscribe to events on the store
    exampleStore.on('example:load:complete', function () {
      console.log('Loaded!');
      this.setState({
        results: exampleStore.getAll()
      });
    }, this);
  },

  componentDidUnmount: function () {
    // Make sure you unsubscribe from the store
    exampleStore.off(null, null, this);
  },

  render: function () {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchBarInput}
          onSubmitEditing={this.onSubmit}
          onChangeText={(text) => this.setState({text: text})}
          />
        {this._renderResults()}
      </View>
    )
  },

  _renderResults: function () {
    if (!this.state.results) {
      return null;
    }

    return this.state.results.map((result) => <Text style={styles.result}>{result.text}</Text>);
  }

  onSubmit: function () {
    Dispatcher.dispatch('example:load', this.state.text);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchBarInput: {
    fontSize: 15,
    height: 30,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 20,
    width: 100
  },
  result: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10
  },
});
```
