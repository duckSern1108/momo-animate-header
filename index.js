import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Animated, Dimensions, Pressable } from 'react-native';
import Constants from 'expo-constants';
import {FontAwesome5} from '@expo/vector-icons'

//data
const DATA = [1,2,3,4,5,6,7,8,9,10]
const ACTION_GROUP = [{
  text: 'Nạp tiền vào ví',
  icon : 'sign-out-alt'
},
{
  text: 'Rút tiền',
  icon : 'dollar-sign'
},
{
  text: 'Mã thanh toán',
  icon : 'barcode'
},
{
  text: 'Quét mã',
  icon : 'qrcode'
}]

const ACTION_GROUP_COUNT = ACTION_GROUP.length

//style
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
const HEADER_HEIGHT = 170 + STATUS_BAR_HEIGHT
const HEADER_PADDING_TOP = 24
const ICON_SIZE = 16
const SPACE = 16
const FINAL_HEADER_HEIGHT = HEADER_PADDING_TOP * 2 + ICON_SIZE + STATUS_BAR_HEIGHT
const ACTION_ICON_SIZE = 40
const ACTION_ICON_PADDING = (ACTION_ICON_SIZE - ICON_SIZE) / 2
const SCREEN_WIDTH = Dimensions.get('screen').width

// 3 = icon search + bell + power off
const ICON_HEADER_MAX_WIDTH = (SCREEN_WIDTH - SPACE * 2) / (ACTION_GROUP_COUNT + 3)
const FINAL_ACTION_GROUP_WIDTH = ICON_HEADER_MAX_WIDTH * ACTION_GROUP_COUNT
// 1 = icon search
const INITIAL_SEARCH_BAR_WIDTH = ICON_HEADER_MAX_WIDTH * (ACTION_GROUP_COUNT + 1)

//animated
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5)
const AnimatedTouchable = Animated.createAnimatedComponent(Pressable)
const DEFAULT_INPUT_RANGE = [0,HEADER_HEIGHT]


