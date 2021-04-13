import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class Confidential extends React.Component { 

    render(){
        const text_confidential_1 = 'Vos données sont protégées.';
        const text_confidential_2 = 'Les données échangées entre votre téléphone mobile et le serveur NIVA sont sécurisées et cryptées par certificat.';
        return(
            <View style = { styles.container }>
                <Animatable.View animation = "fadeInDown" style = { styles.container_header }>
                    <View style = { styles.container_logo }>
                        <View style = { styles.container_ico }>
                            <FontAwesome5 name = "user-lock" size = { 35 } color = "#008080" style = {{ padding:15 }}/>
                        </View>
                    </View>
                </Animatable.View>
                <View style = { styles.container_body }>
                    <Animatable.View animation = "bounceIn">  
                        <TouchableOpacity style = { styles.text_body }>
                            <Text style = { styles.text_confidential }>{ text_confidential_1 }</Text>
                            <Text style = { styles.text_confidential }>{ text_confidential_2 }</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container_header: {
        flex: 1,
        padding: 10,
        paddingTop: 20
    },
    container_body : {
        flex : 2,
        padding: 10
    },
    container_logo: {
        flex: 1,
        padding: 20, 
        backgroundColor: '#008080',
        elevation: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: "center"
    },
    container_ico: {
        backgroundColor: "#ECEFEC", 
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_confidential: {
        padding: 5
    },
    text_body : {
        padding: 30, 
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 5,
        marginBottom: 10
    }, 
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails
    }
}

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (Confidential)
