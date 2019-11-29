import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Homescreen from './screens/Homescreen'
import Results from './screens/result'
import News from './screens/News'



const navigator = createStackNavigator(
  {
    Home: Homescreen,
    News: News,
    Results: Results

  },
  {

    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
        height: 30,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    navigationOptions: {
      tabBarLabel: 'Home!',
    },

  },







)

export default createAppContainer(navigator);