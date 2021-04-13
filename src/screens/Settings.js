import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { emailAction } from '../redux/actions/emailAction'
import { passwordAction } from '../redux/actions/passwordAction'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Switch } from 'react-native-paper';
import SwitchExample from '../component/switch_example'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import * as Animatable from 'react-native-animatable';

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
            <View style = { styles.container }>
                <Animatable.View animation = "fadeInDown" style = { styles.container_header }>
                    <View style = { styles.container_logo_email }>
                        <View style = { styles.container_ico }>
                            <FontAwesome5 name='cogs' size = { 35 } color = '#008080' style = {{ padding:15 }}/>
                        </View>
                        <View style={ styles.container_email }>
                            <Text style = { styles.text_email }>{ this.props.email }</Text>
                        </View>
                    </View>
                </Animatable.View>

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
                
                <View style = { styles.container_body }>
                    <Animatable.View animation = "bounceIn" delay = { 0 }>
                        <TouchableOpacity style = { styles.button_body } onPress = { () => this.onPressPassword() }>
                            <FontAwesome5 name = "key" color = "black" size = { 20 }/>
                            <Text style = { styles.text_button }>Mot de passe</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation = "bounceIn" delay = { 300 }>
                        <TouchableOpacity style = { styles.button_body } onPress = { () => this.onPressLocation() }>
                            <FontAwesome5 name = "map-marker-alt" color = "black" size = { 20 }/>
                            <Text style = { styles.text_button }>Localisation GPS</Text>
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
        alignItems : 'center'
    },
    button_body : {
        padding: 30, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flexDirection : 'row',
        marginBottom : 10
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
        password: state.passwordReducer.password
    }
}


export default connect(mapStateToProps, {emailAction, passwordAction}) (Settings)
