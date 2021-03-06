import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SignIn from "../screens/SignIn";
import ManagementTime from "../screens/ManagementTime";
import About from "../screens/About";
import DrawerComponent from "../component/DrawerComponent";
import Password from "../screens/Password";
import Settings from "../screens/Settings";
import { AuthContext } from "../context/context";
import { connect } from "react-redux";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { langueAction } from "../redux/actions/langueAction";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Confidential from "../screens/Confidential";
import InitialComponent from "../component/InitialComponent";

const ManagementTimeStack = createStackNavigator();
const ManagementTimeStackScreen = ({ navigation }) => (
    <ManagementTimeStack.Navigator>
        <ManagementTimeStack.Screen
            name="Gestion du temps"
            component={ManagementTime}
            options={({}) => ({
                title: "Niva - Gestion du temps",
                headerStyle: {
                    backgroundColor: "#31859C",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerLeft: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRight: () => <InitialComponent nav={navigation} />,
                headerLeftContainerStyle: {
                    marginLeft: 20,
                },
            })}
        />
    </ManagementTimeStack.Navigator>
);

const ParameterStack = createStackNavigator();
const ParameterStackScreen = ({ navigation }) => (
    <ParameterStack.Navigator>
        <ParameterStack.Screen
            name="Paramètre"
            component={Settings}
            options={{
                title: "Niva - Paramètres",
                headerStyle: {
                    backgroundColor: "#31859C",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",

                headerLeft: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerLeftContainerStyle: {
                    marginLeft: 20,
                },
            }}
        />
        <ParameterStack.Screen
            name="Mot de passe"
            component={Password}
            options={{
                title: "Niva - Mot de passe",
                headerStyle: {
                    backgroundColor: "#31859C",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerLeft: () => <FontAwesome5 onPress={() => navigation.navigate("Paramètre")} name="arrow-left" color="white" size={23} />,
                headerLeftContainerStyle: {
                    marginLeft: 20,
                },
            }}
        />
    </ParameterStack.Navigator>
);

const AboutStack = createStackNavigator();
const AboutStackScreen = ({ navigation }) => (
    <AboutStack.Navigator>
        <AboutStack.Screen
            name="A propos"
            component={About}
            options={{
                title: "Niva - À propos",
                headerStyle: {
                    backgroundColor: "#31859C",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerLeft: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRight: () => <InitialComponent nav={navigation} />,
                headerLeftContainerStyle: {
                    marginLeft: 20,
                },
            }}
        />
    </AboutStack.Navigator>
);

const ConfidentialStack = createStackNavigator();
const ConfidentialStackScreen = ({ navigation }) => (
    <ConfidentialStack.Navigator>
        <ConfidentialStack.Screen
            name="Confidentialite"
            component={Confidential}
            options={{
                title: "Niva - Confidentialite",
                headerStyle: {
                    backgroundColor: "#31859C",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerLeft: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRight: () => <InitialComponent nav={navigation} />,
                headerLeftContainerStyle: {
                    marginLeft: 20,
                },
            }}
        />
    </ConfidentialStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator headerMode="none">
        <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In" }} />
    </AuthStack.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
    <Drawer.Navigator initialRouteName="Gestion du temps" drawerContent={(props) => <DrawerComponent {...props} />}>
        <Drawer.Screen name="Gestion du temps" component={ManagementTimeStackScreen} />
        <Drawer.Screen name="Parametre" component={ParameterStackScreen} />
        <Drawer.Screen name="A propos" component={AboutStackScreen} />
        <Drawer.Screen name="Confidentialite" component={ConfidentialStackScreen} />
    </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ email, password }) => (
    <RootStack.Navigator headerMode="none">
        {email && password ? <RootStack.Screen name="Management Time" component={DrawerScreen} options={{ animationEnabled: false }} /> : <RootStack.Screen name="Auth" component={AuthStackScreen} options={{ animationEnabled: false }} />}
    </RootStack.Navigator>
);

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    render() {
        return (
            <AuthContext.Provider value={this.props}>
                <NavigationContainer>
                    <RootStackScreen email={this.props.email} password={this.props.password} navigation={this.props.navigation} />
                </NavigationContainer>
            </AuthContext.Provider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue,
    };
};

export default connect(mapStateToProps, { emailAction, passwordAction, langueAction })(Navigation);
