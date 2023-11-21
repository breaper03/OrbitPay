import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import StyledText from '../components/StyledText';
import theme from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';


const TransactionComplete = () => {

  const navigation = useNavigation();
  const {email, description, amount, coin} = useRoute().params
  
  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>
        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <View style={{alignItems: 'center', justifyContent: 'space-around', height: "100%"}}>
            <View style={{backgroundColor: theme.colors.lightGreen, borderRadius: width, padding: 30, minWidth: "40%", maxWidth: "40%"}}>
              <Icon type='font-awesome-5' name='check' color={theme.colors.green} size={70}/>
            </View>
            <View>
              <StyledText fontSize="xl" fontWeight="light" color="blue">¡Envio exitoso!</StyledText>
            </View>
            <View style={{width: width * 0.70}}>
              {/* <StyledText fontSize="xxl" fontWeight="light" color="gray">{amount}</StyledText> */}
              <View
                style={{
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  backgroundColor: theme.colors.white,
                  borderRadius: 10,
                  elevation: 3,
                  flexDirection: 'row', 
                  height: 50, width: "100%",
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}
              >
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
                  {coin.icon}
                  <View>
                    <StyledText fontSize="base" fontWeight="light" color="blue">{coin.coin}</StyledText>
                    <StyledText fontSize="xs" fontWeight="light" color="blue">{coin.coinName}</StyledText>
                  </View>
                </View>
                <View>
                  <StyledText fontSize="medium" fontWeight="bold" color="gray">$ {amount}</StyledText>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', paddingHorizontal: 10, marginBottom: 10}}>
              <StyledText fontWeight="bold" fontSize="lg" color="blue">Datos del Destinatario:</StyledText>
              <View style={{width: "100%", gap: 10, marginTop: 15}}>
                <View style={{gap: 0}}>
                  <StyledText color="gray" fontWeight="bold">Correo OrbitPay:</StyledText>
                  <StyledText color="blue" fontSize="medium" fontWeight="light">{email}</StyledText>
                </View>
                <View style={{gap: 0}}>
                  <StyledText color="gray" fontWeight="bold">Descripcion:</StyledText>
                  <StyledText color="blue" fontSize="medium" fontWeight="light">{description}</StyledText>
                </View>
              </View>
              <View style={{width: width * 0.70, marginTop: 15}}>
                <TouchableOpacity 
                  style={{backgroundColor: theme.colors.blue, alignItems: 'center', paddingHorizontal: 5, paddingVertical:10, borderRadius: 100}}
                  onPress={() => navigation.navigate("Dashboard")}
                >
                  <StyledText color="white" fontSize="medium" fontWeight="bold">Volver al inicio</StyledText>
                </TouchableOpacity>
              </View>
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
    padding: 5,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.135, // Centra verticalmente en el 25% de la pantalla
    height: height * 0.68
  },
  goBack: {
    justifyContent: 'flex-start',
    backgroundColor: '#00000000',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.10, // Centra verticalmente en el 25% de la pantalla
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
  content: {
    fontSize: theme.fontSize.medium,
    fontSize: 16,
  },
});

export default TransactionComplete;
