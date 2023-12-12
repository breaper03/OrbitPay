//framework
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
//other
import { Icon, Badge } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import StyledText from './StyledText';
//my
import theme from "../theme"

export default function StyledUserBar({user}) {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("UserDashboard")}
        style={{
          backgroundColor: theme.colors.blue, paddingVertical: 6, paddingHorizontal: 15, gap: 5, width: width * 0.4,
          borderRadius: 100, flexDirection:"row", alignItems: 'center', justifyContent:"space-between", 
        }}>
        <Icon name='user-alt' type='font-awesome-5' color={theme.colors.lightBlue} size={25}/>
        <StyledText color="white" fontWeight="extraBold" fontSize="sm">
          {user !== undefined ? user.username.toUpperCase() : ""}
        </StyledText>
        {
          user !== undefined && user.verification_status.name === "profile_verification_complete"
          ? <Icon type='octicon' name="verified" color={theme.colors.green} size={15}/>
          : <Icon type='octicon' name="unverified" color={theme.colors.gray} size={15}/>
        }
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderRadius: 100, flexDirection:"row", justifyContent:"center"
        }}
      >
        <Icon name='bell' type='material-community' color={theme.colors.blue} solid={true} size={30} />
        <Badge value="0" badgeStyle={{borderColor: "red"}} containerStyle={{right: 8}} status="error" size/>
      </TouchableOpacity>
    </View>
  )
}

const {width, height} = Dimensions.get("window") 

const styles = StyleSheet.create({
  container: {
    flex:1,
    overflow: 'scroll',
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  box: {
    flex: 1,
    minWidth: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between', 
    paddingLeft: 5,
    paddingRight: 1,
  },
  boxText: {
    textAlign: "right",
    fontSize: theme.fontSize.base,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeights.extraLight,
  },
})