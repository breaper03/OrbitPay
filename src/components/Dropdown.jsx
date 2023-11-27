import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, FlatList, Dimensions } from 'react-native';
import theme from '../theme';
import StyledText from './StyledText';
import { Icon } from '@rneui/themed';
import { useUser } from "../context/UserContext"


const {width, height} = Dimensions.get('window')

const Dropdown = ({ data, onSelect, selected }) => {

  const {transactions} = useUser()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      if (!transactions) {
          return await handleUserBalance()
            .then((data) => {
              setLoading(false);
            })
            .catch((error) => {
              console.log("errorStyledTable", error)
              setLoading(false);
            })
        } else {
          setLoading(false);
        }
    }
    getTransactions()
  }, [transactions])

  const [modalVisible, setModalVisible] = useState(false);
  const [titleButton, setTitleButton] = useState()

  const handleSelect = async (item) => {
    await onSelect(item);
    setTitleButton(item)
    setModalVisible(false)
    setModalVisible(false);
  };

  const transformedArray = (number) => {
    // Eliminar signo '-' y reemplazar ',' por '.'
    const formattedNumber = number.replace('-', '').replace(',', '.');
  
    // Redondear a 7 decimales
    const roundedNumber = Number(formattedNumber).toFixed(7);
  
    return roundedNumber.replace("-", "");
  }

  const fixTotalInDolar = (numero) => {
    // Convierte el número a un string con dos decimale
    const numeroFormateado = Number(numero).toFixed(2);
  
    // Asegura que el número nunca sea negativo
    const plusNumber = numeroFormateado < 0 ? "0.00" : numeroFormateado;  
    return plusNumber;
  };

  const renderItem = ({item}) => (
      <TouchableOpacity 
        onPress={() => handleSelect(item)} 
        style={{
          borderWidth: 2,
          marginBottom: 10,
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.lightBlue,
          borderRadius: 10,
          elevation: 3,
          flex: 1,
          flexDirection: 'row', 
          width: width * 0.75, 
          height: 50, paddingHorizontal: 10, 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
          <View >
            <Image source={{uri: `${item.currency_icon_path}`}} width={20} height={20}/>
          </View>
          <View>
            <StyledText fontSize="base" fontWeight="light" color="blue">{item.currency_name}</StyledText>
            <StyledText fontSize="xs" fontWeight="light" color="blue">{item.currency_symbol}</StyledText>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <StyledText fontSize="normal" fontWeight="base" color="blue">{transformedArray(item.total)}</StyledText>
          <StyledText fontSize="medium" fontWeight="bold" color="blue">$ {fixTotalInDolar(item.total_in_usd).replace("-", "")}</StyledText>
        </View>
      </TouchableOpacity>
    )

  return (    
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={titleButton ? {} : styles.button}>
          {
            !titleButton
              ? <StyledText color="blue" fontWeight="bold" fontSize="base">Seleccione una moneda</StyledText>
              : (
                  <View
                    style={{
                      borderWidth: 2,
                      marginBottom: 10,
                      backgroundColor: theme.colors.white,
                      borderColor: theme.colors.lightBlue,
                      borderRadius: 10,
                      elevation: 3,
                      // flex: 1,
                      flexDirection: 'row', 
                      width: width * 0.75, 
                      height: 50, paddingHorizontal: 10, 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                    }}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
                      <View>
                        <Image source={{uri: `${titleButton.currency_icon_path}`}} width={20} height={20}/>
                      </View>
                      <View>
                        <StyledText fontSize="base" fontWeight="light" color="blue">{titleButton.currency_name}</StyledText>
                        <StyledText fontSize="xs" fontWeight="light" color="blue">{titleButton.currency_symbol}</StyledText>
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <StyledText fontSize="normal" fontWeight="base" color="blue">{transformedArray(titleButton.total)}</StyledText>
                      <StyledText fontSize="medium" fontWeight="bold" color="blue">$ {fixTotalInDolar(titleButton.total_in_usd).replace("-", "")}</StyledText>
                    </View>
                  </View>
                )
          }
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{backgroundColor: theme.colors.blue, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, elevation: 3}}>
                {/* <StyledText color="white" fontWeight="bold" fontSize="base">Atras</StyledText> */}
                <Icon type='material-icons' name='chevron-left' color="white"/>
              </TouchableOpacity>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">Seleccione una moneda:</StyledText>
            </View>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.coin}
              renderItem={renderItem}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Dropdown

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    elevation: 9
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
    height: height * 0.5,
    width: width * 0.85,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  flatList: {
    flex: 1,
    backgroundColor: "red",
  }
});
