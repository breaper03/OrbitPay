import React, { useState } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, Transactions, Pay, Send, Swap, Orbit, Resume, TransactionComplete } from '../screens'
import { View, Image, Keyboard } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import theme from '../theme'

const Tab = createBottomTabNavigator()

const screenOptions = {
  tabBarShowLabel:false,
  headerShown:false,
  backgroundColor: "transparent",
  tabBarStyle:{
    position: "absolute",
    height: 60,
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 100
  }
}

const Navigation = () => {

  const [menuShown, setMenuShown] = useState(true)
  
  // return (
  //   <Tab.Navigator screenOptions={screenOptions}>
  //     <Tab.Screen 
  //       name="Home" 
  //       component={MyStack} 
  //       options={{
  //         tabBarIcon: ({focused}) => (
  //           <View 
  //             style={{
  //               alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
  //               borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
                
  //             }}
  //             > 
  //             <Entypo name="home" size={24} color={focused ? theme.colors.white : theme.colors.blue} />
  //           </View>
  //         )
  //       }}
  //     />
  //     <Tab.Screen 
  //       name="Orbit" 
  //       component={Orbit} 
  //       options={({ route }) => ({
  //         tabBarIcon: ({focused}) => (
  //           <View 
  //             style={{
  //               alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
  //               borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
  //               flexDirection: 'row'
                
  //             }}
  //             > 
  //             {
  //               !focused 
  //                 ? <Image source={require("../../assets/Orbit.png")} style={{top: 4}}/>
  //                 : <Image source={require("../../assets/OrbitNegative.png")} style={{top: 4}}/>
  //             }
  //           </View>
  //         ),
  //         tabBarVisible: route.state && route.state.index === 1
  //       })}
  //     />
  //     <Tab.Screen 
  //       name="Transactiones" 
  //       component={Transactions} 
  //       options={{
  //         tabBarIcon: ({focused})=>(
  //           <View
  //           style={{
  //             alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
  //             borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
  //           }}
  //           > 
  //             <FontAwesome name="exchange" size={24} color={focused ? theme.colors.white: theme.colors.blue} />
  //           </View>
  //         ),
  //       }}
  //       />
  //   </Tab.Navigator>
  // )

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {() => (
            <Tab.Navigator screenOptions={screenOptions} initialRouteName='Home'>
              <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{
                  tabBarIcon: ({focused}) => (
                    <View 
                      style={{
                        alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
                        borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
                        
                      }}
                      > 
                      <Entypo name="home" size={24} color={focused ? theme.colors.white : theme.colors.blue} />
                    </View>
                  )
                }}
              />
              <Tab.Screen 
                name="Orbit" 
                component={Orbit} 
                options={({ route }) => ({
                  tabBarIcon: ({focused}) => (
                    <View 
                      style={{
                        alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
                        borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
                        flexDirection: 'row'
                        
                      }}
                      > 
                      {
                        !focused 
                          ? <Image source={require("../../assets/Orbit.png")} style={{top: 4}}/>
                          : <Image source={require("../../assets/OrbitNegative.png")} style={{top: 4}}/>
                      }
                    </View>
                  ),
                  tabBarVisible: route.state && route.state.index === 1
                })}
              />
              <Tab.Screen 
                name="Transactiones" 
                component={Transactions} 
                options={{
                  tabBarIcon: ({focused})=>(
                    <View
                    style={{
                      alignItems: "center", justifyContent: "center", backgroundColor: `${focused ? theme.colors.blue : "transparent"}`,
                      borderWidth: 2.5, borderRadius: 10, borderColor: `${focused ? theme.colors.blue : theme.colors.blurBlue}`, width: 45, height: 45,
                    }}
                    > 
                      <FontAwesome name="exchange" size={24} color={focused ? theme.colors.white: theme.colors.blue} />
                    </View>
                  ),
                }}
                />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        {/* hdhd */}
        <Stack.Screen 
          name="Pay" 
          component={Pay} 
        />
        <Stack.Screen 
          name="Send" 
          component={Send} 
        />
        <Stack.Screen 
          name="Swap" 
          component={Swap} 
        />
        <Stack.Screen 
          name="Resume" 
          component={Resume} 
        />
        <Stack.Screen 
          name="TransactionComplete" 
          component={TransactionComplete} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={Home}
      />
      <Stack.Screen 
        name="transactions" 
        component={Transactions} 
      />
      <Stack.Screen 
        name="Pay" 
        component={Pay} 
      />
      <Stack.Screen 
        name="Send" 
        component={Send} 
      />
      <Stack.Screen 
        name="Swap" 
        component={Swap} 
      />
      <Stack.Screen 
        name="Resume" 
        component={Resume} 
      />
      <Stack.Screen 
        name="TransactionComplete" 
        component={TransactionComplete} 
      />
    </Stack.Navigator>
  );
}

export default Navigation