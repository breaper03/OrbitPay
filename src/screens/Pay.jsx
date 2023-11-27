import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native';
import StyledText from '../components/StyledText';
import { Icon } from '@rneui/themed';
import theme from '../theme';
import { Keyboard, Dropdown } from '../components';
const Pay = () => {

  const navigation = useNavigation()

  const [amount, setAmount] = useState("0.00")
  const [selected, setSelected] = useState();

  const handleSelect = (option) => {
    setSelected(option)
  };

  const handleNextStep = () => {
    parseFloat(amount) > 0.00 && selected
      ? navigation.navigate('Resume',{
        amount: amount,
        coin: selected
      })
      : !parseFloat(amount) > 0.00 ? new Error("El monto minimo es de $ 1.00")
      : !selected && new Error("Seleccione una moneda para continuar")
  }

  const data = [
    {
      coin: "PTR",
      coinName: "Petro",
      icon: <Image source={require("../../assets/PTR.png")}/>,
      balance: "0,00033"
    },
    {
      coin: "BTC",
      coinName: "Bitcoin",
      icon: <Image source={require("../../assets/BTC.png")}/>,
      balance: "0,00033000"
    },
    {
      coin: "USDT",
      coinName: "Tether",
      icon: <Image source={require("../../assets/USDT.png")}/>,
      balance: "1,00000000"
    },
    {
      coin: "ETH",
      coinName: "Ethereum",
      icon: <Image source={require("../../assets/ETH.png")}/>,
      balance: "2,50000000"
    },
    {
      coin: "USD",
      coinName: "Dolar",
      icon: <Image source={require("../../assets/USD.png")}/>,
      balance: "15,00"
    },
    {
      coin: "EUR",
      coinName: "Euro",
      icon: <Image source={require("../../assets/EUR.png")}/>,
      balance: "25,00"
    },
    {
      coin: "BS",
      coinName: "Bolivar",
      icon: <Image source={require("../../assets/VES.png")}/>,
      balance: "12,4000"
    },
  ]
  // ["VES", "USDT", "USD", "EUR", "ETH", "BTC"]
  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: height * 0.3 }]}/>

        <TouchableOpacity onPress={() => navigation.navigate("Orbit")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Orbit</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: height * 0.7 }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <StyledText style={styles.title}>$ {amount}</StyledText>
          <StyledText fontSize="sm" fontWeight="bold" color="gray" >(El monto maximo es 600)</StyledText>
          <View style={{width: "100%", paddingHorizontal: 10, justifyContent: 'space-between', marginTop: height * 0.005}}>
            
            <Dropdown data={data} onSelect={handleSelect} selected={selected}/>
            
            <View style={{marginTop: height * 0.02, height: height * 0.37}}>
              <Keyboard amount={amount} setAmount={setAmount}/>
            </View>

            <View style={{marginTop: height * 0.03}}>
              <TouchableOpacity 
                onPress={handleNextStep}
                style={{backgroundColor: theme.colors.blue, paddingVertical: 10, marginHorizontal: 50, borderRadius: 100, alignItems: 'center', elevation: 3}}
              >
                <StyledText fontSize="medium" fontWeight="bold" color="white">Siguiente</StyledText>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </View>
    </>
  );
};

const { width, height } = Dimensions.get('window'); // Obtener dimensiones de la pantalla

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3, // Sombras
    paddingVertical: 16,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.135, // Centra verticalmente en el 25% de la pantalla
    height: height * 0.70,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5
  },
  goBack: {
    justifyContent: 'flex-start',
    backgroundColor: '#00000000',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.05, // Centra verticalmente en el 25% de la pantalla
    height: height * 0.07
  },
  itemsGoBack: {
    flex: 1, 
    flexDirection: 'row', 
    width: "100%", 
    justifyContent: "flex-start", 
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeights.extraBold,
    color: theme.colors.black,
  },
  content: {
    fontSize: theme.fontSize.medium,
    fontSize: 16,
  },
  
  boxStyles: {
    backgroundColor: "gray",
    borderColor: theme.colors.blue,
    borderWidth: 0,
    elevation: 3,
    width: 350,
    backgroundColor: "white"
  },
  dropdown: {
    backgroundColor: "white",
    padding: 0,
    height: 181,
    elevation: 3
  },
  dropdownItems: {
    backgroundColor: "gray",
    borderBottomColor: theme.colors.lightBlue,
    borderTopColor: theme.colors.lightBlue,
    borderBottomWidth: 2,
    borderTopWidth: 2
  },
  dropdownText: {
    width: width * 0.70,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default Pay;
