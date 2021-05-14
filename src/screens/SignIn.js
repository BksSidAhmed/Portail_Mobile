import React from "react";
import { connect } from "react-redux";
import { ScrollView, View, StyleSheet, Text, StatusBar, NativeModules } from "react-native";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { getToken, getUser, postLostPassword } from "../api/index";
import * as Animatable from "react-native-animatable";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { langueAction } from "../redux/actions/langueAction";
import { Button, Input, Overlay } from "react-native-elements";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.email_lost_password = "";
        this.state = {
            loader_button_send_lost_password: false,
            loader_button_send_connection: false,
            disable_button_send_lost_password: false,
            disable_buttons_send_connection: false,
            text_input_email: "Email",
            text_input_password: "Mot de passe",
            text_bouton_connexion: "Connexion",
            text_modal_button_send: "Envoyer",
            text_modal_button_cancel: "Annuler",
            text_modal_button_close: "Fermer",
            text_bouton_lost_password: "Mot de passe oublié ?",
            text_modal_error_credentials: "Le nom d'utilisateur et/ou le mot de passe est incorrect.",
            text_modal_lost_password: "Entrez votre email. Un lien vous permettant de renouveler votre mot de passe vous sera envoyé.",
            text_modal_no_internet_connection: "Il semblerait que vous n'ayez pas d'accès à internet. Vous pourrez réessayer lorsque vous aurez à nouveau un accès.",
            text_modal_error_unknown: "Il semblerait y avoir un problème avec le serveur distant. Veuillez réessayer plus tard.",
            error_input_lost_password: "",
            error_input_password: "",
            error_input_email: "",
            visible_modal_error_credentials: false,
            visible_modal_error_unknown: false,
            visible_modal_lost_password: false,
            visible_modal_response_lost_password: false,
            visible_modal_no_internet_connection: false,
            response_lost_password: "",
            etat_connection: true,
        };
    }

    UNSAFE_componentWillMount = () => {
        const locale = Platform.OS === "ios" ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

        NetInfo.addEventListener((netInfos) => {
            this.setState({
                etat_connection: netInfos.isConnected,
            });
            if (!netInfos.isConnected) {
                this._toggleOverlay("no-internet-connection");
            }
        });

        if (locale === "de_DE") {
            this.setState({
                text_input_email: "Email",
                text_input_password: "Passwort",
                text_bouton_connexion: "Einloggen",
                text_bouton_lost_password: "Passwort vergessen ?",
                text_modal_button_send: "Senden",
                text_modal_button_cancel: "Abbrechen",
                text_modal_button_close: "Schließen",
                text_modal_error_credentials: "Der Benutzername und / oder das Passwort sind falsch.",
                text_modal_lost_password: "Geben sie ihre E-Mail Adresse ein. Ein Link, über den Sie Ihr Passwort erneuern können, wird an Sie gesendet.",
                text_modal_no_internet_connection: "Es sieht so aus, als hätten Sie keinen Internetzugang. Sie können es erneut versuchen, wenn Sie erneut Zugriff haben.",
                text_modal_error_unknown: "Es scheint ein Problem mit dem Remote-Server zu geben. Bitte versuchen Sie es später noch einmal.",
            });
        }
        if (locale === "es_ES") {
            this.setState({
                text_input_email: "Correo electrónico",
                text_input_password: "Contraseña",
                text_bouton_connexion: "Iniciar sesión",
                text_bouton_lost_password: "Contraseña olvidada ?",
                text_modal_button_send: "Enviar",
                text_modal_button_cancel: "Anular",
                text_modal_button_close: "Cerrar",
                text_modal_error_credentials: "El nombre de usuario y / o la contraseña son incorrectos.",
                text_modal_lost_password: "Introduce tu correo electrónico. Se le enviará un enlace que le permitirá renovar su contraseña.",
                text_modal_no_internet_connection: "Parece que no tienes acceso a Internet. Puede intentarlo de nuevo cuando tenga acceso de nuevo.",
                text_modal_error_unknown: "Parece haber un problema con el servidor remoto. Por favor, inténtelo de nuevo más tarde.",
            });
        }
        if (locale === "en_GB") {
            this.setState({
                text_input_email: "Email",
                text_input_password: "Password",
                text_bouton_connexion: "Login",
                text_bouton_lost_password: "Lost password ?",
                text_modal_button_send: "Send",
                text_modal_button_cancel: "Cancel",
                text_modal_button_close: "Close",
                text_modal_error_credentials: "The username and / or password is incorrect.",
                text_modal_lost_password: "Enter your e-mail. A link allowing you to renew your password will be sent to you.",
                text_modal_no_internet_connection: "It looks like you don't have internet access. You can try again when you have access again.",
                text_modal_error_unknown: "There appears to be a problem with the remote server. Please try again later.",
            });
        }
        if (locale === "it_IT") {
            this.setState({
                text_input_email: "E-mail",
                text_input_password: "Parola d'ordine",
                text_bouton_connexion: "Accedi",
                text_bouton_lost_password: "Password dimenticata ?",
                text_modal_button_send: "Mandare",
                text_modal_button_cancel: "Cancellare",
                text_modal_button_close: "Chiudere",
                text_modal_error_credentials: "Il nome utente e / o la password non sono corretti.",
                text_modal_lost_password: "Inserisci il tuo indirizzo email. Ti verrà inviato un collegamento che ti consentirà di rinnovare la password.",
                text_modal_no_internet_connection: "Sembra che tu non abbia accesso a Internet. Puoi riprovare quando avrai di nuovo accesso.",
                text_modal_error_unknown: "Sembra che ci sia un problema con il server remoto. Per favore riprova più tardi.",
            });
        }
        if (locale === "nl_NL") {
            this.setState({
                text_input_email: "E-mail",
                text_input_password: "Wachtwoord",
                text_bouton_connexion: "Inloggen",
                text_bouton_lost_password: "Vergeten wachtwoord ?",
                text_modal_button_send: "Sturen",
                text_modal_button_cancel: "Annuleren",
                text_modal_button_close: "Sluiten",
                text_modal_error_credentials: "De gebruikersnaam en / of het wachtwoord is onjuist.",
                text_modal_lost_password: "Voer uw e-mailadres in. U ontvangt een link waarmee u uw wachtwoord kunt vernieuwen.",
                text_modal_no_internet_connection: "Het lijkt erop dat u geen internettoegang heeft. U kunt het opnieuw proberen als u weer toegang heeft.",
                text_modal_error_unknown: "Er lijkt een probleem te zijn met de externe server. Probeer het later nog eens.",
            });
        }
    };

    editEmail = (text) => {
        this.email = text;
        if (text !== "") {
            this.setState({ error_input_email: "" });
        } else {
            this.setState({ error_input_email: "Veuillez enter votre mail" });
        }
    };

    editEmailLostPassword = (text) => {
        this.email_lost_password = text;
        if (text !== "") {
            this.setState({ error_input_lost_password: "" });
        } else {
            this.setState({ error_input_lost_password: "Veuillez renseigner un mail" });
        }
    };

    editPassword = (text) => {
        this.password = text;
        if (text !== "") {
            this.setState({ error_input_password: "" });
        } else {
            this.setState({ error_input_password: "Veuillez entrer votre mot de passe" });
        }
    };

    _sendRequest = (selector) => {
        if (this.state.etat_connection) {
            if (selector === "connection") {
                if (this.email !== "") {
                    if (this.password !== "") {
                        this.setState({ loader_button_send_connection: true, disable_buttons_send_connection: true });
                        getToken(this.email, this.password).then((token) => {
                            if (token[0] === 200) {
                                getUser(token[1].token, this.email).then((user) => {
                                    if (user[0] === 200) {
                                        this.props.emailAction(this.email);
                                        this.props.passwordAction(this.password);
                                        this.props.langueAction(user[1].user.langue);

                                        const found = this.props.emails.find((element) => element === this.email);

                                        if (found === undefined) {
                                            this.props.listeEmailAction(this.email);
                                        }
                                    } else {
                                        this.setState({
                                            loader_button_send_connection: false,
                                            disable_buttons_send_connection: false,
                                            visible_modal_error_unknown: true,
                                        });
                                    }
                                });
                            } else if (token[0] === 401) {
                                this.setState({
                                    loader_button_send_connection: false,
                                    disable_buttons_send_connection: false,
                                    visible_modal_error_credentials: true,
                                });
                            } else {
                                this.setState({
                                    loader_button_send_connection: false,
                                    disable_buttons_send_connection: false,
                                    visible_modal_error_unknown: true,
                                });
                            }
                        });
                    } else {
                        this.setState({
                            error_input_password: "Veuillez entrer votre mot de passe",
                        });
                    }
                } else {
                    this.setState({
                        error_input_email: "Veuillez entrer votre mail",
                    });
                }
            }

            if (selector === "lost-password") {
                if (this.email_lost_password !== "") {
                    this.setState({ loader_button_send_lost_password: true, disable_button_send_lost_password: true });
                    postLostPassword(this.email_lost_password).then((data) => {
                        this.setState({
                            loader_button_send_lost_password: false,
                            disable_button_send_lost_password: false,
                            response_lost_password: "",
                        });

                        if (data[1].success) {
                            this.setState({
                                response_lost_password: data[1].message,
                            });
                            this._toggleOverlay("response-lost-password");
                        } else {
                            this.setState({
                                error_input_lost_password: data[1].message,
                            });
                        }
                    });
                } else {
                    this.setState({
                        error_input_lost_password: "Veuillez renseigner un mail",
                    });
                }
            }
        } else {
            this._toggleOverlay("no-internet-connection");
        }
    };

    _toggleOverlay = (selector) => {
        if (selector === "error-credentials") {
            this.setState({ visible_modal_error_credentials: !this.state.visible_modal_error_credentials });
        }
        if (selector === "error-unknown") {
            this.setState({ visible_modal_error_unknown: !this.state.visible_modal_error_unknown });
        }
        if (selector === "no-internet-connection") {
            this.setState({ visible_modal_no_internet_connection: !this.state.visible_modal_no_internet_connection });
        }
        if (selector === "lost-password") {
            this.setState({ visible_modal_lost_password: !this.state.visible_modal_lost_password, error_input_lost_password: "" });
            this.email_lost_password = "";
        }
        if (selector === "response-lost-password") {
            this.setState({ visible_modal_response_lost_password: !this.state.visible_modal_response_lost_password });
        }
    };

    _renderModal = (selector) => {
        if (selector === "error-credentials") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.text_modal_error_credentials}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={this.state.text_modal_button_close} onPress={() => this._toggleOverlay("error-credentials")} />
                    </View>
                </View>
            );
        }

        if (selector === "error-unknown") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.text_modal_error_unknown}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={this.state.text_modal_button_close} onPress={() => this._toggleOverlay("error-unknown")} />
                    </View>
                </View>
            );
        }

        if (selector === "lost-password") {
            return (
                <View style={styles.view_overlay}>
                    <View>
                        <Text style={styles.text_overlay}>{this.state.text_modal_lost_password}</Text>
                        <Input
                            placeholder={this.state.text_input_email}
                            rightIcon={{ type: "font-awesome", name: "envelope" }}
                            errorMessage={this.state.error_input_lost_password}
                            style={styles.text_input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => this.editEmailLostPassword(text)}
                        />
                    </View>
                    <View style={styles.view_button_overlay}>
                        <Button
                            buttonStyle={styles.button_overlay_accept}
                            containerStyle={styles.container_button_overlay_accept}
                            title={this.state.text_modal_button_send}
                            disabled={this.state.disable_button_send_lost_password}
                            loading={this.state.loader_button_send_lost_password}
                            loadingProps={styles.loader_lost_password}
                            onPress={() => this._sendRequest("lost-password")}
                        />
                        <Button
                            buttonStyle={styles.button_overlay_refuse}
                            containerStyle={styles.container_button_overlay_accept}
                            title={this.state.text_modal_button_cancel}
                            disabled={this.state.disable_button_send_lost_password}
                            onPress={() => this._toggleOverlay("lost-password")}
                        />
                    </View>
                </View>
            );
        }

        if (selector === "response-lost-password") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.response_lost_password}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={this.state.text_modal_button_close} onPress={() => this._toggleOverlay("response-lost-password")} />
                    </View>
                </View>
            );
        }

        if (selector === "no-internet-connection") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.text_modal_no_internet_connection}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={this.state.text_modal_button_close} onPress={() => this._toggleOverlay("no-internet-connection")} />
                    </View>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#31859C" barStyle="light-content" />
                <View style={styles.view_title}>
                    <Animatable.Text animation="fadeInDown" style={styles.text_title}>
                        NIVA
                    </Animatable.Text>
                </View>
                <View style={styles.view_form}>
                    <ScrollView>
                        <Animatable.View animation="fadeInUp">
                            <View style={styles.view_input}>
                                <Input
                                    placeholder={this.state.text_input_email}
                                    rightIcon={{ type: "font-awesome", name: "envelope" }}
                                    errorMessage={this.state.error_input_email}
                                    style={styles.text_input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={(text) => this.editEmail(text)}
                                />
                                <Input
                                    placeholder={this.state.text_input_password}
                                    rightIcon={{ type: "font-awesome", name: "lock" }}
                                    errorMessage={this.state.error_input_password}
                                    style={styles.text_input}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    onChangeText={(text) => this.editPassword(text)}
                                />
                            </View>
                            <View style={styles.view_button}>
                                <Button
                                    containerStyle={styles.container_button}
                                    buttonStyle={styles.button_style}
                                    title={this.state.text_bouton_connexion}
                                    titleStyle={styles.text_button}
                                    disabled={this.state.disable_buttons_send_connection}
                                    loading={this.state.loader_button_send_connection}
                                    loadingProps={styles.loader_connection}
                                    onPress={() => this._sendRequest("connection")}
                                />
                                <Button containerStyle={styles.container_button} buttonStyle={styles.button_style} title={this.state.text_bouton_lost_password} titleStyle={styles.text_button} onPress={() => this._toggleOverlay("lost-password")} />
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </View>
                <Overlay isVisible={this.state.visible_modal_error_credentials} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("error-credentials")}
                </Overlay>
                <Overlay isVisible={this.state.visible_modal_error_unknown} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("error-unknown")}
                </Overlay>
                <Overlay isVisible={this.state.visible_modal_no_internet_connection} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("no-internet-connection")}
                </Overlay>
                <Overlay isVisible={this.state.visible_modal_lost_password} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("lost-password")}
                </Overlay>
                <Overlay isVisible={this.state.visible_modal_response_lost_password} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("response-lost-password")}
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#31859C",
    },
    container_button: {
        width: "100%",
    },
    view_title: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    view_form: {
        flex: 2,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    view_input: {
        marginTop: 20,
        paddingTop: 10,
    },
    view_button: {
        alignItems: "center",
        marginVertical: 10,
    },
    view_overlay: {
        padding: 20,
    },
    view_button_overlay: {
        flexDirection: "row",
        justifyContent: "center",
    },
    text_title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 60,
    },
    text_button: {
        color: "black",
    },
    text_input: {
        color: "#05375a",
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15,
    },
    button_style: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 0,
        backgroundColor: "white",
        elevation: 5,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    button_overlay_accept: {
        borderRadius: 0,
        backgroundColor: "#62B554",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    container_button_overlay_accept: {
        flex: 1,
    },
    button_overlay_refuse: {
        borderRadius: 0,
        backgroundColor: "#AC6867",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    loader_lost_password: {
        color: "#31859C",
    },
    loader_connection: {
        color: "#31859C",
    },
    overlay_margin_10: {
        margin: 10,
    },
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        emails: state.listeEmailReducer.emails,
        langue: state.langueReducer.langue,
        pointing: state.pointingReducer.pointing,
    };
};

export default connect(mapStateToProps, { emailAction, passwordAction, listeEmailAction, langueAction })(SignIn);
