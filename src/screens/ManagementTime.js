import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Image, FlatList, Vibration} from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { getToken, postAction, getUser } from '../api/index';
import Geolocation from '@react-native-community/geolocation';
import {listeEmailAction} from '../redux/actions/listeEmailAction';
import {pointingAction} from '../redux/actions/pointingHorsLigneAction';
import { Button, Overlay} from 'react-native-elements';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import {PermissionsAndroid} from 'react-native';
import { getDistance } from 'geolib';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const geolib = require('geolib');

class ManagementTime extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            initialPosition: '', 
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
            visibleListActivites: false,
            disabled : false,
            user : '',
            currentIco: '',
            currentLibelle: '',
            currentText: '', 
            compteurDelete : 0, 
            loading : false, 
            etatgeolocalisation : 1,
            activeGeolocalisation : null,
            lieuxGeolocalisation : null,
            distance : false,
            host : null,
            ip : null,
            program : null,
            userAS400 : null,
            passwordAS400 : null,
            statutUser : null,
            icoPresent : null,
            icoAbsent : null,
            errorServeur : false,
            activite : null,
            activites : null,
            activitesButton: null,
            activitesLibelle: null,
            activitesLocalisation: null,
            loaderOverlayResponse: false,
        }
    }
    
    UNSAFE_componentWillMount() {
        this.renderClock();      
        this.sendPointingDeconnection();
        this.getDataCust();
    }

    componentWillUnmount = () => {
        clearInterval(this.IntervalClock);
        LocationServicesDialogBox.stopListener();
    }

// Envoie le pointage de déconnexion 
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
                                postAction(data[1].token,pointing[0],pointing[1],pointing[2],pointing[3],pointing[4],pointing[5],pointing[6],null).then(data => {
                                    if(data[0] == 200) {
                                            compteurDelete++
                                            if(compteurDelete == element.pointage.length) {
                                                var removeIndex = dataPointing.map(function(item) { return item.email; }).indexOf(this.props.email);
                                                dataPointing.splice(removeIndex, 1);
                                                this.props.pointingAction(dataPointing)
                                                this.setState({
                                                    loading : false,
                                                    errorServeur : false,
                                                })
                                            }
                                    }else {
                                        this.setState({
                                            loading : false,
                                            errorServeur : true,
                                            visible : true,
                                            currentIco: null,
                                            currentLibelle: 'Erreur serveur',
                                            currentText: "Serveur Indisponible"

                                        })
                                    }
                                })
                            }else {
                                this.setState({
                                    loading : false,
                                    errorServeur : true,
                                    visible : true,
                                    currentIco: null,
                                    currentLibelle: 'Erreur serveur',
                                    currentText: "Serveur Indisponible"

                                })
                            }
                        })
                    })
                }
            });
    }

