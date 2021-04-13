import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
class About extends React.Component { 

    render() {
        const list_about =  [
            { key : 1, text: 'NIVA® version V1.0 2021' },
            { key : 2, text: 'Cette application a été réalisée par ALPHASYS - Lyon - France.' },
            { key : 3, text: 'NIVA est une marque déposée par ALPHASYS - Lyon - France.' },
            { key : 4, text: 'Cette application a pour objectif de : ' },
            { key : 5, text: ' - Récupérer les mouvements de début, fin ou changement d\'activité' },
            { key : 6, text: ' - Calculer et comptabiliser le temps écoulé entre deux mouvements' },
            { key : 7, text: ' - Informer l\'utilisateur sur le décompte d\'un certain nombre de compteurs affichés' },
            { key : 8, text: ' - Le calcul du temps écoulé ainsi que le choix des compteurs affichés sont de la responsabilité de votre employeur' },
        ];
        return(
            <View style = { styles.container }>
                <Animatable.View animation = "bounceIn" style = { styles.container_header }>
                    <View style = { styles.container_logo }>
                        <View style = { styles.container_ico }>
                            <Image style = { styles.image_top_body } source = { require ('../image/logo_niva.png') }/>
                        </View>
                    </View>
                </Animatable.View>
                <View style = { styles.container_body }>
                    <Animatable.View animation = "bounceIn" delay = { 300 } style = { styles.text_body }>  
                        <FlatList data = { list_about } renderItem = { ({ item }) => <Text style = { styles.text_about }>{ item.text }</Text>} />
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
    text_about: {
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

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (About)
