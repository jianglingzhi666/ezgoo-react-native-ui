import React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import {POSITION, Modal} from '../Modal';
import ToastComponent from './Toast';
import {ToastProps} from './Toast';

export function Toast(
  toastConfig: ToastProps,
  position: POSITION = POSITION.CENTER,
  time: number | undefined = 500,
) {
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
  setTimeout(() => {
    modal.getInstance()?.close(() => {
      modal.unmount();
    });
  }, time);
}
