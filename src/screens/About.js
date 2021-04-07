import React from 'react'
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';

class About extends React.Component { 

    render(){
        const text_about_1 = 'NIVA® version V1.0 2021';
        const text_about_2 = 'Cette application a été réalisée par ALPHASYS - Lyon - France.';
        const text_about_3 = 'NIVA est une marque déposée par ALPHASYS - Lyon - France.';
        const text_about_4 = 'Cette application a pour objectif de : ';
        const list_objectifs =  [
            { key : 1, objectif: 'Récupérer les mouvements de début, fin ou changement d\'activité' },
            { key : 2, objectif: 'Calculer et comptabiliser le temps écoulé entre deux mouvements' },
            { key : 3, objectif: 'Informer l\'utilisateur sur le décompte d\'un certain nombre de compteurs affichés' },
            { key : 4, objectif: 'Le calcul du temps écoulé ainsi que le choix des compteurs affichés sont de la responsabilité de votre employeur' },
        ];
        return(
            <View style = { styles.container }>
                <Text style = { styles.text_about }>{ text_about_1 }</Text>
                <Text style = { styles.text_about }>{ text_about_2 }</Text>
                <Text style = { styles.text_about }>{ text_about_3 }</Text>
                <Text style = { styles.text_about }>{ text_about_4 }</Text>
                <FlatList data = { list_objectifs } renderItem = { ({ item }) => <Text style = { styles.text_about }>  -  { item.objectif }</Text>} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingVertical: 10
    },
    text_about : {
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

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (About)
