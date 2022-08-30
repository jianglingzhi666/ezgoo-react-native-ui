import React from 'react';
import {View} from 'react-native';
import {TOP_INDEX} from '../../common/style';
import {setScreenHeight} from '../../utils/phoneInfo';
//modal数组代理
let modal_array_proxy:
  | undefined
  | Array<{component: React.ReactElement; id: number}>;

//递增modal id
let count = 0;

//添加modal层
export function addElement(element: React.ReactElement) {
  modal_array_proxy?.push({component: element, id: count});
  count++;
  return count;
}

//删除modal层
export function deletElement(id: number) {
  //获取对应modal下标
  let index = modal_array_proxy?.findIndex(item => item.id === id);
  if (index === undefined) {
    return false;
  } else {
    modal_array_proxy?.splice(index, 0);
    return true;
  }
}

export function TopView(Component: any) {
  return class extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
    }
    componentDidMount() {
      this.initModal();
    }

    componentWillUnmount() {
      modal_array_proxy = undefined;
    }
    //初始化数组代理
    initModal = () => {
      const self = this;
      let handler = {
        set(target: any, property: any, value: any) {
          target[property] = value;
          self.forceUpdate();
          return true;
        },
      };
      modal_array_proxy = new Proxy(new Array(), handler);
    };

    render() {
      return (
        <View
          style={{flex: 1, position: 'relative'}}
          onLayout={event => {
            setScreenHeight(event.nativeEvent.layout.height);
          }}>
          <WrapperCommponent>
            <Component />
          </WrapperCommponent>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: TOP_INDEX,
            }}
            pointerEvents="box-none">
            {modal_array_proxy?.map(item => {
              return React.cloneElement(item.component, {key: item.id});
            })}
          </View>
        </View>
      );
    }
  };
}

class WrapperCommponent extends React.Component<any, any> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <View style={{flex: 1}}>{this.props.children}</View>;
  }
}
