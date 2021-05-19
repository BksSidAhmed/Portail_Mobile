import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { connect } from "react-redux";
import { emailAction } from "../redux/actions/emailAction";
import { passwordAction } from "../redux/actions/passwordAction";
import { langueAction } from "../redux/actions/langueAction";

class DrawerComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    signOut = () => {
        this.props.emailAction("");
        this.props.passwordAction("");
        this.props.langueAction("100");
    };

    render() {
        let list_item = [{ text: "Gestion du temps" }, { text: "Confidentialité" }, { text: "À propos" }, { text: "Déconnexion" }];

        if (this.props.langue === "109") {
            list_item = [{ text: "Zeitmanagement" }, { text: "Vertraulichkeit" }, { text: "Etwa" }, { text: "Ausloggen" }];
        }

        if (this.props.langue === "134") {
            list_item = [{ text: "Gestión del tiempo" }, { text: "Confidencialidad" }, { text: "A proposito" }, { text: "Cerrar sesión" }];
        }

        if (this.props.langue === "132") {
            list_item = [{ text: "Time management" }, { text: "Confidentiality" }, { text: "About" }, { text: "Logout" }];
        }

        if (this.props.langue === "127") {
            list_item = [{ text: "Gestione del tempo" }, { text: "Riservatezza" }, { text: "A proposito" }, { text: "Disconnettersi" }];
        }

        if (this.props.langue === "135") {
            list_item = [{ text: "Tijdsbeheer" }, { text: "Vertrouwelijkheid" }, { text: "Over" }, { text: "Uitloggen" }];
        }

        const Initialnom = this.props.nom.substr(0, 1);
        const Initialprenom = this.props.prenom.substr(0, 1);

        return (
            <View style={styles.container}>
                <DrawerContentScrollView>
                    <View style={styles.container_header}>
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => {
                                this.props.navigation.navigate("Parametre");
                            }}>
                            <Text style={styles.initialText}>{Initialprenom + Initialnom}</Text>
                        </TouchableOpacity>
                        <View style={styles.margin_vertical_10}>
                            <Text style={styles.initialText}> {this.props.prenom + " " + this.props.nom} </Text>
                        </View>
                    </View>
                    <View style={styles.container_body}>
                        <View style={styles.container_button}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("Gestion du temps");
                                }}>
                                <Text style={styles.buttonText}>{list_item[0].text}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container_button}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("Confidentialite");
                                }}>
                                <Text style={styles.buttonText}>{list_item[1].text}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container_button}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("A propos");
                                }}>
                                <Text style={styles.buttonText}>{list_item[2].text}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container_buttonDeconnexion}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.signOut();
                                }}>
                                <Text style={styles.buttonText}>{list_item[3].text}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DrawerContentScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#31859C",
    },
    container_header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35,
        marginBottom: 20,
    },
    container_body: {
        flex: 1,
    },
    circle: {
        width: 90,
        height: 90,
        borderRadius: 150 / 2,
        backgroundColor: "#376092",
        justifyContent: "center",
        alignItems: "center",
        elevation: 7,
    },
    initialText: {
        color: "#fff",
        fontSize: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
    },
    container_button: {
        marginRight: 50,
        marginLeft: 15,
        padding: 15,
        borderTopWidth: 1,
        borderColor: "#fff",
    },
    container_buttonDeconnexion: {
        marginRight: 50,
        marginLeft: 15,
        padding: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#fff",
    },
    margin_vertical_10: {
        marginVertical: 10,
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

export default connect(mapStateToProps, { emailAction, passwordAction, langueAction })(DrawerComponent);
