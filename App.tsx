
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import Navigation from './src/components/Navigation';
import { UserProvider } from './src/context/UserContext';

export default function App() {

  return (
    <>
      <SafeAreaProvider>
        <View style={{flex:1}}>
          <UserProvider>
            <Navigation/>
          </UserProvider>
        </View>
      </SafeAreaProvider>
    </>
  );
}
