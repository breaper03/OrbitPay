
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import Navigation from './src/components/Navigation';
import { NavigationContainer, useRoute } from '@react-navigation/native';

export default function App() {

  return (
    <>
      <SafeAreaProvider>
        <View style={{flex:1}}>
          <Navigation/>
        </View>
      </SafeAreaProvider>
    </>
  );
}
