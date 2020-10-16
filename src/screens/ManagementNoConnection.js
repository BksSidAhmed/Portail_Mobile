import React from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Vibration} from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Overlay} from 'react-native-elements'
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux'
import {pointingAction} from '../redux/actions/pointingHorsLigneAction'
import {RESET_ACTION} from '../redux/actions/resetActions'
import {listeEmailAction} from '../redux/actions/listeEmailAction'
import {resetListMail} from '../redux/actions/listeEmailAction'
import {RESET_TABLE_ACTION} from '../redux/actions/pointingHorsLigneAction'
import { emailAction } from '../redux/actions/emailAction'
import { passwordAction } from '../redux/actions/passwordAction'

class ManagementNoConnection extends React.Component { 
    constructor(props) {
        super(props)
        this.email = null,
        this.state = { 
            visible : false,
            time: '',
            loading : false,
            disabled : false,
            isVisible : false, 
            timer : 60,
            timers : false,
            textPointing : "",
            color : {}
        }
    }

    UNSAFE_componentWillMount() {
        this.renderClock()
    }
    
    componentWillUnmount = () => {
        clearInterval(this.IntervalClock);
        clearInterval(this.clockCall);
    }
    
    startTimer = () => {
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }

    decrementClock = () => {
        if(this.state.timer === 0) {
            this.setState({
                timers : false,
                disabled : false,
                timer : 60
            })
            clearInterval(this.clockCall)
        }
        this.setState((prevstate) => ({ timer: prevstate.timer-1 }));
    };

    getFullHeure = () => {
        var now = new moment().format("HHmmss");
        return now
    }

    getFullDate = () => {
        var now = new moment().format("YYYYMMDD");
        return now
    }

    renderClock = () => {
        this.IntervalClock = setInterval(() => {
            this.setState({
                time: moment().format('HH:mm:ss')
            })
        }, 1000);
    }

    actionButton = () => {
        this.props.emailAction('')
        this.props.passwordAction('')
        this.setState({
            isVisible : true,
            loading : true
        })
    }

