import {View, Text, TouchableOpacity, TextStyle} from 'react-native';
import React from 'react';
import * as style from '../../common/style';

export interface AlertComponentProps {
  title: string;
  titleStyle?: TextStyle;
  bodyText: string;
  bodyTextStyle?: TextStyle;
  confirmText?: string;
  confirmTextStyle?: TextStyle;
  confirmCallback?: () => void;
}

export class AlertComponent extends React.Component<AlertComponentProps, any> {
  static defaultProps = {
    confirmText: '确定',
  };
  render() {
    return (
      <View
        style={{
          width: 280,
          backgroundColor: 'white',
          borderRadius: 4,
          alignItems: 'center',
        }}>
        <Text
          style={[
            {fontSize: 18, color: '#000', marginTop: 29, fontWeight: 'bold'},
            this.props.titleStyle,
          ]}>
          {this.props.title}
        </Text>
        <Text
          style={[
            {
              fontSize: 14,
              color: '#999',
              marginVertical: 16,
              paddingHorizontal: 30,
            },
            this.props.bodyTextStyle,
          ]}>
          {this.props.bodyText}
        </Text>
        <TouchableOpacity
          onPress={this.props.confirmCallback}
          style={[
            {
              width: '100%',
              height: 50,
              borderTopWidth: 0.5,
              borderTopColor: '#D2D3D5',
              justifyContent: 'center',
              alignItems: 'center',
            },
            this.props.confirmTextStyle,
          ]}>
          <Text style={{fontSize: 18, color: style.themeColor}}>
            {this.props.confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
