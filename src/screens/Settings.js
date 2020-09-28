import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Keyboard, Alert } from 'react-native';
import { emailAction } from '../redux/actions/emailAction'
import { passwordAction } from '../redux/actions/passwordAction'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { IconButton } from 'react-native-paper';
import { Root, Popup } from 'popup-ui';
import LinearGradient from 'react-native-linear-gradient';

class Settings extends React.Component { 

    constructor(props) {
        super(props)
        this.email = "",
        this.password = "",
        this.Ancienpassword = ""
        this.state = {
            isVisible: false,
            disabledemail : false,
            disabledpassword : false,
            isSelectedemail: false,
            isSelectedpassword: false,
        }
        
    }

    onPressEmail = () => {
        this.setState((prevState, prevProps) => ({
            isSelectedemail: !prevState.isSelectedemail
        }))
    }

    editEmail = (text) => {
        this.email = text
    }

    validetEmail = () => {
        if(this.email == ''){
            this.onPressEmail()
        }
        else {
            this.props.emailAction(this.email)
            this.onPressEmail()
            Popup.show({
                type: 'Success',
                title: 'Adresse mail',
                textBody: 'Le mail à etait changé avec succès ',
                button: false,
                buttonText: 'Ok',
                callback: () => Popup.hide()
            })
        }
    }

    changeEmail = () => {
        return(
            <View>
                <View style={ styles.container_email }>
                    <View style={ styles.container_input }>
                        <MaterialIcons 
                            name="arrow-forward"
                            size={ 20 }
                        />
                        <TextInput 
                            onChangeText = { (text) => this.editEmail(text) }
                            placeholder= "Nouvelle adresse mail"
                            editable = { true }
                            style={ styles.text_input }
                            keyboardType = "email-address"
                            onSubmitEditing = { () => this.validetEmail() }
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={ () => this.validetEmail() }>
                    <LinearGradient
                        colors={ ["#008080", "#008080"] }
                        style={ styles.button }>
                        <Text style={ styles.text_logout }>Modifier</Text>
                    </LinearGradient>
                </TouchableOpacity>  
            </View>  
        )
    }

    onPressPassword = () => {
        this.setState((prevState, prevProps) => ({
            isSelectedpassword: !prevState.isSelectedpassword
        }));
        

    }

    editPassword = (text) => {
        this.password = text
    }

    editAncienPassword = (text) => {
        this.Ancienpassword = text
    }
        
    validetPassword = () => {
        if (this.Ancienpassword != this.props.password) {
            this.onPressPassword()
            Popup.show({
                type: 'Danger',
                title: 'Mot de passe',
                textBody: 'Le mot de passe ne correspond pas ',
                button: false,
                buttonText: 'Ok',
                callback: () => Popup.hide()
            })   
        }
        else {
            this.props.passwordAction(this.password)
            this.onPressPassword()
            Popup.show({
                type: 'Success',
                title: 'Nouveau mot de passe',
                textBody: 'Le mot de passe à etait changé avec succès ',
                button: false,
                buttonText: 'Ok',
                callback: () => Popup.hide()
            })
        }    
    }

    changePassword = () => {
        return(
            <View>
                <View style={ styles.container_password }>
                    <View style={ styles.container_input }>
                        <MaterialIcons 
                            name="arrow-forward"
                            size={ 20 }
                        />
                        <TextInput 
                            onChangeText={ (text) => this.editAncienPassword(text) }
                            placeholder="Mot de passe actuel"
                            editable = { true }
                            style={ styles.text_input }
                            secureTextEntry= { true }
                        />
                    </View>
                </View>  
                <View style={ styles.container_password }>
                    <View style={ styles.container_input }>
                        <MaterialIcons 
                            name="arrow-forward"
                            size={ 20 }
                        />
                        <TextInput 
                            onChangeText={ (text) => this.editPassword(text) }
                            placeholder="Nouveau mot de passe"
                            editable = { true }
                            style={ styles.text_input }
                            secureTextEntry= { true }
                            onSubmitEditing = { () => this.validetPassword() }
                        />
                    </View>
                </View> 
                <TouchableOpacity onPress={ () => this.validetPassword() }>
                    <LinearGradient
                        colors={ ["#008080", "#008080"] }
                        style={ styles.button }>
                        <Text style={ styles.text_logout }>Modifier</Text>
                    </LinearGradient>
                </TouchableOpacity>  
            </View> 
        )
    }

