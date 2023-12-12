import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { Icon } from "@rneui/themed"
import theme from "../theme"
import StyledText from "./StyledText"
import * as SecureStore from "expo-secure-store";
import moment from 'moment';
import 'moment/locale/es';
import { getExchangeRates, getTransactionsList } from '../api/transactions/transactions'
import Loader from './Loader'
import { useUser } from "../context/UserContext"


const StyledTransations = ({customHeight, pagination}) => {
  moment.locale('es');

  const [transactionData, setTransactionData] = useState();

  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  const transactions = async (refresh) => {
    setLoading(true)
    if (!transactionData || refresh) {
      const token = await SecureStore.getItemAsync("token")
      return await getTransactionsList(pagination, token)
        .then((data) => {
          setTransactionData(data.response.map((data) => data))
          setLoading(false)
        })
        .catch((error) => {
          console.log("error", error)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
  }

  useEffect(() => {
    
    transactions(false)
  }, [transactionData, user]);

  // organizacion de las transacciones por fecha
  const transactionsByDate = {};

  if (transactionData !== undefined) {
    transactionData.forEach(transaction => {
      const date = transaction.created_date;
      if (!transactionsByDate[date]) {
        transactionsByDate[date] = [];
      }
      transactionsByDate[date].push(transaction);
    });
  }


  const sortedTransactions = Object.keys(transactionsByDate).sort((a, b) => b.localeCompare(a)).map(date => {
    return {
      date: date,
      transactions: transactionsByDate[date],
    };
  });

  const renderTransactionItem = ({ item }) => (
    <View key={Math.random()}>
      <View style={{ backgroundColor: theme.colors.lightgray, paddingVertical: 1, borderTopColor: theme.colors.lightBlue, borderTopWidth: 2, marginTop: 2 }}>
        <StyledText style={styles.dateText}>{moment(item.date).format('DD [de] MMMM [del] YYYY')}</StyledText>
      </View>
      {item.transactions.map(transaction => (
        <View style={styles.transactionBox} key={transaction.id}>
          <View style={[styles.coinContainer]}>
            {/* CoinName */}
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', width: width * 0.137}}>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">{transaction.currency_from.symbol}</StyledText>
              <StyledText fontSize="base" color="gray">{transaction.currency_from.name}</StyledText>
            </View>
            {/* avatar */}
            <Icon name="account-circle" type='material-community' color={theme.colors.blue} size={25}/>
            {/* Status */}
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', justifyContent: 'center'}}>
              <View>
                <StyledText fontSize="base" color="blue" fontWeight="extraBold">
                  {
                    transaction.transactionType.name
                  }
                </StyledText>
              </View>
              <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                {
                  transaction.status.color === "default" 
                  ? <Icon name='checkbox-blank-circle' type='material-community' color="#ECAA00" size={8}/> 
                    : transaction.status === "success" 
                    ? <Icon name='checkbox-blank-circle' type='material-community' color={theme.colors.green} size={8}/>
                    : <Icon name='checkbox-blank-circle' type='material-community' color={theme.colors.red} size={8}/>
                }
                <StyledText color="blue">
                  {
                    transaction.status.color === "default" 
                    ? "Pendiente"
                      : transaction.status === "success" 
                      ? "Procesando"
                      : "Cancelada"
                  }
                </StyledText>
              </View>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <View style={{flexWrap: "nowrap"}}>
              <StyledText fontSize="medium" fontWeight="extraBold" color="blue">
                {/* {transaction.currency_from.symbol}  */}
                {transaction.amount}
              </StyledText>
            </View>
            <View>
              <StyledText fontSize="normal" fontWeight="extraLight" color="blue">
                $ {"0.00"}
              </StyledText>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, {height: customHeight ? height * customHeight : height * sortedTransactions.length / 7}]}>
      <View style={styles.box}>
        <View key={Math.random()} style={{flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'space-between'}}>
          <View>
            <StyledText fontSize="normal" fontWeight="normal" color="blue">Ultimas Transacciones</StyledText>
          </View>
          <TouchableOpacity onPress={async () => await transactions(true)}>
            <Icon name='sync' type='material-community' color={theme.colors.blue} size={20}/>
          </TouchableOpacity>
        </View>
        {
          loading 
            ? (
              <View style={{justifyContent: 'center', alignItems: 'center', height: "100%", width: "100%"}}>
                <Loader loading={loading} size={"large"} color={theme.colors.blue}/>
              </View>
            ) : !transactionData
              ? (
                <View style={{alignSelf: 'center', justifyContent: 'center', marginTop: 50}}>
                  <StyledText color="blue" fontWeight="bold" fontSize="normal">No existen transacciones para mostrar...</StyledText>
                </View>
              )
              : (
                <FlatList
                  data={sortedTransactions}
                  renderItem={renderTransactionItem}
                  key={Math.random()}
                  keyExtractor={(item) => item.date}
                />
              )
        }
      </View>
    </View>
  )
}

export default StyledTransations
const {height, width} = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    elevation: 3,
    maxHeight: height * 0.6,
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  box: {
    flexDirection: 'column',
    flex: 1
  },
  dateText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.blue,
    paddingHorizontal: 10,
  },
  coinContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: "flex-start",
    alignItems: 'center',
    width: width * 0.45,
    paddingHorizontal: 7
  },
  balanceContainer: {
    width: width * 0.48, 
    alignItems: 'flex-end', 
    flexDirection: 'column', 
    paddingHorizontal: 7
  },
  transactionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBlue
  }
})