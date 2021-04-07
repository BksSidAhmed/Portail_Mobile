import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';

class Confidential extends React.Component { 

    render(){
        const text_confidential_1 = 'Vos données sont protégées.';
        const text_confidential_2 = 'Les données échangées entre votre téléphone mobile et le serveur NIVA sont sécurisées et cryptées par certificat.';
        return(
            <View style = { styles.container }>
                <Text style = { styles.text_confidential }>{ text_confidential_1 }</Text>
                <Text style = { styles.text_confidential }>{ text_confidential_2 }</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        paddingVertical: 10
    },
    text_confidential : {
        textAlign:'center',
        padding: 5
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
