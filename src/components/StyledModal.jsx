import { Modal, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import Constants from 'expo-constants';
import StyledText from './StyledText'
import { Icon } from '@rneui/themed';
import React from 'react'
import theme from '../theme'

export default function StyledModal({visible, setVisible}) {
  
  return (
    <View
      blurRadius={visible ? 10 : 0}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', gap: 1}}>
              <StyledText style={{textAlign: "center", fontWeight: "bold", fontSize: theme.fontSize.medium, color: "gray", marginTop: 20}}>
                Esta seguro de que desea procesar la operacion</StyledText>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 50}}>
                <TouchableOpacity onPress={() => setVisible(false)} 
                  style={{
                    backgroundColor: theme.colors.blue,
                    elevation: 3,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 120
                  }}
                >
                  <StyledText fontSize="medium" fontWeight="bold" color="white">Aceptar</StyledText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(false)} 
                  style={{
                    backgroundColor: theme.colors.white,
                    elevation: 3,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 120
                  }}
                >
                  <StyledText fontSize="medium" fontWeight="bold" color="blue">Cancelar</StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    height: height * 0.18,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
})