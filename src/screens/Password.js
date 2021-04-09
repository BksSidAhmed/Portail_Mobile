import React from 'react'
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements'

class Password extends React.Component { 

    valider() {
        console.log('valider')
    }
    render(){
        return(
            <View style = { styles.view_form }>
                <ScrollView style = {{ flex : 1 }}>
                        <View style = { styles.view_input }>
                            <Input 
                                placeholder = "Mot de passe actuelle"
                                // rightIcon = {{ type: 'font-awesome', name: 'envelope' }}
                                style = { styles.text_input }
                                // keyboardType = "email-address"
                                autoCapitalize = "none"
                                // onChangeText = { (text) => this.editEmail(text) }
                            />
                            <Input 
                                placeholder = "Nouveau Mot de Passe"
                                rightIcon = {{ type: 'font-awesome', name: 'lock' }}
                                style = { styles.text_input }
                                secureTextEntry = { true }
                                autoCapitalize = "none"
                                onChangeText = { (text) => this.editPassword(text) }
                            />
                            <Input 
                                placeholder = "Saisir à nouveau le Mot de Passe"
                                rightIcon = {{ type: 'font-awesome', name: 'lock' }}
                                style = { styles.text_input }
                                secureTextEntry = { true }
                                autoCapitalize = "none"
                                onChangeText = { (text) => this.editPassword(text) }
                            />
                        </View>
                </ScrollView>
                <View style = { styles.view_button }>
                    <Button containerStyle = { styles.button_container} buttonStyle = { styles.button_style } title = "Valider" onPress = { () => this.valider() }/>
                </View>
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
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    view_input: {
        marginTop: 20,
        paddingTop : 10
    },
    view_button: {
        alignItems : 'flex-end',
        justifyContent : 'flex-end',
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

export default Password
