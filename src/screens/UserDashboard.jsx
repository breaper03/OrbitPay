import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import {Icon} from "@rneui/themed"
import { StatusBar } from 'expo-status-bar'
import theme from '../theme'
import { useNavigation } from "@react-navigation/native"
import {useUser} from "../context/UserContext"

//styled components
import { StyledText } from '../components'

const UserDashboard = () => {

  const { user } = useUser();

  const navigation = useNavigation()

  return (
    <>
      <StatusBar style="dark" backgroundColor={theme.colors.lightBlue} hidden={false} translucent={true}/>
      <View style={[{ backgroundColor: theme.colors.lightBlue, height: "30%" }]}/>

        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.goBack}>
          <View style={styles.itemsGoBack}>
            <Icon type='material-icons' name='chevron-left' color={theme.colors.blue} size={55}/>
            <StyledText color="blue" fontSize="xxxl" fontWeight="bold">Inicio</StyledText>
          </View>
        </TouchableOpacity>

        <View style={[{ backgroundColor: theme.colors.lightBlue, height: "70%" }]} />

        {
          user !== undefined
            ? (
              <View 
                style={[styles.card, {backgroundColor: "transparent", top: height * 0.135, height: height * 0.63, justifyContent: 'space-between'}]}
              >
                <View style={[styles.card, {backgroundColor: "white", height: height * 0.13, elevation: 4, flexDirection:'row', gap: 10}]}>
                  <View style={{backgroundColor: theme.colors.blue, borderRadius: 100, alignItems: 'center', justifyContent: 'center', padding: 18}}>
                    <Icon name='user-alt' type='font-awesome-5' color={theme.colors.lightBlue} size={35}/>
                  </View>
                  <View style={{height: "100%", flexDirection: 'column'}}>
                    <StyledText fontSize="medium" fontWeight="bold" color="blue">{user.username}</StyledText>
                    <StyledText fontSize="normal" fontWeight="light" color="blue">{user.email}</StyledText>
                    {
                      user.verification_status.name === "profile_verification_complete"
                      ? (
                        <View style={{backgroundColor: theme.colors.lightGreen, borderRadius: 100, paddingVertical:2, paddingHorizontal:10, flexDirection: "row", alignItems: 'center', gap: 5, width: width * 0.26, marginTop: 5}}>
                          <StyledText fontSize="normal" fontWeight="bold" color="green">Verificado</StyledText>
                          <Icon type='octicon' name="verified" color={theme.colors.green} size={15}/>
                        </View> 
                      )
                      : (
                        <View style={{backgroundColor: theme.colors.lightgray, borderRadius: 100, paddingVertical:2, paddingHorizontal:10, flexDirection: "row", alignItems: 'center', gap: 5, width: width * 0.3, marginTop: 5}}>
                          <StyledText fontSize="normal" fontWeight="bold" color="gray">Sin Verificar</StyledText>
                          <Icon type='octicon' name="unverified" color={theme.colors.gray} size={15}/>
                        </View>
                      )
                    }
                  </View>
                </View>
                
                <View
                  style={[styles.card, {backgroundColor: "white", height: height * 0.435, top: height * 0.15, elevation: 4, gap: 5}]}
                >
                  <TouchableOpacity 
                    style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                    // onPress={navigation.navigate("Dashboard")}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}>
                      <Icon name='table' type='material-community' color={theme.colors.blue}/>
                      <StyledText fontWeight="light" color="blue" fontSize="medium">Tablero</StyledText>
                    </View>
                    <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                  </TouchableOpacity>
                  <View style={{width: "100%", borderColor: theme.colors.blue, borderWidth: 0.5}}/>
                  <TouchableOpacity 
                    style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                    // onPress={navigation.navigate("Dashboard")}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}>
                      <Icon name='swap-vertical-bold' type='material-community' color={theme.colors.blue}/>
                      <StyledText fontWeight="light" color="blue" fontSize="medium">Enviar / Criptos</StyledText>
                    </View>
                    <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                  </TouchableOpacity>
                  <View style={{width: "100%", borderColor: theme.colors.blue, borderWidth: 0.5}}/>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("BankAccounts")}
                    style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                  >
                    <View 
                      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}
                    >
                      <Icon name='account-balance-wallet' type='material-icons' color={theme.colors.blue}/>
                      <StyledText fontWeight="light" color="blue" fontSize="medium">Cuentas</StyledText>
                    </View>
                    <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                  </TouchableOpacity>
                  <View style={{width: "100%", borderColor: theme.colors.blue, borderWidth: 0.5}}/>
                  <TouchableOpacity 
                    style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                    // onPress={navigation.navigate("Dashboard")}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}>
                      <Icon name='hand-coin' type='material-community' color={theme.colors.blue}/>
                      <StyledText fontWeight="light" color="blue" fontSize="medium">Recibir FIAT</StyledText>
                    </View>
                    <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                  </TouchableOpacity>
                  <View style={{width: "100%", borderColor: theme.colors.blue, borderWidth: 0.5}}/>
                  <TouchableOpacity 
                    style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}>
                      <Icon name='sign-out-alt' type='font-awesome-5' color={theme.colors.blue}/>
                      <StyledText fontWeight="light" color="blue" fontSize="medium">Cerrar Sesion</StyledText>
                    </View>
                    <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                  </TouchableOpacity>
                </View>
                {
                  user.verification_status.name ===  "profile_verification_register"
                    ? (
                      <View
                        style={[styles.card, {backgroundColor: "white", height: height * 0.1, top: height * 0.6, elevation: 4, gap: 5}]}
                      >
                        <TouchableOpacity 
                          style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between'}}
                          onPress={() => navigation.navigate("CompleteRegister")}
                        >
                          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 15}}>
                            <Icon name='shield-account' type='material-community' color={theme.colors.blue}/>
                            <StyledText fontWeight="light" color="blue" fontSize="medium">Verificar Usuario</StyledText>
                          </View>
                          <Icon type='font-awesome-5' name='chevron-right' color={theme.colors.blue}/>
                        </TouchableOpacity>
                      </View>
                    )
                    : ""
                }
              </View>
            )
            : (
              <View style={[styles.card, {backgroundColor: "transparent", top: height * 0.135, height: height * 0.63, justifyContent: 'space-between'}]}>
                <TouchableOpacity 
                  style={{backgroundColor: theme.colors.blue}}
                  onPress={() => navigation.navigate("Dashboard")}>
                    <StyledText color="white" fontWeight="bold" fontSize="medium">Regresar al inicio</StyledText>
                  </TouchableOpacity>
              </View>
            )
        }

        <View >
          <StyledText fontWeight="light" color="blue" fontSize="medium">hello world</StyledText>
        </View>
    </>
  )
}

export default UserDashboard

const {width, height} = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  card: {
    borderRadius: 10,
    padding: 12,
    position: 'absolute',
    zIndex: 1,
    width: width * 0.9, // Ancho del 90% de la pantalla
    alignSelf: 'center', // Centra horizontalmente
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