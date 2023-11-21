import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native'
import { Icon } from '@rneui/themed';
import React, { useState } from 'react'
import {StyledText} from "../components"
import { Searchbar } from 'react-native-paper';
import { getCountries } from '../api/general/Countries';
import theme from '../theme';
import Loader from './Loader';

const Countries = ({onSelect}) => {

  const [countryModalView, setCountryModalView] = useState(false);

  const [countries, setCountries] = useState(undefined);
  const [filteredCountries, setFilteredCountries] = useState(undefined);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")

  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelectCountry = async (option) => {
    await onSelect(option)
    setTitle(option.name)
    setCountryModalView(false)
  }

  const handleGetCountries = async () => {
    setCountryModalView(true)
    if (countries === undefined) {
      setLoading(true)
      const {response} = await getCountries()
      setCountries(response)
      setLoading(false)
    }
  }

  const onChangeSearch = (query) => {
    setSearchQuery(query)
    if (searchQuery.length) {
      setLoading(true)
      const filtered = countries.filter((country) => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCountries(filtered)
      setLoading(false)
    }
  }

  const renderItem = ({item}) => (
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
      onPress={() => handleSelectCountry(item)}
    >
      <StyledText color="blue" fontSize="normal" fontWeight="bold">{item.name}</StyledText>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={{borderWidth: 2, borderColor: theme.colors.blue, borderRadius: 15, paddingVertical: 8, alignItems:'center', elevation: 3, backgroundColor: theme.colors.white, paddingHorizontal: 10}}
        onPress={() => handleGetCountries(true)}
      >
        <StyledText color="blue" fontWeight="bold" fontSize="normal">{title ? title : "Seleccione un pais:"}</StyledText>
      </TouchableOpacity>
      <Modal
        style={{position: 'absolute', zIndex: 1, flex: 1}}
        animationType="slide"
        transparent={false}
        visible={countryModalView}
        onRequestClose={() => setCountryModalView(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center', marginTop: 5}}>
              <TouchableOpacity onPress={() => setCountryModalView(false)} style={{backgroundColor: theme.colors.blue, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, elevation: 3}}>
                <Icon type='material-icons' name='chevron-left' color="white"/>
              </TouchableOpacity>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">Seleccione un pais:</StyledText>
            </View>
            <Searchbar
              theme={{roundness: 1, colors: {elevation: {level3: theme.colors.lightBlue}}}}
              rippleColor={theme.colors.blue}
              placeholder="Buscar pais..."
              onChangeText={onChangeSearch}
              
              onKeyPress={
                (e) => e.nativeEvent.key === "Backspace" && searchQuery.length <= 1 ? setCountries(countries) : ""
              }
              value={searchQuery}
            />
            <View style={{width: "100%", height: height * 0.52, justifyContent: 'center'}}>
              {
                loading 
                  ? (
                    <Loader loading={loading} color={theme.colors.blue} size={"large"}/>
                  ) : (
                    <FlatList
                      data={searchQuery.length > 0 ? filteredCountries : countries}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItem}
                    />
                  )
              }
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ) 
}

export default Countries

const {width, height} = Dimensions.get("window")

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
    height: height * 0.70,
    width: width * 0.80,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
})