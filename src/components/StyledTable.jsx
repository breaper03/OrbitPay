import React, { useEffect, useState } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native'
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import StyledText from './StyledText';
import Loader from './Loader';
import theme from "../theme"
import { useUser } from "../context/UserContext"

const StyledTable = ({setBalance}) => {
  const { handleUserBalance, transactions, user } = useUser()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      if (transactions === undefined || transactions.length < 1) {
          return await handleUserBalance()
            .then((data) => {
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
            })
        } else {
          setLoading(false);
        }
    }
    getTransactions()
  }, [transactions, user])


  const transformedArray = (number) => {
    // Eliminar signo '-' y reemplazar ',' por '.'
    const formattedNumber = number.replace('-', '').replace(',', '.');
  
    // Redondear a 7 decimales
    const roundedNumber = Number(formattedNumber).toFixed(7);
  
    return roundedNumber.replace("-", "");
  }

  const fixTotalInDolar = (numero) => {
    // Convierte el número a un string con dos decimale
    const numeroFormateado = Number(numero).toFixed(2);
    setTotalBalance()

  
    // Asegura que el número nunca sea negativo
    const plusNumber = numeroFormateado < 0 ? "0.00" : numeroFormateado;  
    return plusNumber;
  };

  const setTotalBalance = () => {
    const formatNumber = transactions.map((item) => Number(item.total_in_usd).toFixed(2))
    const balance = formatNumber.reduce((total, numero) => total + parseFloat(numero), 0)

    const formattedNumber = parseFloat(balance).toFixed(2);

    
    // Split into integer and decimal parts
    const parts = formattedNumber.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
  
    // Add commas as thousands separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    // Combine the formatted parts
    const finalNumber = `${integerPart}.${decimalPart}`;
    setBalance(finalNumber)
  };
  
  const navigation = useNavigation()

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.rows}>
        <View color="blue" fontSize="xxs" fontWeight="extralight" style={styles.icoRow}>

          <View >
            <Image source={{uri: `${item.currency_icon_path}`}} width={20} height={20}/>
          </View>
          <View>
            <StyledText style={styles.icoRowText}>{item.currency_name}</StyledText>
            <StyledText style={styles.icoRowText}>{item.currency_symbol}</StyledText> 
          </View>

        </View>

        <View color="blue" fontSize="xxs" fontWeight="extralight" style={styles.balanceRow}>
          <View>
            <StyledText style={styles.balanceRowText}>{transformedArray(item.total)}</StyledText>
            <StyledText style={styles.balanceRowText}>$ {fixTotalInDolar(item.total_in_usd).replace("-", "")}</StyledText> 
          </View>
        </View>

        <TouchableOpacity style={styles.rowsText}>
          <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
            onPress={() => navigation.navigate("Pay", {coin: item})}
          >
            <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.blue} size={20}/>
          </StyledText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowsText}>
          <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
            onPress={() => navigation.navigate("Receive", {coin: item})}
          >
            <Icon name='arrow-bottom-left-thick' type='material-community'color={theme.colors.blue} size={20}/>
          </StyledText>        
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowsText}>
          <StyledText color="blue" fontSize="xxs" fontWeight="extralight" style={styles.rowsText}
            onPress={() => navigation.navigate("Swap", {coin: item})}
          >
            <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
          </StyledText>
        </TouchableOpacity>
      </View>

    )
  }
  
  return (


    <View style={styles.container}>

      <View key={Math.random()} style={styles.header}>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerText}>Moneda</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerBalancetext}>Balance</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Envio</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Deposito</StyledText>
        <StyledText fontSize="base" fontWeight="extrabold" color="blue" style={styles.headerActionText}>Intercambio</StyledText>
      </View>

      {
        loading === true
          ? (
            <View style={[styles.flatList, {alignItems: 'center', justifyContent: 'center'}]}>
              <Loader color={theme.colors.blue} loading={loading} size={"large"} key={Math.random()}/>
            </View>
          ) : (
            <FlatList
              style={styles.flatList}
              data={transactions}
              keyExtractor={(item, index) => { item.id }}
              renderItem={renderItem}
            />
          )
      }

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
    minHeight: height * 0.280,
    maxHeight: height * 0.280,
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
    fontWeight: theme.fontWeights.normal,
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
    fontWeight: theme.fontWeights.normal,
    width: 60,
    overflow: "hidden",
    maxHeight: "100%"
  },
})

export default StyledTable