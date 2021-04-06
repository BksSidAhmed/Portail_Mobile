import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { connect } from 'react-redux'
import {emailAction} from '../redux/actions/emailAction'
import {passwordAction} from '../redux/actions/passwordAction'
import { Drawer} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { color } from 'react-native-reanimated';

class DrawerComponent extends React.Component { 

    signOut = () => {
        this.props.emailAction('')
        this.props.passwordAction('')
    }

    render(){
        return(
            <View style = {{flex : 1}}>
                <DrawerContentScrollView>
                    <View style = {{flex :1, alignContent : 'center'}}>
                        <View style = {{flex : 0.5, justifyContent : 'center', alignItems: 'center', margin : 20}}>
                            <Image
                                style={{height : 100, width: 100, alignContent : 'center'}}
                                source={require ('../../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png')}
                            />
                            <Text style = {{fontSize : 20, fontWeight : 'bold', }}>{ this.props.email } </Text>
                        </View>
                        <View style = {{flex : 1}}>
                            <Text style = {{fontSize : 15, margin : 10, fontWeight : 'bold'}}> Menu </Text>
                            <Drawer.Section style={styles.drawerSection}>
                                <DrawerItem 
                                    label="Gestion du temps"
                                    labelStyle = {{
                                        fontSize : 15,
                                    }}
                                    onPress={() => {this.props.navigation.navigate('Gestion du temps')}}
                                />
                            </Drawer.Section>
                            <Drawer.Section style={styles.drawerSection}>
                                <DrawerItem 
                                    label="Paramètres"
                                    labelStyle = {{
                                        fontSize : 15,
                                    }}
                                    onPress={() => {this.props.navigation.navigate('Gestion du temps')}}
                                />
                            </Drawer.Section>
                            <Drawer.Section style={styles.drawerSection}>
                                <DrawerItem 
                                    label="A propos"
                                    labelStyle = {{
                                        fontSize : 15,
                                    }}
                                    onPress={() => {this.props.navigation.navigate('Gestion du temps')}}
                                />
                            </Drawer.Section>
                        </View>
                    </View>
                </DrawerContentScrollView>
               <View style={styles.bottomDrawerSection}>
                    <DrawerItem 
                        icon={() => (
                            <FontAwesome5 
                                name="sign-out-alt" 
                                color='white'
                                size={30}
                            />
                        )}
                        label="Déconnexion"
                        labelStyle = {{
                            fontSize : 20,
                            color : 'white'
                        }}
                        onPress={() => {this.signOut()}}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 2,
        borderBottomWidth : 2,
        borderBottomColor: '#f4f4f4',
        justifyContent : 'flex-end',
        backgroundColor : '#008080'
    },
    drawerSection: {
        borderColor: '#f4f4f4',
        borderWidth: 3,
    },
    bottomDrawerSectionDeco: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        justifyContent : 'flex-end',
    },
  });

const mapStateToProps = (state) => {
    // Redux Store --> Component
   return {
    email: state.emailReducer.email,
    password: state.passwordReducer.password,
   }
  }

export default connect(mapStateToProps,{emailAction,passwordAction}) (DrawerComponent)
