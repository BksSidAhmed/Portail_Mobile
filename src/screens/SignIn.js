import React from "react";
import { connect } from "react-redux";
import { ScrollView, View, StyleSheet, Text, StatusBar, ActivityIndicator, NativeModules } from "react-native";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { getToken, getUser, postLostPassword } from "../api/index";
import * as Animatable from "react-native-animatable";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { langueAction } from "../redux/actions/langueAction";
import { Button, Input, Overlay } from "react-native-elements";
import { Platform } from "react-native";
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.state = {
            loading: false,
            visibleError: false,
            visibleLostPassword: false,
            visibleLostPasswordResponse: false,
            loaderLostPassword: false,
            responseLostPassword: "",
            emailLostPassword: null,
            text_input_email: "Email",
            text_input_password: "Mot de passe",
            text_bouton_connexion: "Connexion",
            text_bouton_lost_password: "Mot de passe oublié ?",
        };
    }

    UNSAFE_componentWillMount = () => {
        const locale = Platform.OS === "ios" ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

        if (locale === "de_DE") {
            this.setState({
                text_input_email: "Email",
                text_input_password: "Passwort",
                text_bouton_connexion: "Einloggen",
                text_bouton_lost_password: "Passwort vergessen ?",
            });
        }
        if (locale === "es_ES") {
            this.setState({
                text_input_email: "Correo electrónico",
                text_input_password: "Contraseña",
                text_bouton_connexion: "Iniciar sesión",
                text_bouton_lost_password: "Contraseña olvidada ?",
            });
        }
        if (locale === "en_GB") {
            this.setState({
                text_input_email: "Email",
                text_input_password: "Password",
                text_bouton_connexion: "Login",
                text_bouton_lost_password: "Lost password ?",
            });
        }
        if (locale === "it_IT") {
            this.setState({
                text_input_email: "E-mail",
                text_input_password: "Parola d'ordine",
                text_bouton_connexion: "Accedi",
                text_bouton_lost_password: "Password dimenticata ?",
            });
        }
        if (locale === "nl_NL") {
            this.setState({
                text_input_email: "E-mail",
                text_input_password: "Wachtwoord",
                text_bouton_connexion: "Inloggen",
                text_bouton_lost_password: "Vergeten wachtwoord ?",
            });
        }
    };

    editEmail = (text) => {
        this.email = text;
    };

    editEmailLostPassword = (text) => {
        this.emailLostPassword = text;
    };

    editPassword = (text) => {
        this.password = text;
    };

    connexion = () => {
        getToken(this.email, this.password).then((token) => {
            if (token[0] === 200) {
                this.setState({
                    loading: true,
                });

                this.props.emailAction(this.email);
                this.props.passwordAction(this.password);

                getUser(token[1].token, this.email).then((user) => {
                    if (user[0] === 200) {
                        this.props.langueAction(user[1].user.langue);
                    } else {
                        this.setState({
                            loading: false,
                            visibleError: true,
                        });
                    }
                });

                const found = this.props.emails.find((element) => element === this.email);

                if (found === undefined) {
                    this.props.listeEmailAction(this.email);
                }
            } else if (token[0] === 401) {
                this.setState({
                    loading: false,
                    visibleError: true,
                });
            } else {
                this.props.navigation.navigate("Gestion du temps hors connection");
            }
        });
    };

    forgotPassword = () => {
        this.setState({
            loaderLostPassword: true,
            visibleLostPasswordResponse: true,
        });

        this.toggleOverlay("lost-password");
        this.toggleOverlay("response-lost-password");

        if (this.emailLostPassword != null) {
            postLostPassword(this.emailLostPassword).then((data) => {
                this.setState({
                    loaderLostPassword: false,
                    responseLostPassword: data[1],
                });
            });
        } else {
            this.setState({
                loaderLostPassword: false,
                responseLostPassword: { success: false, message: "Aucun email renseigné." },
            });
        }
    };

    toggleOverlay = (selector) => {
        if (selector === "error") {
            this.setState({ visibleError: !this.state.visibleError });
        }
        if (selector === "lost-password") {
            this.setState({ visibleLostPassword: !this.state.visibleLostPassword });
        }
        if (selector === "response-lost-password") {
            this.setState({ visibleLostPasswordResponse: !this.state.visibleLostPasswordResponse });
        }
    };

    contentLostPassword = () => {
        return (
            <View style={styles.view_overlay}>
                <View>
                    <Text style={styles.text_overlay}>Entrez votre email. Un lien vous permettant de renouveler votre mot de passe vous sera envoyé.</Text>
                    <Input
                        placeholder={this.state.text_input_email}
                        rightIcon={{ type: "font-awesome", name: "envelope" }}
                        style={styles.text_input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) => this.editEmailLostPassword(text)}
                    />
                </View>
                <View style={styles.view_button_overlay}>
                    <Button buttonStyle={styles.button_overlay_accept} title="Envoyer" onPress={() => this.forgotPassword()} />
                    <Button buttonStyle={styles.button_overlay_refuse} title="Annuler" onPress={() => this.toggleOverlay("lost-password")} />
                </View>
            </View>
        );
    };

    contentLostPasswordResponse = (data) => {
        return (
            <View style={styles.view_overlay}>
                <Text style={styles.text_overlay}>{data.message}</Text>
                <View style={styles.view_button_overlay}>
                    <Button buttonStyle={styles.button_overlay_accept} title="OK" onPress={() => this.toggleOverlay("response-lost-password")} />
                </View>
            </View>
        );
    };

    loader = () => {
        return (
            <View style={styles.view_overlay}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.view_title}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            );
        }

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
                                    style={styles.text_input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={(text) => this.editEmail(text)}
                                />
                                <Input
                                    placeholder={this.state.text_input_password}
                                    rightIcon={{ type: "font-awesome", name: "lock" }}
                                    style={styles.text_input}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    onChangeText={(text) => this.editPassword(text)}
                                />
                            </View>
                            <View style={styles.view_button}>
                                <Button containerStyle={styles.container_button} buttonStyle={styles.button_style} title={this.state.text_bouton_connexion} titleStyle={styles.text_button} onPress={() => this.connexion()} />
                                <Button containerStyle={styles.container_button} buttonStyle={styles.button_style} title={this.state.text_bouton_lost_password} titleStyle={styles.text_button} onPress={() => this.toggleOverlay("lost-password")} />
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </View>
                <Overlay isVisible={this.state.visibleError} onBackdropPress={() => this.toggleOverlay("error")}>
                    <View style={styles.view_overlay}>
                        <Text style={styles.text_overlay}>Le nom d'utilisateur et/ou le mot de passe est incorrect.</Text>
                        <View style={styles.view_button_overlay}>
                            <Button buttonStyle={styles.button_overlay_accept} title="Fermer" onPress={() => this.toggleOverlay("error")} />
                        </View>
                    </View>
                </Overlay>
                <Overlay isVisible={this.state.visibleLostPassword} onBackdropPress={() => this.toggleOverlay("lost-password")}>
                    {this.contentLostPassword()}
                </Overlay>
                <Overlay isVisible={this.state.visibleLostPasswordResponse} onBackdropPress={() => this.toggleOverlay("response-lost-password")}>
                    {this.state.loaderLostPassword ? this.loader() : this.contentLostPasswordResponse(this.state.responseLostPassword)}
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
        // fontWeight: "bold",
        // fontSize: 60,
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
