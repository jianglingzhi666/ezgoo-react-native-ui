import React from 'react'
import { View, Text, Image, Animated, Easing, ColorValue, TouchableOpacity } from 'react-native'

export interface SwitchProps {
  value: boolean
  activeColor?: ColorValue
  color?: ColorValue
  onChange?: (value: boolean) => void
}

export class Switch extends React.Component<SwitchProps, any> {
  static defaultProps = {
    activeColor: '#09BB07',
    color: '#FFFFFF'
  }
  color: ColorValue = '#FFFFFF'
  value = new Animated.Value(0)
  shouldComponentUpdate(nextProps: SwitchProps, nextState) {
    if (nextProps.value !== this.props.value) {
      if (!nextProps.value) {
        this.color = this.props.color
        this.forceUpdate()
      }
      this.animated(nextProps.value ? 19 : 0, () => {
        if (nextProps.value) {
          this.color = this.props.activeColor
          this.forceUpdate()
        }
      })
      return false
    }
    return true
  }
  componentDidMount() {
    this.animated(this.props.value ? 19 : 0, () => {
      this.color = this.props.value ? this.props.activeColor : this.props.color
      this.forceUpdate()
    })
  }
  animated = (number: 0 | 19, callback?: () => void) => {
    Animated.timing(this.value, {
      toValue: number,
      easing: Easing.linear,
      useNativeDriver: false,
      duration: 200
    }).start(callback)
  }
  render() {
    const { activeColor, value, onChange } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onChange && onChange(!value)
        }}
        style={{
          width: 52,
          height: 32,
          borderRadius: 16,
          borderColor: '#E5E5E5',
          borderWidth: 1.5,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.color
        }}>
        <Animated.Image
          style={{ width: 47, height: 44, position: 'absolute', left: -7, top: -3, transform: [{ translateX: this.value }] }}
          source={require('./icon/switch_button.png')}
        />
      </TouchableOpacity>
    )
  }
}
