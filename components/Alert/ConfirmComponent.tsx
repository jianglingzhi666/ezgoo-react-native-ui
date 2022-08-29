import {View, Text, TouchableOpacity, TextStyle} from 'react-native';
import React from 'react';
import * as style from '../../common/style';

export interface ConfirmComponentProps {
  title: string;
  titleStyle?: TextStyle;
  bodyText: string;
  bodyTextStyle?: TextStyle;
  confirmText?: string;
  confirmTextStyle?: TextStyle;
  confirmCallback?: () => void;
  cancelText?: string;
  cancelTextStyle?: TextStyle;
  cancelCallback?: () => void;
}

export class ConfirmComponent extends React.Component<
  ConfirmComponentProps,
  any
> {
  static defaultProps = {
    confirmText: '确定',
    cancelText: '取消',
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
        <View
          style={{
            width: '100%',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={this.props.cancelCallback}
            style={[
              {
                flex: 1,
                height: 50,
                borderTopWidth: 0.5,
                borderTopColor: '#D2D3D5',
                justifyContent: 'center',
                alignItems: 'center',
              },
              this.props.confirmTextStyle,
            ]}>
            <Text style={{fontSize: 18, color: '#000'}}>
              {this.props.cancelText}
            </Text>
          </TouchableOpacity>
          <View style={{width: 0.5, height: 50, backgroundColor: '#D2D3D5'}} />
          <TouchableOpacity
            onPress={this.props.confirmCallback}
            style={[
              {
                flex: 1,
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
      </View>
    );
  }
}
