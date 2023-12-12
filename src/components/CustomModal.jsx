import { StyleSheet, Modal, View, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from "@rneui/themed"
import { Searchbar } from 'react-native-paper';
import { StyledText} from "../components"
import theme from '../theme'
import Loader from './Loader'

const CustomModal = ({disabled, content, title, selected, setSelected, widthButton, searchBar}) => {

  const [loading, setLoading] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")

  const [filteredContent, setFilteredContent] = useState()

  const handleSelect = (item) => {
    setSelected(item)
    setModalVisible(false)
  }


  const onChangeSearch = (query) => {
    setSearchQuery(query)
    if (searchQuery.length) {
      setLoading(true)
      const filtered = content.options.filter((element) => element.toLowerCase().includes(searchQuery.toLowerCase()))
      console.log(filtered)
      setFilteredContent(filtered)
      setLoading(false)
    }
  }

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
        height: 75, paddingHorizontal: 10, 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      <View style={{alignItems: 'center', borderBottomColor: theme.colors.blue, borderBottomWidth: 2, width: "80%", padding: 10}}>
        <StyledText fontSize="medium" fontWeight="bold" color="blue">{item}</StyledText>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        style={{width: widthButton, height: height * 0.0765, borderRadius: 5, borderWidth: +`${content.error ? 2 : 1}`, borderColor: `${content.error ? theme.colors.red : disabled ? theme.colors.gray : theme.colors.blue}`, alignItems: 'center', justifyContent: 'center'}}
      >
        <StyledText color={disabled ? "gray" : "blue"} fontSize="medium" fontWeight={selected ? "bold" : "extraLight"}>
          {title ? title : content.label}
        </StyledText>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {height: +`${searchBar ? height * 0.6 : height * 0.5}`}]}>
            <View style={{flexDirection: 'row', width: "100%", justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: theme.colors.blue, padding: 5, borderRadius: 100}}>
                <Icon type='material-icons' name='chevron-left' color="white"/>
              </TouchableOpacity>
              <StyledText fontSize="medium" fontWeight="bold" color="blue">{content && content.label}</StyledText>
              <StyledText fontSize="medium" fontWeight="bold" color="blue"></StyledText>
            </View>
            {
              !content.options
                ? <Loader loading={true} size={"large"} color={theme.colors.blue}/>
                : (
                  <>
                    {
                      searchBar
                        ? (
                          <Searchbar
                            theme={{roundness: 1, colors: {elevation: {level3: theme.colors.lightBlue}}}}
                            rippleColor={theme.colors.blue}
                            placeholder="Buscar..."
                            onChangeText={(e) => onChangeSearch(e)}
                            onKeyPress={
                              (e) => e.nativeEvent.key === "Backspace" && searchQuery.length <= 1 ? handleSelect(content) : ""
                            }
                            value={searchQuery}
                          />
                        ) : ""
                    }
                    <FlatList
                      data={searchQuery ? filteredContent : content.options}
                      keyExtractor={(item) => item.name}
                      renderItem={renderItem}
                    />
                  </>
                )
            }
          </View>
        </View>
      </Modal>
    </>
  )
}

export default CustomModal

const {height, width} = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    height: "100%",
    backgroundColor: theme.colors.blurBlue
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