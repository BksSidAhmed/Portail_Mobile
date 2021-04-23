import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';
import * as Animatable from 'react-native-animatable';
class About extends React.Component { 

    render() {
        let list_about = [];
        //Français
        if(this.props.langue === '100') {
            list_about =  [
                { key : 1, text: 'NIVA® version V1.0 2021' },
                { key : 2, text: 'Cette application a été réalisée par ALPHASYS - Lyon - France.' },
                { key : 3, text: 'NIVA est une marque déposée par ALPHASYS - Lyon - France.' },
                { key : 4, text: 'Cette application a pour objectif de : ' },
                { key : 5, text: ' - Récupérer les mouvements de début, fin ou changement d\'activité' },
                { key : 6, text: ' - Calculer et comptabiliser le temps écoulé entre deux mouvements' },
                { key : 7, text: ' - Informer l\'utilisateur sur le décompte d\'un certain nombre de compteurs affichés' },
                { key : 8, text: ' - Le calcul du temps écoulé ainsi que le choix des compteurs affichés sont de la responsabilité de votre employeur' },
            ];
            this.props.navigation.setOptions({ title: 'À propos' });
        }
        //Allemand
        if(this.props.langue === '109') {
            list_about =  [
                { key : 1, text: 'NIVA® fassung V3.0 2021' },
                { key : 2, text: 'Diese Anwendung wurde von ALPHASYS erstellt - Lyon - France.' },
                { key : 3, text: 'NIVA ist eine eingetragene Marke von ALPHASYS - Lyon - France.' },
                { key : 4, text: 'Diese Anwendung zielt darauf ab : ' },
                { key : 5, text: ' - Rufen Sie die Start-, End- oder Änderungsaktivitätsbewegungen ab' },
                { key : 6, text: ' - Berechnen und notieren Sie die zwischen zwei Bewegungen verstrichene Zeit' },
                { key : 7, text: ' - Informieren Sie den Benutzer über die Anzahl einer bestimmten Anzahl angezeigter Zähler' },
                { key : 8, text: ' - Die Berechnung der verstrichenen Zeit sowie die Auswahl der angezeigten Zähler liegen in der Verantwortung Ihres Arbeitgebers' },
            ];
            this.props.navigation.setOptions({ title: 'Etwa' });
        }
        //Espagnol
        if(this.props.langue === '134') {
            list_about =  [
                { key : 1, text: 'NIVA® versión V3.0 2021' },
                { key : 2, text: 'Esta aplicación fue producida por ALPHASYS - Lyon - France.' },
                { key : 3, text: 'NIVA es una marca registrada de ALPHASYS - Lyon - France.' },
                { key : 4, text: 'Esta aplicación tiene como objetivo : ' },
                { key : 5, text: ' - Recuperar los movimientos de actividad de inicio, finalización o cambio' },
                { key : 6, text: ' - Calcula y registra el tiempo transcurrido entre dos movimientos' },
                { key : 7, text: ' - Informar al usuario sobre el recuento de un cierto número de contadores mostrados' },
                { key : 8, text: ' - El cálculo del tiempo transcurrido, así como la elección de los contadores mostrados, son responsabilidad de su empleador' },
            ];
            this.props.navigation.setOptions({ title: 'A proposito' });
        }
        //Anglais
        if(this.props.langue === '132') {
            list_about =  [
                { key : 1, text: 'NIVA® fassung V3.0 2021' },
                { key : 2, text: 'This application was produced by ALPHASYS - Lyon - France.' },
                { key : 3, text: 'NIVA is a registered trademark by ALPHASYS - Lyon - France.' },
                { key : 4, text: 'This application aims to : ' },
                { key : 5, text: ' - Retrieve the start, end or change activity movements' },
                { key : 6, text: ' - Calculate and record the time elapsed between two movements' },
                { key : 7, text: ' - Inform the user about the count of a certain number of counters displayed' },
                { key : 8, text: ' - The calculation of the elapsed time as well as the choice of the displayed counters are the responsibility of your employer' },
            ];
            this.props.navigation.setOptions({ title: 'About' });
        }
        //Italien
        if(this.props.langue === '127') {
            list_about =  [
                { key : 1, text: 'NIVA® versione V3.0 2021' },
                { key : 2, text: 'Questa applicazione è stata prodotta da ALPHASYS - Lyon - France.' },
                { key : 3, text: 'NIVA è un marchio registrato di ALPHASYS - Lyon - France.' },
                { key : 4, text: 'Questa applicazione mira a : ' },
                { key : 5, text: ' - Recuperare l\'inizio, la fine o modificare i movimenti dell\'attività' },
                { key : 6, text: ' - Calcola e registra il tempo trascorso tra due movimenti' },
                { key : 7, text: ' - Informare l\'utente sul conteggio di un certo numero di contatori visualizzati' },
                { key : 8, text: ' - Il calcolo del tempo trascorso e la scelta dei contatori visualizzati sono a carico del vostro datore di lavoro.' },
            ];
            this.props.navigation.setOptions({ title: 'A proposito' });
        }
        //Néerlandais
        if(this.props.langue === '135') {
            list_about =  [
                { key : 1, text: 'NIVA® versie V1.0 2021' },
                { key : 2, text: 'Deze applicatie is gemaakt door ALPHASYS - Lyon - Frankrijk.' },
                { key : 3, text: 'NIVA is een handelsmerk geregistreerd door ALPHASYS - Lyon - Frankrijk.' },
                { key : 4, text: 'Deze applicatie heeft tot doel : ' },
                { key : 5, text: ' - Haal de begin-, eind- of wijzigingsbewegingen op' },
                { key : 6, text: ' - Bereken en noteer de tijd die is verstreken tussen twee bewegingen' },
                { key : 7, text: ' - Informeer de gebruiker over het aantal getoonde tellers' },
                { key : 8, text: ' - De berekening van de verstreken tijd en de keuze van de weergegeven tellers zijn de verantwoordelijkheid van uw werkgever.' },
            ];
            this.props.navigation.setOptions({ title: 'Over' });
        }
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
        emails: state.listeEmailReducer.emails,
        langue: state.langueReducer.langue
    }
}

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (About)
