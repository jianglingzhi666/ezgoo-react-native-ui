import React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import {POSITION, Modal} from '../Modal';
import ToastComponent from './Toast';
import {ToastProps} from './Toast';
import {deletElement} from '../TopView';

let toast_array: Array<{
  instance: ReactTestRenderer.ReactTestRenderer;
  id: number;
}> = [];
/**
 * 吐司
 * @param toastConfig
 * @param position
 * @param time
 * @returns
 */
export function Toast(
  toastConfig: ToastProps,
  position: POSITION = POSITION.CENTER,
  time?: number,
): number | undefined {
  let modal: ReactTestRenderer.ReactTestRenderer = ReactTestRenderer.create(
    React.createElement(
      Modal,
      {
        style: {
          alignItems: 'center',
          top: position === POSITION.TOP ? 160 : 0,
          paddingBottom: position === POSITION.BOTTOM ? 160 : 0,
        },
        visible: true,
        backgroundColor: 'rgba(0,0,0,0)',
        animationType: 'fade',
        position: position,
      },
      React.createElement(ToastComponent, {
        ...toastConfig,
      }),
    ),
  );
  if (typeof time === 'number') {
    setTimeout(() => {
      modal.getInstance()?.close(() => {
        modal.unmount();
      });
    }, time);
  } else {
    toast_array.push({
      instance: modal,
      id: modal.getInstance()?.id,
    });
    return modal.getInstance()?.id;
  }
}
/**
 * 用于关闭没设置time的toast
 * @param id
 */
export function closeToast(id: number) {
  let index = toast_array.findIndex(item => item.id === id);
  if (index !== undefined) {
    toast_array[index].instance.getInstance()?.close(() => {
      toast_array[index].instance.unmount();
      toast_array.splice(index, 0);
    });
  }
}
