import React from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native'
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import StyledText from './StyledText';
import theme from "../theme"



const data = [
  {
    id: 1,
    name: "PTR",
    coinName: "Petro",
    balance: "0,000",
    value: "0,520000",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community'
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/Petro.png")}/>
  },
  {
    id: 2,
    name: "BTC",
    coinName: "Bitcoin",
    balance: "0,000",
    value: "0.520000",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community' 
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/BTC.png")}/>
  },
  {
    id: 3,
    name: "USDT",
    coinName: "Tether",
    balance: "0,000",
    value: "300",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community' 
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/USDT.png")}/>
  },
  {
    id: 4,
    name: "ETH",
    coinName: "Ethereum",
    balance: "0,000",
    value: "0,520000",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community'color={theme.colors.blue} size={20}/>, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/eth.png")}/>
  },
  {
    id: 5,
    name: "USD",
    coinName: "Dolar",
    balance: "0,000",
    value: "0.520000",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community' 
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/usd.png")}/>
  },
  {
    id: 6,
    name: "EUR",
    coinName: "Euro",
    balance: "0,000",
    value: "0.520000",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community' 
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/euro.png")}/>
  },
  {
    id: 7,
    name: "BS",
    coinName: "Bolivares",
    balance: "0,000",
    value: "300",
    action: {
      deposit: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>, 
      withdrawal: <Icon name='arrow-bottom-left-thick' type='material-community' 
        color={theme.colors.blue} size={20}
      />, 
      swap: <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
    },
    icon: <Image source={require("../../assets/bolivar.png")}/>
  },
]

const StyledTable = () => {
  

  const navigation = useNavigation()

  const renderItem = ({item}) => (
    <View key={item.id} style={styles.rows}>
      <View color="blue" fontSize="xxs" fontWeight="extralight" style={styles.icoRow}>

        <View>
          {item.icon}
        </View>
        <View>
          <StyledText style={styles.icoRowText}>{item.coinName}</StyledText>
          <StyledText style={styles.icoRowText}>{item.name}</StyledText> 
        </View>

      </View>

      <View color="blue" fontSize="xxs" fontWeight="extralight" style={styles.balanceRow}>
        <View>
          <StyledText style={styles.balanceRowText}>{item.value}</StyledText>
          <StyledText style={styles.balanceRowText}>$ {item.balance}</StyledText> 
        </View>
      </View>

      <TouchableOpacity style={styles.rowsText}>
        <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
          onPress={() => navigation.navigate("Pay")}
        >
          {item.action.deposit}
        </StyledText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowsText}>
        <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
          onPress={() => navigation.navigate("Send")}
        >
          {item.action.withdrawal}
        </StyledText>        
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowsText}>
        <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
          onPress={() => navigation.navigate("Swap")}
        >
          {item.action.swap}
        </StyledText>
      </TouchableOpacity>



    </View>
  )
  
  return (


    <View style={styles.container}>

      <View key={Math.random()} style={styles.header}>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerText}> </StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerBalancetext}>Balance</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Envio</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Deposito</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Intercambio</StyledText>
      </View>

      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => { item.id.toString() }}
        renderItem={renderItem}
      ></FlatList>
    </View>
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingVertical: 0,
    paddingHorizontal: 1,
  },
  headerTopBar: {
    backgroundColor: theme.colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 12,
    maxHeight: height * 0.69,
    borderRadius: 10
  },

  headerTopText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: {
    flex: 1,
    maxHeight: 25,
    marginTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3
  },

  headerText: {
    flex: 1,
    flexDirection: "row",
    textAlign: "right",
    paddingVertical: 1,
    paddingHorizontal: 5,
    minWidth: 35,
    fontWeight: theme.fontWeights.extraBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
    alignItems: "center",
  },

  headerActionText: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    paddingVertical: 1,
    paddingHorizontal: 1,
    minWidth: 15,
    fontWeight: theme.fontWeights.extraBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
    alignItems: "center",
  },

  headerBalancetext: {
    flex: 1,
    flexDirection: "row",
    textAlign: "right",
    paddingVertical: 1,
    paddingHorizontal: 5,
    width: "100%",
    fontWeight: theme.fontWeights.extraBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
  },

  modalIcon: {
    marginLeft: 5,
    marginBottom: 20
  },

  flatList: {
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    height: height * 0.295,
    elevation: 3
  },

  rows: {
    flexDirection: "row",
    paddingHorizontal: 2,
    justifyContent: "space-between",
    alignItems: "center",
    borderStyle: 'solid',
    borderTopWidth: 2,
    borderTopColor: theme.colors.lightBlue,
  },

  rowsText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 2,
    paddingHorizontal: 1,
    fontSize: theme.fontSize.base,
    maxWidth: 80,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeights.bold,
  },

  icoRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between', 
    paddingLeft: 5,
    paddingRight: 1,
  },
  icoRowText: {
    textAlign: "right",
    fontSize: theme.fontSize.base,
    color: theme.colors.blue,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeights.extraLight,
  },
  balanceRow : {
    flex: 1,
    flexDirection: "col",
    alignItems: "center",
    textAlign: "right",
    justifyContent: 'end', 
    paddingLeft: 5,
    paddingRight: 1,
    width: "100%",
  },
  balanceRowText: {
    flexDirection: "row",
    paddingVertical: 1,
    textAlign: "right",
    color: theme.colors.blue,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeights.extraLight,
    width: 60,
    overflow: "hidden",
    maxHeight: "100%"
  },
})

export default StyledTable