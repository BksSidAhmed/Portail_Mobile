import React from "react";
import { StyleSheet, View, Text, StatusBar, Vibration } from "react-native";
import moment, { locale } from "moment";
import "moment/locale/fr";
import * as Animatable from "react-native-animatable";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Overlay, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { pointingAction } from "../redux/actions/pointingHorsLigneAction";
import { RESET_ACTION } from "../redux/actions/resetActions";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { resetListMail } from "../redux/actions/listeEmailAction";
import { RESET_TABLE_ACTION } from "../redux/actions/pointingHorsLigneAction";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { langueAction } from "../redux/actions/langueAction";
class ManagementNoConnection extends React.Component {
    constructor(props) {
        super(props);
        this.email = null;
        this.state = {
            visible: false,
            time: "",
            loading: false,
            disabled: false,
            isVisible: false,
            timer: 60,
            timers: false,
            text_pointing: "",
            text_pointing_success: "Votre mouvement a été enregistrée avec succès. Il sera communiquée à votre employeur lors de votre prochaine connexion en ligne.",
            text_pointing_error: "Pour utiliser la fonctionnalité hors ligne, veuillez vous connecter en ligne au moins une fois avec vos identifiants.",
            color: {},
            errorMail: null,
            text_hors_ligne:
                "Il semble y avoir eu une erreur lors de la tentative de connexion. Il peut s'avérer d'une erreur serveur ou vous n'avez plus accès à une connexion Internet. Mais en mode Hors ligne vous pouvez réaliser une transaction d'entrée ou de sortie, si vous souhaitez profiter de toutes les fonctionnalités que Niva Mobile vous propose.",
            text_bouton_hors_ligne: "Enregistrer un mouvement",
            text_bouton_hors_ligne_connexion: "Connexion",
            text_input_email: "Email",
            text_bouton_enregistrer: "Enregistrer",
            text_bouton_annuler: "Annuler",
            text_titre_dialog_popup: "Etat du mouvement",
            text_overlay: "Entrez votre email de connexion.'\n'Votre mouvement sera envoyé lors de votre prochaine connexion.",
        };
    }

