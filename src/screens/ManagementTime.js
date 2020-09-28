import React from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr'
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux'
import { getToken, postAction, getUser } from '../api/index'
import Geolocation from '@react-native-community/geolocation';
import Dialog, { DialogContent, SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import {listeEmailAction} from '../redux/actions/listeEmailAction'
import {pointingAction} from '../redux/actions/pointingHorsLigneAction'

class ManagementTime extends React.Component { 
    constructor(props) {
        super(props)
        this.state = { 
            time: '',
            loadingList: true,
            loadingButtonF01: true,
            loadingButtonF02: true,
            loadingButtonF03: true,
            loadingButtonF04: true,
            loadingButtonF05: true,
            loadingF00 : false,
            loadingF01 : false,
            loadingF02 : false,
            loadingF03 : false,
            loadingF04 : false,
            loadingF05 : false,
            latitude: '',
            longitude : '',
            visible: false,
            disabled : false,
            user : '',
            currentIco: '',
            currentLibelle: '',
            currentText: '', 
            compteurDelete : 0, 
            loading : false
        }
    }
    sendPointingDeconnection() {
        var dataPointing = this.props.pointing
        var compteurDelete = 0
            dataPointing.forEach(element => {   
                if(element.email == this.props.email){
                    this.setState({
                        loading : true
                    })
                     element.pointage.forEach(pointing => {
                         getToken(this.props.email,this.props.password).then(data => {
                            if(data[0] == 200) {
                                postAction(data[1].token,pointing[0],pointing[1],pointing[2],pointing[3],pointing[4],pointing[5],pointing[6]).then(data => {
                                    console.log(data)
                                    if(data[0] == 200) {
                                            compteurDelete++
                                            console.log(compteurDelete)
                                            if(compteurDelete == element.pointage.length) {
                                                var removeIndex = dataPointing.map(function(item) { return item.email; }).indexOf(this.props.email);
                                                dataPointing.splice(removeIndex, 1);
                                                this.props.pointingAction(dataPointing)
                                                this.setState({
                                                    loading : false
                                                })
                                            }
                                    }
                                })
                            }
                        })
                    })
                }
            });
    }
    UNSAFE_componentWillMount() {
        this.renderClock();      
        this.sendPointingDeconnection()

        getToken(this.props.email,this.props.password).then(data => {
            if(data[0] == 200) 
            {
                getUser(data[1].token, this.props.email).then(response => {
                    this.setState({
                        loadingList: false,
                        user: {
                            'email': response[1].user.email,
                            'latitude_reference': response[1].user.latitude_reference,
                            'longitude_reference': response[1].user.longitude_reference,
                            'marge_reference': response[1].user.marge_reference,
                            'profil': {
                                'action0': {
                                    'active': response[1].user.profil.action_0.active,
                                    'ico': response[1].user.profil.action_0.ico,
                                    'libelle': response[1].user.profil.action_0.libelle
                                },
                                'action1': {
                                    'active': response[1].user.profil.action_1.active,
                                    'ico': response[1].user.profil.action_1.ico,
                                    'libelle': response[1].user.profil.action_1.libelle
                                },
                                'action2': {
                                    'active': response[1].user.profil.action_2.active,
                                    'ico': response[1].user.profil.action_2.ico,
                                    'libelle': response[1].user.profil.action_2.libelle
                                },
                                'action3': {
                                    'active': response[1].user.profil.action_3.active,
                                    'ico': response[1].user.profil.action_3.ico,
                                    'libelle': response[1].user.profil.action_3.libelle
                                },
                                'action4': {
                                    'active': response[1].user.profil.action_4.active,
                                    'ico': response[1].user.profil.action_4.ico,
                                    'libelle': response[1].user.profil.action_4.libelle
                                },
                                'action5': {
                                    'active': response[1].user.profil.action_5.active,
                                    'ico': response[1].user.profil.action_5.ico,
                                    'libelle': response[1].user.profil.action_5.libelle
                                }
                            }
                        }
                    })
                });
            }
        });
    }

    componentWillUnmount = () => {
            clearInterval(this.renderClock());
            clearInterval(this.dialogPopup())
    }
    componentWillUnmount() {
        console.log('management')
    }


    getFullHeure = () => {
        var now = new moment().format("HHmmss");
        return now
    }

    getFullDate = () => {
        var now = new moment().format("YYYYMMDD");
        return now
    }

    renderClock = () => {
        setInterval(() => {
            this.setState({
                time: moment().format('HH:mm:ss')
            })
        }, 1000);
    }

    geolocalisation = async () => {
        try {
            Geolocation.getCurrentPosition(info => 
                this.setState({
                    latitude : info.coords.latitude.toString(),
                    longitude : info.coords.longitude.toString(),
                })
            );
        } catch (err) {
            console.log(err);
        }
    }

    actionButton = (button, libelle) => {
        this.setState({
            [`loading`+`${button}`] : true
        })
        this.setState({
           disabled : true
        })
        getToken(this.props.email,this.props.password).then(data => {
            if(data[0] == 200) {
                postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),button,this.state.latitude,this.state.longitude).then(data => {
                    if(data[0] == 200) {
                        this.setState({
                            [`loading`+`${button}`] : false
                        })
                        this.setState({
                            disabled : false
                        })
                        this.setState({
                            visible : true,
                            currentIco: data[1].ico,
                            currentLibelle: libelle,
                            currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                        })              
                    }
                    else {
                        this.setState({
                            visible : true
                        })
                    }
                })
            }
        })
    }

    dialogPopup = (ico, title, text) => {
        return(
            <Dialog
                visible={this.state.visible}
                dialogAnimation={new SlideAnimation({
                    zoomFrom: 'top',
                })}
                dialogTitle={<DialogTitle title={title} />}
                onTouchOutside={() => {
                    this.setState({ visible: false });
                }}
                style={ styles.dialog }
            >
                <DialogContent  style={ styles.dialog_content }>
                    <Image style={ styles.image } source={{ uri: `data:image/png;base64,${ico}` }} />
                    <Text style={ styles.text_dialog }>{ text }</Text>
                </DialogContent>
            </Dialog>
        )
    }

    buttons = (user) => {
        let libelles =  [];
        if( user.profil.action0.active )
        {
            libelles.push({ key : user.profil.action0.libelle, ico : user.profil.action0.ico, button : 'F00', disabled : this.state.disabled, delay: 0, loading : this.state.loadingF00 });
        }
        if( user.profil.action1.active )
        {
            libelles.push({ key : user.profil.action1.libelle, ico : user.profil.action1.ico, button : 'F01', disabled : this.state.disabled, delay : 200, loading : this.state.loadingF01 });
        }
        if( user.profil.action2.active )
        {
            libelles.push({ key : user.profil.action2.libelle, ico : user.profil.action2.ico, button : 'F02', disabled : this.state.disabled, delay : 400, loading : this.state.loadingF02 });
        }
        if( user.profil.action3.active )
        {
            libelles.push({ key : user.profil.action3.libelle, ico : user.profil.action3.ico, button : 'F03', disabled : this.state.disabled, delay : 600, loading : this.state.loadingF03 });
        }
        if( user.profil.action4.active )
        {
            libelles.push({ key : user.profil.action4.libelle, ico : user.profil.action4.ico, button : 'F04', disabled : this.state.disabled, delay : 800, loading : this.state.loadingF04 });
        }
        if( user.profil.action5.active )
        {
            libelles.push({ key : user.profil.action5.libelle, ico : user.profil.action5.ico, button : 'F05', disabled : this.state.disabled, delay : 1000, loading : this.state.loadingF05 });
        }
            
        return(
            <FlatList data={ libelles } 
                renderItem={({item}) => 
                    <Animatable.View animation="bounceIn" delay={ item.delay } style={ styles.container_button_animation }>
                        <TouchableOpacity 
                            onPress={ () => this.actionButton(item.button, item.key) } 
                            disabled={ item.disabled } 
                            style={ styles.button }
                        >
                            {
                                (item.loading 
                                    ? <ActivityIndicator size="large" color="#00ff00"/>  
                                    : <View style={ styles.container_ico }>
                                        <Image style={ styles.image } source={{ uri: `data:image/png;base64,${item.ico}` }} />
                                        <Text>{ item.key }</Text>
                                      </View>
                                )
                            }

                        </TouchableOpacity>
                    </Animatable.View>
                }
            ></FlatList>
        )
    }

    render(){
        const { loadingList, currentIco, currentLibelle, currentText, user } = this.state;
        return(
            <View style={ styles.container }>
                <StatusBar backgroundColor='#008080' barStyle="light-content"/>
                <Animatable.View animation="fadeInDown" style={ styles.container_header }>
                    {
                        this.state.loading ? 
                                <Text style = {{fontSize : 20, textAlign : 'justify', color : 'white', marginTop : 40}}>Veuillez patienter les transactions réalisées hors ligne sont en cours d'acheminement ...</Text>
                        :   <View> 
                                <View>
                                    <Text style={ styles.text_date }>{ moment().format("dddd Do MMMM YYYY").toUpperCase() }</Text>
                                </View>
                                <View style={ styles.container_clock }>
                                    <Text style={ styles.text_heure }>{ this.state.time }</Text>
                                </View>
                            </View>
                    }

                </Animatable.View>
                <View style={ styles.container_all_buttons }>
                    <View style={ styles.container_buttons }>
                        { this.state.loading ? <ActivityIndicator size="large" color="#00ff00" style={ styles.container_loader } /> : loadingList ? <ActivityIndicator size="large" color="#00ff00" style={ styles.container_loader } /> : this.buttons(user) }
                    </View>
                </View>
                { this.dialogPopup(currentIco, currentLibelle, currentText) }
            </View>
        );
    }

}
const styles = StyleSheet.create({ 
    container:{
        flex : 1,
    },
    container_loader: {
        flex: 1
    },
    container_clock: {
        flex : 1,
        borderBottomEndRadius : 90,
        borderBottomLeftRadius : 90, 
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    container_header : {
        flex : 0.35,
        backgroundColor: '#008080',
        paddingHorizontal: 20,
        paddingVertical: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container_all_buttons: {
        flex:1,
    },
    container_buttons: {
        flex : 1 , 
        flexDirection: 'row', 
    },
    container_button_animation: {
        flex : 1 , 
    },
    container_ico: {
        flex : 1, 
        alignItems : "center", 
        justifyContent: "center"
    },

    button:{ 
        flex : 1,
        backgroundColor: "#FFF",
        paddingVertical: 20,
        marginVertical: 2,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.24,
        shadowRadius: 3.80,
        elevation: 5,
        borderRadius: 3
    },

    image: {
        height : 50,
        width: 50,
        marginVertical: 10
    },
    
    text_date: {
        textAlign : 'center',
        marginTop : 50,
        color : "#fff",
        fontSize : 20
    },
    text_heure:{
        textAlign:'center',
        fontSize:50,
        textAlign : "center",
        color : "#fff",
    },
    text_dialog: {
        textAlign: 'center'
    },

    dialog: {
        textAlign: 'center'
    },
    dialog_content: {
        alignItems: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF',
      },
          button1:{ 
        flex : 0.25,
        backgroundColor: "#FFF",
        paddingVertical: 20,
        marginVertical: 2,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.24,
        shadowRadius: 3.80,
        elevation: 5,
        borderRadius: 3
    },
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails
    }
}

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (ManagementTime)