//fake onpress
const onPress = () => alert('press')
const ActionIcon = ({scrollY,item,index}) => {
  const {text,icon} = item
  const backgroundColor = scrollY.interpolate({
    inputRange: DEFAULT_INPUT_RANGE,
    outputRange: ['#ffffff','transparent'],
    extrapolate: 'clamp'
  })
  const textScale = Animated.add(scrollY,0).interpolate({
    inputRange: DEFAULT_INPUT_RANGE,
    outputRange: [1,0],
    extrapolate: 'clamp'
  })
  const iconColor = Animated.add(scrollY,0).interpolate({
    inputRange: DEFAULT_INPUT_RANGE,
    outputRange: ['#000','#fff'],
    extrapolate: 'clamp'
  })
  
  return(
    <Pressable 
      style={{
        alignItems: 'center',
        width: '25%',
        // backgroundColor: 'orange'
      }}
      onPress={onPress}
    >
      <Animated.View
      key={index}
      style={{
        width: ACTION_ICON_SIZE,
        height: ACTION_ICON_SIZE,
        borderRadius: 8,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <AnimatedIcon name={icon} size={ICON_SIZE} style={{
        color: iconColor
      }}/>
    </Animated.View>
      <Animated.Text style={{
        color: '#ffffff',
        fontSize: 14,
        marginTop: SPACE,
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingHorizontal: SPACE / 4,
        transform: [{
          scale: textScale
        }]
      }}>
        {text}
      </Animated.Text>
    </Pressable>
  )
}

export default function App() {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const Header = () => {
    const height = scrollY.interpolate({
      inputRange: DEFAULT_INPUT_RANGE,
      outputRange: [HEADER_HEIGHT,FINAL_HEADER_HEIGHT],
      extrapolate: 'clamp'
    })
    const searchBarWidth = Animated.add(scrollY,0).interpolate({
      inputRange: DEFAULT_INPUT_RANGE,
      outputRange: [INITIAL_SEARCH_BAR_WIDTH,0],
      extrapolate: 'clamp'
    })
    const actionGroupWidth = Animated.add(scrollY,0).interpolate({
      inputRange: DEFAULT_INPUT_RANGE,
      outputRange: [SCREEN_WIDTH, FINAL_ACTION_GROUP_WIDTH],
      extrapolate: 'clamp'
    })
    const actionGroupTop = Animated.add(scrollY,0).interpolate({
      inputRange: DEFAULT_INPUT_RANGE,
      outputRange: [FINAL_HEADER_HEIGHT,HEADER_PADDING_TOP + STATUS_BAR_HEIGHT - ACTION_ICON_PADDING],
      extrapolate: 'clamp'
    })
    const actionGroupTranslateX = Animated.add(scrollY,0).interpolate({
      inputRange: DEFAULT_INPUT_RANGE,
      outputRange: [0,ICON_HEADER_MAX_WIDTH + SPACE],
      extrapolate: 'clamp'
    })
    return(
      <Animated.View style={[styles.header,{
        height
      }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={styles.searchBarContainer}>
            <Pressable onPress={onPress} style={styles.headerIconContainer}>
              <FontAwesome5 name="search" size={ICON_SIZE} color="#ffffff"/>
            </Pressable>
            <AnimatedTouchable
              onPress={onPress}
              style={{
                width: searchBarWidth,
                backgroundColor: 'transparent',
                height: ICON_SIZE + SPACE,
                position: 'absolute',
                justifyContent: 'center',
                zIndex: 100,
                borderRadius: SPACE / 2
              }}
            />
            <AnimatedTouchable
              style={{
                width: searchBarWidth,
                backgroundColor: 'pink',
                height: ICON_SIZE + SPACE,
                position: 'absolute',
                justifyContent: 'center',
                zIndex: -1,
                borderRadius: SPACE / 2
              }}
            >
              <Text style={{
                color: '#ffffff',
                // opacity: 0.7,
                marginLeft : ICON_HEADER_MAX_WIDTH
              }}>
                Tìm kiếm
              </Text>
            </AnimatedTouchable>
          </View>
          <Pressable onPress={onPress} style={styles.headerIconContainer}>
            <FontAwesome5 name="bell" size={ICON_SIZE} color="#fff" />
          </Pressable>
          <Pressable onPress={onPress} style={styles.headerIconContainer}>
            <FontAwesome5 name="power-off" size={ICON_SIZE} color="#fff"/>
          </Pressable>
          
        </View>
        <Animated.View 
          style={{
            overflow: 'hidden',
            flexDirection: 'row',
            position: 'absolute',
            top : actionGroupTop,
            width: actionGroupWidth,
            transform: [{
                translateX: actionGroupTranslateX
            }]
          }}
        >
          {ACTION_GROUP.map((item,index) => {
            return(
              <ActionIcon scrollY={scrollY} item={item} index={index} />
            )
          })}
        </Animated.View>
      </Animated.View>
    )
  }
  const translateY = scrollY.interpolate({
    inputRange: DEFAULT_INPUT_RANGE,
    outputRange: [HEADER_HEIGHT,FINAL_HEADER_HEIGHT - HEADER_HEIGHT]
  })
  return (
    <View style={styles.container}>
      <AnimatedFlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
          onScroll={Animated.event([{
            nativeEvent: {
              contentOffset : {
                y: scrollY
              }
            }
          }])}
        style={[styles.flatList,{
          transform: [{
            translateY
          }]
        }]}
        data={DATA}
        renderItem={({item,index}) => {
          return(
            <View style={styles.item}>
              <Text>{index}</Text>
            </View>
          )
        }}
      />
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  item: {
    height: 100,
    backgroundColor: 'yellow',
    marginBottom: SPACE
  },
  flatList: {
  },
  header: {
    backgroundColor: 'red',
    position: 'absolute',
    width: '100%',
    top : 0,
    paddingHorizontal: SPACE,
    paddingTop: HEADER_PADDING_TOP + STATUS_BAR_HEIGHT
  },
  headerIconContainer : {
    width: ICON_HEADER_MAX_WIDTH,
    alignItems: 'center',
  },
  searchBarContainer: {
    width: INITIAL_SEARCH_BAR_WIDTH,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