    UNSAFE_componentWillMount() {
        this.renderClock();

        if (locale === "de_DE") {
            this.setState({
                text_hors_ligne:
                    "Beim Versuch, eine Verbindung herzustellen, scheint ein Fehler aufgetreten zu sein. Möglicherweise liegt ein Serverfehler vor oder Sie haben keinen Zugriff mehr auf eine Internetverbindung. Aber im Offline-Modus können Sie eine Ein- oder Ausstiegstransaktion durchführen. Wenn Sie alle Funktionen von Niva Mobile nutzen möchten, stellen Sie bitte eine Verbindung zu einem Internetnetzwerk her.",
                text_bouton_hors_ligne: "Nehmen Sie eine Bewegung auf",
                text_bouton_hors_ligne_connexion: "Verbindung",
                text_input_email: "Email",
                text_bouton_enregistrer: "Aufzeichnung",
                text_bouton_annuler: "Abbrechen",
                text_titre_dialog_popup: "Bewegungszustand",
                text_overlay: "Geben Sie Ihre Login-E-Mail-Adresse ein. Ihre Bewegung wird beim nächsten Anmelden gesendet.",
                text_pointing_success: "Ihre Bewegung wurde erfolgreich registriert. Dies wird Ihrem Arbeitgeber mitgeteilt, wenn Sie sich das nächste Mal online anmelden.",
                text_pointing_error: "Um die Offline-Funktionalität zu nutzen, melden Sie sich bitte mindestens einmal online mit Ihren Anmeldeinformationen an.",
            });
            this.props.navigation.setOptions({ title: "Niva - Zeiteinteilung offline" });
        }

        if (locale === "es_ES") {
            this.setState({
                text_hors_ligne:
                    "Parece que se ha producido un error al intentar conectarse. Puede ser un error del servidor o ya no tiene acceso a una conexión a Internet. Pero en el modo Offline puedes realizar una transacción de entrada o salida, si quieres aprovechar todas las funcionalidades que te ofrece Niva Mobile, por favor conéctate a una red de internet.",
                text_bouton_hors_ligne: "Graba un movimiento",
                text_bouton_hors_ligne_connexion: "Conexión",
                text_input_email: "Correo electrónico",
                text_bouton_enregistrer: "Registro",
                text_bouton_annuler: "Anular",
                text_titre_dialog_popup: "Estado de movimiento",
                text_overlay: "Ingrese su correo electrónico de inicio de sesión. Su movimiento se enviará la próxima vez que inicie sesión.",
                text_pointing_success: "Tu movimiento se ha registrado con éxito. Se le comunicará a su empleador la próxima vez que inicie sesión en línea.",
                text_pointing_error: "Para utilizar la funcionalidad sin conexión, inicie sesión en línea al menos una vez con sus credenciales.",
            });
            this.props.navigation.setOptions({ title: "Niva - Gestión del tiempo fuera de linea" });
        }

        if (locale === "en_GB") {
            this.setState({
                text_hors_ligne:
                    "There seems to have been an error trying to connect. It may be a server error or you no longer have access to an Internet connection. But in Offline mode you can carry out an entry or exit transaction, if you want to take advantage of all the features that Niva Mobile offers you, please connect to an internet network.",
                text_bouton_hors_ligne: "Record a movement",
                text_bouton_hors_ligne_connexion: "Login",
                text_input_email: "E-mail",
                text_bouton_enregistrer: "Record",
                text_bouton_annuler: "Cancel",
                text_titre_dialog_popup: "State of movement",
                text_overlay: "Enter your login email. Your movement will be sent the next time you log in.",
                text_pointing_success: "Your movement has been registered successfully. It will be communicated to your employer the next time you log on online.",
                text_pointing_error: "To use the offline functionality, please log in online at least once with your credentials.",
            });
            this.props.navigation.setOptions({ title: "Niva - Time management offline" });
        }

        if (locale === "it_IT") {
            this.setState({
                text_hors_ligne:
                    "Sembra che si sia verificato un errore durante il tentativo di connessione. Potrebbe trattarsi di un errore del server o non hai più accesso a una connessione Internet. Ma in modalità Offline puoi effettuare una transazione in entrata o in uscita, se vuoi usufruire di tutte le funzionalità che ti offre Niva Mobile ti preghiamo di collegarti ad una rete internet.",
                text_bouton_hors_ligne: "Registra un movimento",
                text_bouton_hors_ligne_connexion: "Connessione",
                text_input_email: "E-mail",
                text_bouton_enregistrer: "Registrare",
                text_bouton_annuler: "Per cancellare",
                text_titre_dialog_popup: "Stato di movimento",
                text_overlay: "Inserisci la tua email di accesso. Il tuo movimento verrà inviato al prossimo accesso.",
                text_pointing_success: "Il tuo movimento è stato registrato con successo. Verrà comunicato al tuo datore di lavoro la prossima volta che accedi online.",
                text_pointing_error: "Per utilizzare la funzionalità offline, accedi online almeno una volta con le tue credenziali.",
            });
            this.props.navigation.setOptions({ title: "Niva - Gestione del tempo disconnesso" });
        }

        if (locale === "nl_NL") {
            this.setState({
                text_hors_ligne:
                    "Er lijkt een fout te zijn opgetreden bij het maken van verbinding. Het kan een serverfout zijn of u heeft geen toegang meer tot een internetverbinding. Maar in de offline modus kunt u een in- of uitgangstransactie uitvoeren. Als u gebruik wilt maken van alle functies die Niva Mobile u biedt, maak dan verbinding met een internetnetwerk.",
                text_bouton_hors_ligne: "Leg een beweging vast",
                text_bouton_hors_ligne_connexion: "Verbinding",
                text_input_email: "E-mail",
                text_bouton_enregistrer: "Opnemen",
                text_bouton_annuler: "Annuleren",
                text_titre_dialog_popup: "Staat van beweging",
                text_overlay: "Voer uw inlog-e-mailadres in. Uw beweging wordt de volgende keer dat u inlogt verzonden.",
                text_pointing_success: "Uw beweging is succesvol geregistreerd. De volgende keer dat u zich online aanmeldt, wordt het aan uw werkgever meegedeeld.",
                text_pointing_error: "Om de offline functionaliteit te gebruiken, dient u zich ten minste één keer online aan te melden met uw inloggegevens.",
            });
            this.props.navigation.setOptions({ title: "Niva - Offline tijdbeheer" });
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.IntervalClock);
        clearInterval(this.clockCall);
    };

    startTimer = () => {
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    };

    decrementClock = () => {
        if (this.state.timer === 0) {
            this.setState({
                timers: false,
                disabled: false,
                timer: 60,
            });
            clearInterval(this.clockCall);
        }
        this.setState((prevstate) => ({ timer: prevstate.timer - 1 }));
    };

