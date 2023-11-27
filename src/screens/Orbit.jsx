import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import StyledText from '../components/StyledText';
import theme from '../theme';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';

const Orbit = () => {
  const navigation = useNavigation()

  const route = useRoute().name

  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.lightBlue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={{ backgroundColor: theme.colors.lightBlue, height: "30%", alignItems: 'center', justifyContent: 'flex-start'}}/>

        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color={theme.colors.blue} size={55}/>
            <StyledText color="blue" fontSize="xxxl" fontWeight="bold">Home</StyledText>
          </View>
        </TouchableOpacity>

        <View style={{ backgroundColor: theme.colors.lightBlue, height: "70%" }} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={[styles.card, {display: 'flex'}]}>
          <StyledText style={styles.title}>Orbit</StyledText>
          <View style={styles.itemsCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Pay")}
              style={{backgroundColor: theme.colors.lightBlue, paddingBottom: 10, borderRadius:15, flexDirection: 'column', alignItems:'center', elevation: 3}}>
              <View style={styles.buttonCard}>
                <Icon name='arrow-top-right-thick' type='material-community' color={theme.colors.white} size={40}/> 
              </View>
              <StyledText fontSize="base" fontWeight="bold" color="blue">Enviar</StyledText>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate("Receive")}
              style={{backgroundColor: theme.colors.lightBlue, paddingBottom: 10, borderRadius:15, flexDirection: 'column', alignItems:'center', elevation: 3}}>
              <View style={styles.buttonCard}>
                <Icon name='arrow-bottom-left-thick' type='material-community' color={theme.colors.white} size={40}/>
              </View>
              <StyledText fontSize="base" fontWeight="bold" color="blue">Recibir</StyledText>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate("Swap")}
              style={{backgroundColor: theme.colors.lightBlue, paddingBottom: 10, borderRadius:15, flexDirection: 'column', alignItems:'center', elevation: 3}}>
              <View style={styles.buttonCard}>
                <Icon name='sync' type='material-community' color={theme.colors.white} size={40}/>
              </View>
              <StyledText fontSize="base" fontWeight="bold" color="blue">Cambio</StyledText>
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
    padding: 16,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.20, // Centra verticalmente en el 25% de la pantalla
    height: height * 0.35
  },
  itemsCard: {
    flex: 1, 
    flexDirection: 'row', 
    width: "100%", 
    justifyContent: "space-around", 
    alignItems: 'center'
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
  buttonCard: {
    borderRadius: 15,
    shadowColor: "#000",
    backgroundColor: theme.colors.blue,
    color: theme.colors.white,
    padding: 15,
    marginBottom: 5
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

export default Orbit;
