import React from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Image, FlatList, Vibration, RefreshControl, SafeAreaView } from "react-native";
import moment from "moment";
import "moment/locale/fr";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { getToken, postAction, getUser } from "../api/index";
import Geolocation from "react-native-geolocation-service";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { pointingAction } from "../redux/actions/pointingHorsLigneAction";
import { nomAction } from "../redux/actions/nomAction";
import { prenomAction } from "../redux/actions/prenonAction";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { langueAction } from "../redux/actions/langueAction";
import { Button, Overlay } from "react-native-elements";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { PermissionsAndroid } from "react-native";
import { getDistance } from "geolib";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";

class ManagementTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: "",
            timeFixed: "",
            loaderResponse: false,
            loadingList: true,
            loadingResponse: false,
            latitude: "",
            longitude: "",
            visible: false,
            visibleMouvementsEnAttente: false,
            user: "",
            currentIco: "",
            currentLibelle: "",
            currentText: "",
            compteurDelete: 0,
            statutUser: null,
            statut1: null,
            statut2: null,
            statut3: null,
            statut4: null,
            statut5: null,
            errorServeur: false,
            activite: null,
            activites: null,
            loaderOverlayResponse: false,
            refreshing: false,
            mouvementsEnAttente: false,
            mouvements: null,
            mouvementText: "",
            disableBoutonMouvements: true,
            text_welcome: "Bonjour, ",
            expanded_0: false,
            expanded_1: false,
            expanded_2: false,
            expanded_3: false,
            expanded_4: false,
            expanded_5: false,
        };
        this.flatListRef = null;

        if (this.props.langue === "100") {
            this.props.navigation.setOptions({ title: "Niva - Gestion du temps" });
        }

        if (this.props.langue === "109") {
            this.props.navigation.setOptions({ title: "Niva - Zeiteinteilung" });
            this.state.text_welcome = "Hallo, ";
        }

        if (this.props.langue === "134") {
            this.props.navigation.setOptions({ title: "Niva - Gestión del tiempo" });
            this.state.text_welcome = "Buenos dias, ";
        }

        if (this.props.langue === "132") {
            this.props.navigation.setOptions({ title: "Niva - Time management" });
            this.state.text_welcome = "Hello, ";
        }

        if (this.props.langue === "127") {
            this.props.navigation.setOptions({ title: "Niva - Gestione del tempo" });
            this.state.text_welcome = "Buongiorno, ";
        }

        if (this.props.langue === "135") {
            this.props.navigation.setOptions({ title: "Niva - Tijdsbeheer" });
            this.state.text_welcome = "Hallo, ";
        }
    }

    UNSAFE_componentWillMount() {
        this._renderClock();
        this._sendMouvements();
        this._getUserData();
        this._getMouvementsEnAttente();
    }

    componentWillUnmount = () => {
        clearInterval(this.IntervalClock);
        LocationServicesDialogBox.stopListener();
    };

    _getMouvementsEnAttente = () => {
        var dataPointing = this.props.pointing;
        if (dataPointing.length === 0) {
            this.setState({
                mouvementsEnAttente: false,
            });
        } else {
            this.setState({
                mouvementsEnAttente: true,
            });
        }
    };

    _getMouvementsEnAttenteByEmail = () => {
        var dataPointing = this.props.pointing;
        var mouvements = [];
        var compteur = 0;
        var date = "";
        var heure = "";
        dataPointing.forEach((element) => {
            if (element.email === this.props.email) {
                element.pointage.forEach((pointing) => {
                    date = pointing[2].substring(6, 8) + "/" + pointing[2].substring(4, 6) + "/" + pointing[2].substring(0, 4);
                    heure = pointing[3].substring(0, 2) + "h" + pointing[3].substring(2, 4);
                    mouvements.push({ key: compteur, date: date, heure: heure, ico: "", colorIco: "", loadingMouvement: true });
                    compteur++;
                });
            }
        });
        return mouvements;
    };

    _getUserData() {
        getToken(this.props.email, this.props.password).then((token) => {
            if (token[0] === 200) {
                getUser(token[1].token, this.props.email).then((response) => {
                    this.props.nomAction(response[1].user.nom);
                    this.props.prenomAction(response[1].user.prenom);
                    this.setState({
                        loadingList: false,
                        refreshing: false,
                        user: {
                            email: response[1].user.email,
                            prenom: response[1].user.prenom,
                            nom: response[1].user.nom,
                            profil: {
                                action0: {
                                    active: response[1].user.profil.action_0.active,
                                    icoPresent: response[1].user.profil.action_0.ico_present,
                                    icoAbsent: response[1].user.profil.action_0.ico_absent,
                                    libellePresent: response[1].user.profil.action_0.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_0.libelle_absent,
                                    localisation: response[1].user.profil.action_0.localisation,
                                    activite: response[1].user.profil.action_0.activite,
                                    displayPresent: response[1].user.profil.action_0.displayPresent,
                                    displayAbsent: response[1].user.profil.action_0.displayAbsent,
                                },
                                action1: {
                                    active: response[1].user.profil.action_1.active,
                                    icoPresent: response[1].user.profil.action_1.ico_present,
                                    icoAbsent: response[1].user.profil.action_1.ico_absent,
                                    libellePresent: response[1].user.profil.action_1.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_1.libelle_absent,
                                    localisation: response[1].user.profil.action_1.localisation,
                                    activite: response[1].user.profil.action_1.activite,
                                    displayPresent: response[1].user.profil.action_1.displayPresent,
                                    displayAbsent: response[1].user.profil.action_1.displayAbsent,
                                },
                                action2: {
                                    active: response[1].user.profil.action_2.active,
                                    icoPresent: response[1].user.profil.action_2.ico_present,
                                    icoAbsent: response[1].user.profil.action_2.ico_absent,
                                    libellePresent: response[1].user.profil.action_2.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_2.libelle_absent,
                                    localisation: response[1].user.profil.action_2.localisation,
                                    activite: response[1].user.profil.action_2.activite,
                                    displayPresent: response[1].user.profil.action_2.displayPresent,
                                    displayAbsent: response[1].user.profil.action_2.displayAbsent,
                                },
                                action3: {
                                    active: response[1].user.profil.action_3.active,
                                    icoPresent: response[1].user.profil.action_3.ico_present,
                                    icoAbsent: response[1].user.profil.action_3.ico_absent,
                                    libellePresent: response[1].user.profil.action_3.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_3.libelle_absent,
                                    localisation: response[1].user.profil.action_3.localisation,
                                    activite: response[1].user.profil.action_3.activite,
                                    displayPresent: response[1].user.profil.action_3.displayPresent,
                                    displayAbsent: response[1].user.profil.action_3.displayAbsent,
                                },
                                action4: {
                                    active: response[1].user.profil.action_4.active,
                                    icoPresent: response[1].user.profil.action_4.ico_present,
                                    icoAbsent: response[1].user.profil.action_4.ico_absent,
                                    libellePresent: response[1].user.profil.action_4.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_4.libelle_absent,
                                    localisation: response[1].user.profil.action_4.localisation,
                                    activite: response[1].user.profil.action_4.activite,
                                    displayPresent: response[1].user.profil.action_4.displayPresent,
                                    displayAbsent: response[1].user.profil.action_4.displayAbsent,
                                },
                                action5: {
                                    active: response[1].user.profil.action_5.active,
                                    icoPresent: response[1].user.profil.action_5.ico_present,
                                    icoAbsent: response[1].user.profil.action_5.ico_absent,
                                    libellePresent: response[1].user.profil.action_5.libelle_present,
                                    libelleAbsent: response[1].user.profil.action_5.libelle_absent,
                                    localisation: response[1].user.profil.action_5.localisation,
                                    activite: response[1].user.profil.action_5.activite,
                                    displayPresent: response[1].user.profil.action_5.displayPresent,
                                    displayAbsent: response[1].user.profil.action_5.displayAbsent,
                                },
                            },
                            client: {
                                activeBadgeClient: response[1].user.client.activeBadge,
                                activeAbsenceClient: response[1].user.client.activeAbsence,
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
                        statut5: response[1].user.statut5,
                    });
                });
            } else {
                this.props.navigation.navigate("Gestion du temps hors connection");
            }
        });
    }

    _getFullHeure = () => {
        var now = new moment().format("HHmmss");
        return now;
    };

    _getFullDate = () => {
        var now = new moment().format("YYYYMMDD");
        return now;
    };

    _refresh = () => {
        this.setState({
            refreshing: true,
            loadingList: true,
        });
        this._getUserData();
        this._getMouvementsEnAttente();
        this._resetCollapse();
    };

    _resetCollapse = () => {
        this.setState({
            expanded_0: false,
            expanded_1: false,
            expanded_2: false,
            expanded_3: false,
            expanded_4: false,
            expanded_5: false,
        });
    };

    _toggleCollapse = (button) => {
        this.setState({
            timeFixed: moment().format("LTS"),
        });

        if (button === "F00") {
            this.setState({
                expanded_0: !this.state.expanded_0,
                expanded_1: false,
                expanded_2: false,
                expanded_3: false,
                expanded_4: false,
                expanded_5: false,
            });
        }
        if (button === "F01") {
            this.setState({
                expanded_0: false,
                expanded_1: !this.state.expanded_1,
                expanded_2: false,
                expanded_3: false,
                expanded_4: false,
                expanded_5: false,
            });
        }
        if (button === "F02") {
            this.setState({
                expanded_0: false,
                expanded_1: false,
                expanded_2: !this.state.expanded_2,
                expanded_3: false,
                expanded_4: false,
                expanded_5: false,
            });
        }
        if (button === "F03") {
            this.setState({
                expanded_0: false,
                expanded_1: false,
                expanded_2: false,
                expanded_3: !this.state.expanded_3,
                expanded_4: false,
                expanded_5: false,
            });
        }
        if (button === "F04") {
            this.setState({
                expanded_0: false,
                expanded_1: false,
                expanded_2: false,
                expanded_3: false,
                expanded_4: !this.state.expanded_4,
                expanded_5: false,
            });
        }
        if (button === "F05") {
            this.setState({
                expanded_0: false,
                expanded_1: false,
                expanded_2: false,
                expanded_3: false,
                expanded_4: false,
                expanded_5: !this.state.expanded_5,
            });
        }
        this._scrollToIndex(button);
        this.setState({
            loadingResponse: false,
            loaderResponse: false,
        });
    };

    _scrollToIndex = (button) => {
        if (button === "F00") {
            this.flatListRef.scrollToIndex({ animated: true, index: 0 });
        }
        if (button === "F01") {
            this.flatListRef.scrollToIndex({ animated: true, index: 1 });
        }
        if (button === "F02") {
            this.flatListRef.scrollToIndex({ animated: true, index: 2 });
        }
        if (button === "F03") {
            this.flatListRef.scrollToIndex({ animated: true, index: 3 });
        }
        if (button === "F04") {
            this.flatListRef.scrollToIndex({ animated: true, index: 4 });
        }
        if (button === "F05") {
            this.flatListRef.scrollToIndex({ animated: true, index: 5 });
        }
    };

    _sendMouvements() {
        var dataPointing = this.props.pointing;
        var compteurDelete = 0;

        this.setState({
            mouvements: this._getMouvementsEnAttenteByEmail(),
            mouvementText: "Début de la séquence d'envoi",
            disableBoutonMouvements: true,
        });

        dataPointing.forEach((element) => {
            if (element.email === this.props.email) {
                this.setState({
                    visibleMouvementsEnAttente: true,
                });

                var compteur = 0;

                element.pointage.forEach((pointing) => {
                    getToken(this.props.email, this.props.password).then((token) => {
                        if (token[0] === 200) {
                            postAction(token[1].token, pointing[0], pointing[1], pointing[2], pointing[3], pointing[4], pointing[5], pointing[6], null, pointing[7]).then((action) => {
                                if (action[0] === 200 && action[1].code === 200) {
                                    this.state.mouvements[compteur].ico = "check-circle";
                                    this.state.mouvements[compteur].colorIco = "#31859C";
                                    this.state.mouvements[compteur].loadingMouvement = false;

                                    this.setState({
                                        mouvementText: "Envoi du mouvement " + (compteur + 1) + " réussi",
                                    });

                                    compteurDelete++;
                                    compteur++;
                                    if (compteurDelete === element.pointage.length) {
                                        var removeIndex = dataPointing
                                            .map(function (item) {
                                                return item.email;
                                            })
                                            .indexOf(this.props.email);
                                        dataPointing.splice(removeIndex, 1);
                                        this.props.pointingAction(dataPointing);
                                        this.setState({
                                            errorServeur: false,
                                            disableBoutonMouvements: false,
                                        });
                                    }

                                    this._refresh();
                                } else {
                                    this.state.mouvements[compteur].ico = "times-circle";
                                    this.state.mouvements[compteur].colorIco = "#AC6867";
                                    this.state.mouvements[compteur].loadingMouvement = false;

                                    this.setState({
                                        mouvementText: "Envoi du mouvement " + (compteur + 1) + " echoué",
                                    });

                                    compteur++;

                                    if (compteur === element.pointage.length) {
                                        this.setState({
                                            disableBoutonMouvements: false,
                                        });
                                    }

                                    this._refresh();
                                }
                            });
                        } else {
                            this.state.mouvements[compteur].ico = "times-circle";
                            this.state.mouvements[compteur].colorIco = "#AC6867";
                            this.state.mouvements[compteur].loadingMouvement = false;

                            this.setState({
                                mouvementText: "Envoi du mouvement " + (compteur + 1) + " echoué",
                                disableBoutonMouvements: false,
                            });

                            compteur++;

                            if (compteur === element.pointage.length) {
                                this.setState({
                                    disableBoutonMouvements: false,
                                });
                            }

                            this._refresh();
                        }
                    });
                });
            }
        });
    }

    _renderClock = () => {
        this.IntervalClock = setInterval(() => {
            this.setState({
                time: moment().format("LTS"),
            });
        }, 1000);
    };

    _requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted;
    };

    _errorServeur = async (buttonError, lat, long, activite) => {
        this.setState({
            loadingList: false,
            loaderResponse: false,
            loadingResponse: true,
            currentIco: null,
            currentLibelle: "Erreur serveur",
            currentText: "Serveur actuellement indisponible.\nLe mouvement a été enregistré dans votre mobile.",
        });
        this._scrollToIndex(buttonError);

        if (buttonError === "F00" || activite != null) {
            var dataPointing = this.props.pointing;
            var compteurTrouve = 0;
            for (var i = 0; i < dataPointing.length; i++) {
                if (dataPointing[i].email === this.props.email) {
                    dataPointing[i].pointage.push(["0", this.props.email, this._getFullDate(), this._getFullHeure(), buttonError, lat, long, activite]);
                    compteurTrouve++;

                    this.props.pointingAction(dataPointing);

                    Vibration.vibrate(500);
                }
            }

            if (compteurTrouve === 0) {
                dataPointing.push({ email: this.props.email, pointage: [["0", this.props.email, this._getFullDate(), this._getFullHeure(), buttonError, lat, long, activite]] });

                this.props.pointingAction(dataPointing);

                Vibration.vibrate(500);
            }
        } else {
            this.setState({
                currentText: "Serveur actuellement indisponible.",
            });
            this._scrollToIndex(buttonError);
        }
    };

    _sendAction = async (button, libelle, localisation, activite) => {
        this.setState({
            loaderResponse: true,
            loadingResponse: false,
        });

        let ligne_1 = "";
        let ligne_2 = "";
        let ligne_3 = "";
        let ligne_4 = "";
        let dataIco = null;
        let indicateurTemps = "1";

        if (button === "P00") {
            this.setState({
                loadingList: false,
                visible: false,
                loaderOverlayResponse: false,
            });
            this._sendMouvements();
        }

        if (!this.state.user.activeGeolocalisation) {
            getToken(this.props.email, this.props.password).then((token) => {
                if (token[0] === 200) {
                    postAction(token[1].token, indicateurTemps, this.props.email, this._getFullDate(), this._getFullHeure(), button, null, null, activite, null).then((action) => {
                        if (action[0] === 200) {
                            if (action[1].code === 200) {
                                if (button === "F00") {
                                    Vibration.vibrate(500);
                                }

                                ligne_1 = action[1].message.ligne_1;
                                ligne_2 = action[1].message.ligne_2;
                                ligne_3 = action[1].message.ligne_3;
                                ligne_4 = action[1].message.ligne_4;

                                if (ligne_1 !== "") {
                                    ligne_1 = ligne_1 + "\n";
                                }
                                if (ligne_2 !== "") {
                                    ligne_2 = ligne_2 + "\n";
                                }
                                if (ligne_3 !== "") {
                                    ligne_3 = ligne_3 + "\n";
                                }
                                if (action[1].ico !== "") {
                                    dataIco = action[1].ico;
                                }

                                this.setState({
                                    loadingList: false,
                                    loaderResponse: false,
                                    loadingResponse: true,
                                    statutUser: action[1].statut0,
                                    statut1: action[1].statut1,
                                    statut2: action[1].statut2,
                                    statut3: action[1].statut3,
                                    statut4: action[1].statut4,
                                    statut5: action[1].statut5,
                                    currentIco: dataIco,
                                    currentLibelle: libelle,
                                    currentText: ligne_1 + ligne_2 + ligne_3 + ligne_4,
                                });
                                this._scrollToIndex(button);
                            } else {
                                this._errorServeur(button, this.state.latitude, this.state.longitude, activite);
                            }
                        } else {
                            this.props.navigation.navigate("Gestion du temps hors connection");
                        }
                    });
                } else {
                    this.props.navigation.navigate("Gestion du temps hors connection");
                }
            });
        } else {
            if (localisation) {
                this._requestLocationPermission().then((granted) => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        Geolocation.getCurrentPosition((info) =>
                            this.setState(
                                {
                                    latitude: info.coords.latitude.toString(),
                                    longitude: info.coords.longitude.toString(),
                                },
                                () => {
                                    var test = false;
                                    var codeLieu = null;
                                    this.state.user.lieuxGeolocalisation.forEach((lieu) => {
                                        var dis = getDistance({ latitude: this.state.latitude, longitude: this.state.longitude }, { latitude: lieu.latitude, longitude: lieu.longitude });
                                        if (dis <= lieu.marge) {
                                            test = true;
                                            codeLieu = lieu.code;
                                        }
                                    });

                                    if (test) {
                                        getToken(this.props.email, this.props.password).then((token) => {
                                            if (token[0] === 200) {
                                                postAction(token[1].token, indicateurTemps, this.props.email, this._getFullDate(), this._getFullHeure(), button, this.state.latitude, this.state.longitude, activite, codeLieu).then((action) => {
                                                    if (action[0] === 200) {
                                                        if (action[1].code === 200) {
                                                            if (button === "F00") {
                                                                Vibration.vibrate(500);
                                                            }

                                                            ligne_1 = action[1].message.ligne_1;
                                                            ligne_2 = action[1].message.ligne_2;
                                                            ligne_3 = action[1].message.ligne_3;
                                                            ligne_4 = action[1].message.ligne_4;

                                                            if (ligne_1 !== "") {
                                                                ligne_1 = ligne_1 + "\n";
                                                            }
                                                            if (ligne_2 !== "") {
                                                                ligne_2 = ligne_2 + "\n";
                                                            }
                                                            if (ligne_3 !== "") {
                                                                ligne_3 = ligne_3 + "\n";
                                                            }
                                                            if (action[1].ico !== "") {
                                                                dataIco = action[1].ico;
                                                            }

                                                            this.setState({
                                                                loadingList: false,
                                                                loaderResponse: false,
                                                                loadingResponse: true,
                                                                statutUser: action[1].statut0,
                                                                statut1: action[1].statut1,
                                                                statut2: action[1].statut2,
                                                                statut3: action[1].statut3,
                                                                statut4: action[1].statut4,
                                                                statut5: action[1].statut5,
                                                                currentIco: dataIco,
                                                                currentLibelle: libelle,
                                                                currentText: ligne_1 + ligne_2 + ligne_3 + ligne_4,
                                                            });
                                                            this._scrollToIndex(button);
                                                        } else {
                                                            this._errorServeur(button, this.state.latitude, this.state.longitude, activite);
                                                        }
                                                    } else {
                                                        this.props.navigation.navigate("Gestion du temps hors connection");
                                                    }
                                                });
                                            } else {
                                                this.props.navigation.navigate("Gestion du temps hors connection");
                                            }
                                        });
                                    } else {
                                        getToken(this.props.email, this.props.password).then((token) => {
                                            if (token[0] === 200) {
                                                postAction(token[1].token, indicateurTemps, this.props.email, this._getFullDate(), this._getFullHeure(), "E01", this.state.latitude, this.state.longitude, activite, null).then((action) => {
                                                    if (action[0] === 200) {
                                                        if (action[1].code === 200) {
                                                            if (button === "F00") {
                                                                Vibration.vibrate(500);
                                                            }

                                                            ligne_1 = action[1].message.ligne_1;
                                                            ligne_2 = action[1].message.ligne_2;
                                                            ligne_3 = action[1].message.ligne_3;
                                                            ligne_4 = action[1].message.ligne_4;

                                                            if (ligne_1 !== "") {
                                                                ligne_1 = ligne_1 + "\n";
                                                            }
                                                            if (ligne_2 !== "") {
                                                                ligne_2 = ligne_2 + "\n";
                                                            }
                                                            if (ligne_3 !== "") {
                                                                ligne_3 = ligne_3 + "\n";
                                                            }

                                                            this.setState({
                                                                loadingList: false,
                                                                loaderResponse: false,
                                                                loadingResponse: true,
                                                                statutUser: action[1].statut0,
                                                                statut1: action[1].statut1,
                                                                statut2: action[1].statut2,
                                                                statut3: action[1].statut3,
                                                                statut4: action[1].statut4,
                                                                statut5: action[1].statut5,
                                                                currentIco: null,
                                                                currentLibelle: libelle,
                                                                currentText: ligne_1 + ligne_2 + ligne_3 + ligne_4,
                                                            });
                                                            this._scrollToIndex(button);
                                                        } else {
                                                            this._errorServeur(button, this.state.latitude, this.state.longitude, activite);
                                                        }
                                                    } else {
                                                        this.props.navigation.navigate("Gestion du temps hors connection");
                                                    }
                                                });
                                            } else {
                                                this.props.navigation.navigate("Gestion du temps hors connection");
                                            }
                                        });
                                    }
                                }
                            )
                        );
                    } else {
                        getToken(this.props.email, this.props.password).then((token) => {
                            if (token[0] === 200) {
                                postAction(token[1].token, indicateurTemps, this.props.email, this._getFullDate(), this._getFullHeure(), "E00", null, null, null, null).then((action) => {
                                    if (action[0] === 200) {
                                        if (action[1].code === 200) {
                                            if (button === "F00") {
                                                Vibration.vibrate(500);
                                            }

                                            ligne_1 = action[1].message.ligne_1;
                                            ligne_2 = action[1].message.ligne_2;
                                            ligne_3 = action[1].message.ligne_3;
                                            ligne_4 = action[1].message.ligne_4;

                                            if (ligne_1 !== "") {
                                                ligne_1 = ligne_1 + "\n";
                                            }
                                            if (ligne_2 !== "") {
                                                ligne_2 = ligne_2 + "\n";
                                            }
                                            if (ligne_3 !== "") {
                                                ligne_3 = ligne_3 + "\n";
                                            }

                                            this.setState({
                                                loadingList: false,
                                                loaderResponse: false,
                                                loadingResponse: true,
                                                statutUser: action[1].statut0,
                                                statut1: action[1].statut1,
                                                statut2: action[1].statut2,
                                                statut3: action[1].statut3,
                                                statut4: action[1].statut4,
                                                statut5: action[1].statut5,
                                                currentIco: null,
                                                currentLibelle: libelle,
                                                currentText: ligne_1 + ligne_2 + ligne_3 + ligne_4,
                                            });
                                            this._scrollToIndex(button);
                                        } else {
                                            this._errorServeur(button, null, null, activite);
                                        }
                                    } else {
                                        this.props.navigation.navigate("Gestion du temps hors connection");
                                    }
                                });
                            } else {
                                this.props.navigation.navigate("Gestion du temps hors connection");
                            }
                        });
                    }
                });
            } else {
                getToken(this.props.email, this.props.password).then((token) => {
                    if (token[0] === 200) {
                        postAction(token[1].token, indicateurTemps, this.props.email, this._getFullDate(), this._getFullHeure(), button, null, null, activite, null).then((action) => {
                            if (action[0] === 200) {
                                if (action[1].code === 200) {
                                    if (button === "F00") {
                                        Vibration.vibrate(500);
                                    }

                                    ligne_1 = action[1].message.ligne_1;
                                    ligne_2 = action[1].message.ligne_2;
                                    ligne_3 = action[1].message.ligne_3;
                                    ligne_4 = action[1].message.ligne_4;

                                    if (ligne_1 !== "") {
                                        ligne_1 = ligne_1 + "\n";
                                    }
                                    if (ligne_2 !== "") {
                                        ligne_2 = ligne_2 + "\n";
                                    }
                                    if (ligne_3 !== "") {
                                        ligne_3 = ligne_3 + "\n";
                                    }
                                    if (action[1].ico !== "") {
                                        dataIco = action[1].ico;
                                    }

                                    this.setState({
                                        loadingList: false,
                                        loaderResponse: false,
                                        loadingResponse: true,
                                        statutUser: action[1].statut0,
                                        currentIco: dataIco,
                                        currentLibelle: libelle,
                                        currentText: ligne_1 + ligne_2 + ligne_3 + ligne_4,
                                    });
                                    this._scrollToIndex(button);
                                } else {
                                    this._errorServeur(button, null, null, activite);
                                }
                            } else {
                                this.props.navigation.navigate("Gestion du temps hors connection");
                            }
                        });
                    } else {
                        this.props.navigation.navigate("Gestion du temps hors connection");
                    }
                });
            }
        }
    };

    _renderRetour = (button, typeButton, icoBase64, libelle, text) => {
        let ico = <Image style={styles.image} source={{ uri: `data:image/png;base64,${icoBase64}` }} />;
        if (icoBase64 === null) {
            ico = <FontAwesome5 name="exclamation-circle" color="#AC6867" size={50} />;
        } else {
            if (button === "F00" || typeButton === "O" || typeButton === "F") {
                libelle = "Transaction validé";
                ico = <FontAwesome5 name="check-circle" color="#62B554" size={50} />;
            }
        }
        return (
            <View style={styles.container_overlay}>
                <View style={styles.container_titre_response}>
                    <Text style={styles.text_title_overlay}>{libelle}</Text>
                </View>
                <View style={styles.container_ico_response}>{ico}</View>
                <View style={styles.container_text_response}>
                    <Text style={styles.text_body_overlay}>{text}</Text>
                </View>
                <View style={styles.container_button_response}>
                    <Button buttonStyle={styles.button_cancel_collapse} title="Fermer" onPress={() => this._refresh()} />
                </View>
            </View>
        );
    };

    _renderButtons = (user) => {
        let libelles = [];

        if (this.state.mouvementsEnAttente) {
            libelles.push({ key: 0, libelle: "Envoi des mouvements en attente", ico: "", button: "P00", delay: 0, localisation: this.state.mouvementsEnAttente, activite: false });
        }

        if (user.profil.action0.active) {
            var display_0 = true;
            if (this.state.statutUser) {
                if (!user.profil.action0.displayPresent) {
                    display_0 = false;
                }
                libelles.push({
                    key: 1,
                    libelle: user.profil.action0.libellePresent,
                    ico: user.profil.action0.icoPresent,
                    button: "F00",
                    delay: 0,
                    localisation: user.profil.action0.localisation,
                    activite: user.profil.action0.activite,
                    expanded: this.state.expanded_0,
                    display: display_0,
                });
            } else {
                if (!user.profil.action0.displayAbsent) {
                    display_0 = false;
                }
                libelles.push({
                    key: 1,
                    libelle: user.profil.action0.libelleAbsent,
                    ico: user.profil.action0.icoAbsent,
                    button: "F00",
                    delay: 0,
                    localisation: user.profil.action0.localisation,
                    activite: user.profil.action0.activite,
                    expanded: this.state.expanded_0,
                    display: display_0,
                });
            }
        }

        if (user.profil.action1.active) {
            var display_1 = true;
            if (this.state.statutUser) {
                if (!user.profil.action1.displayPresent) {
                    display_1 = false;
                }
            } else {
                if (!user.profil.action1.displayAbsent) {
                    display_1 = false;
                }
            }
            if (this.state.statut1) {
                libelles.push({
                    key: 2,
                    libelle: user.profil.action1.libellePresent,
                    ico: user.profil.action1.icoPresent,
                    button: "F01",
                    delay: 200,
                    localisation: user.profil.action1.localisation,
                    activite: user.profil.action1.activite,
                    expanded: this.state.expanded_1,
                    display: display_1,
                });
            } else {
                libelles.push({
                    key: 2,
                    libelle: user.profil.action1.libelleAbsent,
                    ico: user.profil.action1.icoAbsent,
                    button: "F01",
                    delay: 200,
                    localisation: user.profil.action1.localisation,
                    activite: user.profil.action1.activite,
                    expanded: this.state.expanded_1,
                    display: display_1,
                });
            }
        }

        if (user.profil.action2.active) {
            var display_2 = true;
            if (this.state.statutUser) {
                if (!user.profil.action2.displayPresent) {
                    display_2 = false;
                }
            } else {
                if (!user.profil.action2.displayAbsent) {
                    display_2 = false;
                }
            }
            if (this.state.statut2) {
                libelles.push({
                    key: 3,
                    libelle: user.profil.action2.libellePresent,
                    ico: user.profil.action2.icoPresent,
                    button: "F02",
                    delay: 400,
                    localisation: user.profil.action2.localisation,
                    activite: user.profil.action2.activite,
                    expanded: this.state.expanded_2,
                    display: display_2,
                });
            } else {
                libelles.push({
                    key: 3,
                    libelle: user.profil.action2.libelleAbsent,
                    ico: user.profil.action2.icoAbsent,
                    button: "F02",
                    delay: 400,
                    localisation: user.profil.action2.localisation,
                    activite: user.profil.action2.activite,
                    expanded: this.state.expanded_2,
                    display: display_2,
                });
            }
        }

        if (user.profil.action3.active) {
            var display_3 = true;
            if (this.state.statutUser) {
                if (!user.profil.action3.displayPresent) {
                    display_3 = false;
                }
            } else {
                if (!user.profil.action3.displayAbsent) {
                    display_3 = false;
                }
            }
            if (this.state.statut3) {
                libelles.push({
                    key: 4,
                    libelle: user.profil.action3.libellePresent,
                    ico: user.profil.action3.icoPresent,
                    button: "F03",
                    delay: 600,
                    localisation: user.profil.action3.localisation,
                    activite: user.profil.action3.activite,
                    expanded: this.state.expanded_3,
                    display: display_3,
                });
            } else {
                libelles.push({
                    key: 4,
                    libelle: user.profil.action3.libelleAbsent,
                    ico: user.profil.action3.icoAbsent,
                    button: "F03",
                    delay: 600,
                    localisation: user.profil.action3.localisation,
                    activite: user.profil.action3.activite,
                    expanded: this.state.expanded_3,
                    display: display_3,
                });
            }
        }

        if (user.profil.action4.active) {
            var display_4 = true;
            if (this.state.statutUser) {
                if (!user.profil.action4.displayPresent) {
                    display_4 = false;
                }
            } else {
                if (!user.profil.action4.displayAbsent) {
                    display_4 = false;
                }
            }
            if (this.state.statut4) {
                libelles.push({
                    key: 5,
                    libelle: user.profil.action4.libellePresent,
                    ico: user.profil.action4.icoPresent,
                    button: "F04",
                    delay: 800,
                    localisation: user.profil.action4.localisation,
                    activite: user.profil.action4.activite,
                    expanded: this.state.expanded_4,
                    display: display_4,
                });
            } else {
                libelles.push({
                    key: 5,
                    libelle: user.profil.action4.libelleAbsent,
                    ico: user.profil.action4.icoAbsent,
                    button: "F04",
                    delay: 800,
                    localisation: user.profil.action4.localisation,
                    activite: user.profil.action4.activite,
                    expanded: this.state.expanded_4,
                    display: display_4,
                });
            }
        }

        if (user.profil.action5.active) {
            var display_5 = true;
            if (this.state.statutUser) {
                if (!user.profil.action5.displayPresent) {
                    display_5 = false;
                }
            } else {
                if (!user.profil.action5.displayAbsent) {
                    display_5 = false;
                }
            }
            if (this.state.statut5) {
                libelles.push({
                    key: 6,
                    libelle: user.profil.action5.libellePresent,
                    ico: user.profil.action5.icoPresent,
                    button: "F05",
                    delay: 1000,
                    localisation: user.profil.action5.localisation,
                    activite: user.profil.action5.activite,
                    expanded: this.state.expanded_5,
                    display: display_5,
                });
            } else {
                libelles.push({
                    key: 6,
                    libelle: user.profil.action5.libelleAbsent,
                    ico: user.profil.action5.icoAbsent,
                    button: "F05",
                    delay: 1000,
                    localisation: user.profil.action5.localisation,
                    activite: user.profil.action5.activite,
                    expanded: this.state.expanded_5,
                    display: display_5,
                });
            }
        }

        return (
            <SafeAreaView>
                <FlatList
                    data={libelles}
                    renderItem={({ item }) =>
                        item.display ? (
                            <Animatable.View animation="bounceIn" delay={item.delay} style={styles.container_button_animation}>
                                <Collapse isExpanded={item.expanded}>
                                    <CollapseHeader>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item.button === "F00" || item.activite === "O" || item.activite === "F") {
                                                    this._toggleCollapse(item.button);
                                                } else {
                                                    this._toggleCollapse(item.button);
                                                    this._sendAction(item.button, item.libelle, item.localisation, null);
                                                }
                                            }}
                                            style={styles.button_tiles}>
                                            <View style={styles.container_ico}>
                                                {item.ico !== "" ? (
                                                    <Image style={styles.image} source={{ uri: `data:image/png;base64,${item.ico}` }} />
                                                ) : (
                                                    <FontAwesome5 style={styles.ico_padding_10} name="exclamation-circle" color="#AC6867" size={40} />
                                                )}
                                                <Text style={styles.text_button}>{item.libelle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </CollapseHeader>
                                    <CollapseBody style={styles.collapse_button_body}>
                                        {this.state.loaderResponse ? (
                                            <View style={styles.view_collapse}>
                                                <ActivityIndicator color="#008080" size={40} />
                                            </View>
                                        ) : this.state.loadingResponse ? (
                                            this._renderRetour(item.button, item.activite, this.state.currentIco, this.state.currentLibelle, this.state.currentText)
                                        ) : item.activite === "O" ? (
                                            this._renderActivites(item.button, item.libelle, item.localisation, this.state.user.activites)
                                        ) : (
                                            <View style={styles.view_flex_direction_row_flex}>
                                                <View style={styles.view_collapse}>
                                                    <Text style={styles.text_collapse}>Date</Text>
                                                    <Text style={styles.text_collapse}>Heure</Text>
                                                    <Text style={styles.text_collapse}>Confirmation ?</Text>
                                                </View>
                                                <View style={styles.view_collapse}>
                                                    <Text style={styles.text_padding_5}>{moment().format("dddd Do MMMM YYYY").toUpperCase()}</Text>
                                                    <Text style={styles.text_padding_5}>{this.state.timeFixed}</Text>
                                                    <View style={styles.view_flow_direction_row}>
                                                        <Button
                                                            buttonStyle={styles.button_cancel_collapse}
                                                            title="Annuler"
                                                            onPress={() => {
                                                                this._toggleCollapse(item.button);
                                                            }}
                                                        />
                                                        <Button
                                                            buttonStyle={styles.button_validate_collapse}
                                                            title="Valider"
                                                            onPress={() => {
                                                                this._sendAction(item.button, item.libelle, item.localisation, null);
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </CollapseBody>
                                </Collapse>
                            </Animatable.View>
                        ) : null
                    }
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._refresh()} />}
                    keyExtractor={(item) => item.key}
                    ref={(ref) => (this.flatListRef = ref)}
                />
            </SafeAreaView>
        );
    };

    _renderActivites = (button, libelle, localisation, activites) => {
        return (
            <View style={styles.container_overlay}>
                <FlatList
                    data={activites}
                    renderItem={({ item, index }) => (
                        <View style={styles.container_button_animation}>
                            <Button onPress={() => this._sendAction(button, libelle, localisation, item.code)} title={item.nom} titleStyle={styles.text_button_tiles_activite} buttonStyle={styles.button_tiles_activite} />
                        </View>
                    )}
                    keyExtractor={(item) => item.code}
                />
                <View style={styles.container_button_animation}>
                    <Button onPress={() => this._toggleCollapse(button)} title="Annuler" buttonStyle={styles.button_cancel_collapse_activite} />
                </View>
            </View>
        );
    };

    mouvementsEnAttente = () => {
        return (
            <Overlay isVisible={this.state.visibleMouvementsEnAttente} overlayStyle={styles.overlay_padding_0} fullScreen={true} animationType="slide">
                <View style={styles.container_overlay}>
                    <View style={styles.container_global_header_overlay}>
                        <Animatable.View animation="bounceIn" delay={0} style={styles.container_animation_header_overlay}>
                            <View style={styles.container_title_overlay}>
                                <FontAwesome5 name="arrow-alt-circle-up" color="white" size={50} style={styles.ico_margin_10} />
                                <Text style={styles.text_title_overlay_mouvement}>Envoi des mouvements en attente en cours. Merci de bien vouloir patienter.</Text>
                            </View>
                        </Animatable.View>
                        <View style={styles.container_global_tiles_overlay}>
                            <Animatable.View animation="bounceIn" delay={600} style={styles.container_animation_overlay_text}>
                                <View style={styles.container_mouvement_overlay}>
                                    <FlatList
                                        data={this.state.mouvements}
                                        renderItem={({ item }) => (
                                            <View style={styles.container_list_mouvement}>
                                                {item.loadingMouvement ? (
                                                    <ActivityIndicator color="#008080" style={styles.indicator_padding_horizontal_10} />
                                                ) : (
                                                    <FontAwesome5 name={item.ico} color={item.colorIco} size={20} style={styles.indicator_padding_horizontal_10} />
                                                )}
                                                <Text style={styles.text_mouvement_overlay}>
                                                    Mouvement du {item.date} à {item.heure}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            </Animatable.View>
                            <Animatable.View animation="bounceIn" delay={300} style={styles.container_animation_overlay_ico}>
                                <View style={styles.container_ico_overlay}>
                                    <Text>{this.state.mouvementText}</Text>
                                </View>
                            </Animatable.View>
                            <Button disabled={this.state.disableBoutonMouvements} buttonStyle={styles.button_overlay_accept} title="Fermer" onPress={() => this.setState({ visibleMouvementsEnAttente: false })} />
                        </View>
                    </View>
                </View>
            </Overlay>
        );
    };

    render() {
        const { loadingList, user } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#31859C" barStyle="light-content" />
                {loadingList ? (
                    <ActivityIndicator size="large" color="#008080" style={styles.container_loader} />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.container_global_header}>
                            <View style={styles.container_global_header_welcome}>
                                <Animatable.View animation="slideInLeft">
                                    <Text style={styles.text_welcome}>
                                        {this.state.text_welcome}
                                        <Text style={styles.text_welcome_name}>
                                            {this.state.user.prenom} {this.state.user.nom}
                                        </Text>
                                    </Text>
                                </Animatable.View>
                            </View>
                            <View style={styles.container_global_header_date}>
                                <Animatable.View animation="bounceIn">
                                    <Text style={styles.text_date}>{moment().format("dddd Do MMMM YYYY").toUpperCase()}</Text>
                                    <Text style={styles.text_heure}>{this.state.time}</Text>
                                </Animatable.View>
                            </View>
                        </View>
                        <View style={styles.container_global_tiles}>{this._renderButtons(user)}</View>
                    </View>
                )}
                {this.mouvementsEnAttente()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    container_loader: {
        flex: 1,
    },
    container_clock: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    container_title_overlay: {
        flex: 1,
        padding: 20,
        backgroundColor: "#008080",
        elevation: 5,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    container_animation_header_overlay: {
        flex: 1,
        paddingTop: 20,
        padding: 10,
    },
    container_global_tiles: {
        flex: 4,
    },
    container_global_tiles_overlay: {
        flex: 3,
    },
    container_global_header_welcome: {
        flex: 1,
        paddingLeft: 20,
        paddingTop: 20,
    },
    container_global_header: {
        flex: 2,
    },
    container_global_header_date: {
        flex: 2,
    },
    container_global_header_overlay: {
        flex: 1,
    },
    container_button_animation: {
        flex: 1,
        margin: 10,
        elevation: 5,
        backgroundColor: "white",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    container_animation_overlay: {
        flex: 1,
        padding: 10,
    },
    container_animation_overlay_ico: {
        flex: 1,
        padding: 10,
    },
    container_animation_overlay_text: {
        flex: 2,
        padding: 10,
    },
    container_list_mouvement: {
        flex: 2,
        padding: 5,
        flexDirection: "row",
    },
    container_ico: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    container_overlay: {
        flex: 1,
    },
    container_text_activite: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#008080",
        height: 60,
        marginBottom: 1,
    },
    text_activite: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    collapse_button_body: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#D0D0D0",
        padding: 20,
        margin: 10,
    },
    container_ico_overlay: {
        padding: 20,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container_text_overlay: {
        padding: 20,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container_mouvement_overlay: {
        padding: 15,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 5,
        flex: 1,
    },
    container_titre_response: {
        flex: 1,
        fontSize: 20,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    container_ico_response: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    container_text_response: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    container_button_response: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    image: {
        height: 50,
        width: 50,
        padding: 10,
        marginRight: 30,
    },
    ico_overlay: {
        height: 50,
        width: 50,
        padding: 20,
    },
    text_date: {
        textAlign: "center",
        fontSize: 20,
    },
    text_errorServeur: {
        textAlign: "center",
        color: "#AC6867",
        fontSize: 18,
    },
    text_heure: {
        textAlign: "center",
        fontSize: 35,
        padding: 10,
    },
    text_welcome: {
        fontSize: 20,
    },
    text_welcome_name: {
        fontWeight: "bold",
    },
    text_collapse: {
        paddingVertical: 5,
        fontWeight: "bold",
    },
    text_padding_5: {
        paddingVertical: 5,
    },
    dialog: {
        textAlign: "center",
    },
    dialog_content: {
        alignItems: "center",
    },
    spinnerTextStyle: {
        color: "#FFF",
    },
    text_title_overlay_mouvement: {
        fontWeight: "bold",
        fontSize: 17,
        color: "white",
    },
    text_title_overlay: {
        fontWeight: "bold",
        fontSize: 17,
    },
    text_body_overlay: {
        fontSize: 17,
    },
    text_mouvement_overlay: {
        textAlign: "center",
        fontSize: 17,
    },
    text_envoi_hors_ligne: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
    },
    text_button: {
        fontSize: 17,
    },
    buttons_list_activites: {
        padding: 20,
        backgroundColor: "#16A085",
        elevation: 5,
        borderRadius: 5,
    },
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: "#008080",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
    },
    button_cancel_collapse: {
        marginRight: 5,
        paddingHorizontal: 10,
        backgroundColor: "#AC6867",
    },
    button_validate_collapse: {
        marginLeft: 5,
        paddingHorizontal: 10,
        backgroundColor: "#62B554",
    },
    loader_overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay_padding_0: {
        padding: 0,
    },
    ico_padding_10: {
        padding: 10,
    },
    ico_margin_10: {
        marginBottom: 10,
    },
    indicator_padding_horizontal_10: {
        paddingHorizontal: 10,
    },
    view_collapse: {
        flex: 1,
        justifyContent: "center",
    },
    view_flow_direction_row: {
        flexDirection: "row",
    },
    view_flex_direction_row_flex: {
        flex: 1,
        flexDirection: "row",
    },
    button_tiles_activite: {
        backgroundColor: "white",
    },
    button_cancel_collapse_activite: {
        backgroundColor: "#AC6867",
    },
    text_button_tiles_activite: {
        color: "black",
    },
    button_tiles: {
        padding: 20,
    },
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails,
        langue: state.langueReducer.langue,
    };
};

export default connect(mapStateToProps, { listeEmailAction, pointingAction, nomAction, prenomAction, emailAction, passwordAction, langueAction })(ManagementTime);
