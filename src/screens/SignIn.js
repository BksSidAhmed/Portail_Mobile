import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, StyleSheet, Text, StatusBar, ActivityIndicator } from 'react-native';
import { emailAction } from '../redux/actions/emailAction';
import { passwordAction } from '../redux/actions/passwordAction';
import { getToken, postLostPassword } from '../api/index';
import * as Animatable from 'react-native-animatable';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { Button, Input, Overlay } from 'react-native-elements';

class SignIn extends React.Component { 
    constructor(props) {
        super(props)
        this.email = "",
        this.password = "",
        this.state = {
            loading: false,
            visibleError: false,
            visibleLostPassword: false,
            visibleLostPasswordResponse: false,
            loaderLostPassword: false,
            responseLostPassword: '',
            emailLostPassword: null,
        }
    }

    editEmail = (text) => {
        this.email = text
    }

    editEmailLostPassword = (text) => {
        this.emailLostPassword = text
    }

    editPassword = (text) => {
        this.password = text
    }

    connexion = () => {

        getToken(this.email,this.password).then(data => {

            if(data[0] == 200) 
            {

                this.setState({
                    loading : true
                });

                this.props.emailAction(this.email);
                this.props.passwordAction(this.password);

                const found = this.props.emails.find(element => element == this.email); 

                if ( found == undefined ) 
                {
                    this.props.listeEmailAction(this.email);
                }

            }

            if(data[0] == 401) 
            {
                this.setState({
                    loading : false,
                    visibleError: true
                });
            }

        });

    }
    
    forgotPassword = () => {

        this.setState({
            loaderLostPassword: true,
            visibleLostPasswordResponse: true
        });

        this.toggleOverlay('lost-password');
        this.toggleOverlay('response-lost-password');

        if(this.emailLostPassword != null) 
        {
            postLostPassword(this.emailLostPassword).then(data => {

                this.setState({
                    loaderLostPassword: false,
                    responseLostPassword: data[1]
                });

            });
        } 
        else 
        {
            this.setState({
                loaderLostPassword: false,
                responseLostPassword: { success: false, message: 'Aucun email renseigné.' }
            });
        }

    }

    toggleOverlay = (selector) => {
        if(selector == 'error') 
        {
            this.setState({ visibleError: !this.state.visibleError });
        }
        if(selector == 'lost-password') 
        {
            this.setState({ visibleLostPassword: !this.state.visibleLostPassword });
        }
        if(selector == 'response-lost-password') 
        {
            this.setState({ visibleLostPasswordResponse: !this.state.visibleLostPasswordResponse });
        }
    };

    contentLostPassword = () => {
        return (
            <View style = { styles.view_overlay }>
                <View>
                    <Text style = { styles.text_overlay }>Entrez votre email. Un lien vous permettant de renouveler votre mot de passe vous sera envoyé.</Text>
                    <Input 
                        placeholder = "Email"
                        rightIcon = {{ type: 'font-awesome', name: 'envelope' }}
                        style = { styles.text_input }
                        keyboardType = "email-address"
                        autoCapitalize = "none"
                        onChangeText = { (text) => this.editEmailLostPassword(text) }
                    />
                </View>
                <View style = { styles.view_button_overlay }>
                    <Button buttonStyle = { styles.button_overlay_accept } title = "Envoyer" onPress = { () => this.forgotPassword() }/>
                    <Button buttonStyle = { styles.button_overlay_refuse } title = "Annuler" onPress = { () => this.toggleOverlay('lost-password') }/>
                </View>
            </View>
        )
    }
    
    contentLostPasswordResponse = (data) => {
        return (
            <View style = { styles.view_overlay }>
                <Text style = { styles.text_overlay }>{ data.message }</Text>
                <View style = { styles.view_button_overlay }>
                    <Button buttonStyle = { styles.button_overlay_accept } title = "OK" onPress = { () => this.toggleOverlay('response-lost-password') }/>
                </View>
            </View>
        )
    }

    loader = () => {
        return (
            <View style = { styles.view_overlay }>
                <ActivityIndicator size = "large" color = "#00ff00"/>
            </View>
        )
    }

    render() {

        if(this.state.loading) 
        {
            return(
                <View style = {{ flex: 1, justifyContent: "center" }}>
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
                                    onChangeText = { (text) => this.editEmail(text) }
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
                                <Button containerStyle = { styles.container_button } buttonStyle = { styles.button_style } title = "Connexion" onPress = { () => this.connexion() }/>
                                <Button containerStyle = { styles.container_button } buttonStyle = { styles.button_style } title = "Mot de passe oublié ?" onPress = { () => this.toggleOverlay('lost-password') }/>
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </View>
                <Overlay isVisible = { this.state.visibleError } onBackdropPress = { () => this.toggleOverlay('error') }>
                    <View style = { styles.view_overlay }>
                        <Text style = { styles.text_overlay }>Le nom d'utilisateur et/ou le mot de passe est incorrect.</Text>
                        <View style = { styles.view_button_overlay }>
                            <Button buttonStyle = { styles.button_overlay_accept } title = "OK" onPress = { () => this.toggleOverlay('error') }/>
                        </View>
                    </View>
                </Overlay>
                <Overlay isVisible = { this.state.visibleLostPassword } onBackdropPress = { () => this.toggleOverlay('lost-password') }>
                    { this.contentLostPassword() }
                </Overlay>
                <Overlay isVisible = { this.state.visibleLostPasswordResponse } onBackdropPress = { () => this.toggleOverlay('response-lost-password') }>
                    { this.state.loaderLostPassword ? this.loader() : this.contentLostPasswordResponse(this.state.responseLostPassword) }
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
    container_button: {
        width: '100%'
    },
    view_title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_form: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    view_input: {
        marginTop: 20,
        paddingTop: 10
    },
    view_button: {
        alignItems: 'center',
        marginVertical: 10
    },
    view_overlay: {
        padding: 20
    },  
    view_button_overlay: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text_title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 60
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
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: '#008080',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20
    },
    button_overlay_refuse: {
        borderRadius: 50,
        backgroundColor: '#b22222',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20
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

