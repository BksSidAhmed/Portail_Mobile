import React from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity,ActivityIndicator  } from 'react-native';
import { Card,  } from 'react-native-paper';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux'
import {postCheckToken, postActionButton} from '../api/index'
import { Root, Popup } from 'popup-ui';
import {requestACCESS_FINE_LOCATION} from '../permissions/index'
import Geolocation from '@react-native-community/geolocation';
import { Overlay} from 'react-native-elements'

class ManagementTime extends React.Component { 
    constructor(props) {
        super(props)
        this.state = { 
            time: '',
            loadingf0 : false,
            loadingf1 : false,
            loadingf2 : false,
            loadingf3 : false,
            loadingf4 : false,
            loadingf5 : false,
            latitude: '',
            longitude : '',
            isVisible: false,
            disabledf0 : false,
            disabledf1 : false,
            disabledf2 : false,
            disabledf3 : false,
            disabledf4 : false,
            disabledf5 : false,
        }
    }
    componentDidMount() {
        this.clock();
    }

    componentWillUnmount = () => {
        clearInterval(this.clock());
    }

    getFullHeure = () => {
        var now = new moment().format("HHmmss");
        return now
    }

    getFullDate = () => {
        var now = new moment().format("YYYYMMDD");
        return now
    }

    clock = () => {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = this.checkTime(m);
        s = this.checkTime(s);
        var time = h+':'+m+':'+s;
        this.setState({
            time: time
        });
        var t = setTimeout(this.clock, 1000);
    }
    checkTime = (i) => {
        if(i<10) 
        {
            i = "0"+i;
        }
        return i;
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
    actionButton = (button) => {
        this.setState({
            [`loading`+`${button}`] : true
        })
        this.setState({
            [`disabled`+`${button}`] : true
        })
        postCheckToken(this.props.email,this.props.password).then(data => {
            if(data[0] == 200) {
                postActionButton(data[1].token,this.props.email,this.getFullDate(),this.getFullHeure(),button,this.state.latitude,this.state.longitude).then(data => {
                    this.setState({
                        [`loading`+`${button}`] : false
                    })
                    if(data[0] == 200) {
                        this.setState({
                            [`disabled`+`${button}`] : false
                        })
                        this.setState({
                            isVisible : true
                        })
                    }
                    else {
                        this.setState({
                            isVisible : true
                        })
                    }
                })
            }
        })
    }

    Overlay = () => {
        return(
            <Overlay isVisible={this.state.isVisible} 
                overlayStyle = {{backgroundColor : '#008080'}}
                onBackdropPress={() => this.setState({ isVisible: false })} 
                width='auto' 
                height='auto'>
                <FontAwesome5 
                        name='clock' 
                        size={50} 
                        color='white' 
                        style={{textAlign:'center', padding:10}}>
                </FontAwesome5>
                <Text style={{textAlign:'center', fontSize:15, padding:5, color : 'white'}}>
                    Message à mettre juste ici 
                </Text>
            </Overlay>
        )
    }
    
    render(){
        return(
            <View style = {styles.main_containers}>
                {this.Overlay()}
                <StatusBar backgroundColor='#008080' barStyle="light-content"/>
                <Animatable.View animation = "fadeInDown" style = {styles.header}>
                        <View><Text style={styles.text_date}>{moment().format("dddd Do MMMM YYYY")}</Text></View>
                        <View style = {{ justifyContent :'center', alignItems : 'center'}}>
                            <View
                                style={styles.card_heure}>
                                    <Text style={styles.text_heure}>{this.state.time}</Text>
                            </View>
                        </View>
                </Animatable.View>
                <View style = {styles.button_containers}>
                    <View style = {styles.card_button}>
                        <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                            <TouchableOpacity
                                onPress={() => this.actionButton('f0')} 
                                disabled = {this.state.disabledf0}
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                    {
                                        (this.state.loadingf0 
                                            ? <ActivityIndicator size="large" color="#00ff00" />  
                                            : <FontAwesome5 name="user-clock" color= "white" size={50} />        
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                        <TouchableOpacity 
                                onPress={() => this.actionButton('f1')} 
                                disabled = {this.state.disabledf1}
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                    {
                                        (this.state.loadingf1
                                            ? <ActivityIndicator size="large" color="#00ff00" />  
                                            : <FontAwesome5 name="clock" color= "white" size={50} />        
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                    <View style = {styles.card_button}>
                    <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                            <TouchableOpacity 
                                onPress={() => this.actionButton('f2')}
                                disabled = {this.state.disabledf2} 
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                    {
                                        (this.state.loadingf2 
                                            ? <ActivityIndicator size="large" color="#00ff00" />  
                                            : <FontAwesome5 name="user-clock" color= "white" size={50} />        
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                            <TouchableOpacity 
                                onPress={() => this.actionButton('f3')}
                                disabled = {this.state.disabledf3} 
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                {
                                        (this.state.loadingf3 
                                            ? <ActivityIndicator size="large" color="#00ff00" />  
                                            : <FontAwesome5 name="user-clock" color= "white" size={50} />        
                                        )
                                }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                    <View style = {styles.card_button}>
                    <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                            <TouchableOpacity 
                                onPress={() => this.actionButton('f4')} 
                                disabled = {this.state.disabledf4}
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                {
                                        (this.state.loadingf4 
                                            ? <ActivityIndicator size="large" color="#00ff00" />  
                                            : <FontAwesome5 name="user-clock" color= "white" size={50} />        
                                        )
                                }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View animation = "bounceIn" style = {{flex : 1}}>
                            <TouchableOpacity 
                                onPress={() => this.actionButton('f5')} 
                                disabled = {this.state.disabledf5}
                                style = {{ flex : 1, margin : 10, borderRadius : 15, backgroundColor: "#008080"}}>
                                <View style = {{ flex : 1, alignItems : "center", justifyContent: "center"}}>
                                    {
                                            (this.state.loadingf5 
                                                ? <ActivityIndicator size="large" color="#00ff00" />  
                                                : <FontAwesome5 name="user-clock" color= "white" size={50} />        
                                            )
                                    }
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({ 
    main_containers:{
        flex : 1,
    },
    time_containers: {
        flex : 1,
        borderBottomEndRadius : 90,
        borderBottomLeftRadius : 90, 
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    header : {
        flex : 0.5,
        backgroundColor: '#008080',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderBottomLeftRadius : 50,
        borderBottomRightRadius : 50
    },
    text_date:{
        textAlign : 'center',
        marginTop : 50,
        color : "#fff",
        fontSize : 20
    },
    card_heure:{
        width : 200,
        height : 70,
        marginTop : 15,
        backgroundColor : "#008080" ,
        shadowColor: "#7F58FF",
        shadowRadius: 50,
        shadowOffset: {height:50},
        shadowOpacity:1,
        
    },
    text_heure:{
        textAlign:'center',
        fontSize:50,
        textAlign : "center",
        color : "#fff",
    },
    button_containers: {
        flex:1,
        marginTop : 20
    },
    card_button : {
        flex : 1 , 
        flexDirection: 'row', 
        marginBottom : 10,
    },
    content_card : {
        flex : 1, 
        margin : 10, 
        borderRadius : 15,
        backgroundColor: "white"
    },
    image: {
        height : 50
    },
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password
    }
}

export default connect(mapStateToProps) (ManagementTime)
