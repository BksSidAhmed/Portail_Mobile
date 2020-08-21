import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Overlay} from 'react-native-elements'
import {Button} from 'react-native-elements'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { IconButton } from 'react-native-paper';
import { Root, Popup } from 'popup-ui';

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
            <View style = {{flexDirection: 'row'}}>
                <View style={styles.action}>
                    <TextInput 
                        onChangeText = {(text) => this.editEmail(text)}
                        placeholder= "Changer l'adresse mail"
                        placeholderTextColor="#666666"
                        editable = {true}
                        style={styles.textInput}
                        keyboardType = "email-address"
                        onSubmitEditing = {() => this.validetEmail()}
                    />
                </View>
                <IconButton
                        style = {{flex : 1, marginTop : 10}}
                        icon="check"
                        color={"green"}
                        size={20}
                        onPress={() => this.validetEmail()}
                />
            </View>   
        )
      }

      onPressPassword = () => {
        this.setState((prevState, prevProps) => ({
            isSelectedpassword: !prevState.isSelectedpassword
        }))
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
                <View style = {{flexDirection: 'row'}}>
                    <View style={styles.action}>
                        <TextInput 
                            onChangeText = {(text) => this.editAncienPassword(text)}
                            placeholder= "Confirmer votre mot de passe actuelle"
                            placeholderTextColor="#666666"
                            editable = {true}
                            style={styles.textInput}
                            secureTextEntry= {true}
                        />
                    </View>
            </View>  
           
            <View style = {{flexDirection: 'row'}}>
                <View style={styles.action}>
                    <TextInput 
                        onChangeText = {(text) => this.editPassword(text)}
                        placeholder= "Nouveau Mot de passe"
                        placeholderTextColor="#666666"
                        editable = {true}
                        style={styles.textInput}
                        secureTextEntry= {true}
                        onSubmitEditing = {() => this.validetPassword()}
                    />
                </View>
                <IconButton
                        style = {{flex : 1, marginTop : 10}}
                        icon="check"
                        color={"green"}
                        size={20}
                        onPress={() => this.validetPassword()}
                />
            </View>   
        </View> 
        )
      }

    exit = () => {
        this.props.emailAction('')
        this.props.passwordAction('')
    } 
    exitOverlay = () => {
        this.setState({
            isVisible : true
        })
    }
    Overlay = () => {
        return(
            <Overlay isVisible={this.state.isVisible} 
                overlayStyle = {{backgroundColor : '#008080'}}
                onBackdropPress={() => this.setState({ isVisible: false })} 
                width='auto' 
                height='auto'>
                    <Text style={{textAlign:'center', fontSize:16, padding:5, color : 'white'}}>
                        Vous souhaitez quitter Niva Mobile ?
                    </Text>
                    <View style = {{ flexDirection: 'row', justifyContent : 'flex-end', marginTop : 10}}>
                        <Button
                            onPress={() => this.exit()} 
                            buttonStyle = {{backgroundColor : '#922B21', alignItems : 'flex-end', }}
                            type="solid"
                            title="Quittez"/>                  
                    </View>
            </Overlay>
        )
    }
    render(){
        return(
            <Root>
            <View style = {styles.container}>
                {this.Overlay()}
                <View style = {styles.header}>
                    <View style = {{flex : 1, alignItems : 'flex-end'}}>
                        <TouchableOpacity 
                            onPress={() => this.exitOverlay()} 
                            style = {styles.iconExit}>
                                <FontAwesome5 
                                    name='times' 
                                    size={30} 
                                    color='#922B21'>
                                </FontAwesome5>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {styles.text_name}>BOUKAIS Sid-Ahmed</Text>
                    </View>
                    <View style = {{flex : 1, alignItems : "center", justifyContent : "flex-end"}}>
                        <TouchableOpacity style = {styles.content_icone}>
                            <FontAwesome5 
                                name='user-alt' 
                                size={45} 
                                color='black'>
                            </FontAwesome5>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style = {styles.body}>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style = {{flexDirection: 'row'}}>
                            <View style={styles.action}>
                                <MaterialIcons 
                                    name="person"
                                    size={22}
                                />
                                <TextInput 
                                    placeholder={this.props.email}
                                    placeholderTextColor="#666666"
                                    editable = {false}
                                    style={styles.textInput}
                                    keyboardType = "email-address"
                                />
                            </View>
                            <IconButton
                                style = {{flex : 1, marginTop : 10}}
                                icon="pencil"
                                color={"#D35400"}
                                size={20}
                                onPress={() => this.onPressEmail()}
                            />
                    </View>
                    {this.state.isSelectedemail && this.changeEmail()}
                    <Text style={styles.text_footer}>Mot de Passe</Text>
                    <View style = {{flexDirection: 'row'}}>  
                            <View style={styles.action}> 
                                <MaterialIcons 
                                    name="vpn-key"
                                    size={22}
                                />
                                <TextInput 
                                    placeholderTextColor="#666666"
                                    value = {this.props.password}
                                    editable = {this.state.disabledpassword}
                                    secureTextEntry= {true}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />
                            </View>
                            <IconButton
                                style = {{flex : 1, marginTop : 10}}
                                icon="pencil"
                                color={"#D35400"}
                                size={20}
                                onPress={() => this.onPressPassword()}
                            />
                        </View>  
                        {this.state.isSelectedpassword && this.changePassword()}
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
    header : {
        flex : 0.5,
        backgroundColor : '#008080'
    },
    iconExit : {
        marginTop : 10,
        width : 50, 
        height: 50, 
        borderRadius : 30,
        alignItems : 'center',
    },
    text_name : {
        color : 'white',
        fontSize : 25,
        top : 15
    },
    content_icone : {
        backgroundColor : "white", 
        width : 90, 
        height: 90, 
        borderRadius : 50, 
        top : 40, 
        borderColor : '#008080',
        borderWidth : 2,
        justifyContent : 'center',
        alignItems : 'center', 
    },
    body : {
        flex : 1.25,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 15, 
        marginTop : 10
    },
    action: {
        flex : 10,
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
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
