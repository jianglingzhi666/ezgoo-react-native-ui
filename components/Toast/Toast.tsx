import React from 'react';
import {View, Text, TextStyle, ViewStyle} from 'react-native';

export interface ToastProps {
  bodyText: string;
  bodyTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}
export default class Toast extends React.Component<ToastProps, any> {
  render() {
    return (
      <View
        style={[
          {
            minWidth: 120,
            paddingHorizontal: 28,
            paddingVertical: 24,
            borderRadius: 5,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            alignItems: 'center',
            justifyContent: 'center',
          },
          this.props.containerStyle,
        ]}>
        {this.props.icon}
        <Text
          style={[
            {color: 'white', fontSize: 13, marginTop: this.props.icon ? 18 : 0},
            this.props.bodyTextStyle,
          ]}>
          {this.props.bodyText}
        </Text>
      </View>
    );
  }
}