    exit = () => {
        this.props.emailAction('')
        this.props.passwordAction('')
    } 

    exitAlertShow = () => { 
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vraiment vous déconnecter ?',
            [
                {
                    text: 'Oui',
                    onPress: () => this.exit()
                },
                {
                    text: 'Non',
                }
            ] 
        );
    }

    render(){
        return(
            <Root>
                <View style={ styles.container }>
                    <View style={ styles.container_header }>     
                        <View style={ styles.container_text_name }>
                            <Text style={ styles.text_name }>{ this.props.email }</Text>
                        </View>
                        <View style={ styles.container_logo_user }>
                            <TouchableOpacity style={ styles.button_logo_user }>
                                <FontAwesome5 
                                    name='user-alt' 
                                    size={ 45 } 
                                    color='#008080'>
                                </FontAwesome5>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    <ScrollView style={ styles.container_body }>
                        <View style={ styles.container_input_button }>
                            <View style={ styles.container_input }>
                                <MaterialIcons 
                                    name="person"
                                    size={ 20 }
                                />
                                <TextInput 
                                    placeholder={ this.props.email }
                                    editable = { false }
                                    style={ styles.text_input }
                                    keyboardType = "email-address"
                                />
                            </View>
                            <IconButton
                                style={ styles.button_input_modify }
                                icon="pencil"
                                size={ 20 }
                                onPress={ () => this.onPressEmail() }
                            />
                        </View>
                        { this.state.isSelectedemail && this.changeEmail() }
                        <View style={ styles.container_input_button }>  
                            <View style={ styles.container_input }> 
                                <MaterialIcons 
                                    name="vpn-key"
                                    size={22}
                                />
                                <TextInput 
                                    value={ this.props.password }
                                    editable={ this.state.disabledpassword }
                                    secureTextEntry={ true }
                                    style={ styles.text_input }
                                    autoCapitalize="none"
                                />
                            </View>
                            <IconButton
                                style={ styles.button_input_modify }
                                icon="pencil"
                                size={ 20 }
                                onPress={ () => this.onPressPassword() }
                            />
                        </View>  
                        { this.state.isSelectedpassword && this.changePassword() }
                        <View style={ styles.container_button_logout }>
                            <TouchableOpacity onPress={ () => this.exitAlertShow() }>
                                <LinearGradient
                                    colors={ ["#922B21", "#922B21"] }
                                    style={ styles.button }>
                                    <Text style={ styles.text_logout }>Déconnexion</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Root>
        );
    }

}

const styles = StyleSheet.create({
    
    container: {
        flex : 1
    },
    container_header : {
        flex : 1,
        backgroundColor : '#008080',
        alignItems: 'center',
        zIndex: 1,
    },
    container_body : {
        flex : 1.25,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 50,
        zIndex: 0
    },
    container_overlay: {
        backgroundColor : '#008080'
    },
    container_logo_user: {
        height: 45, 
        alignItems : "center", 
    },
    container_button_overlay: {
        flexDirection: 'row', 
        justifyContent : 'center', 
        padding : 10
    },
    container_button_logout: {
        flex : 1, 
        marginTop: 10,
        marginBottom: 60
    }, 
    container_email: {
        flexDirection: 'row'
    },
    container_password: {
        flexDirection: 'row'
    }, 
    container_text_name: {
        flex : 1, 
        justifyContent : 'center', 
        alignItems : 'center'
    },
    container_input: {
        flex : 10,
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 5
    },
    container_input_button: {
        flexDirection: 'row'
    },

    button_overlay_yes: {
        width: 100,
        backgroundColor : '#922B21', 
        margin: 10
    },
    button_overlay_no: {
        width: 100,
        backgroundColor : '#922B21', 
        margin: 10
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
    button_input_modify: {
        flex : 1, 
        marginTop : 10
    },

    text_logout: {
        fontSize: 18,
        fontWeight: 'bold', 
        color : "white"
    },
    text_overlay: {
        textAlign:'center', 
        fontSize: 18, 
        padding: 10, 
        color : 'white'
    },
    text_name : {
        color : 'white',
        fontSize : 25,
        top : 15
    },
    text_footer: {
        color: '#05375a',
        fontSize: 15, 
        marginTop : 10
    },
    text_input: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password
    }
}


export default connect(mapStateToProps, {emailAction, passwordAction}) (Settings)
