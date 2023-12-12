import React from 'react'
import { Text, StyleSheet } from 'react-native'

import theme from "../theme.js"
const StyledText = ({
  children,
  fontSize,
  fontWeight,
  color,
  ...restOfProps
}) => {

  const textStyles = [
    fontSize === "xxs" && styles.xxs,
    fontSize === "xs" && styles.xs,
    fontSize === "sm" && styles.sm,
    fontSize === "base" && styles.base,
    fontSize === "medium" && styles.medium,
    fontSize === "lg" && styles.lg,
    fontSize === "xl" && styles.xl,
    fontSize === "xxl" && styles.xxl,
    fontSize === "xxxl" && styles.xxxl,
    fontWeight === "extraLight" && styles.extraLight,
    fontWeight === "light" && styles.light,
    fontWeight === "normal" && styles.normal,
    fontWeight === "bold" && styles.bold,
    fontWeight === "extraBold" && styles.extraBold,
    color === "white" && styles.white,
    color === "blue" && styles.blue,
    color === "black" && styles.black,
    color === "red" && styles.red,
    color === "green" && styles.green,
    color === "gray" && styles.gray,
    color === "lightRed" && styles.lightRed,
    color === "blurBlue" && styles.blurBlue,
  ]

  return (
    <Text style={textStyles} {...restOfProps} >
      {children}
    </Text>
  )
}

export default StyledText

const styles = StyleSheet.create({
  // Size
  xxs: {
    fontSize: theme.fontSize.xxs,
  },
  xs: {
    fontSize: theme.fontSize.xs
  },
  sm: {
    fontSize: theme.fontSize.sm
  },
  base: {
    fontSize: theme.fontSize.base
  },
  medium: {
    fontSize: theme.fontSize.medium
  },
  lg: {
    fontSize: theme.fontSize.lg
  },
  xl: {
    fontSize: theme.fontSize.xl
  },
  xxl: {
    fontSize: theme.fontSize.xxl
  },
  xxxl: {
    fontSize: theme.fontSize.xxxl
  },

  // Weight
  extraLight: {
    fontWeight: '400'
  },
  light: {
    fontWeight: '500'
  },
  normal: {
    fontWeight: '600'
  },
  bold: {
    fontWeight:'700'
  },
  extraBold: {
    fontWeight: '800'
  },

  // Colors
  white: {
    color: theme.colors.white,
  },
  blue: {
    color: theme.colors.blue,
  },
  lightBlue: {
    color: theme.colors.lightBlue
  },
  blurBlue: {
    color: theme.colors.blurBlue
  },
  black: {
    color: theme.colors.black,
  },
  red: {
    color: theme.colors.red,
  },
  lightRed: {
    color: theme.colors.lightRed,
  },
  green: {
    color: theme.colors.green,
  },
  lightGreen: {
    color: theme.colors.lightGreen,
  },
  gray: {
    color: theme.colors.gray
  },
  lightGray: {
    color: theme.colors.lightgray
  }
})