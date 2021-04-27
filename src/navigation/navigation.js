import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SignIn from "../screens/SignIn";
import ManagementTime from "../screens/ManagementTime";
import About from "../screens/About";
import ManagementNoConnection from "../screens/ManagementNoConnection";
import DrawerComponent from "../component/DrawerComponent";
import Password from "../screens/Password";
import Location from "../screens/Location";
import Settings from "../screens/Settings";
import { AuthContext } from "../context/context";
import { connect } from "react-redux";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { langueAction } from "../redux/actions/langueAction";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import NetInfo from "@react-native-community/netinfo";
import Confidential from "../screens/Confidential";

const ManagementNoConnectionTimeStack = createStackNavigator();
const ManagementNoConnectionStackScreen = () => (
    <ManagementNoConnectionTimeStack.Navigator>
        <ManagementNoConnectionTimeStack.Screen
            name="Gestion du temps hors connection"
            component={ManagementNoConnection}
            options={{
                title: "Niva - Gestion du temps hors ligne",
                headerStyle: {
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        />
    </ManagementNoConnectionTimeStack.Navigator>
);

const ManagementTimeStack = createStackNavigator();
const ManagementTimeStackScreen = ({ navigation }) => (
    <ManagementTimeStack.Navigator>
        <ManagementTimeStack.Screen
            name="Gestion du temps"
            component={ManagementTime}
            options={{
                title: "Niva - Gestion du temps",
                headerStyle: {
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
                },
            }}
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
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
                },
            }}
        />
        <ParameterStack.Screen
            name="Mot de passe"
            component={Password}
            options={{
                title: "Niva - Mot de passe",
                headerStyle: {
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
                },
            }}
        />
        <ParameterStack.Screen
            name="Location"
            component={Location}
            options={{
                title: "Niva - Localisation GPS",
                headerStyle: {
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
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
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
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
                    backgroundColor: "#008080",
                },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => <FontAwesome5 onPress={() => navigation.toggleDrawer()} name="bars" color="white" size={23} />,
                headerRightContainerStyle: {
                    marginRight: 20,
                    marginTop: 5,
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
    <Drawer.Navigator initialRouteName="Gestion du temps" drawerPosition="right" drawerContent={(props) => <DrawerComponent {...props} />}>
        <Drawer.Screen name="Gestion du temps" component={ManagementTimeStackScreen} />
        <Drawer.Screen name="Parametre" component={ParameterStackScreen} />
        <Drawer.Screen name="A propos" component={AboutStackScreen} />
        <Drawer.Screen name="Confidentialite" component={ConfidentialStackScreen} />
    </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ email, password, connection }) => (
    <RootStack.Navigator headerMode="none">
        {connection ? (
            email && password ? (
                <RootStack.Screen name="Management Time" component={DrawerScreen} options={{ animationEnabled: false }} />
            ) : (
                <RootStack.Screen name="Auth" component={AuthStackScreen} options={{ animationEnabled: false }} />
            )
        ) : (
            <RootStack.Screen name="ManagementNoTimeConnection" component={ManagementNoConnectionStackScreen} options={{ animationEnabled: false }} />
        )}
    </RootStack.Navigator>
);

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            etatConnection: null,
        };
    }

    UNSAFE_componentWillMount() {
        NetInfo.addEventListener((state) => {
            this.setState({
                etatConnection: state.isConnected,
            });
        });
    }

    render() {
        return (
            <AuthContext.Provider value={this.props}>
                <NavigationContainer>
                    <RootStackScreen email={this.props.email} password={this.props.password} connection={this.state.etatConnection} navigation={this.props.navigation} />
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
