import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@rneui/base';
import StyledText from '../components/StyledText';
import theme from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
const { width, height } = Dimensions.get('window');

const Receive = () => {

  const navigation = useNavigation();

  const { coin } = useRoute().params

  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
  };

  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
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
          <StyledText style={styles.title}>Deposito</StyledText>
          <View style={{flex: 1, flexDirection: 'column', gap: 10, padding: 5, alignItems: 'center', justifyContent: 'space-between'}}>
            
            <View style={{marginVertical: 10}}>
              <StyledText fontSize="medium" fontWeight="bold" color="black">Depositar {coin.currency_symbol}</StyledText>
            </View>
            
            <View style={{flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'space-between'}}>
              <View>
                <QRCode
                  value={coin.account_address}
                  logo={{uri: `${coin.currency_icon_path}`}}
                  logoSize={25}
                  size={175}
                  logoBackgroundColor='transparent'
                  color={theme.colors.black}
                />
              </View>
            </View>
            
            <View>
              <TouchableOpacity onPress={() => copyToClipboard(coin.account_address)} style={styles.clipboardButtom}>
                <View style={{maxWidth: width * 0.65, overflow: 'hidden', height: height * 0.02}}>
                  <StyledText fontSize="base" fontWeight="light" color="blue">
                    {coin.account_address}
                  </StyledText>
                </View>
                <View style={{backgroundColor: theme.colors.blue, height: "100%", width: 40, justifyContent: 'center'}}>
                  <Icon name='content-copy' type='material-community' color={theme.colors.white} size={20}/>
                </View>
              </TouchableOpacity>
            </View>

          </View>
          <View>
          </View>
        </View>
      </View>
    </>
  );
};


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
    padding: 16,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.135, // Centra verticalmente en el 25% de la pantalla
    height: height * 0.65,
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
  content: {
    fontSize: theme.fontSize.medium,
    fontSize: 16,
  },
  clipboardButtom: {
    flexDirection: "row",
    overflow: 'hidden',
    gap: 8,
    marginTop: 20,
    alignItems: "center",
    paddingLeft: 10,
    justifyContent: 'space-between',
    height: height * 0.05,
    width: width * 0.80,
    borderRadius: 8,
    backgroundColor: theme.colors.blurBlue,
  },
  clipboardText: {

  },
  clipboardIcon: {

  },
  sendButton: {
    backgroundColor: theme.colors.blue, 
    width: width * 0.8, 
    height: height * 0.06,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  }
});

export default Receive;
