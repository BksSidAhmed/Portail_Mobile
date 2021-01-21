import React from 'react'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, StatusBar, ActivityIndicator } from 'react-native';
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'
//API
import { getToken, postPassword } from '../api/index'
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {listeEmailAction} from '../redux/actions/listeEmailAction'

class SignIn extends React.Component { 
    constructor(props) {
        super(props)
        this.email = "",
        this.password = ""
        this.state = {
            loading : false
        }
    }
    editemail = (text) => {
        this.email = text
    }
    editPassword = (text) => {
        this.password = text
    }
    connexion = () => {
        this.setState({
            loading : true
        })
        getToken(this.email,this.password).then(data => {
            console.log(this.email + this.password)
            console.log(data)
            if(data[0] == 200) {
                this.props.emailAction(this.email)
                this.props.passwordAction(this.password)
                const found = this.props.emails.find(element => element == this.email) 
                if ( found == undefined ) {
                    this.props.listeEmailAction(this.email)
                }
            }
        })
    }
    forgotPassword = () => {
        // getToken(this.email,this.password).then(data => {
        //     console.log(data[0])
        //     if(data[0] == 200) {

        //     }
        // })
    }

    render() {
        if(this.state.loading) {
            return(
                <View style={{flex: 1,justifyContent: "center"}}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            )
        }
        return(
        <View style={styles.container}>
            <StatusBar backgroundColor='#008080' barStyle="light-content"/>
                <View style={styles.header}>
                    <Animatable.Text animation = "fadeInLeftBig" style={styles.text_header}>NIVA-RH</Animatable.Text>
                </View>
            <Animatable.View style={styles.footer}
                animation="fadeInUp">
                <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        <MaterialIcons 
                            name="person"
                            size={22}
                        />
                        <TextInput 
                            placeholder="Veuillez entrer votre email"
                            placeholderTextColor="#666666"
                            style={styles.textInput}
                            keyboardType = "email-address"
                            autoCapitalize="none"
                            onChangeText = {(text) => this.editemail(text)}
                            // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                        />
                    </View>    
                    <Text style={styles.text_footer}>Mot de Passe</Text>
                    <View style={styles.action}> 
                        <MaterialIcons 
                            name="vpn-key"
                            size={22}
                        />
                        <TextInput 
                            placeholder="Veuillez entrer votre mot de passe"
                            placeholderTextColor="#666666"
                            secureTextEntry= {true}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText = {(text) => this.editPassword(text)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => this.forgotPassword()}>
                        <Text style={{color: '#008080', marginTop:15}}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => this.connexion()}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}>
                                <Text style={styles.textSign}>Connexion</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
            </Animatable.View>
     </View>      
    );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#008080'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 60
    },
    text_footer: {
        color: '#05375a',
        fontSize: 22, 
        marginTop : 10
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold', 
        color : "white"
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

