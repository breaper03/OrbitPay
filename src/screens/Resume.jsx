import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, TextInput, Modal, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyledText } from '../components';
import theme from '../theme';

const {width, height} = Dimensions.get("window");

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const Resume = () => {

  const descriptionRef = useRef()

  const [inputError, setInputError] = useState({
    email: false,
    description: false,
  })

  const [modalVisible, setModalVisible] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    description: ""
  });

  const {amount, coin} = useRoute().params

  const navigation = useNavigation();
  
  const handleInputChange = (inputName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  const handleOpenModal = () => {
    if (!emailRegex.test(formData.email)) {
      setInputError({email: true, description: inputError.description});
      !formData.description && setInputError({description: true, email: inputError.email});
    } else setModalVisible(true)
  }

  const handleSubmit = (e) => {
    navigation.navigate("TransactionComplete", {email: formData.email, description: formData.description, amount: amount, coin: coin})
  }

  return (
    <>
      <StatusBar style="inverted" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>

        <TouchableOpacity onPress={() => navigation.navigate("Pay")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Orbit Pay</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', gap: 1}}>
                  <StyledText style={{textAlign: "center", fontWeight: "bold", fontSize: theme.fontSize.medium, color: "gray", marginTop: 20}}>
                    Esta seguro de que desea procesar la operacion</StyledText>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 50}}>
                    <TouchableOpacity onPress={handleSubmit} 
                      style={{
                        backgroundColor: theme.colors.blue,
                        elevation: 3,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 120
                      }}
                    >
                      <StyledText fontSize="medium" fontWeight="bold" color="white">Aceptar</StyledText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)} 
                      style={{
                        backgroundColor: theme.colors.white,
                        elevation: 3,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 120
                      }}
                    >
                      <StyledText fontSize="medium" fontWeight="bold" color="blue">Cancelar</StyledText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <View style={{alignItems: 'center', marginBottom: 5}}>
            <StyledText fontWeight="bold" fontSize="lg" color="blue">Resumen</StyledText>
          </View>
          <View style={{gap: 5, paddingHorizontal: 4}}>
            <StyledText fontWeight="bold" fontSize="medium" color="black">Monto a enviar</StyledText>
            <View
              style={{
                marginBottom: 10,
                backgroundColor: theme.colors.white,
                borderRadius: 10,
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
                <StyledText fontSize="medium" fontWeight="bold" color="gray">{coin.balance}</StyledText>
              </View>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
              <StyledText fontWeight="bold" fontSize="medium" color="black">Comision por servicio</StyledText>
              <StyledText fontWeight="bold" fontSize="medium" color="gray">0,52</StyledText>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', gap: 50, marginTop: 15}}>
              <StyledText fontWeight="bold" fontSize="medium" color="blue">Monto total</StyledText>
              <StyledText fontWeight="bold" fontSize="medium" color="gray">{parseFloat(amount) + 0.52}</StyledText>
            </View>
          </View>
          <View>
            <View style={{alignItems: 'center', marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
              <StyledText fontWeight="bold" fontSize="lg" color="blue">Datos del Destinatario:</StyledText>
              <View style={{width: "100%", gap: 10, marginTop: 10}}>
                <View>
                  <StyledText>
                    Correo OrbitPay* {inputError.email ? <StyledText color="red" fontSize="sm" fontWeight="extralight">(Correo o Usuario invalido)</StyledText> : ""}
                  </StyledText>
                  <TextInput placeholder='pruebas.criptoven@gmail.com' onSubmitEditing={() => descriptionRef.current.focus()} style={styles.input} onChangeText={(text) => handleInputChange("email", text)}/>
                </View>
                <View>
                  <StyledText>
                    Descripcion* {
                      inputError.description ? <StyledText color="red" fontSize="sm" fontWeight="extralight">(Descripcion invalida)</StyledText> : ""
                    }
                  </StyledText>
                  <TextInput ref={descriptionRef} placeholder='Prestamo' style={styles.input} onChangeText={(text) => handleInputChange("description", text)}/>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => handleOpenModal()}
              style={{backgroundColor: theme.colors.blue, marginTop: 10, paddingVertical: 10, alignItems: 'center', borderRadius: 20}}
            >
              <StyledText color="white" fontSize="medium" fontWeight="bold">Enviar Orbit</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

export default Resume

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
    height: height * 0.63,
  },
  itemsCard: {
    flex: 1, 
    flexDirection: 'row', 
    width: "100%", 
    justifyContent: "space-around", 
    alignItems: 'center'
  },
  buttonCard: {
    borderRadius: 15,
    shadowColor: "#000",
    backgroundColor: theme.colors.blue,
    color: theme.colors.white,
    padding: 15,
    marginBottom: 5
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
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    backgroundColor: theme.colors.white,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.blue,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    gap:10,
    flexDirection: 'column',
    height: height * 0.18,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
