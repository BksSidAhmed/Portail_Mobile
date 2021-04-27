import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { pointingAction } from "../redux/actions/pointingHorsLigneAction";
import * as Animatable from "react-native-animatable";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
class Confidential extends React.Component {
    render() {
        let text_confidential_1 = "";
        let text_confidential_2 = "";

        if (this.props.langue === "100") {
            text_confidential_1 = "Vos données sont protégées.";
            text_confidential_2 = "Les données échangées entre votre téléphone mobile et le serveur NIVA sont sécurisées et cryptées par certificat.";
            this.props.navigation.setOptions({ title: "Confidentialité" });
        }

        if (this.props.langue === "109") {
            text_confidential_1 = "Ihre Daten sind geschützt.";
            text_confidential_2 = "Die zwischen Ihrem Mobiltelefon und dem NIVA-Server ausgetauschten Daten werden durch ein Zertifikat gesichert und verschlüsselt.";
            this.props.navigation.setOptions({ title: "Vertraulichkeit" });
        }

        if (this.props.langue === "134") {
            text_confidential_1 = "Tus datos están protegidos.";
            text_confidential_2 = "Los datos intercambiados entre su teléfono móvil y el servidor NIVA están protegidos y encriptados por certificado.";
            this.props.navigation.setOptions({ title: "Confidencialidad" });
        }

        if (this.props.langue === "132") {
            text_confidential_1 = "Your data is protected.";
            text_confidential_2 = "The data exchanged between your mobile phone and the NIVA server is secured and encrypted by certificate.";
            this.props.navigation.setOptions({ title: "Confidentiality" });
        }

        if (this.props.langue === "127") {
            text_confidential_1 = "I tuoi dati sono protetti.";
            text_confidential_2 = "I dati scambiati tra il tuo telefono cellulare e il server NIVA sono protetti e crittografati da certificato.";
            this.props.navigation.setOptions({ title: "Riservatezza" });
        }

        if (this.props.langue === "135") {
            text_confidential_1 = "Uw gegevens zijn beschermd.";
            text_confidential_2 = "De gegevens die tussen uw mobiele telefoon en de NIVA-server worden uitgewisseld, zijn beveiligd en versleuteld met een certificaat.";
            this.props.navigation.setOptions({ title: "Vertrouwelijkheid" });
        }

        return (
            <View style={styles.container}>
                <Animatable.View animation="bounceIn" style={styles.container_header}>
                    <View style={styles.container_logo}>
                        <View style={styles.container_ico}>
                            <FontAwesome5 name="user-lock" size={35} color="#008080" style={styles.ico_header} />
                        </View>
                    </View>
                </Animatable.View>
                <View style={styles.container_body}>
                    <Animatable.View animation="bounceIn" delay={300}>
                        <TouchableOpacity style={styles.text_body}>
                            <Text style={styles.text_confidential}>{text_confidential_1}</Text>
                            <Text style={styles.text_confidential}>{text_confidential_2}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    container_logo: {
        flex: 1,
        padding: 20,
        backgroundColor: "#008080",
        elevation: 5,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    container_ico: {
        backgroundColor: "#ECEFEC",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        height: 70,
    },
    ico_header: {
        padding: 15,
    },
    text_confidential: {
        padding: 5,
    },
    text_body: {
        padding: 30,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 5,
        marginBottom: 10,
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

export default connect(mapStateToProps, { listeEmailAction, pointingAction })(Confidential);
