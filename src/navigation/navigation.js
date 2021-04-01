import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';

import SignIn from '../screens/SignIn'
import ManagementTime from '../screens/ManagementTime'
import ManagementNoConnection from '../screens/ManagementNoConnection'
import DrawerComponent from '../component/DrawerComponent'

// import DeletScreenComponent from '../component/DeletScreenComponent'

// import Settings from '../screens/Settings'
// import Home from '../screens/Home'

import { AuthContext } from "../context/context";
import { connect } from 'react-redux'
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NetInfo from "@react-native-community/netinfo";

const ManagementNoConnectionTimeStack = createStackNavigator();
const ManagementNoConnectionStackScreen = () => (
    <ManagementNoConnectionTimeStack.Navigator
        headerMode="none">
        <ManagementNoConnectionTimeStack.Screen 
          name = "Gestion du temps hors connection" 
          component={ManagementNoConnection}
        />
    </ManagementNoConnectionTimeStack.Navigator>
)

const ManagementTimeStack = createStackNavigator();
const ManagementTimeStackScreen = ({navigation}) => (
    <ManagementTimeStack.Navigator>
        <ManagementTimeStack.Screen 
          name = "Gestion du temps" 
          component={ManagementTime}
          options = {{
            title : 'Niva® - Gestion du temps',
            headerStyle : {
              backgroundColor : '#008080',
            },
            headerTintColor : '#fff',
            headerTitleAlign : 'center',
            headerTitleStyle : {
              fontWeight: 'bold'
            },
            headerRight: () => (
              <FontAwesome5 
                  onPress={() => navigation.toggleDrawer()}
                  name="bars" 
                  color= "white" 
                  size={23} 
              />
            ),
            headerRightContainerStyle : {
              padding : 20,
              marginTop : 5
            }
          }}
        />
    </ManagementTimeStack.Navigator>
)

// const SettingsStack = createStackNavigator();
// const SettingsStackScreen = () => (
//     <SettingsStack.Navigator
//       headerMode="none">
//         <SettingsStack.Screen 
//         name = "Settings" 
//         component={deconnexionr}/>
//     </SettingsStack.Navigator>
// )

// const HomeStack = createStackNavigator();
// const HomeStackScreen = () => (
//     <HomeStack.Navigator>
//         <HomeStack.Screen name = "Home" component={Home}/>
//     </HomeStack.Navigator>
// )

// const MyModalBackgroundScreen = () => {
//   return null;
// };

// const Tabs = createBottomTabNavigator();
// const TabsScreen = () => (
//     <Tabs.Navigator
//         tabBarOptions = {{
//             showLabel: false,
//             activeBackgroundColor : '#FF9800',
//             style : {
//               backgroundColor : "#008080"}
//         }}
//     >
//         <Tabs.Screen 
//           name = "ManagementTime" 
//           component={ManagementTimeStackScreen}
//           options={{
//             tabBarIcon: () => (
//             <FontAwesome5 name="user-clock" color= "white" size={30} />
//             ),  
//           }}
//         />
//         <Tabs.Screen 
//           name = "Settings" 
//           component={MyModalBackgroundScreen}
//           options={{
//             // tabBarLabel:() => {return null},
//             tabBarIcon: () => (
//             <FontAwesome5 name="cogs" color= "white" size={30} />
//             ),  
//             tabBarButton : () => (<DeletScreenComponent/>)
//           }}
//         />
//     </Tabs.Navigator>
// );

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

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Gestion du temps" drawerPosition = "right" drawerContent= { props => <DrawerComponent {...props}/>}>
    <Drawer.Screen name="Gestion du temps" component={ManagementTimeStackScreen}/>
  </Drawer.Navigator>
); 

const RootStack = createStackNavigator();
const RootStackScreen = ({email, password, connection}) => (
  <RootStack.Navigator headerMode="none">
    {
      connection ? (
        email && password ? (
          <RootStack.Screen
            name="Management Time"
            component={DrawerScreen}
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
        )
      ) : (
          <RootStack.Screen
            name="ManagementNoTimeConnection"
            component={ManagementNoConnectionStackScreen}
            options={{
              animationEnabled: false
            }}
          />
      )
    }
  </RootStack.Navigator>
);

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        isLoading: true,
        etatConnection : null,
    }
  }
  
  UNSAFE_componentWillMount() {
      NetInfo.addEventListener(state => {
        this.setState({
          etatConnection : state.isConnected
        })
    });
  }
    render(){
        return(
          <AuthContext.Provider>
              <NavigationContainer>
                  <RootStackScreen email={this.props.email} password={this.props.password} connection = {this.state.etatConnection} navigation = {this.props.navigation}/>
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

