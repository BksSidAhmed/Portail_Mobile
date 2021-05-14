import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { connect } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Animatable from "react-native-animatable";
import NetInfo from "@react-native-community/netinfo";
import { Button, Overlay } from "react-native-elements";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            switchOn: false,
            title_message: "",
            text_localisation: "",
            text_localisation_active: "",
            text_localisation_desactive: "",
            text_password: "",
            text_modal_no_internet_connection: "Il semblerait que vous n'ayez pas d'accès à internet. Vous pourrez réessayer lorsque vous aurez à nouveau un accès.",
            text_modal_button_close: "Fermer",
            text_error_network: "",
            text_button_error_no_internet_connection: "Aucune connexion internet.\nAppuyer pour rafraichir.",
            visible_modal_no_internet_connection: false,
        };

        if (this.props.langue === "100") {
            this.state.text_localisation_active = "Localisation activé";
            this.state.text_localisation_desactive = "Localisation désactivé";
            this.state.text_password = "Changer le mot de passe";
            this.props.navigation.setOptions({ title: "Niva - Paramètres" });
        }

        if (this.props.langue === "109") {
            this.state.text_localisation_active = "Lage aktiviert";
            this.state.text_localisation_desactive = "Lage deaktiviert";
            this.state.text_password = "Kennwort ändern";
            this.props.navigation.setOptions({ title: "Niva - Einstellungen" });
        }

        if (this.props.langue === "134") {
            this.state.text_localisation_active = "Localización activado";
            this.state.text_localisation_desactive = "Localización desactivado";
            this.state.text_password = "Cambiar la contraseña";
            this.props.navigation.setOptions({ title: "Niva - Configuraciones" });
        }

        if (this.props.langue === "132") {
            this.state.text_localisation_active = "Location enabled";
            this.state.text_localisation_desactive = "Location disabled";
            this.state.text_password = "Change password";
            this.props.navigation.setOptions({ title: "Niva - Settings" });
        }

        if (this.props.langue === "127") {
            this.state.text_localisation_active = "Posizione abilitato";
            this.state.text_localisation_desactive = "Posizione disattivato";
            this.state.text_password = "Cambia la password";
            this.props.navigation.setOptions({ title: "Niva - Impostazioni" });
        }

        if (this.props.langue === "135") {
            this.state.text_localisation_active = "Locatie ingeschakeld";
            this.state.text_localisation_desactive = "Locatie uitgeschakeld";
            this.state.text_password = "Wachtwoord wijzigen";
            this.props.navigation.setOptions({ title: "Niva - Instellingen" });
        }
    }

    onPressPassword = () => {
        NetInfo.fetch().then((netInfos) => {
            if (!netInfos.isConnected) {
                this._toggleOverlay("no-internet-connection");
            } else {
                this.props.navigation.navigate("Mot de passe");
            }
        });
    };

    _toggleOverlay = (selector) => {
        if (selector === "no-internet-connection") {
            this.setState({ visible_modal_no_internet_connection: !this.state.visible_modal_no_internet_connection, text_error_network: this.state.text_button_error_no_internet_connection });
        }
    };

    _renderModal = (selector) => {
        if (selector === "no-internet-connection") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.text_modal_no_internet_connection}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_accept} title={this.state.text_modal_button_close} onPress={() => this._toggleOverlay("no-internet-connection")} />
                    </View>
                </View>
            );
        }
    };

    render() {
        const Initialnom = this.props.nom.substr(0, 1);
        const Initialprenom = this.props.prenom.substr(0, 1);
        return (
            <View style={styles.container}>
                <Animatable.View animation="bounceIn" style={styles.container_header}>
                    <View style={styles.container_ico_logo_email}>
                        <View style={styles.container_ico}>
                            <Text style={styles.initial_text}>{Initialprenom + Initialnom}</Text>
                        </View>
                    </View>
                    <View style={styles.container_logo_email}>
                        <View style={styles.container_email}>
                            <Text style={styles.text_email}>{this.props.prenom + " " + this.props.nom}</Text>
                        </View>
                        <View style={styles.container_email}>
                            <Text style={styles.text_email}>{this.props.email}</Text>
                        </View>
                    </View>
                </Animatable.View>
                <View style={styles.container_body}>
                    <Animatable.View animation="bounceIn" delay={300}>
                        <TouchableOpacity style={styles.button_body} onPress={() => this.onPressPassword()}>
                            <FontAwesome5 name="key" color="#31859C" size={20} />
                            <Text style={styles.text_button}>{this.state.text_password}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
                <Overlay isVisible={this.state.visible_modal_no_internet_connection} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("no-internet-connection")}
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    container_header: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
    },
    container_body: {
        flex: 2,
        padding: 10,
    },
    container_ico_logo_email: {
        flex: 1,
        padding: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    container_logo_email: {
        flex: 1,
        alignItems: "center",
    },
    container_email: {
        flex: 1,
        justifyContent: "center",
    },
    container_ico: {
        backgroundColor: "#376092",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        height: 90,
        width: 90,
        marginBottom: 10,
    },
    initial_text: {
        color: "#fff",
        fontSize: 20,
    },
    button_body: {
        padding: 30,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#D0D0D0",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
    button_localisation_left: {
        flex: 2,
        flexDirection: "row",
    },
    button_localisation_right: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    text_button: {
        fontSize: 17,
        marginLeft: 15,
    },
    text_email: {
        fontSize: 17,
    },
    ico_padding: {
        padding: 15,
    },
    view_button_overlay: {
        flexDirection: "row",
        justifyContent: "center",
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15,
    },
    view_overlay: {
        padding: 20,
    },
    overlay_margin_10: {
        margin: 10,
    },
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue,
        nom: state.nomReducer.nom,
        prenom: state.prenomReducer.prenom,
    };
};

export default connect(mapStateToProps, { emailAction, passwordAction })(Settings);
