import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { emailAction } from '../redux/actions/emailAction';
import { passwordAction } from '../redux/actions/passwordAction';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Switch } from 'react-native-paper';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import * as Animatable from 'react-native-animatable';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class Settings extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            switchOn: false,
            title_message: '',
            text_localisation: '',
            text_localisation_active: '',
            text_localisation_desactive: '',
            text_password: ''
        }
        //Français
        if(this.props.langue === '100') {
            this.state.text_localisation_active = 'Localisation activé';
            this.state.text_localisation_desactive = 'Localisation désactivé';
            this.state.text_password = 'Mot de passe';
            this.props.navigation.setOptions({ title: 'Paramètres' });
        }
        //Allemand
        if(this.props.langue === '109') {
            this.state.text_localisation_active = 'Lage aktiviert';
            this.state.text_localisation_desactive = 'Lage deaktiviert';
            this.state.text_password = 'Passwort';
            this.props.navigation.setOptions({ title: 'Einstellungen' });
        }
        //Espagnol
        if(this.props.langue === '134') {
            this.state.text_localisation_active = 'Localización activado';
            this.state.text_localisation_desactive = 'Localización desactivado';
            this.state.text_password = 'Contraseña';
            this.props.navigation.setOptions({ title: 'Configuraciones' });
        }
        //Anglais
        if(this.props.langue === '132') {
            this.state.text_localisation_active = 'Location enabled';
            this.state.text_localisation_desactive = 'Location disabled';
            this.state.text_password = 'Password';
            this.props.navigation.setOptions({ title: 'Settings' });
        }
        //Italien
        if(this.props.langue === '127') {
            this.state.text_localisation_active = 'Posizione abilitato';
            this.state.text_localisation_desactive = 'Posizione disattivato';
            this.state.text_password = 'Parola d\'ordine';
            this.props.navigation.setOptions({ title: 'Impostazioni' });
        }
        //Néerlandais
        if(this.props.langue === '135') {
            this.state.text_localisation_active = 'Locatie ingeschakeld';
            this.state.text_localisation_desactive = 'Locatie uitgeschakeld';
            this.state.text_password = 'Wachtwoord';
            this.props.navigation.setOptions({ title: 'Instellingen' });
        }
    }

    componentDidMount() {
        this.getStatutLocalistation();
    }

    UNSAFE_componentWillMount() {
        this.getStatutLocalistation();
    }

    componentWillUnmount = () => {
        LocationServicesDialogBox.stopListener();
    }

    getStatutLocalistation = () => {
        Geolocation.getCurrentPosition((position) => {
            this.setState({
                switchOn: true,
                text_localisation: this.state.text_localisation_active
            });
        }, (error) => {
            this.setState({
                switchOn: false,
                text_localisation: this.state.text_localisation_desactive
            });
        });
    }

    requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted;
    }

    toggleSwitch = () => {
        Geolocation.getCurrentPosition((position) => {
            Alert.alert(
                "Désactivation de localisation",
                "Pour désactiver la localisation rendez vous dans les paramètres de votre téléphone.\n"+
                "Séléctionner ensuite la localisation par application.\n"+
                "Une fois que vous verrez l'application Niva dans la liste désactiver sa localisation.",
                [
                    { text: "OK" }
                ]
            );
        }, (error) => {
            this.requestLocationPermission().then(granted => {
                if(granted === PermissionsAndroid.RESULTS.GRANTED) 
                {
                    this.setState({
                        switchOn: true,
                        text_localisation: this.state.text_localisation_active
                    });
                }
            });
        });
        
      

        // console.log('Switch 1 is: ' + value)
        // if (value) {
        //     console.log('ici')
        //     LocationServicesDialogBox.checkLocationServicesIsEnabled({
        //         message: "<h3>Activer le GPS pour la localiation ?</h3>",           
        //         ok: "OK",
        //         cancel: "NON, MERCI",
        //         enableHighAccuracy: true,
        //         showDialog: true,
        //         openLocationServices: true,
        //         preventOutSideTouch: false,
        //         preventBackClick: false,
        //         providerListener: true
        //     }).then(function(success) 
        //     { 
        //         this.setState({
        //             switch1Value : true
        //         })
        //     }.bind(this)
        //     ).catch((error) => {
        //         this.setState({
        //             switch1Value : false
        //         })
        //     });
        // } else {
        //     console.log('test')
        //     LocationServicesDialogBox.checkLocationServicesIsEnabled({
        //         message: "<h3>Desactiver le GPS pour la localiation ?</h3>",           
        //         ok: "OK",
        //         cancel: "NON, MERCI",
        //         enableHighAccuracy: true,
        //         showDialog: true,
        //         openLocationServices: true,
        //         preventOutSideTouch: false,
        //         preventBackClick: false,
        //         providerListener: true
        //     }).then(function(success) 
        //     { 
        //         this.setState({
        //             switch1Value : false
        //         })
        //     }.bind(this)
        //     ).catch((error) => {
        //         this.setState({
        //             switch1Value : true
        //         })
        //     });
        // }

    }

    onPressPassword = () => {
        this.props.navigation.navigate('Mot de passe');
    }
    
    onPressLocation = () => {
        this.props.navigation.navigate('Location');
    }

    render(){
        const { isSelected } = this.state
        return(
            <View style = { styles.container }>
                <Animatable.View animation = "bounceIn" style = { styles.container_header }>
                    <View style = { styles.container_logo_email }>
                        <View style = { styles.container_ico }>
                            <FontAwesome5 name='cogs' size = { 35 } color = '#008080' style = {{ padding:15 }}/>
                        </View>
                        <View style={ styles.container_email }>
                            <Text style = { styles.text_email }>{ this.props.email }</Text>
                        </View>
                    </View>
                </Animatable.View>
                <View style = { styles.container_body }>
                    <Animatable.View animation = "bounceIn" delay = { 300 }>
                        <TouchableOpacity style = { styles.button_body } onPress = { () => this.onPressPassword() }>
                            <FontAwesome5 name = "key" color = "black" size = { 20 }/>
                            <Text style = { styles.text_button }>{ this.state.text_password }</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation = "bounceIn" delay = { 600 }>
                        <TouchableOpacity style = { styles.button_body } onPress = { () => this.toggleSwitch() }>
                            <View style = { styles.button_localisation_left }>
                                <FontAwesome5 name = "map-marker-alt" color = "black" size = { 20 }/>
                                <Text style = { styles.text_button }>{ this.state.text_localisation }</Text>
                            </View>
                            <View style = { styles.button_localisation_right }>
                                <Switch value = { this.state.switchOn } onValueChange = { () => this.toggleSwitch() }/>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
    container_header : {
        flex : 1,
        padding: 10,
        paddingTop: 20
    },
    container_body : {
        flex : 2,
        padding: 10
    },
    container_logo_email: {
        flex: 1,
        padding: 20, 
        backgroundColor : '#008080',
        elevation: 5,
        borderRadius : 5,
        justifyContent: 'center',
        alignItems : "center"
    },
    container_email: {
        flex: 1,
        justifyContent: 'center'
    },
    container_ico: {
        backgroundColor : "#ECEFEC", 
        borderRadius : 50, 
        justifyContent : 'center',
        alignItems : 'center',
        height: 70
    },
    button_body : {
        padding: 30, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flexDirection : 'row',
        alignItems: 'center',
        marginBottom : 10
    }, 
    button_localisation_left: {
        flex: 2,
        flexDirection: 'row'
    },
    button_localisation_right: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    text_button: {
        fontSize : 16, 
        marginLeft : 15
    },
    text_email : {
        color : 'white',
        fontSize : 25
    },
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue
    }
}


export default connect(mapStateToProps, {emailAction, passwordAction}) (Settings)
