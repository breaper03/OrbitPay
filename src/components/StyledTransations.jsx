import React from 'react'
import { StyleSheet, View, FlatList, Dimensions } from 'react-native'
import { Icon } from "@rneui/themed"
import theme from "../theme"
import StyledText from "./StyledText"

const data = [
  { 
    icon: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.green} size={20}/>,
    coin: "USDT",
    coinName: "Tether",
    transactionType: "send",
    _id: "6fp",
    value: "5,52",
    transactionDate: "13-06-23"
  },
  { 
    icon: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.green} size={20}/>,
    coin: "ETH",
    coinName: "Ethereum",
    transactionType: "receive",
    _id: "7gq",
    value: "2,50",
    transactionDate: "15-06-23"
  },
  { 
    icon: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.green} size={20}/>,
    coin: "USDT",
    coinName: "Tether",
    transactionType: "send",
    _id: "8hr",
    value: "5,52",
    transactionDate: "15-06-23"
  },
  { 
    icon: <Icon name='arrow-top-right-thick' type='material-community'  color={theme.colors.green} size={20}/>,
    coin: "ETH",
    coinName: "Ethereum",
    transactionType: "receive",
    _id: "9is",
    value: "2,50",
    transactionDate: "14-06-23"
  },
]

// organizacion de las transacciones por fecha
const transactionsByDate = {};

data.forEach(transaction => {
  const date = transaction.transactionDate;
  if (!transactionsByDate[date]) {
    transactionsByDate[date] = [];
  }
  transactionsByDate[date].push(transaction);
});

const sortedTransactions = Object.keys(transactionsByDate).sort((a, b) => b.localeCompare(a)).map(date => {
  return {
    date: date,
    transactions: transactionsByDate[date],
  };
});

const StyledTransations = ({title, customHeight}) => {

  const renderTransactionItem = ({ item }) => (
    <View key={Math.random()}>
      <View style={{ backgroundColor: theme.colors.lightgray, paddingVertical: 1, borderTopColor: theme.colors.lightBlue, borderTopWidth: 2, marginTop: 2 }}>
        <StyledText style={styles.dateText}>{item.date}</StyledText>
      </View>
      {item.transactions.map(transaction => (
        <View style={styles.transactionBox} key={Math.random()}>
          <View>
            {
              transaction.transactionType === "receive"
                ? <Icon key={Math.random()} name='arrow-bottom-left-thick' type='material-community'  color={theme.colors.green} size={20}/>
                : <Icon key={Math.random()} name='arrow-top-right-thick' type='material-community'  color={theme.colors.red} size={20}/>
            }
          </View>
          <View style={styles.coinContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">{transaction.coin}</StyledText>
              <StyledText fontSize="base" color="gray">{transaction.coinName}</StyledText>
            </View>
            <StyledText fontSize="base" color="gray">
              {
                transaction.transactionType === "receive" ? "RECIBISTE" : "ENVIASTE"
              }
            </StyledText>
          </View>
          <View>
            <StyledText fontSize="lg" fontWeight="extraBold" color={`${transaction.transactionType === "receive" ? "green" : "red"}`}>
              ${transaction.transactionType === "receive" ? "" : "-"}{transaction.value}
            </StyledText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, {height: customHeight ? height * customHeight : height * sortedTransactions.length / 7}]}>
      <View style={styles.box}>
        {
          title === typeof string
            ? (
              <View key={Math.random()} style={{paddingHorizontal: 20, paddingVertical: 5,}}>
                <StyledText fontSize="medium" fontWeight="normal" color="blue">{title}</StyledText>
              </View>
            ) : (
              <View key={Math.random()} style={{flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 5, justifyContent: 'space-between'}}>
                {
                  title.map(item => (
                    <StyledText fontSize="base" fontWeight="bold" color="blue">{item}</StyledText>
                  ))
                }
              </View>
            )
        }
        <FlatList
          data={sortedTransactions}
          renderItem={renderTransactionItem}
          key={Math.random()}
          keyExtractor={(item) => item.date}
        />
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
    marginRight: 80,
    justifyContent: "flex-end"
  },
  transactionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBlue
  }
})