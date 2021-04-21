import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { connect } from 'react-redux';
import { emailAction } from '../redux/actions/emailAction';
import { passwordAction } from '../redux/actions/passwordAction';
import { langueAction } from '../redux/actions/langueAction';
import { Drawer } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button } from 'react-native-elements';

class DrawerComponent extends React.Component { 
    constructor(props) {
        super(props)
    }
    signOut = () => {
        this.props.emailAction('');
        this.props.passwordAction('');
        this.props.langueAction('100');
    }

    render() {
        let list_item = [];
        //Français
        if(this.props.langue === '100') {
            list_item = [
                { text : 'Gestion du temps' },
                { text : 'Paramètres' },
                { text : 'Confidentialité' },
                { text : 'À propos' },
                { text : 'Déconnexion' }
            ];
        }
        //Allemand
        if(this.props.langue === '109') {
            list_item = [
                { text : 'Zeitmanagement' },
                { text : 'Einstellungen' },
                { text : 'Vertraulichkeit' },
                { text : 'Etwa' },
                { text : 'Ausloggen' }
            ];
        }
        //Espagnol
        if(this.props.langue === '134') {
            list_item = [
                { text : 'Gestión del tiempo' },
                { text : 'Configuraciones' },
                { text : 'Confidencialidad' },
                { text : 'A proposito' },
                { text : 'Cerrar sesión' }
            ];
        }
        //Anglais
        if(this.props.langue === '132') {
            list_item = [
                { text : 'Time management' },
                { text : 'Settings' },
                { text : 'Confidentiality' },
                { text : 'About' },
                { text : 'Logout' }
            ];
        }
        //Italien
        if(this.props.langue === '127') {
            list_item = [
                { text : 'Gestione del tempo' },
                { text : 'Impostazioni' },
                { text : 'Riservatezza' },
                { text : 'A proposito' },
                { text : 'Disconnettersi' }
            ];
        }
        
        return(
            <View style = { styles.container }>
                <DrawerContentScrollView>
                    <View style = { styles.container_body }>
                        <View style = { styles.container_top_body }>
                            <Image style = { styles.image_top_body } source = { require ('../image/logo_niva.png') }/>
                        </View>
                        <View style = { styles.container_items_body }>
                            <View>
                                <Button title = { list_item[0].text } buttonStyle = { styles.button_item } onPress = { () => { this.props.navigation.navigate('Gestion du temps') }}/>
                            </View>
                            <View>
                                <Button title = { list_item[1].text } buttonStyle = { styles.button_item } onPress = { () => { this.props.navigation.navigate('Parametre') }}/>
                            </View>
                            <View>
                                <Button title = { list_item[2].text } buttonStyle = { styles.button_item } onPress = { () => { this.props.navigation.navigate('Confidentialite') }}/>
                            </View>
                            <View>
                                <Button title = { list_item[3].text } buttonStyle = { styles.button_item } onPress={ () => { this.props.navigation.navigate('A propos') }}/>
                            </View>
                        </View>
                    </View>
                </DrawerContentScrollView>
                <View style = { styles.container_bottom }>
                    <View>
                        <Button title = { list_item[4].text } buttonStyle = { styles.button_item_deconnexion } onPress={ () => { this.signOut() }}/>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container_body: {
        flex: 1
    },
    container_top_body: {
        flex : 1, 
        justifyContent : "center", 
        alignItems: "center", 
        margin : 10,
        marginBottom: 10
    },
    button_item_deconnexion: {
        backgroundColor : "#C72C41",
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 40,
        padding: 10
    },
    container_items_body: {
        flex : 1
    },
    button_item: {
        backgroundColor: "#008080",
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 40,
        padding: 10
    },
    text_top_body: {
        fontSize : 20,
        margin: 10 
    },
    image_top_body: {
        height : 100, 
        width: '100%', 
        alignContent : "center"
    }
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue
    }
}

export default connect(mapStateToProps,{emailAction,passwordAction,langueAction}) (DrawerComponent)