    getFullHeure = () => {
        var now = new moment().format("HHmmss");
        return now;
    };

    getFullDate = () => {
        var now = new moment().format("YYYYMMDD");
        return now;
    };

    renderClock = () => {
        this.IntervalClock = setInterval(() => {
            this.setState({
                time: moment().format("HH:mm:ss"),
            });
        }, 1000);
    };

    actionButton = () => {
        this.props.emailAction("");
        this.props.passwordAction("");
        this.setState({
            isVisible: true,
            loading: true,
        });
    };

    overlay = () => {
        return (
            <Overlay isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false, loading: false })} overlayStyle={styles.overlay_popup} animationType="slide">
                <View style={styles.view_overlay}>
                    <View>
                        <Text style={styles.text_overlay}>{this.state.text_overlay}</Text>
                        <Input
                            placeholder={this.state.text_input_email}
                            rightIcon={{ type: "font-awesome", name: "envelope" }}
                            style={styles.text_input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => this.editEmail(text)}
                        />
                    </View>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_accept} title={this.state.text_bouton_enregistrer} onPress={() => this._validatePointing()} />
                        <Button buttonStyle={styles.button_overlay_refuse} title={this.state.text_bouton_annuler} onPress={() => this.setState({ isVisible: false })} />
                    </View>
                </View>
            </Overlay>
        );
    };

    editEmail = (text) => {
        this.email = text;
    };

    dialogPopup = () => {
        return (
            <Overlay isVisible={this.state.visible} overlayStyle={styles.overlay_padding} fullScreen={true} animationType="slide">
                <View style={styles.container}>
                    <View style={styles.container}>
                        <Animatable.View animation="bounceIn" delay={0} style={styles.container_animation_header_overlay}>
                            <View style={styles.container_title_overlay}>
                                <Text style={styles.text_title_overlay}>{this.state.text_titre_dialog_popup}</Text>
                            </View>
                        </Animatable.View>
                    </View>
                    <View style={styles.container_global_tiles_overlay}>
                        <Animatable.View animation="bounceIn" delay={300} style={styles.container_animation_overlay_ico}>
                            <View style={styles.container_ico_overlay}>{this.state.errorMail ? <FontAwesome5 name="exclamation-triangle" color="#C72C41" size={50} /> : <FontAwesome5 name="check-circle" color="#2EB769" size={50} />}</View>
                        </Animatable.View>
                        <Animatable.View animation="bounceIn" delay={600} style={styles.container_animation_overlay_text}>
                            <View style={styles.container_text_overlay}>
                                <Text style={styles.text_body_overlay}>{this.state.text_pointing}</Text>
                            </View>
                        </Animatable.View>
                        <Button buttonStyle={styles.button_overlay_accept} title="Fermer" onPress={() => this.setState({ visible: false, visibleListActivites: false })} />
                    </View>
                </View>
            </Overlay>
        );
    };

    logOut = () => {
        this.props.emailAction("");
        this.props.passwordAction("");
        this.props.langueAction("100");
    };

    _renderButtonConnexion = () => {
        return <Button onPress={() => this.logOut()} disabled={this.state.disabled} buttonStyle={styles.button_mouvement} title={this.state.text_bouton_hors_ligne_connexion} />;
    };

    _validatePointing = () => {
        if (this.email == null) {
            this.setState({
                isVisible: false,
                visible: false,
            });
        } else {
            var compteurIdentique = 0;
            this.props.emails.forEach((element) => {
                if (element === this.email.trim()) {
                    var data = this.props.pointing;
                    var compteurTrouve = 0;

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].email === this.email.trim()) {
                            data[i].pointage.push([0, this.email.trim(), this.getFullDate(), this.getFullHeure(), "F00", 0, 0]);
                            compteurTrouve++;

                            this.props.pointingAction(data);

                            this.setState({
                                isVisible: false,
                                loading: false,
                                disabled: true,
                                timers: true,
                                visible: true,
                                errorMail: false,
                                color: { alignItems: "center", justifyContent: "center", borderBottomWidth: 1, backgroundColor: "#31859C", height: 60 },
                                text_pointing: this.state.text_pointing_success,
                            });

                            Vibration.vibrate(500);

                            this.startTimer();
                        }
                    }

                    if (compteurTrouve === 0) {
                        data.push({ email: this.email.trim(), pointage: [[0, this.email.trim(), this.getFullDate(), this.getFullHeure(), "F00", 0, 0]] });

                        this.props.pointingAction(data);

                        this.setState({
                            isVisible: false,
                            loading: false,
                            disabled: true,
                            timers: true,
                            visible: true,
                            errorMail: false,
                            color: { alignItems: "center", justifyContent: "center", borderBottomWidth: 1, backgroundColor: "#31959C", height: 60 },
                            text_pointing: this.state.text_pointing_success,
                        });

                        Vibration.vibrate(500);

                        this.startTimer();
                    }

                    compteurIdentique++;
                }
            });
            if (compteurIdentique === 0) {
                this.setState({
                    isVisible: false,
                    visible: true,
                    errorMail: true,
                    color: { alignItems: "center", justifyContent: "center", borderBottomWidth: 1, backgroundColor: "#C72C41", height: 60 },
                    text_pointing: this.state.text_pointing_error,
                });

                Vibration.vibrate(500);
            }
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#31859C" barStyle="light-content" />
                <Animatable.View animation="bounceIn" style={styles.container_clock}>
                    <Text style={styles.text_date}>{moment().format("dddd Do MMMM YYYY").toUpperCase()}</Text>
                    <Text style={styles.text_heure}>{this.state.time}</Text>
                </Animatable.View>
                <Animatable.View animation="bounceIn" delay={300} style={styles.container_text_animation}>
                    <View style={styles.text_animation}>
                        <Text style={styles.text_horsLigne}>{this.state.text_hors_ligne}</Text>
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" delay={600} style={styles.container_button_animation}>
                    <Button
                        onPress={() => this.actionButton()}
                        disabled={this.state.disabled}
                        buttonStyle={styles.button_mouvement}
                        titleStyle={styles.text_mouvement}
                        title={this.state.timers ? this.state.timer : this.state.text_bouton_hors_ligne}
                    />
                    {this.props.email !== "" ? this._renderButtonConnexion() : null}
                </Animatable.View>
                {this.overlay()}
                {this.dialogPopup()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    container_clock: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    container_header: {
        flex: 1,
        padding: 10,
        paddingBottom: 5,
    },
    container_button_animation: {
        flex: 2,
        padding: 10,
    },
    container_text_animation: {
        flex: 3,
    },
    container_global_button_animation: {
        flex: 3,
    },
    overlay_padding: {
        padding: 0,
    },
    overlay_popup: {
        padding: 10,
    },
    button_mouvement: {
        backgroundColor: "white",
        padding: 20,
        marginVertical: 5,
        elevation: 5,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    text_animation: {
        padding: 20,
        flex: 1,
        alignItems: "center",
    },
    text_date: {
        textAlign: "center",
        fontSize: 20,
    },
    text_heure: {
        textAlign: "center",
        fontSize: 35,
    },
    text_horsLigne: {
        textAlign: "justify",
        fontSize: 20,
    },
    dialog: {
        textAlign: "center",
    },
    view_overlay: {
        padding: 20,
    },
    view_button_overlay: {
        flexDirection: "row",
        justifyContent: "center",
    },
    text_input: {
        color: "#05375A",
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15,
    },
    button_overlay_accept: {
        borderRadius: 0,
        backgroundColor: "#62B554",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    button_overlay_refuse: {
        borderRadius: 0,
        backgroundColor: "#AC6867",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    container_animation_header_overlay: {
        flex: 1,
        paddingTop: 20,
        padding: 10,
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
    text_title_overlay: {
        textAlign: "center",
        fontSize: 17,
        color: "white",
    },
    container_animation_overlay_ico: {
        flex: 1,
        padding: 10,
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
    container_animation_overlay_text: {
        flex: 2,
        padding: 10,
    },
    container_title_overlay: {
        flex: 1,
        padding: 20,
        backgroundColor: "#31859C",
        elevation: 5,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    text_body_overlay: {
        textAlign: "center",
        fontSize: 18,
        padding: 20,
    },
    container_global_tiles_overlay: {
        flex: 3,
    },
    text_mouvement: {
        color: "black",
    },
});

const mapStateToProps = (state) => {
    return {
        pointing: state.pointingReducer.pointing,
        emails: state.listeEmailReducer.emails,
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue,
    };
};

export default connect(mapStateToProps, { pointingAction, RESET_ACTION, listeEmailAction, resetListMail, RESET_TABLE_ACTION, emailAction, passwordAction, langueAction })(ManagementNoConnection);
