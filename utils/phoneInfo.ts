import {Dimensions, Platform, PixelRatio, StatusBar} from 'react-native';

//判断是否是ios端
const isIOS = Platform.OS === 'ios' ? true : false;

//屏幕宽度
const screenWidth = Dimensions.get('screen').width;

//屏幕高度
let screenHeight = Dimensions.get('screen').height;

//屏幕像素
const pixel = PixelRatio.get();

//是否为ios端刘海屏幕
const isIphoneX = isIOS && (screenHeight >= 812 || screenWidth >= 812);

//底部指示器高度
const indicatorHeight = isIphoneX ? 34 : 0;

//状态栏高度
const statusBarHeight = isIOS
  ? isIphoneX
    ? 44
    : 20
  : StatusBar.currentHeight || 0;

function setScreenHeight(height: number) {
  screenHeight = height;
}

export {
  isIOS,
  screenWidth,
  screenHeight,
  pixel,
  isIphoneX,
  indicatorHeight,
  statusBarHeight,
  setScreenHeight,
};
