import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import theme from '../theme'

const Loader = ({loading, color, size}) => {
  return (
    <View style={{display: `${loading ? "flex" : "none"}`}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loader