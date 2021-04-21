import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Image, FlatList, Vibration, RefreshControl, SafeAreaView } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { getToken, postAction, getUser } from '../api/index';
import Geolocation from 'react-native-geolocation-service';
import { listeEmailAction } from '../redux/actions/listeEmailAction';
import { pointingAction } from '../redux/actions/pointingHorsLigneAction';
import { Button, Overlay } from 'react-native-elements';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { PermissionsAndroid } from 'react-native';
import { getDistance } from 'geolib';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const geolib = require('geolib');

class ManagementTime extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            time: '',
            loadingList: true,
            latitude: '',
            longitude : '',
            visible: false,
            visibleListActivites: false,
            visibleMouvementsEnAttente: false,
            user : '',
            currentIco: '',
            currentLibelle: '',
            currentText: '', 
            compteurDelete : 0, 
            activeGeolocalisation : null,
            lieuxGeolocalisation : null,
            distance : false,
            statutUser : null,
            statut1 : null,
            statut2 : null,
            statut3 : null,
            statut4 : null,
            statut5 : null,
            errorServeur : false,
            activite : null,
            activites : null,
            activitesButton: null,
            activitesLibelle: null,
            activitesLocalisation: null,
            loaderOverlayResponse: false,
            refreshing: false,
            mouvementsEnAttente: false,
            mouvementText: '',
            icoEnvoyeSuccess: false,
            icoEnvoyeEchec: false,
            colorIcoEnvoye: '#008080'
        }
        //Français
        if(this.props.langue === '100') {
            this.props.navigation.setOptions({ title: 'Gestion du temps' });
        }
        //Allemand
        if(this.props.langue === '109') {
            this.props.navigation.setOptions({ title: 'Zeiteinteilung' });
        }
        //Espagnol
        if(this.props.langue === '134') {
            this.props.navigation.setOptions({ title: 'Gestión del tiempo' });
        }
        //Anglais
        if(this.props.langue === '132') {
            this.props.navigation.setOptions({ title: 'Time management' });
        }
        //Italien
        if(this.props.langue === '127') {
            this.props.navigation.setOptions({ title: 'Gestione del tempo' });
        }        
    }
    
    UNSAFE_componentWillMount() {
        this.renderClock();      
        this.sendPointingDeconnection();
        this.getDataCust();
        this.getMouvementsEnAttente();
    }

    componentWillUnmount = () => {
        clearInterval(this.IntervalClock);
        LocationServicesDialogBox.stopListener();
    }

    onRefresh = () => {
        this.setState({
            refreshing: true,
            loadingList: true
        });
        this.getDataCust();
        this.getMouvementsEnAttente();
    }

    getMouvementsEnAttente = () => {
        var dataPointing = this.props.pointing;
        if(dataPointing.length === 0) 
        {
            this.setState({
                mouvementsEnAttente: false
            });
        } 
        else 
        {
            this.setState({
                mouvementsEnAttente: true
            });
        }
    }

    getMouvementsEnAttenteByEmail = () => {
        var dataPointing = this.props.pointing;
        var mouvements = [];
        var compteur = 0;
        var date = '';
        var heure = '';
        dataPointing.forEach(element => { 
            if(element.email == this.props.email)
            {
                element.pointage.forEach(pointing => {
                    date = pointing[2].substring(6,8)+'/'+pointing[2].substring(4,6)+'/'+pointing[2].substring(0,4);
                    heure = pointing[3].substring(0,2)+'h'+pointing[3].substring(2,4);
                    mouvements.push({ key: compteur, date: date, heure: heure });
                    compteur++;
                });
            }
        });
        return mouvements;
    }

    sendPointingDeconnection() {

        var dataPointing = this.props.pointing
        var compteurDelete = 0
        var date = '';
        var heure = '';

        dataPointing.forEach(element => { 

            if(element.email == this.props.email)
            {
                this.setState({
                    visibleMouvementsEnAttente: true,
                    icoEnvoyeEchec: false,
                    icoEnvoyeSuccess: false
                });
                
                element.pointage.forEach(pointing => {
                    
                    date = pointing[2].substring(6,8)+'/'+pointing[2].substring(4,6)+'/'+pointing[2].substring(0,4);
                    heure = pointing[3].substring(0,2)+'h'+pointing[3].substring(2,4);

                    this.setState({
                        mouvementText: 'Mouvement du '+date+' à '+heure+' en cours d\'envoi'
                    });
                    
                    getToken(this.props.email, this.props.password).then(data => {
                    
                        if(data[0] == 200) 
                        {
                            postAction(data[1].token,pointing[0],pointing[1],pointing[2],pointing[3],pointing[4],pointing[5],pointing[6],null).then(data => {
                                    
                                if(data[0] == 200 && data[1].code == 200) 
                                {      
                                    compteurDelete++
                                    
                                    this.setState({
                                        mouvementText: 'Mouvement du '+date+' à '+heure+' envoyé',
                                        icoEnvoyeSuccess: true
                                    });

                                    if(compteurDelete == element.pointage.length) 
                                    {
                                        var removeIndex = dataPointing.map(function(item) { return item.email; }).indexOf(this.props.email);
                                        dataPointing.splice(removeIndex, 1);
                                        this.props.pointingAction(dataPointing)
                                        this.setState({
                                            visibleMouvementsEnAttente : false,
                                            errorServeur : false,
                                        });
                                    }
                                }
                                else 
                                {
                                    this.setState({
                                        visibleMouvementsEnAttente: false,
                                        errorServeur : true,
                                        visible : true,
                                        currentIco: null,
                                        currentLibelle: 'Erreur serveur',
                                        currentText: "Serveur Indisponible",
                                        icoEnvoyeEchec: true,
                                        icoEnvoyeSuccess: false
                                    });
                                }
                            });
                        }
                        else 
                        {
                            this.setState({
                                visibleMouvementsEnAttente : false,
                                errorServeur : true,
                                visible : true,
                                currentIco: null,
                                currentLibelle: 'Erreur serveur',
                                currentText: "Serveur Indisponible",
                                icoEnvoyeEchec: true,
                                icoEnvoyeSuccess: false
                            });
                        }
                    });
                });
            }
        });
    }

    getDataCust() 
    {
        getToken(this.props.email, this.props.password).then(data => {
            
            if(data[0] == 200) 
            {
                getUser(data[1].token, this.props.email).then(response => {
                    this.setState({
                        loadingList: false,
                        refreshing: false,
                        user: {
                            email: response[1].user.email,
                            profil: {
                                action0: {
                                    active: response[1].user.profil.action_0.active ,
                                    icoPresent: response[1].user.profil.action_0.ico_present,
                                    icoAbsent: response[1].user.profil.action_0.ico_absent,
                                    libellePresent: response[1].user.profil.action_0.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_0.libelle_absent,
                                    localisation: response[1].user.profil.action_0.localisation,
                                    activite: response[1].user.profil.action_0.activite
                                },
                                action1: {
                                    active: response[1].user.profil.action_1.active ,
                                    icoPresent: response[1].user.profil.action_1.ico_present,
                                    icoAbsent: response[1].user.profil.action_1.ico_absent,
                                    libellePresent: response[1].user.profil.action_1.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_1.libelle_absent,
                                    localisation: response[1].user.profil.action_1.localisation,
                                    activite: response[1].user.profil.action_1.activite
                                },
                                action2: {
                                    active: response[1].user.profil.action_2.active ,
                                    icoPresent: response[1].user.profil.action_2.ico_present,
                                    icoAbsent: response[1].user.profil.action_2.ico_absent,
                                    libellePresent: response[1].user.profil.action_2.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_2.libelle_absent,
                                    localisation: response[1].user.profil.action_2.localisation,
                                    activite: response[1].user.profil.action_2.activite
                                },
                                action3: {
                                    active: response[1].user.profil.action_3.active ,
                                    icoPresent: response[1].user.profil.action_3.ico_present,
                                    icoAbsent: response[1].user.profil.action_3.ico_absent,
                                    libellePresent: response[1].user.profil.action_3.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_3.libelle_absent,
                                    localisation: response[1].user.profil.action_3.localisation,
                                    activite: response[1].user.profil.action_3.activite
                                },
                                action4: {
                                    active: response[1].user.profil.action_4.active ,
                                    icoPresent: response[1].user.profil.action_4.ico_present,
                                    icoAbsent: response[1].user.profil.action_4.ico_absent,
                                    libellePresent: response[1].user.profil.action_4.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_4.libelle_absent,
                                    localisation: response[1].user.profil.action_4.localisation,
                                    activite: response[1].user.profil.action_4.activite
                                },
                                action5: {
                                    active: response[1].user.profil.action_5.active ,
                                    icoPresent: response[1].user.profil.action_5.ico_present,
                                    icoAbsent: response[1].user.profil.action_5.ico_absent,
                                    libellePresent: response[1].user.profil.action_5.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_5.libelle_absent,
                                    localisation: response[1].user.profil.action_5.localisation,
                                    activite: response[1].user.profil.action_5.activite
                                },
                            },
                            client: {
                                activeBadgeClient: response[1].user.client.activeBadge,
                                activeAbsenceClient: response[1].user.client.activeAbsence
                            },
                            activeBadgeUser: response[1].user.activeBadge,
                            activeAbsenceUser: response[1].user.activeAbsence,
                            activeGeolocalisation: response[1].user.activeLocalisation, 
                            lieuxGeolocalisation: response[1].user.lieux,
                            activites: response[1].user.activites,
                        },
                        statutUser: response[1].user.statut0,
                        statut1: response[1].user.statut1,
                        statut2: response[1].user.statut2,
                        statut3: response[1].user.statut3,
                        statut4: response[1].user.statut4,
                        statut5: response[1].user.statut5
                    });
                });
            }
            else
            {
                this.setState({
                    loadingList: false,
                    refreshing: false,
                    loaderOverlayResponse: true,
                    currentIco: null,
                    currentLibelle: "Erreur serveur",
                    currentText: "La liste n'a pas été mise à jour. Une erreur est survenue.",
                });
            }
        });
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
        this.IntervalClock = setInterval(() => {
            this.setState({
                time: moment().format('HH:mm:ss')
            })
        }, 1000);
    }

    requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted;
    }

    errorServeur = async (buttonError,lat,long,activite) => {

        this.setState({
            errorServeur : true,
            loadingList: false,
            loaderOverlayResponse: false,
            currentIco: null,
            currentLibelle: 'Erreur serveur',
            currentText: "Serveur actuellement indisponible.\nLe mouvement a été enregistré dans votre mobile."
        });

        if(buttonError == 'F00' || activite != null) 
        {
            var dataPointing = this.props.pointing
            var compteurTrouve = 0;  
            for(var i = 0; i < dataPointing.length; i++) 
            {
                if(dataPointing[i]['email'] == this.props.email) 
                {
                    dataPointing[i]['pointage'].push(
                        ['0',this.props.email,this.getFullDate(),this.getFullHeure(),buttonError,lat,long,activite]
                    )
                    compteurTrouve++;

                    this.props.pointingAction(dataPointing)

                    Vibration.vibrate(500)
                }
            }

            if(compteurTrouve == 0)
            {
                dataPointing.push(
                    {
                        'email' : this.props.email,
                        'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),buttonError,lat,long,activite]]       
                    }
                )

                this.props.pointingAction(dataPointing);

                Vibration.vibrate(500)
            }

        }
        else 
        {
            this.setState({
                currentText: "Serveur actuellement indisponible."                                   
            });                    
        }
    }

    actionButton = async (button, libelle, localisation, activite) => {

        this.setState({
            loadingList: true,
            visible: true,
            loaderOverlayResponse: true,
        });

        let ligne_1 = '';
        let ligne_2 = '';
        let ligne_3 = '';
        let ligne_4 = '';
        let dataIco = null;

        if(button == 'P00')
        {
            this.setState({
                loadingList: false,
                visible: false,
                loaderOverlayResponse: false,
            });
            this.sendPointingDeconnection();
        }

        if(!this.state.user.activeGeolocalisation) 
        {
            getToken(this.props.email, this.props.password).then(data => {
                
                if(data[0] == 200) 
                {
                    postAction(data[1].token, '1', this.props.email, this.getFullDate(), this.getFullHeure(), button, null, null, activite).then(data => {
                       
                        if(data[0] == 200 && data[1].code == 200) 
                        {
                            if(button == 'F00') 
                            {
                                Vibration.vibrate(500);
                            }   

                            ligne_1 = data[1].message.ligne_1;
                            ligne_2 = data[1].message.ligne_2;
                            ligne_3 = data[1].message.ligne_3;
                            ligne_4 = data[1].message.ligne_4;

                            if(ligne_1 !== '')
                            {
                                ligne_1 = ligne_1+'\n';
                            }
                            if(ligne_2 !== '')
                            {
                                ligne_2 = ligne_2+'\n';
                            }
                            if(ligne_3 !== '')
                            {
                                ligne_3 = ligne_3+'\n';
                            }
                                
                            if(data[1].ico !== '')
                            { 
                                dataIco = data[1].ico;
                            }
                                                    
                            this.setState({
                                loadingList: false,
                                loaderOverlayResponse: false,
                                statutUser: data[1].statut0,
                                statut1: data[1].statut1,
                                statut2: data[1].statut2,
                                statut3: data[1].statut3,
                                statut4: data[1].statut4,
                                statut5: data[1].statut5,
                                currentIco: dataIco,
                                currentLibelle: libelle,
                                currentText: ligne_1+ligne_2+ligne_3+ligne_4,
                            });
                        }
                        else 
                        {
                            this.errorServeur(button,this.state.latitude,this.state.longitude,activite);
                        }

                    });
                }
                else 
                {            
                    this.errorServeur(button,this.state.latitude,this.state.longitude,activite);
                }
            });
        }
        else 
        {
            if(localisation) 
            {
                this.requestLocationPermission().then(granted => {

                    if(granted === PermissionsAndroid.RESULTS.GRANTED) 
                    {
                        Geolocation.getCurrentPosition(info => 
                            this.setState({
                                latitude: info.coords.latitude.toString(),
                                longitude: info.coords.longitude.toString(),
                            }, 
                            () => {
                                var test = false

                                this.state.user.lieuxGeolocalisation.forEach(lieu => {
                                    var dis = getDistance(
                                        { latitude: this.state.latitude , longitude: this.state.longitude },
                                        { latitude: lieu.latitude, longitude: lieu.longitude }
                                    );
                                    if(dis <= lieu.marge) 
                                    {
                                        test = true
                                    }
                                });

                                if(test) 
                                {                                
                                    getToken(this.props.email,this.props.password).then(data => {
                                            
                                        if(data[0] == 200) 
                                        {
                                            postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),button,this.state.latitude,this.state.longitude,activite).then(data => {
                                                    
                                                if(data[0] == 200 && data[1].code == 200) 
                                                {
                                                    if(button == 'F00') 
                                                    {
                                                        Vibration.vibrate(500)
                                                    }

                                                    ligne_1 = data[1].message.ligne_1;
                                                    ligne_2 = data[1].message.ligne_2;
                                                    ligne_3 = data[1].message.ligne_3;
                                                    ligne_4 = data[1].message.ligne_4;

                                                    if(ligne_1 !== '')
                                                    {
                                                        ligne_1 = ligne_1+'\n';
                                                    }
                                                    if(ligne_2 !== '')
                                                    {
                                                        ligne_2 = ligne_2+'\n';
                                                    }
                                                    if(ligne_3 !== '')
                                                    {
                                                        ligne_3 = ligne_3+'\n';
                                                    }
                                                    
                                                    if(data[1].ico !== '')
                                                    {
                                                        dataIco = data[1].ico;
                                                    }

                                                    this.setState({
                                                        loadingList: false,
                                                        loaderOverlayResponse: false,
                                                        statutUser: data[1].statut0,
                                                        statut1: data[1].statut1,
                                                        statut2: data[1].statut2,
                                                        statut3: data[1].statut3,
                                                        statut4: data[1].statut4,
                                                        statut5: data[1].statut5,
                                                        currentIco: dataIco,
                                                        currentLibelle: libelle,
                                                        currentText: ligne_1+ligne_2+ligne_3+ligne_4,
                                                    }); 
                                                }
                                                else 
                                                {
                                                    this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                }
                                            });
                                        }
                                        else 
                                        {
                                            this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                        } 
                                    });
                                } 
                                else 
                                {    
                                    getToken(this.props.email,this.props.password).then(data => {

                                        if(data[0] == 200) 
                                        {
                                            postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite).then(data => {
                                                        
                                                if(data[0] == 200 && data[1].code == 200) 
                                                {
                                                    if(button == 'F00') 
                                                    {
                                                        Vibration.vibrate(500)
                                                    }

                                                    ligne_1 = data[1].message.ligne_1;
                                                    ligne_2 = data[1].message.ligne_2;
                                                    ligne_3 = data[1].message.ligne_3;
                                                    ligne_4 = data[1].message.ligne_4;

                                                    if(ligne_1 !== '')
                                                    {
                                                        ligne_1 = ligne_1+'\n';
                                                    }
                                                    if(ligne_2 !== '')
                                                    {
                                                        ligne_2 = ligne_2+'\n';
                                                    }
                                                    if(ligne_3 !== '')
                                                    {
                                                        ligne_3 = ligne_3+'\n';
                                                    }

                                                    this.setState({
                                                        loadingList: false,
                                                        loaderOverlayResponse: false,
                                                        statutUser: data[1].statut0,
                                                        statut1: data[1].statut1,
                                                        statut2: data[1].statut2,
                                                        statut3: data[1].statut3,
                                                        statut4: data[1].statut4,
                                                        statut5: data[1].statut5,
                                                        currentIco: null,
                                                        currentLibelle: libelle,
                                                        currentText: ligne_1+ligne_2+ligne_3+ligne_4,
                                                    });           
                                                }
                                                else 
                                                {
                                                    this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                }
                                            });
                                        } 
                                        else 
                                        {
                                            this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                        }
                                    });
                                }
                            })
                        )

                        
                    } 
                    else 
                    {
                        getToken(this.props.email,this.props.password).then(data => {
                            
                            if(data[0] == 200) 
                            {
                                postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null).then(data => {
                                    
                                    if(data[0] == 200 && data[1].code == 200) 
                                    {
                                        if(button == 'F00') 
                                        {
                                            Vibration.vibrate(500)
                                        }

                                        ligne_1 = data[1].message.ligne_1;
                                        ligne_2 = data[1].message.ligne_2;
                                        ligne_3 = data[1].message.ligne_3;
                                        ligne_4 = data[1].message.ligne_4;

                                        if(ligne_1 !== '')
                                        {
                                            ligne_1 = ligne_1+'\n';
                                        }
                                        if(ligne_2 !== '')
                                        {
                                            ligne_2 = ligne_2+'\n';
                                        }
                                        if(ligne_3 !== '')
                                        {
                                            ligne_3 = ligne_3+'\n';
                                        }

                                        this.setState({
                                            loadingList: false,
                                            loaderOverlayResponse: false,
                                            statutUser: data[1].statut0,
                                            statut1: data[1].statut1,
                                            statut2: data[1].statut2,
                                            statut3: data[1].statut3,
                                            statut4: data[1].statut4,
                                            statut5: data[1].statut5,
                                            currentIco: null,
                                            currentLibelle: libelle,
                                            currentText: ligne_1+ligne_2+ligne_3+ligne_4,
                                        });            
                                    }
                                    else 
                                    {
                                        this.errorServeur(button,null,null,activite)
                                    }
                                })
                            } 
                            else 
                            {
                                this.errorServeur(button,null,null,activite)
                            }
                        });
                    }
                });       
            }
            else 
            {
                getToken(this.props.email,this.props.password).then(data => {
                    
                    if(data[0] == 200) 
                    {
                        postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),button,null,null,activite).then(data => {
                            
                            if(data[0] == 200 && data[1].code == 200) 
                            {
                                if(button == 'F00') 
                                {
                                    Vibration.vibrate(500)
                                }

                                ligne_1 = data[1].message.ligne_1;
                                ligne_2 = data[1].message.ligne_2;
                                ligne_3 = data[1].message.ligne_3;
                                ligne_4 = data[1].message.ligne_4;

                                if(ligne_1 !== '')
                                {
                                    ligne_1 = ligne_1+'\n';
                                }
                                if(ligne_2 !== '')
                                {
                                    ligne_2 = ligne_2+'\n';
                                }
                                if(ligne_3 !== '')
                                {
                                    ligne_3 = ligne_3+'\n';
                                }
                                
                                if(data[1].ico !== '')
                                {
                                    dataIco = data[1].ico;
                                }

                                this.setState({
                                    loadingList: false,
                                    loaderOverlayResponse: false,
                                    statutUser: data[1].statut0,
                                    
                                    currentIco: dataIco,
                                    currentLibelle: libelle,
                                    currentText: ligne_1+ligne_2+ligne_3+ligne_4,
                                });        
                            }
                            else 
                            {
                                this.errorServeur(button,null,null,activite)
                            }
                        })
                    }
                    else 
                    {
                        this.errorServeur(button,null,null,activite)
                    }
                })
            }           
        }
    }

    dialogPopup = (ico, title, text) => {

        return(
            <Overlay isVisible = { this.state.visible } overlayStyle = {{ padding : 0 }} fullScreen = { true } animationType = 'slide'>
                {   
                    this.state.loaderOverlayResponse ? 
                        <View style = { styles.container_overlay }>
                            <View style = { styles.loader_overlay }>
                                <ActivityIndicator size = "large" color = "#008080"/> 
                            </View>
                        </View>
                    :
                        <View style = { styles.container_overlay }>
                            <View style = { styles.container_global_header_overlay }>
                                <Animatable.View animation="bounceIn" delay = { 0 } style = { styles.container_animation_header_overlay }>
                                    <View style = { styles.container_title_overlay }>
                                        <Text style = { styles.text_title_overlay }>{ title }</Text>
                                    </View>
                                </Animatable.View>
                            </View>
                            <View style = { styles.container_global_tiles_overlay }>
                                <Animatable.View animation = "bounceIn" delay = { 300 } style = { styles.container_animation_overlay_ico }>
                                    <View style = { styles.container_ico_overlay }>
                                        {
                                            this.state.errorServeur || this.state.currentIco === null ?               
                                                <FontAwesome5 name = "exclamation-triangle" color = "#C72C41" size = { 50 }/>
                                            :                         
                                                <Image style = { styles.ico_overlay } source = {{ uri: `data:image/png;base64,${ico}` }}/>
                                        }
                                    </View>
                                </Animatable.View>
                                <Animatable.View animation = "bounceIn" delay = { 600 } style = { styles.container_animation_overlay_text }>
                                    <View style = { styles.container_text_overlay }>
                                        <Text style = { styles.text_body_overlay }>{ text }</Text>
                                    </View>
                                </Animatable.View>
                                <Button buttonStyle = { styles.button_overlay_accept } title = "OK" onPress = { () => this.setState({ visible: false, visibleListActivites : false }) }/>
                            </View> 
                        </View> 
                }
            </Overlay>
        )

    }

    buttons = (user) => {

        let libelles =  [];
        
        if(this.state.mouvementsEnAttente)
        {
            libelles.push({ key: 0, libelle : 'Envoi des mouvements en attente', ico : '', button : 'P00', delay : 0, localisation : this.state.mouvementsEnAttente, activite : false });
        }

        if(user.profil.action0.active)
        {
            if(this.state.statutUser) 
            {    
                libelles.push({ key  : 1, libelle : user.profil.action0.libellePresent, ico : user.profil.action0.icoPresent, button : 'F00', delay: 0, localisation : user.profil.action0.localisation, activite : user.profil.action0.activite });
            } 
            else 
            {
                libelles.push({ key : 1, libelle : user.profil.action0.libelleAbsent, ico : user.profil.action0.icoAbsent, button : 'F00', delay: 0, localisation : user.profil.action0.localisation, activite : user.profil.action0.activite });
            }
        }
        
        if(user.profil.action1.active)
        {
            if(this.state.statut1) 
            {
                libelles.push({ key : 2, libelle : user.profil.action1.libellePresent, ico : user.profil.action1.icoPresent, button : 'F01', delay : 200, localisation : user.profil.action1.localisation, activite : user.profil.action1.activite});
            }
            else 
            {
                libelles.push({ key : 2, libelle : user.profil.action1.libelleAbsent, ico : user.profil.action1.icoAbsent, button : 'F01', delay : 200, localisation : user.profil.action1.localisation, activite : user.profil.action1.activite});
            }
        }

        if(user.profil.action2.active)
        {
            if(this.state.statut2) 
            {
                libelles.push({ key : 3, libelle : user.profil.action2.libellePresent, ico : user.profil.action2.icoPresent, button : 'F02', delay : 400, localisation : user.profil.action2.localisation, activite : user.profil.action2.activite});
            }
            else 
            {
                libelles.push({ key : 3, libelle : user.profil.action2.libelleAbsent, ico : user.profil.action2.icoAbsent, button : 'F02', delay : 400, localisation : user.profil.action2.localisation, activite : user.profil.action2.activite});
            }
        }

        if(user.profil.action3.active)
        {
            if(this.state.statut3)
            {
                libelles.push({ key : 4, libelle : user.profil.action3.libellePresent, ico : user.profil.action3.icoPresent, button : 'F03', delay : 600, localisation : user.profil.action3.localisation, activite : user.profil.action3.activite});
            }
            else 
            {
                libelles.push({ key : 4, libelle : user.profil.action3.libelleAbsent, ico : user.profil.action3.icoAbsent, button : 'F03', delay : 600, localisation : user.profil.action3.localisation, activite : user.profil.action3.activite});
            }
        }
        
        if(user.profil.action4.active)
        {
            if(this.state.statut4)
            {
                libelles.push({ key : 5, libelle : user.profil.action4.libellePresent, ico : user.profil.action4.icoPresent, button : 'F04', delay : 800, localisation : user.profil.action4.localisation, activite : user.profil.action4.activite});
            }
            else
            {
                libelles.push({ key : 5, libelle : user.profil.action4.libelleAbsent, ico : user.profil.action4.icoAbsent, button : 'F04', delay : 800, localisation : user.profil.action4.localisation, activite : user.profil.action4.activite});
            }
        }

        if(user.profil.action5.active)
        {
            if(this.state.statut5)
            {
                libelles.push({ key : 6, libelle : user.profil.action5.libellePresent, ico : user.profil.action5.icoPresent, button : 'F05', delay : 1000, localisation : user.profil.action5.localisation, activite : user.profil.action5.activite });
            }
            else
            {                
                libelles.push({ key : 6, libelle : user.profil.action5.libelleAbsent, ico : user.profil.action5.icoAbsent, button : 'F05', delay : 1000, localisation : user.profil.action5.localisation, activite : user.profil.action5.activite });
            }
        }

        return(
            <SafeAreaView>
                <FlatList data = { libelles } 
                    renderItem = { ({ item }) => 
                        <Animatable.View animation = "bounceIn" delay = { item.delay } style = { styles.container_button_animation }>
                            <TouchableOpacity 
                                onPress={ () => { 
                                    if(item.activite)
                                    { 
                                        this.showActiviteList(item.button, item.libelle, item.localisation) 
                                    } 
                                    else 
                                    { 
                                        this.actionButton(item.button, item.libelle, item.localisation, null) 
                                    } 
                                } } 
                                style={ styles.button }
                            >     
                                <View style={ styles.container_ico }>
                                    {
                                        item.ico !== '' ?
                                            <Image style={ styles.image } source={{ uri: `data:image/png;base64,${item.ico}` }} />
                                        :
                                            <FontAwesome5 style={{ padding: 10 }} name = "exclamation-circle" color = "#C72C41" size = { 40 }/>
                                    }
                                    <Text>{ item.libelle }</Text>
                                </View>
                            </TouchableOpacity>
                        </Animatable.View>
                    }
                    refreshControl = { <RefreshControl refreshing = { this.state.refreshing } onRefresh = { () => this.onRefresh() }/> }>
                </FlatList>
            </SafeAreaView>
        )

    }

    showActiviteList = (button, libelle, localisation) => {

        this.setState({
            visibleListActivites: true,
            activitesButton: button,
            activitesLibelle: libelle,
            activitesLocalisation: localisation
        });

    }

    

    activitesList = (button, libelle, localisation, activites) => {

        return(
            <Overlay isVisible = { this.state.visibleListActivites } overlayStyle = {{ padding : 0 }} fullScreen = { true } animationType = 'slide'>
                <View style = { styles.container_overlay }>
                    <View style= {{ alignItems : 'center', justifyContent : 'center', backgroundColor : '#008080', height : 60, marginBottom: 1}}>
                        <Text style= {{ fontSize : 20, fontWeight : "bold", color : 'white' }}>Activités disponibles</Text>
                    </View>
                    <FlatList data={ activites } 
                        renderItem={({ item, index }) => 
                            <Animatable.View animation = "bounceIn" delay = { index * 300 } style = { styles.container_button_animation }>
                                <Button 
                                    onPress={ () => this.actionButton(button, libelle, localisation, item.code) } 
                                    buttonStyle= { styles.buttons_list_activites }
                                    title = { item.nom }
                                />
                            </Animatable.View>
                        }
                        keyExtractor = { item => item.code }
                    ></FlatList>
                    <Button buttonStyle = { styles.button_overlay_accept } title = "Retour" onPress = { () => this.setState({ visibleListActivites: false }) }/>
                </View>
            </Overlay>
        )

    }

    mouvementsEnAttente = () => {
        var mouvements = this.getMouvementsEnAttenteByEmail();
        return (
            <Overlay isVisible = { this.state.visibleMouvementsEnAttente } overlayStyle = {{ padding : 0 }} fullScreen = { true } animationType = 'slide'>
                <View style = { styles.container_overlay }>
                    <View style = { styles.container_global_header_overlay }>
                        <Animatable.View animation="bounceIn" delay = { 0 } style = { styles.container_animation_header_overlay }>
                            <View style = { styles.container_title_overlay }>
                                <FontAwesome5 name = "arrow-alt-circle-up" color = "white" size = { 50 } style = {{ marginBottom: 10 }}/>
                                <Text style = { styles.text_title_overlay }>Envoi des mouvements en attente en cours. Merci de bien vouloir patienter.</Text>
                            </View>
                        </Animatable.View>
                        <View style = { styles.container_global_tiles_overlay }>
                            <Animatable.View animation = "bounceIn" delay = { 300 } style = { styles.container_animation_overlay_ico }>
                                <View style = { styles.container_ico_overlay }>        
                                    <Text>{ this.state.mouvementText }</Text>
                                </View>
                            </Animatable.View>
                            <Animatable.View animation = "bounceIn" delay = { 600 } style = { styles.container_animation_overlay_text }>
                                <View style = { styles.container_mouvement_overlay }>
                                    <FlatList data = { mouvements } 
                                        renderItem = { ({ item }) => 
                                            <View style = { styles.container_list_mouvement }>
                                                {
                                                    this.state.icoEnvoyeSuccess || this.state.icoEnvoyeEchec ?
                                                        <FontAwesome5 name = "arrow-alt-check" color = { this.state.colorIcoEnvoye } size = { 20 } style = {{ paddingHorizontal: 10 }}/> 
                                                    :
                                                        <FontAwesome5 name = "arrow-alt-circle-right" color = "grey" size = { 20 } style = {{ paddingHorizontal: 10 }}/>
                                                }
                                                <Text style = { styles.text_mouvement_overlay }>Mouvement du { item.date } à { item.heure }</Text> 
                                            </View>
                                        }>
                                    </FlatList>
                                </View>
                            </Animatable.View>
                        </View> 
                    </View> 
                </View>
            </Overlay>
        )

    }

    render(){
        const { loadingList, currentIco, currentLibelle, currentText, user, activitesButton, activitesLibelle, activitesLocalisation } = this.state;
        return(
            <View style = { styles.container }>
                <StatusBar backgroundColor = "#008080" barStyle = "light-content"/> 
                <View style = { styles.container_global_header }>
                    <Animatable.View animation = "bounceIn" style = { styles.container_header }>
                        <View style={ styles.container_clock }>
                            <Text style={ styles.text_date }>{ moment().format("dddd Do MMMM YYYY").toUpperCase() }</Text>
                            <Text style={ styles.text_heure }>{ this.state.time }</Text>
                        </View> 
                    </Animatable.View>
                </View>
                <View style={ styles.container_global_tiles }>
                    { 
                        loadingList ? 
                                <ActivityIndicator size = "large" color = "#008080" style={ styles.container_loader } /> 
                            : 
                                this.buttons(user) 
                    }
                </View>
                { this.dialogPopup(currentIco, currentLibelle, currentText) }
                { this.activitesList(activitesButton, activitesLibelle, activitesLocalisation, user.activites) }
                { this.mouvementsEnAttente() }
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
        padding: 20, 
        backgroundColor : '#008080',
        elevation: 5,
        borderRadius : 5,
        justifyContent: 'center',
        alignItems: 'center'
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
    container_header : {
        flex: 1,
        paddingTop: 20,
        padding: 10, 
    },
    container_animation_header_overlay : {
        flex: 1,
        paddingTop: 20,
        padding: 10, 
    },
    container_global_tiles: {
        flex:2,
    },
    container_global_tiles_overlay: {
        flex:3,
    },
    container_global_header: {
        flex : 1 , 
    },
    container_global_header_overlay: {
        flex : 1 , 
    },
    container_button_animation: {
        flex : 1 , 
        padding: 10
    },
    container_animation_overlay: {
        flex : 1 , 
        padding: 10
    },
    container_animation_overlay_ico: {
        flex : 1 , 
        padding: 10
    },
    container_animation_overlay_text: {
        flex : 2 , 
        padding: 10
    },
    container_list_mouvement: {
        flex : 2 , 
        padding: 5,
        flexDirection: 'row'
    },
    container_ico: {
        flex : 1, 
        alignItems : "center", 
        justifyContent: "center"
    },
    container_overlay: {
        flex: 1
    },  
    button:{ 
        padding: 20, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        // flexDirection : 'row',
        // marginBottom : 10
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
    container_text_overlay:{ 
        padding: 20, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container_mouvement_overlay:{ 
        padding: 15, 
        backgroundColor : 'white',
        elevation: 5,
        borderRadius : 5,
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    image: {
        height : 50,
        width: 50,
        marginVertical: 10
    },
    ico_overlay : {
        height : 50,
        width: 50,
        padding: 20
    },
    text_date: {
        textAlign : 'center',
        // marginTop : 20,
        color : "#fff",
        fontSize : 20
    },
    text_errorServeur: {
        textAlign : 'center',
        color : "#F25431",
        fontSize : 18
    },
    text_heure:{
        textAlign:'center',
        fontSize: 40,
        // textAlign : "center",
        color : "#fff",
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
    text_title_overlay: {
        textAlign: 'center',
        fontSize : 17,
        color: 'white'
    },
    text_body_overlay: {
        textAlign: 'center',
        fontSize : 15,
        padding: 20
    },
    text_mouvement_overlay: {
        textAlign: 'center',
        fontSize : 15,
    },
    text_envoi_hors_ligne: {
        fontSize : 20, 
        textAlign : "center", 
        color : "white"
    },
    buttons_list_activites: {
        padding: 20, 
        backgroundColor : '#16A085',
        elevation: 5,
        borderRadius : 5,
    },  
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: '#008080',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20
    },
    loader_overlay: {
        flex : 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails,
        langue: state.langueReducer.langue
    }
}

export default connect(mapStateToProps,{listeEmailAction, pointingAction}) (ManagementTime)
