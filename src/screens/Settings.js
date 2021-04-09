import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { emailAction } from '../redux/actions/emailAction'
import { passwordAction } from '../redux/actions/passwordAction'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Switch } from 'react-native-paper';
import SwitchExample from '../component/switch_example'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

class Settings extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            switch1Value: false,
            isSelected : false
         }
    }
    componentWillUnmount = () => {
        LocationServicesDialogBox.stopListener();
    }

    toggleSwitch1 = (value) => {
        this.setState({switch1Value: value})
        console.log('Switch 1 is: ' + value)
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
        this.props.navigation.navigate('Mot de passe')
    }
    onPressLocation = () => {
        this.props.navigation.navigate('Location')
    }
    render(){
        const { isSelected } = this.state
        return(
            <View style={ styles.container }>
                <View style={ styles.container_header }>     
                    {/* <View style={ styles.container_text_name }>
                        <Text style={ styles.text_name }>{ this.props.email }</Text>
                    </View> */}
                    <View style={ styles.container_logo_user }>
                        <TouchableOpacity style={ styles.button_logo_user }>
                            <FontAwesome5 
                                name='cogs' 
                                size={ 45 } 
                                color='#008080'>
                            </FontAwesome5>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={ styles.container_body }>
                    {/* <View style={ styles.container_button_logoutModif }>
                        <TouchableOpacity onPress={ () => this.changePassword() }>
                            <LinearGradient
                                colors={ ["#008080", "#008080"] }
                                style={ styles.button }>
                                <Text style={ styles.text_logout }>Modifier Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>  
                    </View> */}
                {/* <View>
                    <SwitchExample
                        toggleSwitch1 = {this.toggleSwitch1}
                        switch1Value = {this.state.switch1Value}/>
                </View> */}
                    <View style = {{flex :1, padding : 10}}>
                        <TouchableOpacity 
                            style={styles.touchablePassword}  
                            onPress={() => this.onPressPassword()}>
                                <FontAwesome5 
                                    name="key" 
                                    color= "black" 
                                    size={20} 
                                />
                                <Text style = {{fontSize : 16, marginLeft : 15}}>Mot de passe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.touchablePassword}  
                            onPress={() => this.onPressLocation()}>
                                <FontAwesome5 
                                    name="map-marker-alt" 
                                    color= "black" 
                                    size={20} 
                                />
                                <Text style = {{fontSize : 16, marginLeft : 15}}>Localisation GPS</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
    container_header : {
        flex : 0.25,
        backgroundColor : '#008080',
        alignItems: 'center',
        zIndex: 1,
        elevation : 3
    },
    container_body : {
        flex : 1,
        zIndex: 0,
    },
    touchablePassword : {
        padding: 30, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flexDirection : 'row',
        marginBottom : 10
    }, 
    container_logo_user: {
        height: 45, 
        alignItems : "center", 
        marginTop : 15
    },
    container_button_logout: {
        flex : 1, 
        marginTop: 10,
        marginBottom: 60
    }, 
    container_button_logoutModif: {
        flex : 1, 
        marginTop: 30,
    },
    container_text_name: {
        flex : 1, 
        justifyContent : 'center', 
        alignItems : 'center',
    },
    container_input: {
        flex : 10,
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 5
    },
    button : {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    button_logo_user : {
        backgroundColor : "#ECEFEC", 
        position: 'absolute',
        width : 90, 
        height: 90, 
        borderRadius : 50, 
        justifyContent : 'center',
        alignItems : 'center', 
    },
    text_logout: {
        fontSize: 18,
        fontWeight: 'bold', 
        color : "white"
    },
    text_name : {
        color : 'white',
        fontSize : 30,
        top : 15
    },
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password
    }
}


export default connect(mapStateToProps, {emailAction, passwordAction}) (Settings)
