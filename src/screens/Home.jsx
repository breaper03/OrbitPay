import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import * as SecureStore from "expo-secure-store"
import Constants from 'expo-constants';
import StyledText from "../components/StyledText"
import StyledTable from '../components/StyledTable'
import StyledModal from '../components/StyledModal'
import theme from '../theme';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import StyledUserBar from '../components/StyledUserBar'
import StyledTransations from '../components/StyledTransations';
import { StatusBar } from 'expo-status-bar'
import { useUser } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const { user } = useUser()
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState(undefined)

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.lightBlue} hidden={false} translucent={true}/>
      <View style={{height: Constants.statusBarHeight}}>
        <StyledModal visible={visible} setVisible={setVisible} />
      </View>
      <View style={styles.container}>
        <View style={styles.box}>

          {/* User Bar */}
          <View style={styles.carouselTopBar}>
            <StyledUserBar user={user}/>
          </View>

          {/* Balance Bar */}
          <View key={Math.random()} style={styles.headerTopBar}>
            <TouchableOpacity style={styles.headerTopText} onPress={() => {setVisible(!visible)}}>
              <View>
                <StyledText fontSize="xxl" fontWeight="bold" color="white">Balance</StyledText>
              </View>
              <View style={{flexDirection: "row", alignItems: 'flex-end'}}> 
                <StyledText 
                  style={{color: theme.colors.white, fontWeight: theme.fontWeights.bold, fontSize: theme.fontSize.medium, marginBottom: 3}}
                >$</StyledText>
                <StyledText fontSize="xxl" fontWeight="bold" color="white"> 100</StyledText>
                <Icon name='info-outline' type='material' size={14} color={theme.colors.white} style={styles.modalIcon}/>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Table and Transactions Container */}
          <View style={{ flex: 1, flexDirection: "column"}}>
            <View style={{height: height * 0.365, marginBottom: 15, elevation: 3}}>
              <StyledTable/>
            </View>
            
            <View style={{height:height * 0.19, paddingVertical: 1}}>
              <StyledTransations title={["Ultimas transacciones"]} customHeight={0.2}/>
            </View>
          </View>

        </View>
      </View>
    </>
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: theme.colors.lightBlue,
  },
  box: {
    flex: 1, 
    height: height * 0.01,
    flexDirection: 'column',
    paddingVertical: 0,
    paddingHorizontal: 12,
  },

  carouselTopBar: {
    flex: 1,
    paddingHorizontal: 1,
    paddingVertical: 1,
    overflow: 'hidden',
    marginVertical: 10,
    maxHeight: height * 0.065,
    borderRadius: 10,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  headerTopBar: {
    backgroundColor: theme.colors.blue,
    paddingVertical: height * 0.01,
    paddingHorizontal: height * 0.02,
    height: height * 0.075,
    borderRadius: 10,
    elevation: 9
  },

  headerTopText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: {
    marginTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 2,
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    paddingVertical: 2,
    paddingHorizontal: 5,
    maxWidth: 80,
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
  },

  headerBalancetext: {
    flex: 1,
    flexDirection: "row",
    textAlign: "right",
    paddingVertical: 2,
    paddingHorizontal: 5,
    maxWidth: 80,
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
  },

  modalIcon: {
    marginLeft: 5,
    marginBottom: 20
  },
})

export default Home
