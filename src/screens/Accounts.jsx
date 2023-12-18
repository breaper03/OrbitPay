import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { TextInput } from 'react-native-paper';
import { Icon } from '@rneui/base';
import { CustomModal, StyledText } from '../components';
import theme from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createBankAccount, deleteBankAccount, getBankAccounts, getBanks } from '../api/bank/bank';
import * as SecureStore from "expo-secure-store";
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('window');

const Accounts = () => {
  
  useEffect(() => {
    handleGetBankAccount()
  }, [banks, BankAccounts])
  

  const [BankAccounts, setBankAccounts] = useState({})
  const [firstLoader, setFirstLoader] = useState(false)
  const [banks, setBanks] = useState()
  const [currentBankId, setCurrentBankId] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [banksmodalVisible, setBanksModalVisible] = useState(false)
  const [currencymodalVisible, setCurrencyModalVisible] = useState(false)
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitTry, setSubmitTry] = useState(false)
  const [errors, setErrors] = useState()
  const [formValue, setFormValue] = useState({
    alias: undefined, // nombre para el banco
    currency: undefined, // solo ["VES", "USD", "EUR"]
    bankCodeNumber: undefined, // numero de cuenta 
    bancCodePhoneCountry: undefined, // codigo de telefono afiliado a su banco
    phoneNumber: undefined, // numero de telefono afiliado al banco
    bancAccountType: undefined, // tipo de cuenta
    bank: undefined // nombre del banco (endpoin) => getbanks from general
  });

  const [titles, setTitles] = useState({
    alias: "Alias", // nombre para el banco
    currency: "Moneda", // solo ["VES", "USD", "EUR"]
    bankCodeNumber: "Numero de cuenta", // codigo de telefono afiliado a su banco
    bancCodePhoneCountry: "Codigo Telefonico", // codigo de telefono afiliado a su banco
    phoneNumber: "Telefono", // numero de telefono afiliado al banco
    bancAccountType: "Tipo de cuenta", // tipo de cuenta
    bank: "Banco" // nombre del banco (endpoin) => getbanks from general
  })

  const handleFormChange = (name, text) => {
    setSubmitTry(false)
    console.log({[name] : text})
    if (name === "bancCodePhoneCountry" || name === "phoneNumber") {
      const obj = {[name]: +text}
      setFormValue({...formValue, ...obj})
    } else {
      const obj = {[name]: text}
      setFormValue({...formValue, ...obj})
    }
  }

  const handleGetBankAccount = async () => {
    setFirstLoader(true)
    const token = await SecureStore.getItemAsync("token")
    const userId = await SecureStore.getItemAsync("userId")

    userId && token.length > 4 !== undefined && await getBankAccounts(userId, token)
      .then((data) => {
        data.code === 200 && setBankAccounts(data.response)
        setFirstLoader(false)
      })
    token.length > 4 && await getBanks(token)
      .then((data) => {
        setBanks(data.response)
        setFirstLoader(false)
      });
  }

  const handleDeleteBankAccount = async () => {
    setLoading(true)
    const token = await SecureStore.getItemAsync("token")
    await deleteBankAccount(currentBankId, token).then(async (data) => data.code === 200 && await handleGetBankAccount())
    setLoading(false)
  }

  const handleOpenConfirmModal = (id) => {
    setCurrentBankId(id)
    setConfirmModalVisible(true)
  }

  const checkFormValueErros = () => {
    let error = []
    Object.keys(formValue).forEach((element) => {
      if (element === "bankCodeNumber") {
        formValue[element] === undefined || formValue[element].toString().length < 20 ? error.push(true) : error.push(false)
      } else if (element === "phoneNumber") {
        formValue[element] === undefined || formValue[element].toString().length < 10 ? error.push(true) : error.push(false)
      } else if (element === "bancCodePhoneCountry") {
        formValue[element] === undefined || formValue[element].toString().length < 2 ? error.push(true) : error.push(false)
      }
        formValue[element] === undefined ? error.push(true) : error.push(false)
    })

    console.log("errorserrors", error)

    error.some(item => item === true)
      ? setErrors(true)
      : setErrors(false)
  }

  const handleCreateBankAccount = async () => {
    setLoading(true)
    checkFormValueErros()
    const userId = await SecureStore.getItemAsync("userId")
    const token = await SecureStore.getItemAsync("token")
    console.log(errors)
    if (!errors) {
      await createBankAccount(userId, formValue, token)
        .then(async (data) => {
          if (data.code === 200) {
            setModalVisible(false)
            await handleGetBankAccount()
          } else {
            setLoading(false)
            setSubmitTry(true)
          }
          setLoading(false)
        });
        setLoading(false)
      } else {
        setLoading(false)
        setSubmitTry(true)
      }
  }

  const handleSelectCurrency = (currency) => {
    setFormValue({...formValue, currency: currency})
    setTitles({...titles, currency: currency})
    console.log("formValue", formValue)
    setCurrencyModalVisible(false)
  }
  
  const handleSelectAccountType = (accountType) => {
    const val = accountType === "Corriente" ? 2 : 1
    setFormValue({...formValue, bancAccountType: val})
    setTitles({...titles, bancAccountType: accountType})
    console.log("formValue", formValue)
    setAccountTypeModalVisible(false)
  }

  const handleSelectBank = (item) => {
    setFormValue({...formValue, bank: item.id})
    setTitles({...titles, bank: item.name})
    console.log("formValue", formValue)
    setBanksModalVisible(false)
  }

  const renderItem = ({item}) => (
    <TouchableOpacity 
      style={{flexDirection: 'column', flexWrap: 'nowrap', backgroundColor: theme.colors.lightgray, borderRadius: 10, elevation: 3, alignItems: 'center', justifyContent: 'center', height: 40, paddingHorizontal: 5, marginBottom: 8}}
      onPress={() => handleSelectBank(item)}
    >
      <StyledText color="blue" fontSize="base" fontWeight="bold">{item.name}</StyledText>
      <View style={{flexDirection: 'row', gap: 8}}>
        <StyledText color="blue" fontSize="base" fontWeight="bold">{item.code}</StyledText>
        <StyledText color="blue" fontSize="base" fontWeight="bold">{item.currencies.map((el) => `${el.symbol} `)}</StyledText>
      </View>
    </TouchableOpacity>
  )
  

  const navigation = useNavigation()
  
  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: height * 0.15}]}>
            <View>
              <StyledText fontSize={"medium"} fontWeight={"bold"} color={"blue"}>¿Esta seguro de eliminar la cuenta?</StyledText>
            </View>
            <View style={{flexDirection: 'row', gap: 15}}>
              <TouchableOpacity 
                onPress={() => {
                  setConfirmModalVisible(false)
                  handleDeleteBankAccount()
                }}
                style={{width: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.blue, borderRadius: 100, paddingVertical: 8}}>
                <StyledText color={"white"} fontWeight={"bold"}>Aceptar</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(false)} 
                style={{width: 100, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: theme.colors.gray, borderRadius: 100, paddingVertical: 8}}>
                <StyledText color={"blue"} fontWeight={"bold"}>Cancelar</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: `${submitTry ? height * 0.65 : height * 0.6}`}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  setSubmitTry(false)
                  setModalVisible(false)
                }} 
                style={{backgroundColor: `${loading ? theme.colors.blurBlue : theme.colors.blue}`, width: 35, height: 35, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
              >
                <Icon type='material-icons' name='chevron-left' color={theme.colors.white} size={35}/>
              </TouchableOpacity>
              <View style={{marginRight: width * 0.07}}>
                <StyledText color="blue" fontSize="lg" fontWeight="bold">Añadir cuenta bancaria</StyledText>
              </View>
            </View>
            <View style={{width: "100%", flexDirection: 'row', gap: 5}}>
              <View style={{width: "64%"}}>
                <TextInput
                  placeholder="Alias"
                  value={formValue.alias}
                  mode='outlined'
                  onChangeText={(text) => handleFormChange("alias", text)}
                  // error={formValue.direccion.address2.error === true}
                  outlineColor={theme.colors.blue}
                  activeOutlineColor={theme.colors.blue}
                />
              </View>
              <TouchableOpacity 
                onPress={() => setCurrencyModalVisible(true)}
                style={{borderColor: theme.colors.blue, borderWidth: 1, width: "35%", height: height * 0.0765, alignItems: 'flex-start', justifyContent: 'center', borderRadius: 5, paddingHorizontal: 14}}
              >
                <StyledText color={titles.currency === "Moneda" ? "gray" : "blue"} fontSize="medium" fontWeight="normal">{titles.currency}</StyledText>
              </TouchableOpacity>
            </View>
            <View style={{width: "100%", flexDirection: 'row', gap: 5}}>
              <TouchableOpacity 
                onPress={() => setBanksModalVisible(true)}
                style={{borderColor: theme.colors.blue, borderWidth: 1, width: "67%", height: height * 0.0765, alignItems: 'flex-start', justifyContent: 'center', borderRadius: 5, paddingHorizontal: 14}}
              >
                <StyledText color={titles.bank === "Banco" ? "gray" : "blue"} fontSize={titles.bank === "Banco" ? "medium" : "base"} fontWeight="normal">{titles.bank}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAccountTypeModalVisible(true)}
                style={{borderColor: theme.colors.blue, borderWidth: 1, width: "31%", height: height * 0.0765, alignItems: 'flex-start', justifyContent: 'center', borderRadius: 5, paddingHorizontal: 14}}
              >
                <StyledText color={titles.bancAccountType === "Tipo de cuenta" ? "gray" : "blue"} fontSize="medium" fontWeight="normal">{titles.bancAccountType}</StyledText>
              </TouchableOpacity>

            </View>
            <View style={{width: "100%"}}>
              <TextInput
                placeholder="Numero de cuenta"
                value={formValue.bankCodeNumber}
                mode='outlined'
                maxLength={20}
                keyboardType='number-pad'
                minL
                onChangeText={(text) => handleFormChange("bankCodeNumber", +text)}
                // error={formValue.direccion.address2.error === true}
                outlineColor={theme.colors.blue}
                activeOutlineColor={theme.colors.blue}
              />
            </View>
            <View style={{width: "100%", flexDirection: 'row', gap: 5}}>
              <View style={{width: "49%"}}>
                <TextInput
                  placeholder="Codigo de telefono"
                  value={formValue.bancCodePhoneCountry}
                  mode='outlined'
                  keyboardType='number-pad'
                  maxLength={3}
                  onChangeText={(text) => handleFormChange("bancCodePhoneCountry", text)}
                  // error={formValue.direccion.address2.error === true}
                  outlineColor={theme.colors.blue}
                  activeOutlineColor={theme.colors.blue}
                />
              </View>
              <View style={{width: "49%"}}>
                <TextInput
                  placeholder="Telefono"
                  value={formValue.phoneNumber}
                  mode='outlined'
                  maxLength={formValue.bancCodePhoneCountry === "58" ? 11 : 15}
                  keyboardType='number-pad'
                  onChangeText={(text) => handleFormChange("phoneNumber", +text)}
                  // error={formValue.direccion.address2.error === true}
                  outlineColor={theme.colors.blue}
                  activeOutlineColor={theme.colors.blue}
                />
              </View>
            </View>
            {
              submitTry && (
                <StyledText color={"red"}>
                  Verifique el formulario
                </StyledText>
              )
            }
            <TouchableOpacity
              disabled={loading}
              onPress={() => handleCreateBankAccount()}
              style={{backgroundColor: `${loading ? theme.colors.blurBlue : theme.colors.blue}`, alignItems: 'center', justifyContent: 'center', borderRadius: 100, width: "100%", height: 40}}
            >
              { 
                loading
                ? <Loader loading={loading} color={"white"}/>
                : <StyledText color={"white"} fontSize={"medium"} fontWeight={"bold"}>Aceptar</StyledText>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={currencymodalVisible}
        onRequestClose={() => setCurrencyModalVisible(false)}
      > 
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: height * 0.36}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
              <TouchableOpacity 
                onPress={() => setCurrencyModalVisible(false)} 
                style={{backgroundColor: theme.colors.blue, width: 35, height: 35, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
              >
                <Icon type='material-icons' name='chevron-left' color={theme.colors.white} size={35}/>
              </TouchableOpacity>
              <View style={{marginRight: width * 0.03}}>
                <StyledText color="blue" fontSize="medium" fontWeight="bold">Seleccione la moneda de su banco:</StyledText>
              </View>
            </View>
            <View style={{height: '80%', width: "90%", alignItems: 'center', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => handleSelectCurrency("VES")}
                style={{backgroundColor: theme.colors.lightgray, alignItems: 'center', width: "90%", paddingVertical: 10, borderRadius: 10, elevation: 3}}
              >
                <StyledText color={"blue"} fontSize={"medium"} fontWeight={"bold"}>Bolivares (VES)</StyledText>
              </TouchableOpacity>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <StyledText color={"blue"} fontSize={"base"} fontWeight={"bold"}>Solo se aceptan cuentas en Bolivares (VES)</StyledText>
              </View>
              {/* <TouchableOpacity
                disabled={true}
                onPress={() => handleSelectCurrency("USD")}
                style={{backgroundColor: theme.colors.lightgray, alignItems: 'center', width: "90%", paddingVertical: 10, borderRadius: 10, elevation: 3}}
              >
                <StyledText color={"blue"} fontSize={"medium"} fontWeight={"bold"}>Dolares (USD)</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelectCurrency("EUR")}
                style={{backgroundColor: theme.colors.lightgray, alignItems: 'center', width: "90%", paddingVertical: 10, borderRadius: 10, elevation: 3}}
              >
                <StyledText color={"blue"} fontSize={"medium"} fontWeight={"bold"}>Euros (EUR)</StyledText>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={accountTypeModalVisible}
        onRequestClose={() => setAccountTypeModalVisible(false)}
      > 
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: height * 0.35}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
              <TouchableOpacity 
                onPress={() => setAccountTypeModalVisible(false)} 
                style={{backgroundColor: theme.colors.blue, width: 35, height: 35, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
              >
                <Icon type='material-icons' name='chevron-left' color={theme.colors.white} size={35}/>
              </TouchableOpacity>
              <View style={{marginRight: width * 0.1}}>
                <StyledText color="blue" fontSize="medium" fontWeight="bold">Seleccione el tipo de cuenta:</StyledText>
              </View>
            </View>
            <View style={{height: '80%', width: "90%", alignItems: 'center', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => handleSelectAccountType("Corriente")}
                style={{backgroundColor: theme.colors.lightgray, alignItems: 'center', width: "90%", paddingVertical: 10, borderRadius: 10, elevation: 3}}
              >
                <StyledText color={"blue"} fontSize={"medium"} fontWeight={"bold"}>Corriente</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelectAccountType("Ahorro")}
                style={{backgroundColor: theme.colors.lightgray, alignItems: 'center', width: "90%", paddingVertical: 10, borderRadius: 10, elevation: 3}}
              >
                <StyledText color={"blue"} fontSize={"medium"} fontWeight={"bold"}>Ahorro</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={banksmodalVisible}
        onRequestClose={() => setBanksModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: height * 0.6}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
              <TouchableOpacity 
                onPress={() => setBanksModalVisible(false)} 
                style={{backgroundColor: theme.colors.blue, width: 35, height: 35, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
              >
                <Icon type='material-icons' name='chevron-left' color={theme.colors.white} size={35}/>
              </TouchableOpacity>
              <View style={{marginRight: width * 0.08}}>
                <StyledText color="blue" fontSize="lg" fontWeight="bold">Seleccione un banco:</StyledText>
              </View>
            </View>
            <View style={{width: "100%"}}>
              {
                loading
                  ? (
                    <View style={{marginTop: 120}}>
                      <Loader loading={loading} size={"large"} color={theme.colors.blue}/>
                    </View>
                  )
                  : (
                    <View style={{height: height * 0.47}}>
                      <FlatList
                        style={{height: height * 0.05}}
                        data={banks}
                        renderItem={renderItem}
                      />
                    </View>
                  )
              }
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>

        <View style={[{ backgroundColor: theme.colors.blue, height: "30%" }]}/>

        <TouchableOpacity onPress={() => navigation.navigate("UserDashboard")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Atras</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <StyledText style={styles.title}>Cuentas bancarias</StyledText>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              style={{backgroundColor: theme.colors.blue, width: 45, height: 45, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
            >
              <Icon type='material-community' name='bank-plus' color={theme.colors.white} style={{marginLeft: 1}}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, flexDirection: 'column', gap: 10, padding: 5, alignItems: 'center', justifyContent: 'space-between'}}>
            {
              firstLoader
                ? (
                  <View style={{marginTop: 60}}>
                    <Loader loading={firstLoader} size={"large"} color={theme.colors.blue}/>
                  </View>
                ) : BankAccounts
                  ? (
                    <View>
                      {
                        BankAccounts.length > 0
                          ? (
                            BankAccounts.map((item) => (
                              <View key={item.id} style={{flexDirection: 'row', backgroundColor: theme.colors.lightgray, marginTop: 12, borderRadius: 10, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'space-around'}}>
                                <View style={{width: "50%", height: 65, alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginLeft: 12}}>
                                  <StyledText color={"blue"} fontWeight={"base"}>{item.banc_alias_name}</StyledText>
                                  <StyledText color={"blue"} fontSize={"base"} fontWeight={"bold"}>{item.bank.name}</StyledText>
                                </View>
                                <View style={{width: "25%", height: 65, alignItems: 'center', justifyContent: 'center'}}>
                                  <StyledText color={"blue"} fontSize={"base"} fontWeight={"base"}>{item.bac_type_account}</StyledText>
                                  <StyledText color={"blue"} fontSize={"base"} fontWeight={"bold"}>{item.currency.symbol}</StyledText>
                                </View>
                                <View style={{width: "25%", height: 65, alignItems: 'center', justifyContent: 'center'}}>
                                  <TouchableOpacity
                                    onPress={() => handleOpenConfirmModal(item.id)} 
                                    style={{backgroundColor: theme.colors.lightRed, padding: 8, borderRadius: 10}}
                                  >
                                    <Icon name='trash' type='feather' size={18} color={theme.colors.blue}/>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))
                          ) : (
                            <View style={{marginVertical: 40}}>
                              <StyledText color="gray" fontSize="lg" fontWeight="bold">No hay cuentas bancarias para mostrar...</StyledText>
                            </View>
                          )
                      }
                    </View>
                  ) : (
                    <View style={{marginVertical: 40}}>
                      <StyledText color="gray" fontSize="lg" fontWeight="bold">No hay cuentas bancarias para mostrar...</StyledText>
                    </View>
                  )
            }
          </View>
          <View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Accounts


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
    fontSize: theme.fontSize.xxl,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    gap: 20,
    flexDirection: 'column',
    width: width * 0.85,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
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