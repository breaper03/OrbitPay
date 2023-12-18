import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, TextInput, Modal, Image } from 'react-native'
import { Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyledText } from '../components';
import theme from '../theme';
import { getExchangeRates, getTransactionFees, sendMoney, swapMoney } from '../api/transactions/transactions';
import * as SecureStore from "expo-secure-store"
import Loader from '../components/Loader';

const {width, height} = Dimensions.get("window");

const Resume = () => {

  useEffect(() => {
    handleErros()
    handleFee()
  }, [formData])
  
  const [finishMessage, setFinishMessage] = useState({
    code: "",
    message: ""
  })

  const [loading, setLoading] = useState(false)

  const descriptionRef = useRef()

  const [inputError, setInputError] = useState({
    email: {error: false, submitTry: false},
    description: {error: false, submitTry: false},
  })

  const [modalVisible, setModalVisible] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    description: ""
  });

  const [cryptoAmount, setCryptoAmount] = useState({
    cryptoFee: 0,
    cryptoTotal: 0
  })

  const [fee, setFee] = useState()

  const {amount, coin, dual, lastScreen} = useRoute().params

  const navigation = useNavigation();
  
  const handleInputChange = (inputName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  const handleErros = (submitTry) => {
    errorsOnDirection = !formData.email || formData.email.trim().length <= 0 || formData.email.trim().length < 20
    errorsOnDescription = !formData.description || formData.description.trim().length <= 0
    
    submitTry
      ? setInputError({
        email: {error: errorsOnDirection, submitTry: true},
        description: {error: errorsOnDescription, submitTry: true}
      })
      : setInputError({
        email: {error: errorsOnDirection, submitTry: false},
        description: {error: errorsOnDescription, submitTry: false}
      })
  }

  const checkErrors = () => Object.values(inputError).some((value) => value.error === true);

  const handleOpenModal = () => {
    if (!dual) {
      submitTry = true
      handleErros(submitTry)
      const errors = checkErrors()
      if (!errors) setModalVisible(true)
    } else {
      setModalVisible(true)
    }
  }

  const getCryptoAmount = async (total, fee) => {
    setLoading(true)
    const token = await SecureStore.getItemAsync("token")
    const getCryptoAmount = await getExchangeRates("USD", coin.currency_symbol, token)
    console.log(total, fee)
    // convertir el monto en usd a la criptomoneda seleccionadad por el usuario
    const cryptoTotal = (+total / getCryptoAmount.response[`USD${coin.currency_symbol}`].amountUnformatted).toFixed(8)
    const cryptoFee = (+fee / getCryptoAmount.response[`USD${coin.currency_symbol}`].amountUnformatted).toFixed(8)
    setCryptoAmount({cryptoTotal, cryptoFee})
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (finishMessage.code === "") {
      setLoading(true)
      const token = await SecureStore.getItemAsync("token")
      if (dual) {
        console.log("swap")
        return await swapMoney(coin.currency_symbol, dual.currency_symbol, cryptoAmount, token)
          .then((data) => {
            console.log("dataResume", data)
            setFinishMessage({code: data.code, message: data.message})
            setLoading(false)
            navigation.navigate("TransactionComplete", {email: formData.email, description: formData.description, amount: amount, coin: coin, isError: {code: data.code, message: data.message}})
            return data
          })
      } else {
        return await sendMoney(coin.currency_symbol, cryptoAmount.cryptoTotal, formData.email, formData.description, token)
          .then((data) => {
            setFinishMessage({code: data.code, message: data.message})
            setLoading(false)
            navigation.navigate("TransactionComplete", {email: formData.email, description: formData.description, amount: amount, coin: coin, isError: {code: data.code, message: data.message}})
            return data
          })
      }
    } else {
      navigation.navigate("Dashboard")
    }
  }

  const getExchange = () => {
    const exhange = parseFloat(amount.replace(",", ".")) / coin.exchange_rate
    return parseFloat(exhange.toFixed(8));
  }

  const transformedArray = (number) => {
    // Eliminar signo '-' y reemplazar ',' por '.'
    const formattedNumber = number.replace('-', '').replace(',', '.');
  
    // Redondear a 7 decimales
    const roundedNumber = Number(formattedNumber).toFixed(8);
  
    return roundedNumber.replace("-", "");
  }

  const fixTotalInDolar = (numero) => {
    // Convierte el número a un string con dos decimale
    const numeroFormateado = Number(numero).toFixed(2);
  
    // Asegura que el número nunca sea negativo
    const plusNumber = numeroFormateado < 0 ? "0.00" : numeroFormateado;  
    return plusNumber;
  };

  const handleFee = async () => {
    // currency from sera el selected one en caso de que sea una operacion swap
    setLoading(true)
    const token = await SecureStore.getItemAsync("token");
    await getTransactionFees(amount, coin.currency_symbol, token)
      .then((data) => {
        setFee(data.response)
        getCryptoAmount(+amount + +data.response, data.response)
      })
    setLoading(false)
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>

        <TouchableOpacity onPress={() => navigation.navigate(lastScreen, {coin: coin, amount: amount})} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Volver</StyledText>
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
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, gap: 1}}>

                  {
                    loading
                      ? (
                        <View style={{alignSelf: 'center', marginTop: height * 0.05}}>
                          <Loader loading={loading} size="large" color={theme.colors.blue}/>
                        </View>
                      ) : (
                        <StyledText style={{textAlign: "center", fontWeight: "bold", fontSize: theme.fontSize.medium, color: "gray", marginTop: 30}}>
                          Esta seguro de que desea procesar la operacion
                        </StyledText>
                      )
                  }
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 20}}>
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
            {
              dual
                ? (
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
                      <View>
                        <Image source={{uri: `${coin.currency_icon_path}`}} width={20} height={20}/>
                      </View>
                      <View>
                        <StyledText fontSize="base" fontWeight="light" color="blue">{coin.currency_name}</StyledText>
                        <StyledText fontSize="xs" fontWeight="light" color="blue">{coin.currency_symbol}</StyledText>
                      </View>
                    </View>
                    <Icon type='ant-design' name='swap' color={theme.colors.blue} size={20}/>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
                      <View>
                        <Image source={{uri: `${dual.currency_icon_path}`}} width={20} height={20}/>
                      </View>
                      <View>
                        <StyledText fontSize="base" fontWeight="light" color="blue">{dual.currency_name}</StyledText>
                        <StyledText fontSize="xs" fontWeight="light" color="blue">{dual.currency_symbol}</StyledText>
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <StyledText fontSize="normal" fontWeight="base" color="blue">{getExchange()}</StyledText>
                      <StyledText fontSize="medium" fontWeight="bold" color="blue">$ {amount}</StyledText>
                    </View>
                  </View>
                ) 
                : (
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
                      <View>
                        <Image source={{uri: `${coin.currency_icon_path}`}} width={20} height={20}/>
                      </View>
                      <View>
                        <StyledText fontSize="base" fontWeight="light" color="blue">{coin.currency_name}</StyledText>
                        <StyledText fontSize="xs" fontWeight="light" color="blue">{coin.currency_symbol}</StyledText>
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <StyledText fontSize="normal" fontWeight="bold" color="blue">{getExchange()}</StyledText>
                      <StyledText fontSize="medium" fontWeight="bold" color="gray">$ {amount}</StyledText>
                    </View>
                  </View>
                )
            }
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
              <StyledText fontWeight="bold" fontSize="medium" color="black">Comision por servicio</StyledText>
              <View style={{alignItems: 'flex-end'}}>
                <StyledText fontWeight="bold" fontSize="normal" color="blue">{
                  !cryptoAmount.cryptoFee > 0.00000001
                    ? <Loader size="small" color={theme.colors.blue}/>
                    : cryptoAmount.cryptoFee
                }</StyledText>
                <StyledText fontWeight="bold" fontSize="normal" color="gray">{
                  !fee
                    ? <Loader size="small" color={theme.colors.blue}/>
                    : fee.toFixed(2)
                }</StyledText>
              </View>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', gap: 50, marginTop: 15}}>
              <StyledText fontWeight="bold" fontSize="medium" color="blue">Monto total</StyledText>
              <View style={{alignItems: 'flex-end'}}>
                <StyledText fontWeight="bold" fontSize="normal" color="blue">{
                  !cryptoAmount.cryptoTotal > 0.00000001
                    ? <Loader size="small" color={theme.colors.blue}/>
                    : cryptoAmount.cryptoTotal
                }</StyledText>
                <StyledText fontWeight="bold" fontSize="normal" color="gray">{
                  !fee
                    ? <Loader size="small" color={theme.colors.blue}/>
                    : (parseFloat(amount) + fee).toFixed(2)
                }</StyledText>
              </View>
            </View>
          </View>
          {
            dual
              ? (
                <View style={{marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() => handleOpenModal()}
                    style={{backgroundColor: theme.colors.blurBlue, marginTop: 10, paddingVertical: 10, alignItems: 'center', borderRadius: 20}}
                  >
                    <StyledText color="white" fontSize="medium" fontWeight="bold">Enviar</StyledText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={{alignItems: 'center', marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
                    <StyledText fontWeight="bold" fontSize="lg" color="blue">Datos del Destinatario:</StyledText>
                    <View style={{width: "100%", gap: 10, marginTop: 10}}>
                      <View>
                        <StyledText>
                          Direccion de destino * {
                            inputError.email.submitTry 
                              ? <StyledText color="red" fontSize="sm" fontWeight="extralight">(Direccion invalida)</StyledText>
                              : ""
                          }
                        </StyledText>
                        <TextInput placeholder='pruebas.criptoven@gmail.com' onSubmitEditing={() => descriptionRef.current.focus()} style={styles.input} onChangeText={(text) => handleInputChange("email", text)}/>
                      </View>
                      <View>
                        <StyledText>
                          Descripcion * {
                            inputError.description.submitTry ? <StyledText color="red" fontSize="sm" fontWeight="extralight">(Descripcion invalida)</StyledText> : ""
                          }
                        </StyledText>
                        <TextInput ref={descriptionRef} placeholder='Prestamo' style={styles.input} onChangeText={(text) => handleInputChange("description", text)}/>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleOpenModal()}
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: `${loading ? theme.colors.blurBlue : theme.colors.blue}`, marginTop: 10, paddingVertical: 10, alignItems: 'center', borderRadius: 20}}
                  >
                    {
                      loading
                        ? <Loader loading={true} color={theme.colors.white}/>
                        : <StyledText color="white" fontSize="medium" fontWeight="bold">Enviar Orbit</StyledText>   
                    }
                  </TouchableOpacity>
                </View>
              )
          }
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
    paddingVertical: 15,
    paddingHorizontal: 16,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.135, // Centra verticalmente en el 25% de la pantalla
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 5
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
    gap: 10,
    flexDirection: 'column',
    height: height * 0.20,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});
