import React from 'react';
import {
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  BackHandler,
  NativeEventSubscription,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';
import {addElement, deletElement} from '../TopView';
import {screenHeight, isIOS} from '../../utils/phoneInfo';
export interface ModalProps {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade' | undefined;
  children?: React.ReactNode;
  position?: POSITION;
  onRequestClose?: () => void;
  style?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
}
export enum POSITION {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom',
}

export class Modal extends React.Component<ModalProps, any> {
  static defaultProps = {
    backgroundColor: 'rgba(0,0,0,0.4)',
  };
  id: undefined | number;
  backHandler: NativeEventSubscription | undefined;
  constructor(props: any) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
    };
  }
  componentDidMount() {
    if (!isIOS) {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (this.props.onRequestClose && this.props.visible) {
            this.props.onRequestClose && this.props.onRequestClose();
            return true;
          } else {
            return false;
          }
        },
      );
    }
    if (this.props.visible) {
      this.open();
    }
  }
  componentWillUnmount() {
    if (this.id !== undefined) {
      deletElement(this.id as number);
      this.id = undefined;
    }
    this.backHandler && this.backHandler.remove();
  }
  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.open();
      } else {
        this.close();
      }
    }
  }
  //显示
  open = (callback?: () => void) => {
    this.id = addElement(this.renderModal());
    if (this.props.animationType === 'fade') {
      this.fadeEnter(this.state.animation, callback);
    } else if (this.props.animationType === 'slide') {
      this.slideEnter(this.state.animation, callback);
    }
  };
  close = (callback?: () => void) => {
    //关闭modal
    if (this.id !== undefined) {
      const closeModal = () => {
        deletElement(this.id as number);
        this.id = undefined;
        callback && callback();
      };
      if (this.props.animationType === 'fade') {
        this.fadeOut(this.state.animation, closeModal);
      } else if (this.props.animationType === 'slide') {
        this.slideOut(this.state.animation, closeModal);
      } else {
        closeModal();
      }
    }
  };
  //淡入动画
  fadeEnter = (animation: Animated.AnimatedValue, callback?: () => void) => {
    Animated.timing(animation, {
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 200,
    }).start(() => {
      callback && callback();
    });
  };
  //淡出动画
  fadeOut = (animation: Animated.AnimatedValue, callback?: () => void) => {
    Animated.timing(animation, {
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 200,
    }).start(() => {
      callback && callback();
    });
  };
  //滑入
  slideEnter = (animation: Animated.AnimatedValue, callback?: () => void) => {
    Animated.timing(animation, {
      toValue: -screenHeight,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start(() => {
      callback && callback();
    });
  };
  //滑入
  slideOut = (animation: Animated.AnimatedValue, callback?: () => void) => {
    Animated.timing(animation, {
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start(() => {
      callback && callback();
    });
  };

  renderModal = () => {
    const {position} = this.props;

    return (
      <View style={{flex: 1, backgroundColor: this.props.backgroundColor}}>
        <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>
        <Animated.View
          pointerEvents="box-none"
          style={[
            {
              flex: 1,
              width: '100%',
              height: screenHeight,
              position: 'absolute',
              justifyContent:
                position === 'bottom'
                  ? 'flex-end'
                  : position === 'center'
                  ? 'center'
                  : 'flex-start',
              opacity:
                this.props.animationType === 'fade' ? this.state.animation : 1,
              top: this.props.animationType === 'slide' ? screenHeight : 0,
              transform:
                this.props.animationType === 'slide'
                  ? [{translateY: this.state.animation}]
                  : undefined,
            },
            this.props.style,
          ]}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  };

  render() {
    return null;
  }
}