    Overlay() {
        return (
            <Overlay 
                isVisible={this.state.isVisible} 
                onBackdropPress={() => this.setState({ isVisible: false, loading : false })}
                overlayStyle = {{height : 120, width: 300}}>
                <View>
                    <TextInput
                        label="Email"
                        mode = 'outlined'
                        autoCapitalize = "none"
                        onChangeText = { (text) => this.editEmail(text) }
                    />
                    <View style = {{flexDirection: 'row', alignItems : 'flex-end'}}>
                        <TouchableOpacity
                            onPress ={() => this._validatePointing()}
                            style = {{flex: 1, alignItems : 'flex-end', marginRight : 20, marginTop: 10}}>
                            <Text style= {{fontSize : 20, color : 'green'}}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    editEmail = (text) => {
        this.email = text
    }

    dialogPopup = () => {
        return(
            <Overlay 
                isVisible={this.state.visible} 
                onBackdropPress={() => this.setState({ visible: false })}
                overlayStyle = {{height : 'auto', width: '100%', padding : 0}}>
                    <View>
                        <View style= {this.state.color}>
                            <Text style= {{fontSize : 20, fontWeight : "bold"}}>Transaction Entrée/Sortie</Text>
                        </View>
                        <View style = {{alignItems : 'center', justifyContent : 'center', marginTop : 20, marginBottom: 20, marginLeft: 5, marginRight: 5}}>
                                <Text style={ styles.text_dialog }>{ this.state.textPointing }</Text>
                        </View>
                        <TouchableOpacity 
                                onPress={ () => this.setState({ visible: false }) } 
                                style = {{borderTopWidth : 1, width : '100%', alignItems : 'center', justifyContent: 'center', paddingTop : 15, paddingBottom : 15, backgroundColor : '#EDEDED'}}>
                                <Text style = {{fontSize : 20}}>
                                    OK
                                </Text>
                        </TouchableOpacity>
                    </View>
            </Overlay>
        )
    }

    _validatePointing = () => {
        if(this.email == null) {
            this.setState({
                isVisible : false,
                visible : false,
            })
        }
        else {
            var compteurIdentique = 0;      
            this.props.emails.forEach(element => {
                if(element == this.email.trim()) {
                    var data = this.props.pointing
                    var compteurTrouve = 0;    
                    for(var i = 0; i<data.length; i++)
                        {
                            if(data[i]['email'] == this.email.trim())
                            {
                                data[i]['pointage'].push([0,this.email.trim(),this.getFullDate(),this.getFullHeure(),'F00',0,0])
                                compteurTrouve++;
                                this.props.pointingAction(data)
                                this.setState({
                                    isVisible : false,
                                    loading : false,
                                    disabled : true,
                                    timers : true, 
                                    visible : true,
                                    color : { alignItems : 'center',justifyContent : 'center', borderBottomWidth : 1, backgroundColor : '#35C724', height : 60},
                                    textPointing : "Votre transaction a été enregistrée avec succès. Elle sera communiquée à votre employeur lors de votre prochaine connexion en ligne."
                                })
                                Vibration.vibrate(500)
                                this.startTimer()
                            }
                        }
                        if(compteurTrouve == 0)
                        {
                            data.push(
                                {
                                    'email' : this.email.trim(),
                                    'pointage': [[0,this.email.trim(),this.getFullDate(),this.getFullHeure(),'F00',0,0]]       
                                }
                            )
                            this.props.pointingAction(data)
                            this.setState({
                                isVisible : false,
                                loading : false,
                                disabled : true,
                                timers : true,
                                visible : true,
                                color : { alignItems : 'center',justifyContent : 'center', borderBottomWidth : 1, backgroundColor : '#35C724', height : 60 },
                                textPointing : "Votre transaction a été enregistrée avec succès. Elle sera communiquée à votre employeur lors de votre prochaine connexion en ligne."
                            })
                            Vibration.vibrate(500)
                            this.startTimer() 
                        }
                        compteurIdentique++
                }
            });
            if(compteurIdentique==0) {
                this.setState({
                    isVisible : false,
                    visible : true,
                    color : { alignItems : 'center',justifyContent : 'center', borderBottomWidth : 1, backgroundColor : '#F94040', height : 60 },
                    textPointing : "Pour utiliser la fonctionnalité hors ligne, veuillez vous connecter en ligne au moins une fois avec vos identifiants."
                })
                Vibration.vibrate(500)
            }
        }
    } 

    render(){
        return(
            <View style={ styles.container }>
                <StatusBar backgroundColor='#008080' barStyle="light-content"/>
                <Animatable.View animation="fadeInDown" style={ styles.container_header }>
                    <View>
                        <Text style={ styles.text_date }>{ moment().format("dddd Do MMMM YYYY").toUpperCase() }</Text>
                    </View>
                    <View style={ styles.container_clock }>
                        <Text style={ styles.text_heure }>{ this.state.time }</Text>
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" style={ styles.container_button_animation }>
                    <View style= { styles.button1 }>
                        <Text style = {styles.text_horsLigne}>En mode Hors ligne vous pouvez réaliser une transaction d'entrée ou de sortie, si vous souhaitez profiter de toutes les fonctionnalités que Niva Mobile vous propose, veuillez vous connecter à un réseau internet.</Text>
                    </View>
                    <View style = {{flex : 1,justifyContent : 'center', alignItems : 'center'}}>
                        <TouchableOpacity 
                            onPress={ () => this.actionButton() } 
                            disabled = {this.state.disabled}
                            style={ this.state.timers ? styles.buttonDesactiv : styles.button }
                        >
                            <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                {   
                                    (this.state.timers 
                                        ?  <Text style={{fontSize: 50, color: "black"}}>
                                                {this.state.timer}
                                            </Text>
                                        :   <FontAwesome5 name="user-clock" color= "white" size={50}/> 
                                    ) 
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
                {this.Overlay()}
                { this.dialogPopup() }
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container:{
        flex : 1,
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
    container_button_animation: {
        flex : 1 , 
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
    button:{ 
        height : 200,
        width : 200,
        backgroundColor: '#008080',
        paddingVertical: 20,
        marginVertical: 2,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.00,
        elevation: 10,
        borderRadius: 100
    }, 
    buttonDesactiv : {
        height : 200,
        width : 200,
        backgroundColor: '#ECEFEC',
        paddingVertical: 20,
        marginVertical: 2,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.00,
        elevation: 10,
        borderRadius: 100
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
        color : "#fff",
    },
    text_horsLigne : {
        textAlign:'center',
        fontSize: 15,
    },
    text_dialog: {
        textAlign: 'center',
        fontSize : 20
    },
    dialog: {
        textAlign: 'center',
    },
    dialog_content: {
        alignItems: 'center',
        marginTop : 20
    },









    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})
const mapStateToProps = (state) => {
    return {
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails,
        email: state.emailReducer.email,
        password: state.passwordReducer.password
    }
}

export default connect(mapStateToProps, {pointingAction, RESET_ACTION, listeEmailAction, resetListMail, RESET_TABLE_ACTION, emailAction, passwordAction}) (ManagementNoConnection)
