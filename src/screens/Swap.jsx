import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import StyledText from '../components/StyledText';
import theme from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown, Keyboard } from '../components';

const Swap = () => {

  const navigation = useNavigation();
  const {coin} = useRoute().params 

  const [selectedTwo, setSelectedTwo] = useState(coin);
  const [selectedOne, setSelectedOne] = useState(coin);
  const [amount, setAmount] = useState("0.00")

  const handleSelectOne = (option) => {
    setSelectedOne(option)
  };

  const handleSelectTwo = (option) => {
    setSelectedTwo(option)
  };

  const handleNextStep = () => {
    if (selectedTwo === selectedOne || amount < 1.00) {
      console.log("negativo el procedimiento...")
      // se despliegan warnings dependiendo del error
    } else {
      navigation.navigate('Resume',{
        amount: amount,
        coin: selectedOne,
        dual: selectedTwo,
        lastScreen: "Swap"
      })
    }
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Inicio</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          {/* <StyledText style={styles.title}>Intercambio</StyledText> */}
          <View style={{gap: 10}}>
            <StyledText style={styles.amount}>$ {amount}</StyledText>
            <View>
              <View style={{alignItems: 'center'}}>
                <Dropdown onSelect={handleSelectOne} selected={selectedOne} coinLink={coin} isDual={selectedTwo}/>
                  <Icon type='ant-design' name='swap' color={theme.colors.blue} size={25}/>
                <Dropdown onSelect={handleSelectTwo} selected={selectedTwo} isDual={selectedOne}/>
              </View>
              <View style={{marginTop: height * 0.02, height: height * 0.37}}>
                <Keyboard amount={amount} setAmount={setAmount} maxAmount={selectedOne.total_in_usd}/>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleNextStep()}
              style={{backgroundColor: theme.colors.blue, paddingVertical: 10, marginHorizontal: 10, marginTop: 20, borderRadius: 100, alignItems: 'center', elevation: 3}}
            >
              <StyledText fontSize="medium" fontWeight="bold" color="white">Siguiente</StyledText>
            </TouchableOpacity>
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
    paddingVertical: 15,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.135, // Centra verticalmente en el 25% de la pantalla
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
    fontWeight: 'bold',
    color: theme.colors.blue
  },
  amount: {
    textAlign: 'center',
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.black
  },
  content: {
    fontSize: theme.fontSize.medium,
    fontSize: 16,
  },
});

export default Swap;
