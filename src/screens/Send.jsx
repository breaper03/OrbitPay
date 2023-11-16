import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@rneui/base';
import StyledText from '../components/StyledText';
import theme from '../theme';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Send = () => {

  const navigation = useNavigation()

  const [viewQR, setViewQR] = useState(false);
  
  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
  };

  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>

        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>

        <TouchableOpacity onPress={() => navigation.navigate("Orbit")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Orbit</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <StyledText style={styles.title}>Orbit Pay</StyledText>
          <View style={{flex: 1, flexDirection: 'column', gap: 10, padding: 5, alignItems: 'center', justifyContent: 'space-between'}}>
            
            <View style={{marginVertical: 10}}>
              <StyledText fontSize="medium" fontWeight="bold" color="black">Recibir Orbit</StyledText>
            </View>
            
            <View style={{flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => setViewQR(!viewQR)}>
                {
                  !viewQR 
                    ? <Image source={require("../../assets/orbitLG.png")}/>
                    : <Image source={require("../../assets/qr.png")}/>
                }
              </TouchableOpacity>
              <StyledText fontSize="normal" fontWeight="base" color="gray">Pulse para ver el QR</StyledText>
            </View>
            
            <View>
              <TouchableOpacity onPress={() => copyToClipboard("breaper2021@gmail.com")} style={styles.clipboardButtom}>
                <StyledText fontSize="medium" fontWeight="bold" color="black">breaper2021@gmail.com</StyledText>
                <Icon name='clipboard-text-outline' type='material-community' color={theme.colors.blue} size={20}/>
              </TouchableOpacity>
            </View>
            
            <View>
              <TouchableOpacity style={styles.sendButton}>
                <StyledText fontSize="medium" fontWeight="bold" color="white">Enviar Orbit</StyledText>
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
    gap: 8,
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#ccc",
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

export default Send;
