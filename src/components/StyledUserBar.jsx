//framework
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
//other
import { Icon, Badge } from '@rneui/themed';
//my
import StyledText from './StyledText'
import theme from "../theme"

const data = [
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "gain",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "lose",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "gain",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "lose",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "gain",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "lose",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
  {
    name: "BTC",
    coinName: "Bitcoin",
    state: "gain",
    UpOrDown: 7.5,
    value: "25,5000000",
    icon: "ico"
  },
]

export default function StyledUserBar() {
  return (
    <View style={styles.container}>
      <View 
        style={{
          backgroundColor: theme.colors.blue, padding: 6, paddingHorizontal: 7,
          borderRadius: 100, flexDirection:"row", alignItems: 'center', justifyContent:"space-between"
        }}>
        <Icon name='user-circle' type='font-awesome-5' color={theme.colors.lightBlue} size={30}/>
      </View>
      <View 
        style={{
          borderRadius: 100, flexDirection:"row", justifyContent:"center"
        }}>
        <Icon name='bell' type='font-awesome-5' color={theme.colors.blue} solid={true} size={30} />
        <Badge value="0" badgeStyle={{borderColor: "red"}} containerStyle={{right: 8}} status="error" size/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    overflow: 'scroll',
    height: 69,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  box: {
    flex: 1,
    minWidth: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between', 
    paddingLeft: 5,
    paddingRight: 1,
  },
  boxText: {
    textAlign: "right",
    fontSize: theme.fontSize.base,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeights.extraLight,
  },
})