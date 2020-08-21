import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignIn from '../screens/SignIn'
import ManagementTime from '../screens/ManagementTime'
import Splash from '../components/Splash'
import Settings from '../screens/Settings'
import Home from '../screens/Home'

import { AuthContext } from "../context/context";
import { connect } from 'react-redux'
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ManagementTimeStack = createStackNavigator();
const ManagementTimeStackScreen = () => (
    <ManagementTimeStack.Navigator
        headerMode="none">
        <ManagementTimeStack.Screen 
          name = "Gestion du temps" 
          component={ManagementTime}
        />
    </ManagementTimeStack.Navigator>
)
const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => (
    <SettingsStack.Navigator
      headerMode="none">
        <SettingsStack.Screen 
        name = "Settings" 
        component={Settings}/>
    </SettingsStack.Navigator>
)
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name = "Home" component={Home}/>
    </HomeStack.Navigator>
)
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
    <Tabs.Navigator
        tabBarOptions = {{
            showLabel: false,
            activeBackgroundColor : '#FF9800',
            style : {
              backgroundColor : "#008080"}
        }}
    >
        <Tabs.Screen 
          name = "ManagementTime" 
          component={ManagementTimeStackScreen}
          options={{
            tabBarIcon: () => (
            <FontAwesome5 name="user-clock" color= "white" size={30} />
            ),  
          }}
        />
        <Tabs.Screen
          name = "Home" 
          component={HomeStackScreen}
          options={{
            tabBarIcon: () => (
            <FontAwesome5 name="home" color= "white" size={30} />
            ),  
          }}
        />
        <Tabs.Screen 
          name = "Settings" 
          component={SettingsStackScreen}
          options={{
            tabBarIcon: () => (
            <FontAwesome5 name="cogs" color= "white" size={30} />
            ),  
          }}
        />
    </Tabs.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator 
    headerMode="none">
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({email, password}) => (
  <RootStack.Navigator headerMode="none">
    {email && password ? (
      <RootStack.Screen
        name="Management Time"
        component={TabsScreen}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false
        }}
      />
    )}
  </RootStack.Navigator>
);

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        isLoading: true,
    }
  }

    render(){
        return(
          <AuthContext.Provider>
              <NavigationContainer>
                  <RootStackScreen email={this.props.email} password={this.props.password}/>
              </NavigationContainer>
          </AuthContext.Provider>
        )
    }
}
const mapStateToProps = (state) => {
  return {
      email: state.emailReducer.email,
      password: state.passwordReducer.password
  }
}

export default connect(mapStateToProps, {emailAction, passwordAction}) (Navigation)