// Recuperer les infos de l'utilisateur 
    getDataCust() 
    {
        getToken(this.props.email, this.props.password).then(data => {
            
            if(data[0] == 200) 
            {
                getUser(data[1].token, this.props.email).then(response => {
                    this.setState({
                        loadingList: false,
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
                        statutUser: response[1].user.statut

                        // icoAbsent : response[1].user.icoAbsent,
                        // icoPresent : response[1].user.icoPresent,
                    })
                    // {
                    //     response[1].user.client.activeBadge == false && response[1].user.activeBadge == false ?
                    //         (
                    //             response[1].user.profil.action_0.active = false

                    //         ) : (
                                
                    //             response[1].user.client.activeBadge == false || response[1].user.activeBadge == false ? 
                    //                     (
                    //                         response[1].user.profil.action_0.active = false

                    //                     ) : (
                    //                         null
                    //                     )
                    //             )
                    // }
                    // if( response[1].user.statut == true ) {
                    //     this.setState({
                    //         loadingList: false,
                    //         user: {
                    //             'email': response[1].user.email,
                    //             'profil': {
                    //                 'action0': {
                    //                     'active': response[1].user.profil.action_0.active ,
                    //                     'ico_present': response[1].user.profil.action_0.icoPresent,
                    //                     'ico_absent': response[1].user.icoAbsent,
                    //                     'libelle': response[1].user.profil.action_0.libelle,
                    //                     'localisation' : response[1].user.profil.action_0.localisation,
                    //                     'activite' : response[1].user.profil.action_0.activite
                    //                 },
                    //                 'action1': {
                    //                     'active': response[1].user.profil.action_1.active,
                    //                     'ico': response[1].user.profil.action_1.ico,
                    //                     'libelle': response[1].user.profil.action_1.libelle,
                    //                     'localisation' : response[1].user.profil.action_1.localisation, 
                    //                     'activite' : response[1].user.profil.action_1.activite
                    //                 },
                    //                 'action2': {
                    //                     'active': response[1].user.profil.action_2.active,
                    //                     'ico': response[1].user.profil.action_2.ico,
                    //                     'libelle': response[1].user.profil.action_2.libelle,
                    //                     'localisation' : response[1].user.profil.action_2.localisation, 
                    //                     'activite' : response[1].user.profil.action_2.activite
                    //                 },
                    //                 'action3': {
                    //                     'active': response[1].user.profil.action_3.active,
                    //                     'ico': response[1].user.profil.action_3.ico,
                    //                     'libelle': response[1].user.profil.action_3.libelle,
                    //                     'localisation' : response[1].user.profil.action_3.localisation, 
                    //                     'activite' : response[1].user.profil.action_3.activite
                    //                 },
                    //                 'action4': {
                    //                     'active': response[1].user.profil.action_4.active,
                    //                     'ico': response[1].user.profil.action_4.ico,
                    //                     'libelle': response[1].user.profil.action_4.libelle,
                    //                     'localisation' : response[1].user.profil.action_4.localisation, 
                    //                     'activite' : response[1].user.profil.action_4.activite
                    //                 },
                    //                 'action5': {
                    //                     'active': response[1].user.profil.action_5.active,
                    //                     'ico': response[1].user.profil.action_5.ico,
                    //                     'libelle': response[1].user.profil.action_5.libelle,
                    //                     'localisation' : response[1].user.profil.action_5.localisation,
                    //                     'activite' : response[1].user.profil.action_5.activite
                    //                 }
                    //             }
                    //         }
                    //     })
                    // } else {
                    //     this.setState({
                    //         loadingList: false,
                    //         user: {
                    //             'email': response[1].user.email,
                    //             'profil': {
                    //                 'action0': {
                    //                     'active': response[1].user.profil.action_0.active ,
                    //                     'ico': response[1].user.icoPresent,
                    //                     'libelle': response[1].user.profil.action_0.libelle,
                    //                     'localisation' : response[1].user.profil.action_0.localisation, 
                    //                     'activite' : response[1].user.profil.action_0.activite
                    //                 },
                    //                 'action1': {
                    //                     'active': response[1].user.profil.action_1.active,
                    //                     'ico': response[1].user.profil.action_1.ico,
                    //                     'libelle': response[1].user.profil.action_1.libelle,
                    //                     'localisation' : response[1].user.profil.action_1.localisation,
                    //                     'activite' : response[1].user.profil.action_1.activite
                    //                 },
                    //                 'action2': {
                    //                     'active': response[1].user.profil.action_2.active,
                    //                     'ico': response[1].user.profil.action_2.ico,
                    //                     'libelle': response[1].user.profil.action_2.libelle,
                    //                     'localisation' : response[1].user.profil.action_2.localisation, 
                    //                     'activite' : response[1].user.profil.action_2.activite
                    //                 },
                    //                 'action3': {
                    //                     'active': response[1].user.profil.action_3.active,
                    //                     'ico': response[1].user.profil.action_3.ico,
                    //                     'libelle': response[1].user.profil.action_3.libelle,
                    //                     'localisation' : response[1].user.profil.action_3.localisation,
                    //                     'activite' : response[1].user.profil.action_3.activite
                    //                 },
                    //                 'action4': {
                    //                     'active': response[1].user.profil.action_4.active,
                    //                     'ico': response[1].user.profil.action_4.ico,
                    //                     'libelle': response[1].user.profil.action_4.libelle,
                    //                     'localisation' : response[1].user.profil.action_4.localisation, 
                    //                     'activite' : response[1].user.profil.action_4.activite
                    //                 },
                    //                 'action5': {
                    //                     'active': response[1].user.profil.action_5.active,
                    //                     'ico': response[1].user.profil.action_5.ico,
                    //                     'libelle': response[1].user.profil.action_5.libelle,
                    //                     'localisation' : response[1].user.profil.action_5.localisation,
                    //                     'activite' : response[1].user.profil.action_5.activite 
                    //                 }
                    //             }
                    //         }
                    //     })
                    // }

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

    errorServeur = async (buttonError,lat,long,activite) => {
        this.setState({
            errorServeur : true,
        });

        if(buttonError == 'F00') 
        {
            var dataPointing = this.props.pointing
            var compteurTrouve = 0;  
            for(var i = 0; i < dataPointing.length; i++) 
            {
                if(dataPointing[i]['email'] == this.props.email) 
                {
                    dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),buttonError,lat,long,activite])
                    compteurTrouve++;
                    this.props.pointingAction(dataPointing)
                    this.setState({
                        loadingList: false,
                        loaderOverlayResponse: false,
                        currentIco: null,
                        currentLibelle: 'Erreur serveur',
                        currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                    });

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
                this.props.pointingAction(dataPointing)
                this.setState({
                    loadingList: false,
                    loaderOverlayResponse: false,
                    currentIco: null,
                    currentLibelle: 'Erreur serveur',
                    currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                });

                Vibration.vibrate(500)
            }

        }
        else 
        {
            this.setState({
                loadingList: false,
                loaderOverlayResponse: false,
                currentIco: null,
                currentLibelle: 'Erreur serveur',
                currentText: "Serveur Indisponible"                                   
            })                    
        }
    }

    actionButton = async (button, libelle, localisation, activite) => {

        this.setState({
            loadingList: true,
            visible: true,
            loaderOverlayResponse: true,
        });

        if(this.state.user.activeGeolocalisation == false) 
        {
            getToken(this.props.email, this.props.password).then(data => {
                
                if(data[0] == 200) 
                {
                    postAction(data[1].token, '1', this.props.email, this.getFullDate(), this.getFullHeure(), button, this.state.latitude, this.state.longitude, activite).then(data => {
                        
                        if(data[0] == 200) 
                        {
                            if(button == 'F00') 
                            {
                                Vibration.vibrate(500);
                            }   

                            this.setState({
                                loadingList: false,
                                loaderOverlayResponse: false,
                                statutUser: data[1].statut,
                                currentIco: data[1].ico,
                                currentLibelle: libelle,
                                currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                            });
                        }
                        else 
                        {
                            this.errorServeur(button,this.state.latitude,this.state.longitude,activite);
                        }

                    })
                }
                else 
                {               
                    this.errorServeur(button,this.state.latitude,this.state.longitude,activite);
                }
            })
        }
        else 
        {
            if(localisation) 
            {
                try 
                {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) 
                    {
                        LocationServicesDialogBox.checkLocationServicesIsEnabled({
                            message: "<h2>Authoriser la localisation ?</h2>L'application à besoin d'accéder à vos données de localisation pour fonctionner.<br/>",           
                            ok: "OK",
                            cancel: "NON, MERCI",
                            enableHighAccuracy: true,
                            showDialog: true,
                            openLocationServices: true,
                            preventOutSideTouch: false,
                            preventBackClick: false,
                            providerListener: true
                        }).then(function(success) {
                            Geolocation.getCurrentPosition(info => 
                                this.setState({
                                    latitude : info.coords.latitude.toString(),
                                    longitude : info.coords.longitude.toString(),
                                }, () => {
                                    var test = false
                                    this.state.user.lieuxGeolocalisation.forEach(pointing => {
                                        var dis = getDistance(
                                            { latitude: this.state.latitude , longitude: this.state.longitude },
                                            { latitude: pointing.latitude, longitude: pointing.longitude }
                                        );
                                        if(dis <= pointing.marge) {
                                            test = true
                                        }
                                    })

                                    if(test == true) 
                                    {                                
                                        getToken(this.props.email,this.props.password).then(data => {
                                            
                                            if(data[0] == 200) 
                                            {
                                                postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),button,this.state.latitude,this.state.longitude,activite).then(data => {
                                                    
                                                    if(data[0] == 200) 
                                                    {
                                                        if(button == 'F00') 
                                                        {
                                                            Vibration.vibrate(500)
                                                        }

                                                        this.setState({
                                                            loadingList: false,
                                                            loaderOverlayResponse: false,
                                                            statutUser: data[1].statut,
                                                            currentIco: data[1].ico,
                                                            currentLibelle: libelle,
                                                            currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                                                        }); 
                                                    }
                                                    else 
                                                    {
                                                        this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                    }
                                                })
                                            }
                                            else 
                                            {
                                                this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                            } 
                                        })
                                    } 
                                    else 
                                    {    
                                        getToken(this.props.email,this.props.password).then(data => {

                                            if(data[0] == 200) 
                                            {
                                                postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite).then(data => {
                                                        
                                                    if(data[0] == 200) 
                                                    {
                                                        if(button == 'F00') 
                                                        {
                                                            Vibration.vibrate(500)
                                                        }

                                                        this.setState({
                                                            loadingList: false,
                                                            loaderOverlayResponse: false,
                                                            statutUser: data[1].statut,
                                                            currentIco: data[1].ico,
                                                            currentLibelle: libelle,
                                                            currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                                                        });           
                                                    }
                                                    else 
                                                    {
                                                        this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                            // this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                        // this.setState({
                                                        //     errorServeur : true,
                                                        //         // visible : true,
                                                        // })
                                                            // if(button == 'F00') {
                                                            //     var dataPointing = this.props.pointing
                                                            //     var compteurTrouve = 0;  
                                                            //     for(var i = 0; i<dataPointing.length; i++) {
                                                            //         if(dataPointing[i]['email'] == this.props.email) {
                                                            //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite])
                                                            //             compteurTrouve++;
                                                            //             this.props.pointingAction(dataPointing)
                                                            //             this.setState(prevState => ({
                                                            //             // [`loading`+`${button}`] : false,
                                                            //             // disabled : false,
                                                            //             // statutIco : !prevState.statutIco,
                                                            //             loadingList: false,
                                                            //             // visible : true,
                                                            //             loaderOverlayResponse: false,
                                                            //             currentIco: null,
                                                            //             currentLibelle: 'Erreur serveur',
                                                            //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                                            //             }))
                                                            //             Vibration.vibrate(500)
                                                            //         }
                                                            //     }
                                                            //     if(compteurTrouve == 0){
                                                            //         dataPointing.push(
                                                            //             {
                                                            //                 'email' : this.props.email,
                                                            //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite]]       
                                                            //             }
                                                            //         )
                                                            //         this.props.pointingAction(dataPointing)
                                                            //         this.setState(prevState => ({
                                                            //             // [`loading`+`${button}`] : false,
                                                            //             // disabled : false,
                                                            //             // statutIco : !prevState.statutIco,
                                                            //             loadingList: false,
                                                            //             // visible : true,
                                                            //             loaderOverlayResponse: false,
                                                            //             currentIco: null,
                                                            //             currentLibelle: 'Erreur serveur',
                                                            //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                                            //         }))
                                                            //         Vibration.vibrate(500)
                                                            //     }
                                                            // }else {
                                                            //     this.setState({
                                                            //         // [`loading`+`${button}`] : false,
                                                            //         // disabled : false,
                                                            //         // visible : true,
                                                            //         loadingList: false,
                                                            //         loaderOverlayResponse: false,
                                                            //         currentIco: null,
                                                            //         currentLibelle: 'Erreur serveur',
                                                            //         currentText: "Serveur Indisponible"                                   
                                                            //     })                    
                                                            // }
                                                            //////////////////////////////////////////
                                                    }
                                                })
                                            } 
                                            else 
                                            {
                                                this.errorServeur(button,this.state.latitude,this.state.longitude,activite)
                                                    /////////////////////////////////////
                                                    // this.setState({
                                                    //     errorServeur : true,
                                                    //     // visible : true,
                                                    // })
                                                    // if(button == 'F00') {
                                                    //     var dataPointing = this.props.pointing
                                                    //     var compteurTrouve = 0;  
                                                    //     for(var i = 0; i<dataPointing.length; i++) {
                                                    //         if(dataPointing[i]['email'] == this.props.email) {
                                                    //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite])
                                                    //             compteurTrouve++;
                                                    //             this.props.pointingAction(dataPointing)
                                                    //             this.setState(prevState => ({
                                                    //             // [`loading`+`${button}`] : false,
                                                    //             // disabled : false,
                                                    //             // statutIco : !prevState.statutIco,
                                                    //             loadingList: false,
                                                    //             loaderOverlayResponse: false,
                                                    //             currentIco: null,
                                                    //             currentLibelle: 'Erreur serveur',
                                                    //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                                    //             }))
                                                    //             Vibration.vibrate(500)
                                                    //         }
                                                    //     }
                                                    //     if(compteurTrouve == 0){
                                                    //         dataPointing.push(
                                                    //             {
                                                    //                 'email' : this.props.email,
                                                    //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),'E01',this.state.latitude,this.state.longitude,activite]]       
                                                    //             }
                                                    //         )
                                                    //         this.props.pointingAction(dataPointing)
                                                    //         this.setState(prevState => ({
                                                    //             // [`loading`+`${button}`] : false,
                                                    //             // disabled : false,
                                                    //             // statutIco : !prevState.statutIco,
                                                    //             loadingList: false,
                                                    //             loaderOverlayResponse: false,
                                                    //             // visible : true,
                                                    //             currentIco: null,
                                                    //             currentLibelle: 'Erreur serveur',
                                                    //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                                    //         }))
                                                    //         Vibration.vibrate(500)
                                                    //     }
                                                    // }else {
                                                    //     this.setState({
                                                    //         // [`loading`+`${button}`] : false,
                                                    //         // disabled : false,
                                                    //         // visible : true,
                                                    //         loadingList: false,
                                                    //         loaderOverlayResponse: false,
                                                    //         currentIco: null,
                                                    //         currentLibelle: 'Erreur serveur',
                                                    //         currentText: "Serveur Indisponible"                                   
                                                    //     })                    
                                                    // }
                                                    ///////////////////////////////////
                                            }
                                        })
                                    }
                                })
                            )
                        }.bind(this)).catch((error) => {

                            getToken(this.props.email,this.props.password).then(data => {
                                
                                if(data[0] == 200) 
                                {
                                    postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null).then(data => {
                                        
                                        if(data[0] == 200) 
                                        {
                                            if(button == 'F00') 
                                            {
                                                Vibration.vibrate(500)
                                            }
                                            this.setState({
                                                loadingList: false,
                                                loaderOverlayResponse: false,
                                                statutUser: data[1].statut,
                                                currentIco: data[1].ico,
                                                currentLibelle: libelle,
                                                currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                                            });            
                                        }
                                        else 
                                        {
                                            this.errorServeur(button,null,null,activite)
                                            ////////////////////////////////////////////
                                            // this.setState({
                                            //     errorServeur : true,
                                            // })
                                            // if(button == 'F00') {
                                            //     var dataPointing = this.props.pointing
                                            //     var compteurTrouve = 0;  
                                            //     for(var i = 0; i<dataPointing.length; i++) {
                                            //         if(dataPointing[i]['email'] == this.props.email) {
                                            //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null])
                                            //             compteurTrouve++;
                                            //             this.props.pointingAction(dataPointing)
                                            //             this.setState(prevState => ({
                                            //             // [`loading`+`${button}`] : false,
                                            //             // disabled : false,
                                            //             // statutIco : !prevState.statutIco,
                                            //             loaderOverlayResponse: false,
                                            //             loadingList: false,
                                            //             // visible : true,
                                            //             currentIco: null,
                                            //             currentLibelle: 'Erreur serveur',
                                            //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                            //             }))
                                            //             Vibration.vibrate(500)
                                            //         }
                                            //     }
                                            //     if(compteurTrouve == 0){
                                            //         dataPointing.push(
                                            //             {
                                            //                 'email' : this.props.email,
                                            //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null]]       
                                            //             }
                                            //         )
                                            //         this.props.pointingAction(dataPointing)
                                            //         this.setState(prevState => ({
                                            //             // [`loading`+`${button}`] : false,
                                            //             // disabled : false,
                                            //             // statutIco : !prevState.statutIco,
                                            //             loaderOverlayResponse: false,
                                            //             loadingList: false,
                                            //             // visible : true,
                                            //             currentIco: null,
                                            //             currentLibelle: 'Erreur serveur',
                                            //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                            //         }))
                                            //         Vibration.vibrate(500)
                                            //     }
                                            // }else {
                                            //     this.setState({
                                            //         // [`loading`+`${button}`] : false,
                                            //         // disabled : false,
                                            //         // visible : true,
                                            //         loadingList: false,
                                            //         loaderOverlayResponse: false,
                                            //         currentIco: null,
                                            //         currentLibelle: 'Erreur serveur',
                                            //         currentText: "Serveur Indisponible"                                   
                                            //     })                    
                                            // }
                                            ////////////////////////////////////////////
                                        }
                                    })
                                }
                                else 
                                {
                                    this.errorServeur(button,null,null,activite)
                                    /////////////////////////////////////
                                    // this.setState({
                                    //     errorServeur : true,
                                    // })
                                    // if(button == 'F00') {
                                    //     var dataPointing = this.props.pointing
                                    //     var compteurTrouve = 0;  
                                    //     for(var i = 0; i<dataPointing.length; i++) {
                                    //         if(dataPointing[i]['email'] == this.props.email) {
                                    //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null])
                                    //             compteurTrouve++;
                                    //             this.props.pointingAction(dataPointing)
                                    //             this.setState(prevState => ({
                                    //             // [`loading`+`${button}`] : false,
                                    //             // disabled : false,
                                    //             // statutIco : !prevState.statutIco,
                                    //             loadingList: false,
                                    //             loaderOverlayResponse: false,
                                    //             // visible : true,
                                    //             currentIco: null,
                                    //             currentLibelle: 'Erreur serveur',
                                    //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                    //             }))
                                    //             Vibration.vibrate(500)
                                    //         }
                                    //     }
                                    //     if(compteurTrouve == 0){
                                    //         dataPointing.push(
                                    //             {
                                    //                 'email' : this.props.email,
                                    //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null]]       
                                    //             }
                                    //         )
                                    //         this.props.pointingAction(dataPointing)
                                    //         this.setState(prevState => ({
                                    //             // [`loading`+`${button}`] : false,
                                    //             // disabled : false,
                                    //             // statutIco : !prevState.statutIco,
                                    //             loadingList: false,
                                    //             loaderOverlayResponse: false,
                                    //             // visible : true,
                                    //             currentIco: null,
                                    //             currentLibelle: 'Erreur serveur',
                                    //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                    //         }))
                                    //         Vibration.vibrate(500)
                                    //     }
                                    // }else {
                                    //     this.setState({
                                    //         // [`loading`+`${button}`] : false,
                                    //         // disabled : false,
                                    //         // visible : true,
                                    //         loadingList: false,
                                    //         loaderOverlayResponse: false,
                                    //         currentIco: null,
                                    //         currentLibelle: 'Erreur serveur',
                                    //         currentText: "Serveur Indisponible"                                   
                                    //     })                    
                                    // }
                                    /////////////////////////////////////
                                } 
                            })
                        });
                    } 
                    else 
                    {
                        getToken(this.props.email,this.props.password).then(data => {
                            
                            if(data[0] == 200) 
                            {
                                postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null).then(data => {
                                    
                                    if(data[0] == 200) 
                                    {
                                        if(button == 'F00') 
                                        {
                                            Vibration.vibrate(500)
                                        }

                                        this.setState({
                                            loadingList: false,
                                            loaderOverlayResponse: false,
                                            statutUser: data[1].statut,
                                            currentIco: data[1].ico,
                                            currentLibelle: libelle,
                                            currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
                                        });            
                                    }
                                    else 
                                    {
                                        this.errorServeur(button,null,null,activite)
                                        ///////////////////////////////////////////
                                        // this.setState({
                                        //     errorServeur : true,
                                        // })
                                        // if(button == 'F00') {
                                        //     var dataPointing = this.props.pointing
                                        //     var compteurTrouve = 0;  
                                        //     for(var i = 0; i<dataPointing.length; i++) {
                                        //         if(dataPointing[i]['email'] == this.props.email) {
                                        //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null])
                                        //             compteurTrouve++;
                                        //             this.props.pointingAction(dataPointing)
                                        //             this.setState(prevState => ({
                                        //             // [`loading`+`${button}`] : false,
                                        //             // disabled : false,
                                        //             // statutIco : !prevState.statutIco,
                                        //             loadingList: false,
                                        //             loaderOverlayResponse: false,
                                        //             // visible : true,
                                        //             currentIco: null,
                                        //             currentLibelle: 'Erreur serveur',
                                        //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                        //             }))
                                        //             Vibration.vibrate(500)
                                        //         }
                                        //     }
                                        //     if(compteurTrouve == 0){
                                        //         dataPointing.push(
                                        //             {
                                        //                 'email' : this.props.email,
                                        //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null]]       
                                        //             }
                                        //         )
                                        //         this.props.pointingAction(dataPointing)
                                        //         this.setState(prevState => ({
                                        //             // [`loading`+`${button}`] : false,
                                        //             // disabled : false,
                                        //             // statutIco : !prevState.statutIco,
                                        //             loaderOverlayResponse: false,
                                        //             loadingList: false,
                                        //             // visible : true,
                                        //             currentIco: null,
                                        //             currentLibelle: 'Erreur serveur',
                                        //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                        //         }))
                                        //         Vibration.vibrate(500)
                                        //     }
                                        // }else {
                                        //     this.setState({
                                        //         // [`loading`+`${button}`] : false,
                                        //         // disabled : false,
                                        //         // visible : true,
                                        //         loadingList: false,
                                        //         loaderOverlayResponse: false,
                                        //         currentIco: null,
                                        //         currentLibelle: 'Erreur serveur',
                                        //         currentText: "Serveur Indisponible"                                   
                                        //     })                    
                                        // }
                                        ////////////////////////////////////////////
                                    }
                                })
                            } 
                            else 
                            {
                                this.errorServeur(button,null,null,activite)
                                //////////////////////////////////////////
                                // this.setState({
                                //     errorServeur : true,
                                // })
                                // if(button == 'F00') {
                                //     var dataPointing = this.props.pointing
                                //     var compteurTrouve = 0;  
                                //     for(var i = 0; i<dataPointing.length; i++) {
                                //         if(dataPointing[i]['email'] == this.props.email) {
                                //             dataPointing[i]['pointage'].push(['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null])
                                //             compteurTrouve++;
                                //             this.props.pointingAction(dataPointing)
                                //             this.setState(prevState => ({
                                //             // [`loading`+`${button}`] : false,
                                //             // disabled : false,
                                //             // statutIco : !prevState.statutIco,
                                //             loadingList: false,
                                //             loaderOverlayResponse: false,
                                //             // visible : true,
                                //             currentIco: null,
                                //             currentLibelle: 'Erreur serveur',
                                //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                //             }))
                                //             Vibration.vibrate(500)
                                //         }
                                //     }
                                //     if(compteurTrouve == 0){
                                //         dataPointing.push(
                                //             {
                                //                 'email' : this.props.email,
                                //                 'pointage': [['0',this.props.email,this.getFullDate(),this.getFullHeure(),"E00",null,null,null]]       
                                //             }
                                //         )
                                //         this.props.pointingAction(dataPointing)
                                //         this.setState(prevState => ({
                                //             // [`loading`+`${button}`] : false,
                                //             // disabled : false,
                                //             // statutIco : !prevState.statutIco,
                                //             loadingList: false,
                                //             loaderOverlayResponse: false,
                                //             // visible : true,
                                //             currentIco: null,
                                //             currentLibelle: 'Erreur serveur',
                                //             currentText: "Serveur Indisponible.\nMouvement enregistrer dans le téléphone"                                   
                                //         }))
                                //         Vibration.vibrate(500)
                                //     }
                                // }else {
                                //     this.setState({
                                //         // [`loading`+`${button}`] : false,
                                //         // disabled : false,
                                //         // visible : true,
                                //         loadingList: false,
                                //         loaderOverlayResponse: false,
                                //         currentIco: null,
                                //         currentLibelle: 'Erreur serveur',
                                //         currentText: "Serveur Indisponible"                                   
                                //     })                    
                                // }
                                /////////////////////////////////////////
                            }
                        })
                    }
                } catch (err) {
                    console.warn(err);
                } 
            }
            else 
            {
                getToken(this.props.email,this.props.password).then(data => {
                    
                    if(data[0] == 200) 
                    {
                        postAction(data[1].token,'1',this.props.email,this.getFullDate(),this.getFullHeure(),button,null,null,activite).then(data => {
                            
                            if(data[0] == 200) 
                            {
                                if(button == 'F00') 
                                {
                                    Vibration.vibrate(500)
                                }

                                this.setState({
                                    loadingList: false,
                                    loaderOverlayResponse: false,
                                    statutUser: data[1].statut,
                                    currentIco: data[1].ico,
                                    currentLibelle: libelle,
                                    currentText: data[1].message.ligne_1+'\n'+data[1].message.ligne_2+'\n'+data[1].message.ligne_3+'\n'+data[1].message.ligne_4,
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
            <Overlay 
                isVisible = { this.state.visible } 
                overlayStyle = {{ padding : 0 }}
                fullScreen = { true }
                animationType = 'slide'>
                <View style = {{ flex : 1 }}>
                    <View style= {{ alignItems: 'center',justifyContent: 'center', backgroundColor: '#008080', height: 60 }}>
                        <Text style= {{ fontSize: 20, fontWeight: "bold", color: 'white' }}>{ title }</Text>
                    </View>
                    {   
                        this.state.loaderOverlayResponse ? 
                            <View style = {{ flex : 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#008080"/> 
                            </View>
                            :
                            <View style = {{ flex : 1 }}>
                                <Animatable.View animation = "slideInLeft" style = { styles.container_button_animation }>
                                    <View style = {{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', marginVertical: 10, marginBottom: 5 }}>
                                        {
                                            this.state.errorServeur ?               
                                                <FontAwesome5 
                                                    name = "exclamation-triangle" 
                                                    color = "red" 
                                                    size = { 70 } 
                                                />
                                                :                         
                                                <Image style = { styles.imageOverlay } source = {{ uri: `data:image/png;base64,${ ico }` }} />
                                            
                                        }
                                    </View>
                                </Animatable.View>
                                <Animatable.View animation="slideInRight" style = { styles.container_button_animation }>
                                    <View style = {{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', marginVertical: 10, marginTop: 5 }}>
                                        <Text style = { styles.text_dialog }>{ text }</Text>
                                    </View>
                                </Animatable.View>
                                <Button buttonStyle = { styles.button_overlay_accept } title = "OK" onPress = { () => this.setState({ visible: false, visibleListActivites : false }) }/>
                            </View> 
                    }
                </View>
            </Overlay>
        )
    }

    buttons = (user) => {
        let libelles =  [];
        if(this.state.statutUser) 
        {
            if(user.profil.action0.active)
            {
                libelles.push({ key : user.profil.action0.libellePresent, ico : user.profil.action0.icoPresent, button : 'F00', disabled : this.state.disabled, delay: 0, loading : this.state.loadingF00, localisation : user.profil.action0.localisation, activite : user.profil.action0.activite });
            }
            if(user.profil.action1.active)
            {
                libelles.push({ key : user.profil.action1.libellePresent, ico : user.profil.action1.icoPresent, button : 'F01', disabled : this.state.disabled, delay : 200, loading : this.state.loadingF01, localisation : user.profil.action1.localisation, activite : user.profil.action1.activite});
            }
            if(user.profil.action2.active)
            {
                libelles.push({ key : user.profil.action2.libellePresent, ico : user.profil.action2.icoPresent, button : 'F02', disabled : this.state.disabled, delay : 400, loading : this.state.loadingF02, localisation : user.profil.action2.localisation, activite : user.profil.action2.activite});
            }
            if(user.profil.action3.active)
            {
                libelles.push({ key : user.profil.action3.libellePresent, ico : user.profil.action3.icoPresent, button : 'F03', disabled : this.state.disabled, delay : 600, loading : this.state.loadingF03, localisation : user.profil.action3.localisation, activite : user.profil.action3.activite});
            }
            if(user.profil.action4.active)
            {
                libelles.push({ key : user.profil.action4.libellePresent, ico : user.profil.action4.icoPresent, button : 'F04', disabled : this.state.disabled, delay : 800, loading : this.state.loadingF04, localisation : user.profil.action4.localisation, activite : user.profil.action4.activite});
            }
            if(user.profil.action5.active)
            {
                libelles.push({ key : user.profil.action5.libellePresent, ico : user.profil.action5.icoPresent, button : 'F05', disabled : this.state.disabled, delay : 1000, loading : this.state.loadingF05, localisation : user.profil.action5.localisation, activite : user.profil.action5.activite });
            }
        }
        else
        {
            if(user.profil.action0.active)
            {
                libelles.push({ key : user.profil.action0.libelleAbsent, ico : user.profil.action0.icoAbsent, button : 'F00', disabled : this.state.disabled, delay: 0, loading : this.state.loadingF00, localisation : user.profil.action0.localisation, activite : user.profil.action0.activite });
            }
            if(user.profil.action1.active)
            {
                libelles.push({ key : user.profil.action1.libelleAbsent, ico : user.profil.action1.icoAbsent, button : 'F01', disabled : this.state.disabled, delay : 200, loading : this.state.loadingF01, localisation : user.profil.action1.localisation, activite : user.profil.action1.activite});
            }
            if(user.profil.action2.active)
            {
                libelles.push({ key : user.profil.action2.libelleAbsent, ico : user.profil.action2.icoAbsent, button : 'F02', disabled : this.state.disabled, delay : 400, loading : this.state.loadingF02, localisation : user.profil.action2.localisation, activite : user.profil.action2.activite});
            }
            if(user.profil.action3.active)
            {
                libelles.push({ key : user.profil.action3.libelleAbsent, ico : user.profil.action3.icoAbsent, button : 'F03', disabled : this.state.disabled, delay : 600, loading : this.state.loadingF03, localisation : user.profil.action3.localisation, activite : user.profil.action3.activite});
            }
            if(user.profil.action4.active)
            {
                libelles.push({ key : user.profil.action4.libelleAbsent, ico : user.profil.action4.icoAbsent, button : 'F04', disabled : this.state.disabled, delay : 800, loading : this.state.loadingF04, localisation : user.profil.action4.localisation, activite : user.profil.action4.activite});
            }
            if(user.profil.action5.active)
            {
                libelles.push({ key : user.profil.action5.libelleAbsent, ico : user.profil.action5.icoAbsent, button : 'F05', disabled : this.state.disabled, delay : 1000, loading : this.state.loadingF05, localisation : user.profil.action5.localisation, activite : user.profil.action5.activite });
            }
        }
        return(
            <FlatList data={ libelles } 
                renderItem={({item}) => 
                    <Animatable.View animation="bounceIn" delay={ item.delay } style={ styles.container_button_animation }>
                        <TouchableOpacity 
                            onPress={ () => { if(item.activite){ this.showActiviteList(item.button, item.key, item.localisation) } else { this.actionButton(item.button, item.key, item.localisation, this.state.activite) } } } 
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

    showActiviteList = (button, libelle, localisation) => {
        this.setState({
            visibleListActivites: true,
            activitesButton: button,
            activitesLibelle: libelle,
            activitesLocalisation: localisation
        })
    }

    activitesList = (button, libelle, localisation, activites) => {
        return(
            <Overlay 
                isVisible={ this.state.visibleListActivites } 
                overlayStyle = {{ padding : 0 }}
                fullScreen = { true }
                animationType = 'slide'>
                <View style = {{ flex :1 }}>
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
                    <Button buttonStyle = { styles.button_overlay_accept } title = "Retour" onPress={ () => this.setState({ visibleListActivites: false }) }/>
                </View>
            </Overlay>
        )
    }

    render(){
        const { loadingList, currentIco, currentLibelle, currentText, user, activitesButton, activitesLibelle, activitesLocalisation } = this.state;
        return(
            <View style = { styles.container }>
                <StatusBar backgroundColor = '#008080' barStyle = "light-content"/>
                <Animatable.View animation = "fadeInDown" style = { styles.container_header }>
                    {
                        this.state.loading ? 
                                <Text style = {{fontSize : 20, textAlign : 'justify', color : 'white', marginTop : 40}}>Veuillez patienter les transactions réalisées hors ligne sont en cours d'acheminement ...</Text>
                        :   <View style = {{ flex: 1 }}> 
                            { this.state.errorServeur ? <Text style = {styles.text_errorServeur}>Serveur momentanément Indisponible</Text>  

                                : (null)
                            }
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
                { this.activitesList(activitesButton, activitesLibelle, activitesLocalisation, user.activites) }
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
        paddingVertical: 10,
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
        // flexDirection: 'row', 
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
    imageOverlay : {
        height : 70,
        width: 70
    },
    text_date: {
        textAlign : 'center',
        marginTop : 20,
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
    text_dialog: {
        textAlign: 'center',
        fontSize : 17,
        color: 'white'
    },
    buttons_list_activites: {
        borderRadius: 0,
        marginVertical: 2,
        backgroundColor: '#16A085',
        paddingVertical: 20
    },  
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: '#008080',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20
    }
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
