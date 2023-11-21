import { StyleSheet, Text, View } from 'react-native'
import Loader from '../components/Loader'
import { useUser } from "../context/UserContext"
import { useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import theme from '../theme'

const LoadingScreen = () => {
  const { initialScreen, user } = useUser();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const determineInitialScreen = () => {
      if (initialScreen === "Loading") {
        setLoading(true);
      } else {
        navigation.navigate(initialScreen);
      }
    };
    determineInitialScreen();
  }, [initialScreen]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {initialScreen === 'Loading' && <Loader loading={loading} color={theme.colors.blue} size={"large"}/>}
    </View>
  );
};

export default LoadingScreen

const styles = StyleSheet.create({})