import React from 'react'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAvoidingView ,ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Alert } from 'react-native';
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'
//API
import { getToken, postPassword } from '../api/index'
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {listeEmailAction} from '../redux/actions/listeEmailAction'
import { Button, Input, Overlay } from 'react-native-elements'

class SignIn extends React.Component { 
    constructor(props) {
        super(props)
        this.email = "",
        this.password = "",
        this.state = {
            loading: false,
            visible: false,
        }
    }

    editemail = (text) => {
        this.email = text
    }

    editPassword = (text) => {
        this.password = text
    }

    connexion = () => {
        getToken(this.email,this.password).then(data => {
            console.log(this.email + this.password)
            console.log(data)
            if(data[0] == 200) {
                this.setState({
                    loading : true
                })
                this.props.emailAction(this.email)
                this.props.passwordAction(this.password)
                const found = this.props.emails.find(element => element == this.email) 
                if ( found == undefined ) {
                    this.props.listeEmailAction(this.email)
                }
            }
            if(data[0] == 401) {
                this.setState({
                    loading : false
                })
                // Alert.alert(
                //     'Erreur',
                //     "Le nom d'utilisateur et/ou le mot de passe est incorrect",
                //     [
                //         {
                //             text: 'ok',
                //         },
                //     ] 
                // );
                this.setState({visible: true});
            }
        })
    }
    // forgotPassword = () => {
    //     // getToken(this.email,this.password).then(data => {
    //     //     console.log(data[0])
    //     //     if(data[0] == 200) {

    //     //     }
    //     // })
    // }

    toggleOverlay = () => {
        this.setState({visible: !this.state.visible});
    };

    render() {

        if(this.state.loading) {
            return(
                <View style = {{flex: 1,justifyContent: "center"}}>
                    <ActivityIndicator size = "large" color = "#00ff00" />
                </View>
            )
        }

        return(
            <View style = { styles.container }> 
                <StatusBar backgroundColor = "#008080" barStyle = "light-content"/>
                <View style = { styles.view_title }>
                    <Animatable.Text animation = "fadeInDown" style={ styles.text_title }>NIVA</Animatable.Text>
                </View>
                <View style = { styles.view_form }>
                    <ScrollView>
                        <Animatable.View animation = "fadeInUp">
                            <View style = { styles.view_input }>
                                <Input 
                                    placeholder = "Email"
                                    rightIcon = {{ type: 'font-awesome', name: 'envelope' }}
                                    style = { styles.text_input }
                                    keyboardType = "email-address"
                                    autoCapitalize = "none"
                                    onChangeText = { (text) => this.editemail(text) }
                                />
                                <Input 
                                    placeholder = "Mot de Passe"
                                    rightIcon = {{ type: 'font-awesome', name: 'lock' }}
                                    style = { styles.text_input }
                                    secureTextEntry = { true }
                                    autoCapitalize = "none"
                                    onChangeText = { (text) => this.editPassword(text) }
                                />
                            </View>
                            <View style = { styles.view_button }>
                                <Button containerStyle = { styles.button_container} buttonStyle = { styles.button_style } title = "Connexion" onPress = {() => this.connexion()}/>
                                <Button containerStyle = { styles.button_container} buttonStyle = { styles.button_style } title = "Mot de passe oublié ?" onPress = {() => this.forgotPassword()}/>
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </View>
                <Overlay isVisible = { this.state.visible } onBackdropPress = { () => this.toggleOverlay() }>
                    <View style = { styles.view_overlay }>
                        <Text style = { styles.text_overlay }>Le nom d'utilisateur et/ou le mot de passe est incorrect.</Text>
                        <Button buttonStyle = { styles.button_overlay } title = "OK" onPress = { () => this.toggleOverlay() }/>
                    </View>
                </Overlay>
            </View> 
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#008080'
    },
    view_title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_form: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    view_input: {
        marginTop: 20,
        paddingTop : 10
    },
    view_button: {
        alignItems: 'center',
        marginVertical: 10
    },
    view_overlay: {
        padding: 20
    },  
    text_title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 60
    },
    text_footer: {
        color: '#05375a',
        fontSize: 22, 
        marginTop : 20
    },
    text_button: {
        fontSize: 22,
        fontWeight: 'bold', 
        color : "white"
    },
    text_input: {
        color: '#05375a'
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15 
    },  
    button_style: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 50,
        backgroundColor: '#008080'
    },
    button_container: {
        width: '100%'
    },
    button_overlay: {
        borderRadius: 50,
        backgroundColor: '#008080'
    }
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        emails: state.listeEmailReducer.emails
    }
}

export default connect(mapStateToProps, {emailAction, passwordAction, listeEmailAction}) (SignIn)

