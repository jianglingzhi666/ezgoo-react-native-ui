import React from 'react'
import { View, ScrollView, Text, StyleSheet, TextStyle, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { Modal } from '../Modal'
import { themeColor } from '../../common/style'
import moment from 'moment'
import * as ReactTestRenderer from 'react-test-renderer'

export interface PickerProps {
  data: Array<string | number>
  onChange: (index: number) => void
  lineHeight?: number
  itemTextStyle?: TextStyle
  defaultValue?: number
}

export interface PickerModalProps {
  data: Array<Array<number | string>>
  defaultValue?: Array<number>
  visible: boolean
  onChange?: (value: Array<number>) => void
  confirmCallback?: (value: Array<number>) => void
  cancelCallback?: () => void
}

interface DatePickerModalProps extends Omit<PickerModalProps, 'onChange' | 'defaultValue' | 'data' | 'confirmCallback'> {
  startDate: string
  endDate: string
  defaultValue?: string
  type: 'date' | 'dateTime' | 'time'
  confirmCallback?: (value: string) => void
}
export function datePicker(props: Omit<DatePickerModalProps, 'visible'>) {
  return new Promise(function (resolve, reject) {
    let modal: ReactTestRenderer.ReactTestRenderer = ReactTestRenderer.create(
      React.createElement(DatePickerModal, {
        ...props,
        visible: true,
        confirmCallback: value => {
          modal.getInstance()?.close(() => {
            modal.unmount()
            resolve(value)
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
  })
}
class DatePickerModal extends React.Component<DatePickerModalProps, any> {
  value: Array<number> = []
  modalRef = React.createRef<PickerModal>()
  constructor(props: DatePickerModalProps) {
    super(props)

    let date = this.props.defaultValue ? new Date(this.props.defaultValue) : new Date()
    let data = this.initData(date.getFullYear(), date.getMonth() + 1, date.getDate())
    this.value = data.activeArray
    this.state = {
      data: data.itemArray
    }
  }
  initData = (year: number, month: number, date: number) => {
    let itemArray: Array<Array<string>> = []
    let activeArray: Array<number> = []
    if (this.props.type === 'time') {
      itemArray = [
        Array.from(new Array(24), (item, index) => index + 1 + '时'),
        Array.from(new Array(60), (item, index) => index + 1 + '分'),
        Array.from(new Array(60), (item, index) => index + 1 + '秒')
      ]
      activeArray = [0, 0, 0]
      return { itemArray, activeArray }
    }
    let startDate = new Date(this.props.startDate)
    let endDate = new Date(this.props.endDate)

    let yearArray = this.getYearArray(startDate.getFullYear(), endDate.getFullYear())

    let activeYear = yearArray.indexOf(year.toString() + '年')

    let monthArray = this.getMonthArray(year, startDate.getFullYear(), startDate.getMonth() + 1, endDate.getFullYear(), endDate.getMonth() + 1)

    let activeMonth = monthArray.indexOf(month.toString() + '月')

    let dateArray = this.getDateArray(
      year,
      month,
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate()
    )

    let activeDate = dateArray.indexOf(date.toString() + '日')

    if (this.props.type === 'date') {
      itemArray = [yearArray, monthArray, dateArray]
      activeArray = [activeYear === -1 ? 0 : activeYear, activeMonth === -1 ? 0 : activeMonth, activeDate === -1 ? 0 : activeDate]
    } else if (this.props.type === 'dateTime') {
      itemArray = [
        yearArray,
        monthArray,
        dateArray,
        Array.from(new Array(24), (item, index) => index + 1 + '时'),
        Array.from(new Array(60), (item, index) => index + 1 + '分'),
        Array.from(new Array(60), (item, index) => index + 1 + '秒')
      ]
      activeArray = [activeYear === -1 ? 0 : activeYear, activeMonth === -1 ? 0 : activeMonth, activeDate === -1 ? 0 : activeDate, 0, 0, 0]
    }
    return {
      itemArray,
      activeArray
    }
  }
  getYearArray = (startYear: number, endYear: number) => {
    let array = []
    for (let i = startYear; i <= endYear; i++) {
      array.push(i + '年')
    }
    return array
  }
  getMonthArray = (year: number, startYear: number, startMonth: number, endYear: number, endMonth: number) => {
    let end = year === endYear ? endMonth : 12
    let start = year === startYear ? startMonth : 1
    let array = []
    for (let i = start; i <= end; i++) {
      array.push(i + '月')
    }
    return array
  }
  getDateArray = (
    year: number,
    month: number,
    startYear: number,
    startMonth: number,
    startDate: number,
    endYear: number,
    endMonth: number,
    endDate: number
  ) => {
    let start = year === startYear && month === startMonth ? startDate : 1
    let end = year === endYear && month === endMonth && endDate <= this.getTotalDate(year, month) ? endDate : this.getTotalDate(year, month)
    let array = []
    for (let i = start; i <= end; i++) {
      array.push(i + '日')
    }
    return array
  }
  getTotalDate = (year: number = new Date().getFullYear(), month: number = new Date().getMonth()) => {
    const date = new Date(year, month, 0)
    return date.getDate()
  }

  onChange = (value: Array<number>) => {
    this.value = value
    if (this.props.type !== 'time') {
      let _moment = moment(`${this.state.data[0][value[0]]}${this.state.data[1][value[1]]}1日`, 'YYYY年M月D日', 'en', true)
      this.setState({
        data: this.initData(_moment.year(), _moment.month() + 1, _moment.date()).itemArray
      })
    }
  }
  confirmCallback = (value: Array<number>) => {
    let str = ''
    value.forEach((item, index) => {
      str += this.state.data[index][item]
    })
    this.props.confirmCallback && this.props.confirmCallback(str)
  }
  close = (callback?: () => void) => {
    this.modalRef.current?.close(callback)
  }
  render() {
    return (
      <PickerModal
        ref={this.modalRef}
        visible={this.props.visible}
        data={this.state.data}
        defaultValue={this.value}
        onChange={this.onChange}
        cancelCallback={this.props.cancelCallback}
        confirmCallback={this.confirmCallback}
      />
    )
  }
}

class PickerModal extends React.Component<PickerModalProps, any> {
  pickerArray: Array<Picker> = []
  value: Array<number> = []
  modalRef = React.createRef<Modal>()
  constructor(props: PickerModalProps) {
    super(props)
    this.value = Array.from(new Array(props.data.length), (item, index) =>
      this.props.defaultValue && this.props.defaultValue[index] !== undefined ? this.props.defaultValue[index] : 0
    )
  }
  shouldComponentUpdate(nextProps: PickerModalProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible === true) {
      this.value = Array.from(new Array(this.props.data.length), (item, index) =>
        this.props.defaultValue && this.props.defaultValue[index] !== undefined ? this.props.defaultValue[index] : 0
      )
    }
    return true
  }
  componentDidUpdate(preProps: PickerModalProps) {
    for (let index = 0; index < this.props.data.length; index++) {
      if (
        preProps.data[index] === undefined ||
        this.props.data[index].length !== preProps.data[index].length ||
        this.props.data[index].toString() !== preProps.data[index].toString()
      ) {
        this.value.splice(index, this.value.length)
        this.value.length = this.props.data.length
        this.value.fill(0, index, this.props.data.length)

        this.value.forEach((item, i) => {
          this.pickerArray[i]?.scrollTo(item)
        })
        this.props.onChange && this.props.onChange(this.value)
        break
      }
    }
  }
  onChange = (index: number, value: number) => {
    this.value[index] = value
    this.props.onChange && this.props.onChange(this.value)
  }
  close = (callback?: () => void) => {
    this.modalRef.current?.close(callback)
  }
  render() {
    return (
      <Modal ref={this.modalRef} position="bottom" visible={this.props.visible} onRequestClose={this.props.cancelCallback} animationType={'slide'}>
        <View style={{ width: '100%', height: 234, backgroundColor: 'white', borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.cancelCallback && this.props.cancelCallback()
              }}>
              <Text style={{ fontSize: 14, color: '#999' }}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.confirmCallback && this.props.confirmCallback(this.value)
              }}>
              <Text style={{ fontSize: 14, color: themeColor }}>确定</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {this.props.data.map((item, index) => {
              return (
                <View style={{ flex: 1 }} key={index}>
                  <Picker
                    ref={(ref: Picker) => {
                      this.pickerArray[index] = ref
                    }}
                    defaultValue={this.value[index]}
                    data={item}
                    onChange={(value: number) => {
                      this.onChange(index, value)
                    }}
                  />
                </View>
              )
            })}
          </View>
        </View>
      </Modal>
    )
  }
}

export class Picker extends React.Component<PickerProps, any> {
  scrollViewRef = React.createRef<ScrollView>()
  static defaultProps = {
    lineHeight: 36,
    defaultValue: 0
  }
  componentDidMount() {
    this.scrollTo(this.props.defaultValue)
  }
  // componentDidUpdate(preProps: PickerProps) {
  //   if (this.props.defaultValue !== preProps.defaultValue) {
  //     this.scrollTo(this.props.defaultValue)
  //   }
  // }
  scrollTo = (index: number) => {
    requestAnimationFrame(() => {
      this.scrollViewRef.current?.scrollTo({ x: 0, y: index * this.props.lineHeight, animated: false })
    })
  }
  render() {
    var throttled = _.throttle(
      y => {
        if (y % this.props.lineHeight === 0) {
          let index = y / this.props.lineHeight
          this.props.onChange(index)
        }
      },
      600,
      { trailing: true, leading: false }
    )
    return (
      <View style={[style.container, { height: this.props.lineHeight * 3 }]}>
        <View pointerEvents="none" style={[style.lineTop, { top: this.props.lineHeight }]} />
        <View pointerEvents="none" style={[style.lineBottom, { bottom: this.props.lineHeight }]} />
        <View
          pointerEvents="none"
          style={{
            height: this.props.lineHeight,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 99
          }}
        />
        <View
          pointerEvents="none"
          style={{
            height: this.props.lineHeight,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 99
          }}
        />
        <ScrollView
          ref={this.scrollViewRef}
          snapToAlignment="start"
          snapToInterval={36}
          bounces={false}
          style={{ width: '100%', height: '100%' }}
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={event => {
            let y = event.nativeEvent.contentOffset.y
            throttled(y)
          }}
          onMomentumScrollEnd={event => {
            let y = event.nativeEvent.contentOffset.y
            throttled(y)
          }}>
          <View style={[style.line, { height: this.props.lineHeight }]} />

          {this.props.data.map((item, index) => {
            return (
              <View style={[style.line, { height: this.props.lineHeight }]} key={index}>
                <Text style={style.lineText}>{item}</Text>
              </View>
            )
          })}
          <View style={[style.line, { height: this.props.lineHeight }]} />
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 108,
    position: 'relative'
  },
  line: {
    width: '100%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lineTop: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f2f2f2'
  },
  lineBottom: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f2f2f2'
  },
  lineText: {
    fontSize: 14,
    color: '#333'
  }
})
