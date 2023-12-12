import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Icon, LinearProgress  } from "@rneui/themed"
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar'
import { StyledText, CustomModal } from '../components';
import theme from '../theme';
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useNavigation } from "@react-navigation/native"
import { getActividadEconomica, getCountries, getFundsSources, getIncomeLevel, getMunicipio, getOcupations, getState } from '../api/general/general';
import { completeRegister } from '../api/users/Users';


const CompleteRegister = () => {

  const navigation = useNavigation()

  useEffect(() => {
    handleCountries();
    handleOcupations();
    handleActividadEconomica()
    handleFundSources()
    handleIncomeLevel()
    handleState()
  }, [])
  
  // FORM
  const [personalDataForm, setPersonalDataForm] = useState({})
  const [financialInformationForm, setFinancialInformationForm] = useState({})
  const [directionForm, setDirectionForm] = useState({})

  const [formValue, setFormValue] = useState({
    aboutUser: {
      firstName: {error: false, value: undefined, name: "firstName", type: "string", label: "Nombre"}, // gabriel siempre capitalizar el texto
      secondName: {error: false, value: undefined, name: "secondName", type: "string", label: "Segundo Nombre"}, // antonio siempre capitalizar el texto
      lastName: {error: false, value: undefined, name: "lastName", type: "string", label: "Apellido"}, // paez siempre capitalizar el texto
      secondlastName: {error: false, value: undefined, name: "secondLastName", type: "string", label: "Segundo Apellido"}, // ramirez siempre capitalizar el texto
      identificationNumberType: {error: false, value: undefined, name: "identificationNumberType", type: "string", label: "V   E   P", options: ["Venezolano", "Extrangero", "Pasaporte"]}, // [ V, E , P ]
      identificationNumber: {error: false, value: undefined, name: "identificationNumber", type: "number", label: "Número de documento"}, // solo numeros maximo hasta 8 caracteres de ser venezolano
      birthDate: {error: false, value: undefined, name: "birthDate", type: "string", label: "dd/mm/aaaa"}, // formato AAAA-MM-DD
      genero: {error: false, value: undefined, name: "genero", type: "string", label: "Genero", options: ["Femenino", "Masculino"]}, // 1: "femenino", 2: masculino
      ocupacion: {error: false, value: undefined, name: "ocupacion", type: "modal", label: "Ocupación", options: []}, // endpoint => getOcupations
      nationality: {error: false, value: undefined, name: "nationality", type: "modal", label: "Nacionalidad", options: []} // Endpoint => General/Get Countries/Nationalities"
    },
    economy: {
      actividadEconomica: {error: false, value: undefined, name: "actividadEconomica", type: "modal", label: "Actividad Economica", options: []}, // Endpoint => General/Get Economic Activities
      otra_actividad: {error: false, value: undefined, name: "otra_actividad", type: "string", label: "Otra Actividad"}, // Obligatoria para Opciones Publico,Privado
      origenFondos: {error: false, value: undefined, name: "origenFondos", type: "modal", label: "Origen Fondos"},  // Endpoint => General/Get Fund Sources
      pep: {error: false, value: undefined, name: "pep", type: "string", label: "PEP", options: ["Si", "No"]}, // [iSI, No ]
      trading: {error: false, value: undefined, name: "trading", type: "string", label: "Hace Trading", options: ["Si", "No"]}, // [iSI, No ]
      brocker: {error: false, value: undefined, name: "brocker", type: "string", label: "Brocker", options: ["Si", "No"]}, // [ SI, NO ]
      incomeLevel: {error: false, value: undefined, name: "incomeLevel", type: "modal", label: "Nivel de ingresos", options: []} // Endpoint => General/Get Income Levels
    }, 
    direccion: {
      country: {error: false, value: undefined, name: "country", type: "modal", label: "Pais", options: []} , // Endpoint => General/Get Countries/Nationalities
      estado: {error: false, value: undefined, name: "estado", type: "modal", label: "Estado", options: []}, // Endpoint => General/Get Estados | Solo para Country Venezuela
      municipio: {error: false, value: undefined, name: "municipio", type: "modal", label: "Municipio", options: []}, // Endpoint => General/Get Municipio | Solo para Country Venezuela
      parroquia: {error: false, value: undefined, name: "parroquia", type: "modal", label: "Parroquia", options: []}, // Endpoint => General/Get Parroquia | Solo para Country Venezuela
      codePhoneCountry: {error: false, value: undefined, name: "codePhoneCountry", type: "modal", label: "Codigo de area", options: []}, // Endpoint => General/Get Countries/Nationalities
      phoneNumber: {error: false, value: undefined, name: "phoneNumber", type: "number", label: "Telefono"}, // No debe contener 0 al inicio EJ 4143110914
      address2: {error: false, value: undefined, name: "address2", type: "string", label: "Direccion 2"}, // Direccion
    },
  });

  const [modal, setModal] = useState({
    title: "",
    content: undefined
  })

  const [modalSelect, setModalSelect] = useState()

  const [section, setSection] = useState("datosPersonales");

  const [loading, setLoading] = useState(false);

  const [loadingNext, setLoadingNext] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [finalModalVisible, setFinalModalVisible] = useState(false);

  const [validRegistration, setValidRegistration] = useState({code: "", message: ""})

  const [personalDataErrors, setPersonalDataErrors] = useState();

  const [financialInformationErrors, setFinancialInformationErrors] = useState();

  const [directionErrors, setDirectionErrors] = useState();

  const [endPointRes, setEndPointRes] = useState({
    ocupacion: [],
    nationality: [],
    origenFondos: [],
    pep: [],
    trading: [],
    brocker: [],
    incomeLevel: [],
    country: [],
    estado: [],
    municipio: [],
    parroquia: [],
    codePhoneCountry: [],
    actividadEconomica: []
  })

  const checkPersonalDataErrors = (submitTry) => {
    Object.keys(formValue.aboutUser).forEach((element) => {
      const {value} = formValue.aboutUser[element]
      if (value === undefined || value === "") {
        submitTry && setFormValue({...formValue, ...formValue.aboutUser[element].error = true})
      } else {
        setFormValue({...formValue, ...formValue.aboutUser[element].error = false})
      }
    })
  };

  const checkFinancialInformationErrors = (submitTry) => {
    formValue.economy.actividadEconomica === "Cuenta propia" || formValue.economy.actividadEconomica === "Desempleado"
      ? formValue.economy.otra_actividad.value = "N/A"
      : formValue.economy.otra_actividad.value = formValue.economy.otra_actividad.value
    Object.keys(formValue.economy).forEach((element) => {
      const {value} = formValue.economy[element]
      if (value === undefined || value === "") {
        submitTry && setFormValue({...formValue, ...formValue.economy[element].error = true})
      } else {
        setFormValue({...formValue, ...formValue.economy[element].error = false})
      }
    })
  };

  const checkDirectionErrors = (submitTry) => {
    Object.keys(formValue.direccion).forEach((element) => {
      const {value} = formValue.direccion[element]
      if (value === undefined || value === "") {
        submitTry && setFormValue({...formValue, ...formValue.direccion[element].error = true})
      } else {
        setFormValue({...formValue, ...formValue.direccion[element].error = false})
      }
    })
  };

  handlePersonalDataChange = (name, text) => {
    checkPersonalDataErrors()
    if (name === "genero") {
      if (text === "Masculino") {
        setFormValue({...formValue, ...formValue.aboutUser[name].value = text})
        setPersonalDataForm({...personalDataForm, [name]: 2})
      } else {
        setFormValue({...formValue, ...formValue.aboutUser[name].value = text})
        setPersonalDataForm({...personalDataForm, [name]: 1})
      }
    } else if (name === "birthDate") {
        const numericInput = text.replace(/\D/g, '');
        const day = numericInput.slice(0, 2);
        const month = numericInput.slice(2, 4);
        const year = numericInput.slice(4, 8);
        const formattedDate = `${day}${day.length === 2 ? '-' : ''}${month}${month.length === 2 ? '-' : ''}${year}`;
        setFormValue({...formValue, ...formValue.aboutUser[name].value = formattedDate});
        if (formattedDate.length >= 10) {
          const day = formattedDate.slice(0, 2)
          const month = formattedDate.slice(3, 5)
          const year = formattedDate.slice(6, 10)
          const newDate = `${year}-${month}-${day}`
          setPersonalDataForm({...personalDataForm, [name]: newDate});
          console.log(personalDataForm.birthDate)
        }
    } else if (name === "nationality") {
      const obj = endPointRes[name].flat()
      const index = obj.find((item) => item.nationality === formValue.aboutUser[name].options.find((item) => item === text))
      setFormValue({...formValue, ...formValue.aboutUser[name].value = text})
      setPersonalDataForm({...personalDataForm, [name]: index.id})
    } else if (formValue.aboutUser[name].type === "modal") {
      const obj = endPointRes[name].flat()
      const index = obj.find((item) => item.name === formValue.aboutUser[name].options.find((item) => item === text))
      setFormValue({...formValue, ...formValue.aboutUser[name].value = text})
      index.id ? setPersonalDataForm({...personalDataForm, [name]: index.id}) : setPersonalDataForm({...personalDataForm, [name]: index})
    } else if (formValue.aboutUser[name].name === "identificationNumberType") {
      if (text === "Venezolano") {
        setFormValue({...formValue, ...formValue.aboutUser[name].value = "V"}) 
        setPersonalDataForm({...personalDataForm, [name]: "V"})
      } else if (text === "Extrangero") {
        setFormValue({...formValue, ...formValue.aboutUser[name].value = "E"}) 
        setPersonalDataForm({...personalDataForm, [name]: "E"})
      } else if (text === "Pasaporte") {
        setFormValue({...formValue, ...formValue.aboutUser[name].value = "P"}) 
        setPersonalDataForm({...personalDataForm, [name]: "P"})
      }
    } else {
      setFormValue({...formValue, ...formValue.aboutUser[name].value = text});
      setPersonalDataForm({...personalDataForm, [name]: text});
    }
  }

  handleFinancialInformationChange = (name, text) => {
    checkFinancialInformationErrors()
    if (formValue.economy[name].name === "incomeLevel") {
      const obj = endPointRes[name].flat()
      const index = obj.find((item) => item.description === formValue.economy[name].options.find((item) => item === text))
      setFormValue({...formValue, ...formValue.economy[name].value = text})
      setFinancialInformationForm({...financialInformationForm, [name]: index.id})
    } else if (formValue.economy[name].type === "modal") {
      const obj = endPointRes[name].flat()
      const index = obj.find((item) => item.name === formValue.economy[name].options.find((item) => item === text))
      setFormValue({...formValue, ...formValue.economy[name].value = text})
      index.id ? setFinancialInformationForm({...financialInformationForm, [name]: index.id}) : setFinancialInformationForm({...financialInformationForm, [name]: index})
    } else {
      setFormValue({...formValue, ...formValue.economy[name].value = text});
      setFinancialInformationForm({...financialInformationForm, [name]: text});
    }
  }

  handleDirectionChange = async (name, text) => {
    checkPersonalDataErrors()
    if (name === "codePhoneCountry") {
      console.log(name, text)
      setFormValue({...formValue, ...formValue.direccion[name].value = text});
      setDirectionForm({...directionForm, [name]: +text});
    } else if (formValue.direccion[name].type === "modal") {
      const obj = endPointRes[name].flat()
      const index = obj.find((item) => item.name === formValue.direccion[name].options.find((item) => item === text))
      setFormValue({...formValue, ...formValue.direccion[name].value = text})
      index.id ? setDirectionForm({...directionForm, [name]: index.id}) : setDirectionForm({...directionForm, [name]: index})
      if (name === "estado" && index.id) {
        console.log(index.id)
        await handleMunicipio(index.id)
      } else if (name === "municipio" && index.id) {
        await handleParroquia(index.id)
      }
    } else {
      console.log(name, text)
      setFormValue({...formValue, ...formValue.direccion[name].value = text});
      setDirectionForm({...directionForm, [name]: text});
    }
  }

  const validatePersonalData = () => {
    setLoadingNext(true)
    checkPersonalDataErrors(true)
    const {aboutUser} = formValue
    const hasErrors = Object.values(aboutUser).some(property => property.error);
    if (!hasErrors) {
      const modifiedObject = {...personalDataForm};
      for (const prop in modifiedObject) {
        if (typeof modifiedObject[prop] === 'object' && modifiedObject[prop].id !== undefined && modifiedObject[prop].name !== undefined) {
          modifiedObject[prop] = modifiedObject[prop].id;
        }
      }
      setSection("informacionFinanciera")
    }
    setLoadingNext(false)
  }
  
  const validateFinancialInformation = () => {
    setLoadingNext(true)
    checkFinancialInformationErrors(true)
    const {economy} = formValue
    const hasErrors = Object.values(economy).some(property => property.error);
    if (!hasErrors) {
      const modifiedObject = {...financialInformationForm};
      for (const prop in modifiedObject) {
        if (typeof modifiedObject[prop] === 'object' && modifiedObject[prop].id !== undefined && modifiedObject[prop].name !== undefined) {
          modifiedObject[prop] = modifiedObject[prop].id;
        }
      }
      setSection("Direccion")
    }
    setLoadingNext(false)
  }
  const validateDirection = () => {
    setLoadingNext(true)
    checkDirectionErrors(true)
    const {direccion} = formValue
    const hasErrors = Object.values(direccion).some(property => property.error);
    console.log(hasErrors)
    if (!hasErrors) {
      const modifiedObject = {...directionForm};
      for (const prop in modifiedObject) {
        if (typeof modifiedObject[prop] === 'object' && modifiedObject[prop].id !== undefined && modifiedObject[prop].name !== undefined) {
          modifiedObject[prop] = modifiedObject[prop].id;
        }
      }
      handleSubmit()
    }
    setLoadingNext(false)
  }

  const handleSubmit = async () => {
    console.log(token)
    const token = await SecureStore.getItemAsync("token")
    directionForm.address1 && delete directionForm.address1
    const handleObj = {...personalDataForm, ...financialInformationForm, ...directionForm}
    console.log("-----------------------------------------")
    if (token) {
      const req = await completeRegister(handleObj, token)
      const {code, message} = req
      console.log("message y code", code, message)
      code === 200 ?  setValidRegistration({code, message}) : setValidRegistration({code: 400, message: "Ha ocurrido un error, por favor reintente..."})
      setFinalModalVisible(true)
    } else {
      setValidRegistration({code: 400, message: "Su sesion ha expirado, por favor vuelva a iniciar sesion..."})
      setFinalModalVisible(true)
    }
  }

  const handleParroquia = async (id) => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.parroquia.length < 1 || endPointRes.parroquia) {
      setLoading(true)
      const res = await getMunicipio(token, id)
      setEndPointRes({...endPointRes, ...endPointRes.parroquia.push(res)})
      formValue.direccion.parroquia.options = [...res.map((item) => item.name)]
      console.log(formValue.direccion.parroquia.options)
      return res
    }
    setLoading(false)
  }

  const handleMunicipio = async (id) => {
    const token = await SecureStore.getItemAsync("token")
      setLoading(true)
      const res = await getMunicipio(token, id)
      console.log("municipio", res)
      if (res.length < 1) {
        setEndPointRes({...endPointRes, ...endPointRes.municipio.push(1)})
        formValue.direccion.municipio.options = [1]
      } else {
        setEndPointRes({...endPointRes, ...endPointRes.municipio.push(res)})
        formValue.direccion.municipio.options = [...res.map((item) => item.name)]
      }
    setLoading(false)
  }

  const handleState = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.estado.length < 1 || endPointRes.estado) {
      setLoading(true)
      const res = await getState(token)
      setEndPointRes({...endPointRes, ...endPointRes.estado.push(res)})
      formValue.direccion.estado.options = [...res.map((item) => item.name)]
      return res
    }
    setLoading(false)
  }
  
  const handleIncomeLevel = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.incomeLevel.length < 1 || endPointRes.incomeLevel) {
      setLoading(true)
      const res = await getIncomeLevel(token)
      setEndPointRes({...endPointRes, ...endPointRes.incomeLevel.push(res)})
      formValue.economy.incomeLevel.options = [...res.map((item) => item.description)]
      return res
    }
    setLoading(false)
  }

  const handleActividadEconomica = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.actividadEconomica.length < 1 || endPointRes.actividadEconomica) {
      setLoading(true)
      const res = await getActividadEconomica(token)
      setEndPointRes({...endPointRes, ...endPointRes.actividadEconomica.push(res)})
      formValue.economy.actividadEconomica.options = [...res.map((item) => item.name)]
      return res
    }
    setLoading(false)
  }

  const handleFundSources = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.origenFondos.length < 1 || endPointRes.origenFondos) {
      setLoading(true)
      const res = await getFundsSources(token)
      setEndPointRes({...endPointRes, ...endPointRes.origenFondos.push(res)})
      formValue.economy.origenFondos.options = [...res.map((item) => item.name)]
      return res
    }
    setLoading(false)
  }

  const handleCountries = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.nationality.length < 1 || endPointRes.nationality) {
      setLoading(true)
      const res = await getCountries(token)

      setEndPointRes({...endPointRes, ...endPointRes.nationality.push(res)})
      formValue.aboutUser.nationality.options = [...res.map((item) => item.nationality)]

      setEndPointRes({...endPointRes, ...endPointRes.country.push(res)})
      formValue.direccion.country.options = [...res.map((item) => item.name)]

      setEndPointRes({...endPointRes, ...endPointRes.codePhoneCountry.push(res)})
      formValue.direccion.codePhoneCountry.options = [...res.map((item) => item.phone_code)]
      console.log(directionForm.codePhoneCountry)
      
      return res
    }
    setLoading(false)
  }
  
  const handleOcupations = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (endPointRes.ocupacion.length < 1 || endPointRes.ocupacion) {
      setLoading(true)
      const res = await getOcupations(token)
      setEndPointRes({...endPointRes, ...endPointRes.ocupacion.push(res)})
      formValue.aboutUser.ocupacion.options = [...res.map((item) => item.name)]
      return res
    }
    setLoading(false)
  }

  return (
    <>
      <StatusBar style='dark' backgroundColor={theme.colors.lightBlue} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={finalModalVisible}
        onRequestClose={() => setFinalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {
              validRegistration.code === 200
                ? (
                  <>
                    <View style={{backgroundColor: theme.colors.lightGreen, borderRadius: width, padding: 16}}>
                      <Icon type='font-awesome-5' name='check' color={theme.colors.green} size={50}/>
                    </View>
                    <View>
                      <StyledText fontSize="medium" fontWeight="bold" color="blue">Los datos fueron registrados con éxito, la cuenta esta en proceso de validación</StyledText>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Dashboard")}
                      style={{backgroundColor: theme.colors.blue, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 100}}
                    >
                      <StyledText color="white" fontSize="medium" fontWeight="bold" >Volver al Inicio</StyledText>
                    </TouchableOpacity>
                  </>
                )
                : (
                  <>
                    <View style={{backgroundColor: theme.colors.lightRed, borderRadius: width, padding: 16, paddingHorizontal: 35}}>
                      <Icon type='font-awesome-5' name='exclamation' color={theme.colors.red} size={50}/>
                    </View>
                    <View>
                      <StyledText fontSize="medium" fontWeight="bold" color="blue">{validRegistration.message}</StyledText>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Dashboard")}
                      style={{backgroundColor: theme.colors.blue, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 100}}
                    >
                      <StyledText color="white" fontSize="medium" fontWeight="bold" >Volver al Inicio</StyledText>
                    </TouchableOpacity>
                  </>
                )
            }
          </View>
        </View>
      </Modal>


      <View style={styles.container}>
        <ScrollView style={styles.card}>
          {/* TOP CONTAINER */}
          <View style={styles.box} scrollEnabled={true}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={{marginTop: 5}}>
                <Icon name="account-circle" type='material-community' color={theme.colors.blue} size={35}/>
              </View>
              <StyledText color="blue" fontWeight="bold" fontSize="xxl">Registro de Cliente</StyledText>
            </View>
            {/* <View style={{width: "100%", borderColor: theme.colors.blue, borderWidth: 0.5, marginVertical: 12}}/> */}
            <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 5}}>
              <View style={{padding: 10}}>
                <LinearProgress animation={{duration: 100}} value={section === "datosPersonales" ? 0.17 : section === "informacionFinanciera" ? 0.5 : 0.85} trackColor='#fff' color={theme.colors.blue} variant='determinate'/>
                <View style={{justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
                  <View style={{alignItems: "center"}}>
                    <StyledText fontSize="base" fontWeight="bold" color={section === "datosPersonales" ? "blue" : "gray"}>Datos</StyledText>
                    <StyledText fontSize="base" fontWeight="bold" color={section === "datosPersonales" ? "blue" : "gray"}>Personales</StyledText>
                  </View>
                  <View style={{alignItems: "center"}}>
                    <StyledText fontSize="base" fontWeight="bold" color={section === "informacionFinanciera" ? "blue" : "gray"}>Información</StyledText>
                    <StyledText fontSize="base" fontWeight="bold" color={section === "informacionFinanciera" ? "blue" : "gray"}>Financiera</StyledText>
                  </View>
                  <View style={{alignItems: "center"}}>
                    <StyledText fontSize="base" fontWeight="bold" color={section === "Direccion" ? "blue" : "gray"}>Dirección</StyledText>
                  </View>
                </View>
              </View>

              <ScrollView>
                {
                  section === "datosPersonales"
                    ? (
                      <>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                          <View style={{width: "49%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.firstName.label}
                              value={formValue.aboutUser.firstName.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("firstName", text)}
                              error={formValue.aboutUser.firstName.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                          <View style={{width: "49%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.secondName.label}
                              value={formValue.aboutUser.secondName.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("secondName", text)}
                              error={formValue.aboutUser.secondName.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                          <View style={{width: "49%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.lastName.label}
                              value={formValue.aboutUser.lastName.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("lastName", text)}
                              error={formValue.aboutUser.lastName.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                          <View style={{width: "49%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.secondlastName.label}
                              value={formValue.aboutUser.secondlastName.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("secondlastName", text)}
                              error={formValue.aboutUser.secondlastName.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, gap: 2}}>
                          <CustomModal content={formValue.aboutUser.identificationNumberType} title={formValue.aboutUser.identificationNumberType.value} selected={personalDataForm.identificationNumberType && personalDataForm.identificationNumberType} setSelected={(item) => handlePersonalDataChange("identificationNumberType", item)} widthButton={"35%"}/>
                          <View style={{width: "63%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.identificationNumber.label}
                              value={formValue.aboutUser.identificationNumber.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("identificationNumber", +text)}
                              keyboardType='number-pad'
                              error={formValue.aboutUser.identificationNumber.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, gap: 2}}>
                          <View style={{width: "38%"}}>
                            <TextInput
                              placeholder={formValue.aboutUser.birthDate.label}
                              value={formValue.aboutUser.birthDate.value}
                              mode='outlined'
                              onChangeText={(text) => handlePersonalDataChange("birthDate", text)}
                              keyboardType='number-pad'
                              error={formValue.aboutUser.birthDate.error === true}
                              outlineColor={theme.colors.blue}
                              activeOutlineColor={theme.colors.blue}
                            />
                          </View>
                          <CustomModal content={formValue.aboutUser.genero} title={formValue.aboutUser.genero.value} selected={personalDataForm.genero && personalDataForm.genero} setSelected={(item) => handlePersonalDataChange("genero", item)} widthButton={"60%"}/>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                          <CustomModal content={formValue.aboutUser.ocupacion} title={formValue.aboutUser.ocupacion.value} selected={personalDataForm.ocupacion && personalDataForm.ocupacion} setSelected={(item) => handlePersonalDataChange("ocupacion", item)} widthButton={"49%"} searchBar={true}/>
                          <CustomModal content={formValue.aboutUser.nationality} title={formValue.aboutUser.nationality.value} selected={personalDataForm.nationality && personalDataForm.nationality} setSelected={(item) => handlePersonalDataChange("nationality", item)} widthButton={"49%"} searchBar={true}/>
                        </View>
                      </>
                    ) : section === "informacionFinanciera"
                        ? (
                          <>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                              <CustomModal content={formValue.economy.actividadEconomica} title={formValue.economy.actividadEconomica.value} selected={financialInformationForm.actividadEconomica && financialInformationForm.actividadEconomica} setSelected={(item) => handleFinancialInformationChange("actividadEconomica", item)} widthButton={"49%"}/>
                              <View style={{width: "49%"}}>
                                <TextInput
                                  disabled={formValue.economy.actividadEconomica.value === undefined || formValue.economy.actividadEconomica.value === "Cuenta propia" || formValue.economy.actividadEconomica.value === "Desempleado"}
                                  placeholder={formValue.economy.otra_actividad.label}
                                  value={formValue.economy.otra_actividad.value}
                                  mode='outlined'
                                  onChangeText={(text) => handleFinancialInformationChange("otra_actividad", text)}
                                  error={formValue.economy.otra_actividad.error === true}
                                  outlineColor={theme.colors.blue}
                                  activeOutlineColor={theme.colors.blue}
                                />
                              </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8}}>
                              <CustomModal content={formValue.economy.brocker}  title={formValue.economy.brocker.value} selected={financialInformationForm.brocker && financialInformationForm.brocker} setSelected={(item) => handleFinancialInformationChange("brocker", item)} widthButton={"32.3%"}/>
                              <CustomModal content={formValue.economy.trading}  title={formValue.economy.trading.value} selected={financialInformationForm.trading && financialInformationForm.trading} setSelected={(item) => handleFinancialInformationChange("trading", item)} widthButton={"32.3%"}/>
                              <CustomModal content={formValue.economy.pep}  title={formValue.economy.pep.value} selected={financialInformationForm.pep && financialInformationForm.pep} setSelected={(item) => handleFinancialInformationChange("pep", item)} widthButton={"32.3%"}/>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8}}>
                              <CustomModal content={formValue.economy.origenFondos}  title={formValue.economy.origenFondos.value} selected={financialInformationForm.origenFondos && financialInformationForm.origenFondos} setSelected={(item) => handleFinancialInformationChange("origenFondos", item)} widthButton={"49%"}/>
                              <CustomModal content={formValue.economy.incomeLevel}  title={formValue.economy.incomeLevel.value} selected={financialInformationForm.incomeLevel && financialInformationForm.incomeLevel} setSelected={(item) => handleFinancialInformationChange("incomeLevel", item)} widthButton={"49%"}/>
                            </View>
                          </>
                        ) : section === "Direccion" && (
                            <>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                                <View style={{width: "100%"}}>
                                  <TextInput
                                    placeholder="Direccion"
                                    value={formValue.direccion.address2.value}
                                    mode='outlined'
                                    onChangeText={(text) => handleDirectionChange("address2", text)}
                                    error={formValue.direccion.address2.error === true}
                                    outlineColor={theme.colors.blue}
                                    activeOutlineColor={theme.colors.blue}
                                  />
                                </View>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8}}>
                                <CustomModal content={formValue.direccion.country}  title={formValue.direccion.country.value} selected={directionForm.country && directionForm.country} setSelected={(item) => handleDirectionChange("country", item)} widthButton={"49.3%"} searchBar={true}/>
                                <CustomModal disabled={formValue.direccion.country.value === undefined || formValue.direccion.country.value !== "Venezuela" ? true : false} content={formValue.direccion.estado}  title={formValue.direccion.estado.value} selected={directionForm.estado && directionForm.estado} setSelected={(item) => handleDirectionChange("estado", item)} widthButton={"49.3%"} searchBar={true}/>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8}}>
                                <CustomModal disabled={formValue.direccion.estado.value === undefined ? true : false} content={formValue.direccion.municipio}  title={formValue.direccion.municipio.value} selected={directionForm.municipio && directionForm.municipio} setSelected={(item) => handleDirectionChange("municipio", item)} widthButton={"49%"} searchBar={true}/>
                                <CustomModal disabled={formValue.direccion.municipio.value === undefined ? true : false} content={formValue.direccion.parroquia}  title={formValue.direccion.parroquia.value} selected={directionForm.parroquia && directionForm.parroquia} setSelected={(item) => handleDirectionChange("parroquia", item)} widthButton={"49%"} searchBar={true}/>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8}}>
                                <CustomModal content={formValue.direccion.codePhoneCountry}  title={formValue.direccion.codePhoneCountry.value} selected={directionForm.codePhoneCountry && directionForm.codePhoneCountry} setSelected={(item) => handleDirectionChange("codePhoneCountry", item)} widthButton={"29%"} searchBar={true}/>
                                <View style={{width: "68%"}}>
                                  <TextInput
                                    placeholder={formValue.direccion.phoneNumber.label}
                                    value={formValue.direccion.phoneNumber.value}
                                    mode='outlined'
                                    keyboardType='number-pad'
                                    onChangeText={(text) => handleDirectionChange("phoneNumber", +text)}
                                    error={formValue.direccion.phoneNumber.error === true}
                                    outlineColor={theme.colors.blue}
                                    activeOutlineColor={theme.colors.blue}
                                  />
                                </View>
                              </View>
                            </>
                          
                        )
                }
              </ScrollView>

              <View style={{alignItems: 'center', marginTop: 10}}>
                <StyledText color="blue" fontSize="medium" fontWeight="bold">Todos los campos son obligatorios</StyledText>
              </View>


              <View style={{flexDirection: 'row-reverse', justifyContent: 'space-around' , alignItems: 'center', marginTop: 20, marginBottom: 10}}>
                <TouchableOpacity 
                  onPress={() => section === "datosPersonales" ? validatePersonalData() : section === "informacionFinanciera" ? validateFinancialInformation() : section === "Direccion" && validateDirection()}
                  style={{backgroundColor: theme.colors.blue, borderRadius: 100, paddingVertical: 10, paddingHorizontal: 15}}
                >
                  {
                    loadingNext 
                      ? <Loader loading={loadingNext} size={"small"} color={"white"}/>
                      : (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                          <StyledText color={"white"} fontWeight={"bold"}>Siguiente</StyledText>
                          <Icon name="arrowright" type='ant-design' color="white"/> 
                        </View>
                      )

                  }
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={section === "datosPersonales"}
                  onPress={() => section === "informacionFinanciera" ? setSection("datosPersonales") : section === "Direccion" ? setSection("informacionFinanciera") : setSection("Direccion")}
                  style={{backgroundColor: `${section === "datosPersonales" ? theme.colors.blurBlue : theme.colors.blue}`, borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20}}
                >
                  {
                    loadingNext 
                      ? <Loader loading={loadingNext} size={"small"} color={"white"}/>
                      : (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                          <Icon name="arrowleft" type='ant-design' color="white"/> 
                          <StyledText color={"white"} fontWeight={"bold"}>Anterior</StyledText>
                        </View>
                      ) 

                  }
                </TouchableOpacity>
              </View>
            </View>



          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default CompleteRegister

const {width, height} = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBlue,
    marginTop: Constants.statusBarHeight,
  },
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    elevation: 3, // Sombras
    padding: 0,
    width: width * 0.94, // Ancho del 90% de la pantalla
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.04, // Centra verticalmente en el 25% de la pantalla
    borderColor: theme.colors.blurBlue,
    borderWidth: 0.5
  },
  box: {
    padding: 8,
    borderRadius: 10,
    maxHeight: height * 0.85
  },
  inputStyle: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.gray
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
    padding: 20,
    borderRadius: 10,
  },
})