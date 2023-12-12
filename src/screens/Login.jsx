import { StyleSheet, View, Dimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SegmentedButtons, TextInput, HelperText } from "react-native-paper"
import Constants from 'expo-constants';
import theme from '../theme'
import { StyledText } from '../components'
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader';

const Login = () => {

  const navigation = useNavigation()
  const { handleLogin, handleRegister, handleLogOut } = useUser()

  const [submitError, setSubmitError] = useState({
    error: false,
    message: ""
  })

  const [value, setValue] = useState('Iniciar Sesion');
  const [reside, setReside] = useState();
  const [userType, setUserType] = useState();
  const [loading, setLoading] = useState(false)

  const [pwdVisible, setPwdVisible] = useState({
    loginPwd: false,
    registerPwd: false,
    registerSecondPwd: false,
  });

  const [formValueLogin, setFormValueLogin] = useState({
    username: undefined,
    password: undefined
  });

  const [formValueRegister, setFormValueRegister] = useState({
    email: undefined,
    passwordFirst: undefined,
    passwordSecond: undefined,
    userType: 0,
    reside: undefined
  });

  const [openUsertype, setOpenUsertype] = useState(false)

  const [openCountry, setOpenCountry] = useState(false)

  const [registerError, setRegisterError] = useState({
    email: true,
    passwordFirst: true,
    passwordSecond: true,
    userType: true,
    reside: true
  });

  const [loginError, setLoginError] = useState({
    username: false,
    password: false
  });

  useEffect(() => {
    setLoginError({
      username: false,
      password: false,
    });
    setRegisterError({
      email: false,
      passwordFirst: false,
      passwordSecond: false,
      userType: false,
      reside: false
    });
    setSubmitError({error: false, message: ""})
  }, [value])
  
  useEffect(() => {
    handleLogOut()
  }, [])
  

  const regexPwd = /^(?=.*[A-Z])(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,./?~-]){2}).{8,}$/;
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const userTypeData = [
    {label:'0', value:'Natural'},
    {label:'1', value:'Juridica'}
  ]
  
  const resideData = [
    {label:'0', value:'Venezuela'},
    {label:'1', value:'Extrangero'}
  ]

  const validateLoginParams = () => {
    const { username, password } = formValueLogin;
  
    // Verificar que el campo esté lleno y cumpla con la expresión regular
    const isUsernameValid = !!(username && regexEmail.test(username));
    const isPasswordValid = !!(password && password.trim().length > 0); // Asegurar que password no esté vacío
  
    // Actualizar el estado de los errores
    setLoginError({
      username: !isUsernameValid,
      password: !isPasswordValid
    });
  };

  const validateRegisterParams = () => {
    const { email, passwordFirst, passwordSecond, reside, userType } = formValueRegister;
  
    // Verificar que todos los campos estén llenos y cumplan con las expresiones regulares
    const isEmailValid = !!(email !== undefined && regexEmail.test(email));
    const isPasswordFirstValid = !!(passwordFirst !== undefined && regexPwd.test(passwordFirst));
    const isPasswordSecondValid = !!(passwordSecond !== undefined && passwordSecond === passwordFirst);
    const isResideValid = !!(reside && reside.trim().length > 0);

    // Actualizar el estado de los errores
    setRegisterError({
      email: !isEmailValid,
      passwordFirst: !isPasswordFirstValid,
      passwordSecond: !isPasswordSecondValid,
      reside: !isResideValid,
    });
  };

  const checkLoginErrors = () => Object.values(loginError).some((value) => value === true);
  const checkRegisterErrors = () => Object.values(registerError).some((value) => value === true);
  
  const handleSelectCountry = (option) => {
    setReside(option.value)
    setFormValueRegister({
      ...formValueRegister,
      reside: option.label
    });
    setOpenCountry(false)
  }

  const handleLoginChange = (name, value) => {
    const obj = {...formValueLogin, [name]: value}
    setFormValueLogin(obj);
  }
  
  const handleRegisterChange = (name, value) => {
    const obj = {...formValueRegister, [name]: value}
    setFormValueRegister(obj);
  }

  const login = async () => {
    setLoading(true)
    validateLoginParams()
    const errors = checkLoginErrors()
    if (!errors) {
      return await handleLogin(formValueLogin)
        .then((data) => {
          data.code === 200 && navigation.navigate("Dashboard")
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          setSubmitError({error: true, message: error})
        })
    } else {
      validateLoginParams()
      checkLoginErrors()
      setLoading(false)
    }
  }

  const register = async () => {
    setLoading(true)
    validateRegisterParams()
    const errors = checkRegisterErrors()
    if (!errors) {
      console.log("entra")
      await handleRegister(formValueRegister)
        .catch((error) => {
          setSubmitError({error: true, message: error})
        })
        setValue("Iniciar Sesion")
    }
    setLoading(false)
  }

  return (
    <>
      <StatusBar style='dark' backgroundColor={theme.colors.lightBlue}/>
      <View style={styles.container}>
        <View style={[styles.card, {height: `${value === "Iniciar Sesion" ? height * 0.60 : height * 0.65}`}]}>
          <SegmentedButtons
            style={styles.tabs}
            key={Math.random()}
            density='regular'
            theme={{ colors: { onSurface: theme.colors.blue, secondaryContainer: theme.colors.blue, onSecondaryContainer: "white" }}} 
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                label: 'Iniciar Sesion',
                value: 'Iniciar Sesion',
              },
              {
                label: 'Registrarse',
                value: 'Registrarse',
              }
            ]}
          />
          <View style={[styles.tabsContent, {marginTop: value === "Iniciar Sesion" ? 15 : 0}]}>
            { 
              value === "Iniciar Sesion"
                ? (
                  <View style={styles.tabsContent}>
                    <TextInput
                      onChangeText={(value) => handleLoginChange("username", value) } 
                      placeholder='Correo' 
                      mode="outlined" 
                      outlineColor={theme.colors.blue}
                      textColor={theme.colors.blue}
                      selectTextOnFocus={true}
                      outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                      activeOutlineColor={theme.colors.blue}
                    />
                    <HelperText type="error" padding="normal" 
                      visible={loginError.username}
                    >
                      Direccion de correo invalida!
                    </HelperText>
                    <TextInput
                      onChangeText={(value) => handleLoginChange("password", value) }
                      secureTextEntry={!pwdVisible.loginPwd}
                      placeholder='Contraseña'
                      outlineColor={theme.colors.blue}
                      textColor={theme.colors.blue}
                      selectTextOnFocus={true}
                      outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                      activeOutlineColor={theme.colors.blue}
                      mode='outlined' 
                      right={
                        <TextInput.Icon icon={pwdVisible.loginPwd ? "eye" : "eye-off"} onPress={
                          () => setPwdVisible({...pwdVisible, loginPwd: !pwdVisible.loginPwd})
                        }/>
                      }
                    />
                    <HelperText type="error" padding="normal" 
                      visible={loginError.password}
                    >
                      Ingrese su contraseña!
                    </HelperText>
                    <TouchableOpacity style={{alignItems: 'center', marginTop: 5}} onPress={() => navigation.navigate("ResetPassword")}>
                      <StyledText color="blue" fontSize="normal" fontWeight="extraBold">¿OLVIDO SU CONTRASEÑA?</StyledText>
                    </TouchableOpacity>
                  </View>
                )
                : (
                  <View style={styles.tabsContent}>
                    <View style={{flexDirection: 'row', gap: 10, flexWrap: 'nowrap', width: "100%", alignItems: 'center', justifyContent: 'space-around', marginBottom: 10, marginTop: 20}}>
                      <TouchableOpacity 
                        onPress={() => setOpenCountry(true)}
                        style={{borderWidth: 2, borderColor: `${registerError.reside ? theme.colors.red : theme.colors.blue}`, borderRadius: 15, paddingVertical: 8, alignItems:'center', elevation: 3, backgroundColor: theme.colors.white, minWidth: "100%"}}>
                        <StyledText color="blue" fontWeight="bold" fontSize="normal">
                          {reside !== undefined ? reside : "Nacionalidad:"}
                        </StyledText>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={openCountry}
                        onRequestClose={() => setOpenCountry(false)}
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', gap: 1}}>
                              <StyledText style={{textAlign: "center", fontWeight: "bold", fontSize: theme.fontSize.medium, color: "gray", marginTop: 20}}>
                                Seleccione su nacionalidad:</StyledText>
                              <View style={{flexDirection: 'column', justifyContent: 'space-between', gap: 5}}>
                                {
                                  resideData.map((item) => (
                                    <TouchableOpacity 
                                      style={{
                                        borderWidth: 2,
                                        marginBottom: 10,
                                        backgroundColor: theme.colors.white,
                                        borderColor: theme.colors.lightBlue,
                                        borderRadius: 10,
                                        elevation: 5,
                                        flexDirection: 'row', 
                                        width: width * 0.70, 
                                        height: 50, paddingHorizontal: 10, 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                      }}
                                      onPress={() => handleSelectCountry(item)}>
                                      <StyledText color="blue" fontSize="normal" fontWeight="bold">{item.value}</StyledText>
                                    </TouchableOpacity>
                                  ))
                                }
                              </View>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <TextInput
                      onChangeText={(value) => handleRegisterChange("email", value)}
                      placeholder='Correo'
                      outlineColor={theme.colors.blue}
                      textColor={theme.colors.blue}
                      selectTextOnFocus={true}
                      outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                      activeOutlineColor={theme.colors.blue}
                      mode="outlined"
                    />
                    <HelperText type="error" padding="normal" 
                      visible={registerError.email}
                    >
                      Direccion de correo invalida!
                    </HelperText>
                    <TextInput
                      onChangeText={(value) => handleRegisterChange("passwordFirst", value)}
                      secureTextEntry={!pwdVisible.registerPwd}
                      placeholder='Contraseña' 
                      outlineColor={theme.colors.blue}
                      textColor={theme.colors.blue}
                      selectTextOnFocus={true}
                      outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                      activeOutlineColor={theme.colors.blue}
                      mode='outlined' 
                      right={
                        <TextInput.Icon icon={!pwdVisible.registerPwd ? "eye" : "eye-off"} onPress={
                          () => setPwdVisible({...pwdVisible, registerPwd: !pwdVisible.registerPwd})
                        }/>
                      }
                    />
                    <HelperText type={registerError.passwordFirst ? "error" : "info"} padding="normal" 
                      visible={registerError.passwordFirst}
                    >
                      La contraseña debe contener: (A, a, 1, ?)
                    </HelperText>
                    <TextInput
                      onChangeText={(value) => handleRegisterChange("passwordSecond", value)}
                      secureTextEntry={!pwdVisible.registerSecondPwd}
                      placeholder='Repita la contraseña' 
                      outlineColor={theme.colors.blue}
                      textColor={theme.colors.blue}
                      selectTextOnFocus={true}
                      outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                      activeOutlineColor={theme.colors.blue}
                      mode='outlined' 
                      right={
                        <TextInput.Icon icon={!pwdVisible.registerSecondPwd ? "eye" : "eye-off"} onPress={
                          () => setPwdVisible({...pwdVisible, registerSecondPwd: !pwdVisible.registerSecondPwd})
                        }/>
                      }
                    />
                    <HelperText type="error" padding="normal" 
                      visible={registerError.passwordSecond}
                    >
                      La contraseña debe ser igual a la primera
                    </HelperText>
                  </View>
                )
            }
          </View>
          <View style={{marginBottom: 10, alignItems: 'center'}}>
            <HelperText type='error' padding='normal' visible={submitError.error}>
              {submitError.message.toString()}
            </HelperText>
          </View>
          <TouchableOpacity 
            onPress={() => {
              value === "Iniciar Sesion"
                ? login()
                : register()
            }}
            style={styles.buttom}
          >
            <StyledText color="white" fontSize="medium" fontWeight="bold">
              {loading ? <Loader loading={loading} color={theme.colors.white} size={"small"}/> : value}
            </StyledText>
          </TouchableOpacity>
        </View>

      </View>
    </>
  )
}

export default Login

const {width, height} = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBlue,
    marginTop: Constants.statusBarHeight,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3, // Sombras
    padding: 16,
    width: width * 0.9, // Ancho del 90% de la pantalla
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center', // Centra horizontalmente
    top: height * 0.1, // Centra verticalmente en el 25% de la pantalla
  },
  tabs: {
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 200,
    elevation: 3,
  },
  tabsContent: {
    flex: 1, 
    gap: 1,
    justifyContent: 'center',
  },
  buttom: {
    backgroundColor: theme.colors.blue,
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
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
    height: height * 0.40,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
})