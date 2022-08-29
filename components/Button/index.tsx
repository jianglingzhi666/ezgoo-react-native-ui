import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{width: 100, height: 48, backgroundColor: 'red'}}>
        <Text style={{fontSize: 14, color: 'white'}}>111</Text>
      </TouchableOpacity>
    );
  }
}
