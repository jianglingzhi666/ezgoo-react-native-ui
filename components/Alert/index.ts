import { Modal } from '../Modal'
import React from 'react'
import * as ReactTestRenderer from 'react-test-renderer'
import { AlertComponent, AlertComponentProps } from './AlertComponent'
import { ConfirmComponent, ConfirmComponentProps } from './ConfirmComponent'

export function alert(config: AlertComponentProps): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    let modal: ReactTestRenderer.ReactTestRenderer = ReactTestRenderer.create(
      React.createElement(
        Modal,
        {
          style: { alignItems: 'center' },
          visible: true,
          onRequestClose: () => {
            modal.getInstance()?.close(() => {
              modal.unmount()
              resolve(true)
            })
          },
          animationType: 'fade',
          position: 'center'
        },
        React.createElement(AlertComponent, {
          ...config,
          confirmCallback: () => {
            modal.getInstance()?.close(() => {
              modal.unmount()
              resolve(true)
            })
          }
        })
      )
    )
  })
}

export function confirm(config: ConfirmComponentProps): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    let modal: ReactTestRenderer.ReactTestRenderer = ReactTestRenderer.create(
      React.createElement(
        Modal,
        {
          style: { alignItems: 'center' },
          visible: true,
          onRequestClose: () => {
            modal.getInstance()?.close(() => {
              modal.unmount()
              reject(false)
            })
          },
          animationType: 'fade',
          position: 'center'
        },
        React.createElement(ConfirmComponent, {
          ...config,
          confirmCallback: () => {
            modal.getInstance()?.close(() => {
              modal.unmount()
              resolve(true)
            })
          },
          cancelCallback: () => {
            modal.getInstance()?.close(() => {
              modal.unmount()
              reject(false)
            })
          }
        })
      )
    )
  })
}
