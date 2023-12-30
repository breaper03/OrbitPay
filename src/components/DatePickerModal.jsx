import { useEffect, useState } from 'react';
import { StyleSheet, Modal, Dimensions, View, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-ui-datepicker';
import theme from '../theme';
import dayjs from 'dayjs';
import { StyledText } from "../components"

const DatePickerModal = ({value, onValueChange, error}) => {
  useEffect(() => {
    getTomorrowDate()
  }, [])

  const [modalVisible, setModalVisible] = useState(false)
  const [tomorrowDate, setTomorrowDate] = useState()
  
  function getTomorrowDate() {
    // Get the current date
    const currentDate = dayjs().add(1, "day");
  
    // Add one day to get tomorrow's date
    const tomorrowDate = currentDate.add(1, 'day');
  
    // Format the date in the desired format (DD-MM-YYYY)
    const dateFormat = 'YYYY-DD-MM';
    const formattedTomorrowDate = tomorrowDate.format(dateFormat);
  
    setTomorrowDate(formattedTomorrowDate)
  }


  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, gap: 1}}>
              <DatePicker
                value={value}
                mode="date"
                onValueChange={(value) => onValueChange(value)}
                selectedItemColor={theme.colors.blue}
                minimumDate={dayjs().locale("es").add(-15, 'days')}
                firstDayOfWeek={1}
                todayContainerStyle={{backgroundColor: theme.colors.lightBlue}}
                todayTextStyle={{color: theme.colors.blue}}
                displayFullDays
                headerTextStyle={{color: theme.colors.blue, fontWeight: "700", letterSpacing: 0.75}}
                headerButtonStyle={{borderWidth: 2, borderColor: theme.colors.blue, borderRadius: 100, padding: 6, backgroundColor: theme.colors.blue}}
                headerButtonColor='white'
                headerButtonSize={15}
                maximumDate={dayjs().add(-4, 'hours').add(1, 'day')}
                weekDaysTextStyle={{backgroundColor: theme.colors.lightBlue, paddingHorizontal: 5, paddingVertical: 2.5, borderRadius: 109}}
                yearContainerStyle={{borderColor: "blue"}}
                locale="es"
              />
              </View>
              <TouchableOpacity 
                style={{backgroundColor: theme.colors.blue, paddingVertical: 10, width: "70%", alignItems: 'center', borderRadius: 100, marginBottom: 10}}
                onPress={() => setModalVisible(false)}  
              >
                <StyledText color={"white"} fontWeight={"bold"} fontSize={"medium"}>Aceptar</StyledText>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={{width: "100%", height: height * 0.0765, borderRadius: 5, borderWidth: +`${error ? 2 : 1}`, borderColor: `${error ? theme.colors.red : theme.colors.blue}`, alignItems: 'flex-start', paddingLeft: 15.5, justifyContent: 'center'}}
      >
        <StyledText color={"darkGray"} fontSize={"medium"} fontWeight={value ? "bold" : ""}>{value === undefined ? "Fecha" : value}</StyledText>
      </TouchableOpacity>
    </>
  )
}

export default DatePickerModal

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    gap: 10,
    flexDirection: 'column',
    height: height * 0.56,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    borderRadius: 10,
  },
})