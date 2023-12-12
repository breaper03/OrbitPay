import { StyleSheet, View, Dimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { TextInput, HelperText } from "react-native-paper"
import Constants from 'expo-constants';
import theme from '../theme'
import { StyledText } from '../components'
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';

const ResetPassword = () => {

  const [pwdVisible, setPwdVisible] = useState({
    firstPwd: false,
    secondPwd: false,
  });

  const [pwdError, setPwdError] = useState({
    passwordFirst: false,
    passwordSecond: false,
  });

  const [submitError, setSubmitError] = useState({
    error: false,
    message: ""
  })

  const [loading, setLoading] = useState(false)

  const [formValue, setFormValue] = useState({
    passwordFirst: undefined,
    passwordSecond: undefined
  });

  const handleChange = (name, value) => {
    const obj = {...formValue, [name]: value}
    setFormValue(obj);
    console.log(obj)
  }

  const validateParams = () => {
    const { passwordFirst, passwordSecond } = formValue;
    const regexPwd = /^(?=.*[A-Z])(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,./?~-]){2}).{8,}$/;
  
    // Verificar que todos los campos estén llenos y cumplan con las expresiones regulares
    const isPasswordFirstValid = !!(passwordFirst !== undefined && regexPwd.test(passwordFirst));
    const isPasswordSecondValid = !!(passwordSecond !== undefined && passwordSecond === passwordFirst);

    // Actualizar el estado de los errores
    setPwdError({
      passwordFirst: !isPasswordFirstValid,
      passwordSecond: !isPasswordSecondValid,
    });
  };

  const checkErrors = () => Object.values(pwdError).some((value) => value === true);

  const onSubmit = async () => {
    setLoading(true)
    validateParams()
    const errors = checkErrors()
    console.log(errors)
    alert(`clave1: ${formValue.passwordFirst}, clave2: ${formValue.passwordSecond}`)

    // if (errors) {
    //   await handleRegister(formValueRegister)
    //     .catch((error) => {
    //       setSubmitError({error: true, message: error})
    //     })
    //     setValue("Contraseña cambiada correctamente")
    // }
    errors === false 
      ? setSubmitError({error: true, message: `Las contraseñas deben tener al menos 1 de los siguientes caracteres (A, a, 1, ?)
      `})
      : ""
    setLoading(false)
  }

  return (
    <>
      <StatusBar style='dark' backgroundColor={theme.colors.lightBlue}/>
      <View style={styles.container}>
        <View style={[styles.card]}>
          <View style={[styles.tabsContent]}>

            <View style={{alignItems: "center", marginBottom: 20}}>
              <StyledText fontSize="xl" color="blue" fontWeight="bold">
                Restablecer contraseña
              </StyledText>
            </View>
            
            <View style={styles.tabsContent}>
              <TextInput
                onChangeText={(value) => handleChange("passwordFirst", value) }
                secureTextEntry={!pwdVisible.firstPwd}
                placeholder='Contraseña'
                outlineColor={theme.colors.blue}
                textColor={theme.colors.blue}
                selectTextOnFocus={true}
                outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                activeOutlineColor={theme.colors.blue}
                mode='outlined' 
                right={
                  <TextInput.Icon icon={pwdVisible.loginPwd ? "eye" : "eye-off"} onPress={
                    () => setPwdVisible({...pwdVisible, firstPwd: !pwdVisible.firstPwd})
                  }/>
                }
              />
              <HelperText type="error" padding="normal" 
                visible={pwdError.passwordFirst}
              >
                Contraseña invalida!
              </HelperText>
              <TextInput
                onChangeText={(value) => handleChange("passwordSecond", value) }
                secureTextEntry={!pwdVisible.secondPwd}
                placeholder='Repita la Contraseña'
                outlineColor={theme.colors.blue}
                textColor={theme.colors.blue}
                selectTextOnFocus={true}
                outlineStyle={{borderRadius: 15, backgroundColor: theme.colors.white}}
                activeOutlineColor={theme.colors.blue}
                mode='outlined' 
                right={
                  <TextInput.Icon icon={pwdVisible.loginPwd ? "eye" : "eye-off"} onPress={
                    () => setPwdVisible({...pwdVisible, secondPwd: !pwdVisible.secondPwd})
                  }/>
                }
              />
              <HelperText type="error" padding="normal" 
                visible={pwdError.passwordSecond}
              >
                La contraseñas deben ser iguales!
              </HelperText>
            </View>

          </View>
          <View style={{marginVertical: 10, alignSelf: 'center', height: 53}}>
            <StyledText fontSize="base" color="blue" fontWeight="bold">
              {submitError.message.toString()}
            </StyledText>
          </View>
          <TouchableOpacity 
            onPress={() => onSubmit()}
            style={styles.buttom}
          >
            <StyledText color="white" fontSize="medium" fontWeight="bold">
              {loading ? <Loader loading={loading} color={theme.colors.white} size={"small"}/> : "Restablecer Contraseña"}
            </StyledText>
          </TouchableOpacity>
        </View>

      </View>
    </>
  )
}

export default ResetPassword

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