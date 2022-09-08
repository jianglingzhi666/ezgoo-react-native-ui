import React from 'react'
import { Text, View, SectionList, SectionListRenderItemInfo, SectionListData, TouchableOpacity, Image } from 'react-native'
import { Modal, ModalProps } from '../Modal'
import { screenHeight } from '../../utils/phoneInfo'
import * as ReactTestRenderer from 'react-test-renderer'
const data = require('../../common/address.json')

interface AddressPickerProps extends Omit<ModalProps, 'position'> {
  onChange?: (data: { province: undefined | string; city: undefined | string; area: undefined | string }) => void
}

interface AddressPickerState {
  hotArray: Array<Array<string>>
  data: Array<{ title: string; data: Array<string> }>
  province: string | undefined
  city: string | undefined
  area: string | undefined
  type: 'province' | 'city' | 'area'
}
export function AddressPicker() {
  return new Promise<{ province: undefined | string; city: undefined | string; area: undefined | string }>(function (resolve, reject) {
    let reactTestRenderer: ReactTestRenderer.ReactTestRenderer = ReactTestRenderer.create(
      React.createElement(AddressPickerModal, {
        visible: true,
        onRequestClose: () => {
          reactTestRenderer.getInstance()?.close(() => {
            reactTestRenderer.unmount()
            reject()
          })
        },
        onChange: (data: { province: undefined | string; city: undefined | string; area: undefined | string }) => {
          reactTestRenderer.getInstance()?.close(() => {
            reactTestRenderer.unmount()
            resolve(data)
          })
        }
      })
    )
  })
}
class AddressPickerModal extends React.Component<AddressPickerProps, AddressPickerState> {
  sectionListRef = React.createRef<SectionList>()
  modalRef = React.createRef<Modal>()
  constructor(props) {
    super(props)
    this.state = {
      hotArray: [
        ['北京', '上海', '广州', '深圳'],
        ['杭州', '南京', '苏州', '天津'],
        ['成都', '武汉', '长沙', '重庆']
      ],
      data: this.initProvince(),
      province: undefined,
      city: undefined,
      area: undefined,
      type: 'province'
    }
  }
  initArea = (province: string, city: string) => {
    let cityObject = Object.values(data)
      .flat()
      .find((item, index) => {
        return item.name === province
      })

    let array = []
    try {
      let areaObject = Object.values(cityObject.cityList)
        .flat()
        .find(item => {
          return item.name === city
        })

      let keys = Object.keys(areaObject.areaList)

      keys.forEach((item, index) => {
        array.push({
          title: item,
          data: areaObject.areaList[item]
        })
      })
    } catch (err) {
      let keys = Object.keys(cityObject.areaList)
      keys.forEach((item, index) => {
        array.push({
          title: item,
          data: cityObject.areaList[item]
        })
      })
    }

    return array
  }
  initCity = (province: string) => {
    let cityArray = Object.values(data)
      .flat()
      .find((item, index) => {
        console.log(item)
        return item.name === province
      })
    let array = []
    try {
      let keys = Object.keys(cityArray.cityList)
      keys.forEach((item, index) => {
        array.push({
          title: item,
          data: cityArray.cityList[item].map(element => element.name)
        })
      })
    } catch (err) { }

    return array
  }
  initProvince = () => {
    let keys = Object.keys(data)
    let array = []
    keys.forEach((item, index) => {
      array.push({
        title: item,
        data: data[item].map(element => element.name)
      })
    })
    return array
  }
  renderHot = () => {
    return this.state.hotArray.map((item, index) => {
      return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginTop: 25 }} key={index}>
          {item.map((element, i) => {
            return (
              <Text
                onPress={() => {
                  this.onChange(element)
                }}
                style={{ fontSize: 16, color: '#000' }}
                key={i}>
                {element}
              </Text>
            )
          })}
        </View>
      )
    })
  }
  onChange = (value: string) => {
    if (this.state.type === 'province') {
      let data = this.initCity(value)
      this.setState({
        province: value,
        data: data.length === 0 ? this.initArea(value) : data,
        type: data.length === 0 ? 'area' : 'city'
      })
    } else if (this.state.type === 'city') {
      this.setState({
        type: 'area',
        city: value,
        data: this.initArea(this.state.province as string, value)
      })
    } else {
      this.setState({
        area: value
      })
      this.props.onChange &&
        this.props.onChange({
          province: this.state.province,
          city: this.state.city,
          area: value
        })
    }
    setTimeout(() => {
      this.sectionListRef.current?.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewPosition: 0 })
    }, 300)
  }
  renderItem = (iteminfo: SectionListRenderItemInfo<string>) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onChange(iteminfo.item)
        }}
        style={{ width: '100%', paddingVertical: 15 }}>
        <Text style={{ fontSize: 16, color: '#000' }}>{iteminfo.item}</Text>
      </TouchableOpacity>
    )
  }
  renderSectionHeader = (info: { section: SectionListData<string, { data: Array<string>; title: string }> }) => {
    return (
      <View
        style={{
          paddingBottom: 6,
          paddingTop: 30,
          width: '100%',
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          borderBottomColor: 'rgba(240, 240, 240, 1)'
        }}>
        <Text style={{ fontSize: 14, color: 'rgba(153, 153, 153, 1)' }}>{info.section.title}</Text>
      </View>
    )
  }
  close = (callback?: () => void) => {
    this.modalRef.current?.close(callback)
  }
  render() {
    return (
      <Modal position="bottom" visible={this.props.visible} animationType="slide" onRequestClose={this.props.onRequestClose} ref={this.modalRef}>
        <View
          style={{
            height: screenHeight * 0.8,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 22,
            paddingHorizontal: 26,
            position: 'relative',
            justifyContent: 'center'
          }}>
          <View
            style={{
              width: 22,
              borderRadius: 11,
              backgroundColor: 'rgba(238, 238, 238, 1)',
              position: 'absolute',
              // marginTop: '-50%',
              bottom: 14,
              right: 24,
              zIndex: 99,
              paddingVertical: 7,
              alignItems: 'center'
            }}>
            {this.state.data.map((item, index) => {
              return (
                <Text
                  onPress={() => {
                    this.sectionListRef.current?.scrollToLocation({
                      sectionIndex: index,
                      itemIndex: 0,
                      animated: true,
                      viewPosition: 0
                    })
                  }}
                  key={index}
                  style={{ fontSize: 12, color: 'rgba(102, 102, 102, 1)', marginVertical: 7 }}>
                  {item.title}
                </Text>
              )
            })}
          </View>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>请选择所在地区</Text>
            <TouchableOpacity onPress={this.props.onRequestClose}>
              <Image style={{ width: 16, height: 16 }} source={require('./icon/icon_close.png')} />
            </TouchableOpacity>
          </View>
          {this.state.province !== undefined ? (
            <View style={{ width: '100%', marginBottom: 10, flexDirection: 'row' }}>
              <Text
                style={{ fontSize: 14, color: '#000' }}
                onPress={() => {
                  this.setState({
                    area: undefined,
                    city: undefined,
                    type: 'province',
                    data: this.initProvince()
                  })
                  requestAnimationFrame(() => {
                    this.sectionListRef.current?.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewPosition: 0 })
                  })
                }}>
                {this.state.province}
              </Text>
              {this.state.type === 'area' && this.state.city === undefined ? null : (
                <Text
                  onPress={() => {
                    this.setState({
                      area: undefined,
                      type: 'city',
                      data: this.initCity(this.state.province)
                    })
                    requestAnimationFrame(() => {
                      this.sectionListRef.current?.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewPosition: 0 })
                    })
                  }}
                  style={{ fontSize: 14, color: this.state.type === 'city' ? 'rgba(252, 80, 95, 1)' : '#000', marginLeft: 36 }}>
                  {this.state.type === 'city' ? '请选择' : this.state.city}
                </Text>
              )}
              <Text
                onPress={() => {
                  this.setState({
                    type: 'area',
                    data: this.initArea(this.state.province, this.state.city)
                  })
                  requestAnimationFrame(() => {
                    this.sectionListRef.current?.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewPosition: 0 })
                  })
                }}
                style={{ fontSize: 14, color: this.state.type === 'area' && !this.state.area ? 'rgba(252, 80, 95, 1)' : '#000', marginLeft: 36 }}>
                {this.state.type === 'area' && !this.state.area ? '请选择' : this.state.area}
              </Text>
            </View>
          ) : null}
          <SectionList
            ref={this.sectionListRef}
            stickySectionHeadersEnabled={true}
            ListHeaderComponent={() => {
              if (this.state.province === undefined) {
                return (
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(153, 153, 153, 1)' }}>热门城市选择</Text>
                    {this.renderHot()}
                  </View>
                )
              }
              return <View />
            }}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            sections={this.state.data}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
          />
        </View>
      </Modal>
    )
  }
}
