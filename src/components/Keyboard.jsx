import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from '@rneui/themed'
import StyledText from "./StyledText"
import theme from '../theme'
import { useEffect, useState } from 'react'

const Keyboard = ({amount, setAmount, maxAmount}) => {

  const [maxAmounto, setmaxAmounto] = useState();

  useEffect(() => {
    setmaxAmounto(maxAmount)
  }, [maxAmount])
  

  const handleKeyPress = (key) => {
    const newAmount = parseFloat(amount) * 10 + parseInt(key) /100;

    // Verificar si excede el límite de 600,00
    const limitedAmount = Math.min(newAmount, maxAmount);

    // Actualizar el estado solo si el nuevo valor no excede el límite
    if (limitedAmount <= maxAmount) {
      setAmount(limitedAmount.toFixed(2));
    }
  };

  const handleBackspace = () => {
    const newAmount = parseFloat(amount) * 0.1;
    setAmount(newAmount.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.keyLines}>
          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("1")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">1</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("2")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">2</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("3")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">3</StyledText>
          </TouchableOpacity>
        </View>
        <View style={styles.keyLines}>
          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("4")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">4</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("5")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">5</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("6")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">6</StyledText>
          </TouchableOpacity>
        </View>
        <View style={styles.keyLines}>
          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("7")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">7</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("8")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">8</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("9")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">9</StyledText>
          </TouchableOpacity>
        </View>
        <View style={styles.keyLines}>
          <TouchableOpacity style={styles.keys} onPress={() => setAmount("0,00")}>
            <Icon type="material-icons" name="delete-forever" style={styles.keys} size={30} color={theme.colors.blue}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleKeyPress("0")}>
            <StyledText fontSize="xxxl" fontWeight="bold" color="blue">0</StyledText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keys} onPress={() => handleBackspace()}>
            <Icon type="material-icons" name="backspace" style={styles.keys} size={25} color={theme.colors.blue}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Keyboard

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: "100%",
    borderRadius: 15,
    flexDirection: 'row',
    padding: 5
  },
  box: {
    flexDirection: 'column',
    flex: 1
  },
  keyLines: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  lastKeyLines: {

  },
  keys: { 
    backgroundColor: theme.colors.lightBlue,
    width: 80.106,
    height: 58.614,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 3,
    fontSize: theme.fontSize.xxxxl,
    fontWeight: theme.fontWeights.extraBold
  }
})