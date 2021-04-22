import React from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Vibration} from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Overlay,  Button, Input} from 'react-native-elements'
// import { TextInput } from 'react-native-paper';
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
            color : {},
            errorMail : null
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
                overlayStyle = {{ padding : 0 }} animationType = 'slide'>
                <View style = { styles.view_overlay }>
                    <View>
                        <Text style = { styles.text_overlay }>Entrez votre email de connexion.{'\n'}Votre transaction sera envoyé lors de votre prochaine connexion</Text>
                        <Input 
                            placeholder = "Email"
                            rightIcon = {{ type: 'font-awesome', name: 'envelope' }}
                            style = { styles.text_input }
                            keyboardType = "email-address"
                            autoCapitalize = "none"
                            onChangeText = { (text) => this.editEmail(text) }
                        />
                    </View>
                    <View style = { styles.view_button_overlay }>
                        <Button buttonStyle = { styles.button_overlay_accept } title = "Envoyer" onPress = { () => this._validatePointing() }/>
                        <Button buttonStyle = { styles.button_overlay_refuse } title = "Annuler" onPress = { () =>  this.setState({ isVisible: false })}/>
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
                overlayStyle = {{ padding : 0 }} fullScreen = { true } animationType = 'slide'>
                        <View style = { styles.container }>
                            <View style = { styles.container }>
                                <Animatable.View animation="bounceIn" delay = { 0 } style = { styles.container_animation_header_overlay }>
                                    <View style = { styles.container_title_overlay }>
                                        <Text style = { styles.text_title_overlay }>Transaction Entrée/Sortie</Text>
                                    </View>
                                </Animatable.View>
                            </View>
                            <View style = { styles.container_global_tiles_overlay }>
                                <Animatable.View animation = "bounceIn" delay = { 300 } style = { styles.container_animation_overlay_ico }>
                                    <View style = { styles.container_ico_overlay }>
                                        {
                                            this.state.errorMail ?               
                                                <FontAwesome5 name = "exclamation-triangle" color = "#C72C41" size = { 50 }/>
                                            :                         
                                                <FontAwesome5 name = "check-circle" color = "#2EB769" size = { 50 }/>
                                            
                                        }
                                    </View>
                                </Animatable.View>
                                <Animatable.View animation = "bounceIn" delay = { 600 } style = { styles.container_animation_overlay_text }>
                                    <View style = { styles.container_text_overlay }>
                                        <Text style = { styles.text_body_overlay }>{ this.state.textPointing }</Text>
                                    </View>
                                </Animatable.View>
                                <Button buttonStyle = { styles.button_overlay_accept } title = "OK" onPress = { () => this.setState({ visible: false, visibleListActivites : false }) }/>
                            </View> 
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
                                    errorMail : false,
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
                                errorMail : false,
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
                    errorMail : true,
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
                {/* <Animatable.View animation="fadeInDown" style={ styles.container_header }>
                    <View>
                        <Text style={ styles.text_date }>{ moment().format("dddd Do MMMM YYYY").toUpperCase() }</Text>
                    </View>
                    <View style={ styles.container_clock }>
                        <Text style={ styles.text_heure }>{ this.state.time }</Text>
                    </View>
                </Animatable.View> */}
                <View style = { styles.container }>
                    <Animatable.View animation = "bounceIn" style = { styles.container_header }>
                        <View style={ styles.container_clock }>
                            <Text style={ styles.text_date }>{ moment().format("dddd Do MMMM YYYY").toUpperCase() }</Text>
                            <Text style={ styles.text_heure }>{ this.state.time }</Text>
                        </View> 
                    </Animatable.View>
                </View>
                <Animatable.View animation="bounceIn" style={ styles.container_button_animation }>
                    <View style= { styles.button1 }>
                        <Text style = {styles.text_horsLigne}>En mode Hors ligne vous pouvez réaliser une transaction d'entrée ou de sortie, si vous souhaitez profiter de toutes les fonctionnalités que Niva Mobile vous propose, veuillez vous connecter à un réseau internet.</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={ () => this.actionButton() } 
                        disabled = {this.state.disabled}
                        style={ this.state.timers ? styles.buttonDesactiv : styles.button1 }
                    >
                        <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                            {   
                                (this.state.timers 
                                    ?  <Text style={{fontSize: 50, color: "black"}}>
                                            {this.state.timer}
                                        </Text>
                                    :   <FontAwesome5 name="user-clock" color= "#008080" size={50}/> 
                                ) 
                            }
                        </View>
                    </TouchableOpacity>
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
        padding: 20, 
        backgroundColor : '#008080',
        elevation: 5,
        borderRadius : 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container_header : {
        flex: 1,
        padding: 10, 
        paddingBottom : 5
    },
    container_button_animation: {
        flex : 2 , 
    },
    button1:{ 
        flex : 0.3,
        backgroundColor: "#FFF",
        padding: 5,
        elevation: 7,
        justifyContent : 'center',
        borderRadius : 5,
        margin : 10,
        marginTop : 0
    },
    button:{ 
        // height : 200,
        // width : 200,
        // backgroundColor: '#008080',
        // paddingVertical: 20,
        // marginVertical: 2,
        
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 4.00,
        elevation: 10,
        // borderRadius: 100
        padding: 20, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
    }, 
    buttonDesactiv : {
        // height : 200,
        // width : 200,
        // backgroundColor: '#ECEFEC',
        // paddingVertical: 20,
        // marginVertical: 2,
        
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 4.00,
        // elevation: 10,
        // borderRadius: 100
        flex : 0.3,
        backgroundColor: '#ECEFEC',
        padding: 5,
        elevation: 7,
        justifyContent : 'center',
        borderRadius : 5,
        margin : 10,
        marginTop : 0
    }, 
    text_date: {
        textAlign : 'center',
        // marginTop : 20,
        color : "#fff",
        fontSize : 20
    },
    text_heure:{
        textAlign:'center',
        fontSize: 40,
        // textAlign : "center",
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
    view_overlay: {
        padding: 20
    },  
    view_button_overlay: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text_input: {
        color: '#05375a'
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15 
    },  
    view_button_overlay: {
        flexDirection: 'row',
        justifyContent: 'center'
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
    },
    container_animation_header_overlay : {
        flex: 1,
        paddingTop: 20,
        padding: 10, 
    },
    container_text_overlay:{ 
        padding: 20, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_title_overlay: {
        textAlign: 'center',
        fontSize : 17,
        color: 'white'
    },
    container_animation_overlay_ico: {
        flex : 1 , 
        padding: 10
    },
    container_ico_overlay:{ 
        padding: 20, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container_animation_overlay_text: {
        flex : 2, 
        padding: 10
    },
    container_title_overlay: {
        flex : 1,
        padding: 20, 
        backgroundColor : '#008080',
        elevation: 5,
        borderRadius : 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_body_overlay: {
        textAlign: 'center',
        fontSize : 18,
        padding: 20
    },
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: '#008080',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20
    },
    container_global_tiles_overlay: {
        flex:3,
    },
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
