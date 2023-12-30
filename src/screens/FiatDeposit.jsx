import { Dimensions, StyleSheet, TouchableOpacity, View, Modal, FlatList } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { StyledText, Dropdown } from '../components'
import { TextInput, HelperText } from 'react-native-paper'
import theme from '../theme'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from "@rneui/themed"
import { useEffect, useState } from 'react';
import DatePickerModal from '../components/DatePickerModal';
import dayjs from 'dayjs'
import { getUserAccount } from '../api/users/Users'
import * as SecureStore from "expo-secure-store"
import { getBankAccounts, getCompanyBankAccounts } from '../api/bank/bank'
import { useUser } from "../context/UserContext"
import * as ImagePicker from "expo-image-picker"
import Loader from '../components/Loader'
import { depositFiat } from '../api/transactions/transactions'

const FiatDeposit = () => {

  const { user } = useUser()

  useEffect(() => {
    const getBanks = async () => {
      setLoading(true)
      const token = await SecureStore.getItemAsync("token")
      await handleGetCompanyBanks(token)
      await handleGetUserBanks()
    }
    getBanks()
    setLoading(false)
  }, [])
  

  const navigation = useNavigation()

  const { coin } = useRoute().params

  const [selected, setSelected] = useState(coin)

  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState({error: false, message: ""})

  const [formValue, setFormValue] = useState({
    currency: selected.currency_symbol,
    // currency: undefined,
    amount: undefined,
    date: dayjs().format("YYYY-MM-DD"),
    userBankAccount: undefined, // -> endpoint getUserbank Accounts
    companyBankAccount: undefined, // -> endpoint getCompanybank Accounts
    numberReference: undefined,
    depositSupportFile: image // Solo archivos PDF,JPEG,PNG,
  })
  
  const [formError, setFormError] = useState({
    currency: false,
    amount: undefined,
    date: false,
    userBankAccount: false, // -> endpoint getUserbank Accounts
    companyBankAccount: false, // -> endpoint getCompanybank Accounts
    numberRefence: false,
    depositSupportFile: false // Solo archivos PDF,JPEG,PNG,
  })

  const [loading, setLoading] = useState(false)

  const [companyBankAccount, setCompanyBankAccount] = useState()
  const [userBankAccount, setUserBankAccount] = useState()

  const [userBankModalVisible, setUserBankModalVisible] = useState(false)
  const [companyBankModalVisible, setCompanyBankModalVisible] = useState(false)

  const handleSelect = (option) => {
    setSelected(option)
  };

  const handleFormChange = (name, text) => {
      const obj = {[name]: text}
      setFormValue({...formValue, ...obj})
      console.log(formValue)
  }

  const handleDateChange = (value) => {
    const formated = {date: dayjs(value).format("YYYY-MM-DD").toString()}
    setFormValue({...formValue, ...formated})
    console.log(":formValue", formValue)
  };

  const handleGetUserBanks = async () => {
    const token = await SecureStore.getItemAsync("token")
    const userId = await SecureStore.getItemAsync("userId")

    userId && token.length > 4 !== undefined && await getBankAccounts(userId, token)
      .then((data) => {
        data.code === 200 && setUserBankAccount(data.response)
      })
  }

  const handleGetCompanyBanks = async (token) => {
    await getCompanyBankAccounts(token)
      .then((data) => {
        data.code === 200 && setCompanyBankAccount(data.response)
      })
  };

  const pickImage = async () => {
    const allow = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (allow) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        base64: true,
        quality: 0,
      });
  
      if (!result.canceled) {
        const allowedExtensions = ["jpeg", "pdf", "png"]
        const extension = result.assets[0].uri.split(".")
        const isValidExtension = allowedExtensions.find((item) => item === extension[extension.length - 1])
        if (isValidExtension) {
          setImage(result.assets[0].uri)
          const obj = {depositSupportFile: result.assets[0].base64}
          console.log(obj)
          setFormValue({...formValue, ...obj})
          setImageError({error: false, message: " "})
        } else {
          setImageError({error: true, message: "El formato de la imagen no esta permitido."})
        }
      }
    }
    
  };

  const submitDeposit = async () => {
    const {currency, userBankAccount, companyBankAccount, date, depositSupportFile, numberReference, amount} = formValue
    const token = await SecureStore.getItemAsync("token")
    const obj = {
      date,
      depositSupportFile,
      numberReference,
      amount,
      currency,
      userBankAccount: userBankAccount.id,
      companyBankAccount: companyBankAccount.id,
    }
    const req = await depositFiat(obj, token).then((data) => data)
    console.log("-----------------------------------------------------------------")
  }

  const renderUserBank = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const obj = {userBankAccount: item}
          setFormValue({...formValue, ...obj})
          setUserBankModalVisible(false)
        }}
        key={item.id} style={{flexDirection: 'row', backgroundColor: theme.colors.white, borderRadius: 10, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'space-around', borderWidth: 2, borderColor: theme.colors.blurBlue, marginBottom: 12}}
      >
        <View style={{width: "50%", height: 65, alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginLeft: 12}}>
          <StyledText color={"blue"} fontWeight={"base"}>{item.banc_alias_name}</StyledText>
          <StyledText color={"blue"} fontSize={"sm"} fontWeight={"bold"}>{item.bank.name}</StyledText>
        </View>
        <View style={{width: "25%", height: 65, alignItems: 'center', justifyContent: 'center'}}>
          <StyledText color={"blue"} fontSize={"base"} fontWeight={"base"}>{item.bac_type_account}</StyledText>
          <StyledText color={"blue"} fontSize={"base"} fontWeight={"bold"}>{item.currency.symbol}</StyledText>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCompanyBank = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const obj = {companyBankAccount: item}
          setFormValue({...formValue, ...obj})
          setCompanyBankModalVisible(false)
        }}
        key={item.id} style={{flexDirection: 'row', backgroundColor: theme.colors.white, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: theme.colors.blurBlue, marginBottom: 12}}
      >
        <View style={{height: 65, alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginLeft: 12, paddingLeft: 1}}>
          <StyledText color={"blue"} fontWeight={"base"}>{item.banc_alias_name}</StyledText>
          <StyledText color={"blue"} fontSize={"sm"} fontWeight={"bold"}>{item.bank.name}</StyledText>
        </View>
        <View style={{height: 65, alignItems: 'center', justifyContent: 'center', paddingRight: 12}}>
          <StyledText color={"blue"} fontSize={"base"} fontWeight={"base"}>{item.identification_number}</StyledText>
          <StyledText color={"blue"} fontSize={"base"} fontWeight={"bold"}>{item.currency.symbol}</StyledText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.blue} hidden={false} translucent={true}/>
      {/* User bank account */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={userBankModalVisible}
        onRequestClose={() => setUserBankModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: `${userBankAccount ? height * 0.2 * userBankAccount.length : height * 0.2}`}]}>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setUserBankModalVisible(false)} style={{backgroundColor: theme.colors.blue, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, elevation: 3}}>
                {/* <StyledText color="white" fontWeight="bold" fontSize="base">Atras</StyledText> */}
                <Icon type='material-icons' name='chevron-left' color="white"/>
              </TouchableOpacity>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">Seleccione un banco:</StyledText>
            </View>
              {
                !userBankAccount
                  ? (
                    <View style={{height: height * 0.1, width: 100, alignItems: 'center', justifyContent: 'center'}}>
                      <Loader loading={true} size={"large"} color={theme.colors.blue}/>
                    </View>
                  )
                  : (
                      <FlatList 
                        style={{height: `${userBankAccount ? height * 0.12 * userBankAccount.length : height * 0.2}`}}
                        data={userBankAccount}
                        key={(item) => item.id}
                        renderItem={renderUserBank}
                      />
                  )
              }
          </View>
        </View>
      </Modal>
      {/* Company bank account */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={companyBankModalVisible}
        onRequestClose={() => setCompanyBankModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: `${companyBankAccount ? height * 0.2 * companyBankAccount.length : height * 0.2}`, maxHeight: height * 0.8}]}>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setCompanyBankModalVisible(false)} style={{backgroundColor: theme.colors.blue, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, elevation: 3}}>
                {/* <StyledText color="white" fontWeight="bold" fontSize="base">Atras</StyledText> */}
                <Icon type='material-icons' name='chevron-left' color="white"/>
              </TouchableOpacity>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">Seleccione un banco:</StyledText>
            </View>
            {
                !companyBankAccount
                  ? (
                    <View style={{height: height * 0.1, width: 100, alignItems: 'center', justifyContent: 'center'}}>
                      <Loader loading={true} size={"large"} color={theme.colors.blue}/>
                    </View>
                  )
                  : (
                      <FlatList 
                        style={{height: `${companyBankAccount ? height * 0.12 * companyBankAccount.length : height * 0.2}`}}
                        data={companyBankAccount}
                        key={(item) => item.id}
                        renderItem={renderCompanyBank}
                      />
                  )
              }
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <View style={[{ backgroundColor: theme.colors.blue, height: height * 0.30 }]} />
        <TouchableOpacity onPress={() => navigation.navigate("DashboardButtom")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color="white" size={55}/>
            <StyledText color="white" fontSize="xxxl" fontWeight="bold">Inicio</StyledText>
          </View>
        </TouchableOpacity>
        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />
        {/* Tarjeta que estará en el centro de la pantalla */}
        <View style={styles.card}>
          <StyledText style={styles.title}>Depositar</StyledText>
          <View style={{flex: 1, flexDirection: 'column', gap: 10, padding: 5, alignItems: 'center', justifyContent: 'space-between'}}>
            <Dropdown onSelect={handleSelect} selected={selected} coinLink={coin} isFiatOnly={true}/>
            <View style={{width: "100%"}}>
              <TextInput
                placeholder={"Numero de referencia"}
                value={formValue.numberRefence}
                mode='outlined'
                keyboardType='number-pad'
                onChangeText={(text) => handleFormChange("numberReference", text)}
                error={formError.numberRefence}
                outlineColor={theme.colors.blue}
                activeOutlineColor={theme.colors.blue}
              />
              <HelperText type={formError.numberRefence ? "error" : "info"}>
                  {
                    !formError.numberRefence
                      ? "El numero de refencia debe tener 11 digitos."
                      : "¡El numero de refencia debe tener 11 digitos!"
                  }
              </HelperText>
            </View>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-between'}} >
              <View style={{width: "49%"}}>
                <TextInput
                  placeholder={`Monto en ${selected.currency_symbol}`}
                  value={formValue.amount}
                  // maxLength={10}
                  mode='outlined'
                  keyboardType='number-pad'
                  onChangeText={(key) => handleFormChange("amount", +key)}
                  error={formError.amount}
                  outlineColor={theme.colors.blue}
                  activeOutlineColor={theme.colors.blue}
                />
                <HelperText type={!formError.amount ? 'info' : "error"}>
                  {
                    !formError.date
                      ? `Monto en ${selected.currency_name === "Bolívar" || selected.currency_name === "Dolar" ? selected.currency_name + "es" : selected.currency_name + "s"}`
                      : "Monto invalido"
                  }
                </HelperText>
              </View>
              <View style={{width: "49%"}}>
                <DatePickerModal value={formValue.date} onValueChange={(value) => handleDateChange(value)} error={formError.date}/>
                <HelperText type={!formError.date ? 'info' : "error"}>
                  {
                    !formError.date
                      ? ""
                      : "Fecha invalida"
                  }
                </HelperText>
              </View>
            </View>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-between'}}>
              <TouchableOpacity 
                onPress={() => setUserBankModalVisible(true)}
                style={{width: "49%", height: height * 0.0765, borderRadius: 5, borderWidth: +`${formError.userBankAccount ? 2 : 1}`, borderColor: `${formError.userBankAccount ? theme.colors.red : theme.colors.blue}`, alignItems: 'flex-start', paddingLeft: 15.5, justifyContent: 'center'}}
              >
                <StyledText color={"darkGray"} fontSize={"medium"} fontWeight={formValue.userBankAccount ? "bold" : ""}>{formValue.userBankAccount ? formValue.userBankAccount.banc_alias_name : "Banco Emisor"}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setCompanyBankModalVisible(true)}
                style={{width: "49%", height: height * 0.0765, borderRadius: 5, borderWidth: +`${formError.companyBankAccount ? 2 : 1}`, borderColor: `${formError.companyBankAccount ? theme.colors.red : theme.colors.blue}`, alignItems: 'flex-start', paddingLeft: 15.5, justifyContent: 'center'}}
              >
                <StyledText color={"darkGray"} fontSize={"medium"}>{formValue.companyBankAccount ? formValue.companyBankAccount.banc_alias_name : "Banco Destino"}</StyledText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              onPress={() => pickImage()}
              style={{flexDirection: 'row', gap: 10, width: "100%", height: height * 0.0765, borderStyle: "dashed", borderRadius: 5, borderWidth: +`${formError.userBankAccount ? 3 : 2}`, borderColor: `${imageError.error ? theme.colors.red : theme.colors.blue}`, alignItems: 'center', paddingLeft: 15.5, justifyContent: 'center', marginTop: 5}}
            >
              <StyledText color={imageError.error ? "red" : "darkGray"} fontSize={imageError.error ? "base" : "medium"}>{imageError.error ? imageError.message : image ? `referencia.${image.split("/")[image.split("/").length -1].split(".")[1]}` : "Adjuntar Referencia"}</StyledText>
              {
                imageError.error
                  ? ""
                  : <Icon name='file-import' type='font-awesome-5' size={20} color={theme.colors.blue}/>
              }
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => submitDeposit()}
              style={{backgroundColor: theme.colors.blue, width: "100%", height: height * 0.058, alignItems: 'center', justifyContent: 'center', borderRadius: 100, marginTop: height * 0.015}}
            >
              <StyledText fontSize={"medium"} fontWeight={"bold"} color={"white"}>Aceptar</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default FiatDeposit

const {width, height} = Dimensions.get('window')

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    gap: 20,
    height: height * 0.60,
    flexDirection: 'column',
    width: width * 0.85,
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 10,
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
})