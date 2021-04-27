import React from "react";
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Button, Input, Overlay } from "react-native-elements";
import { getToken, postEditPassword } from "../api";
import * as Animatable from "react-native-animatable";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import { passwordAction } from "../redux/actions/passwordAction";

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.oldPassword = "";
        this.newPassword = "";
        this.samePassword = "";
        this.state = {
            currentIco: "",
            currentLibelle: "",
            currentText: "",
            visible: false,
            loaderOverlayResponse: false,
            error: false,
        };
    }

    valider(newPassword, oldPassword, samePassword) {
        this.setState({
            error: false,
            visible: true,
            loaderOverlayResponse: true,
            currentLibelle: "",
        });

        if (newPassword === samePassword) {
            if (this.props.password === this.oldPassword) {
                getToken(this.props.email, this.props.password).then((token) => {
                    if (token[0] === 200) {
                        postEditPassword(token[1].token, this.props.email, newPassword, oldPassword).then((data) => {
                            if (data[0] === 200) {
                                this.setState({
                                    loaderOverlayResponse: false,
                                    currentLibelle: "Information",
                                    currentText: data[1].message,
                                });
                                this.props.passwordAction(newPassword);
                            } else {
                                this.setState({
                                    error: true,
                                    loaderOverlayResponse: false,
                                    currentLibelle: "Erreur",
                                    currentText: "Erreur côté serveur. Veuillez réessayer ultérieurement.",
                                });
                            }
                        });
                    } else {
                        this.setState({
                            error: true,
                            loaderOverlayResponse: false,
                            currentLibelle: "Erreur",
                            currentText: "Votre mot de passe actuel n'est pas le bon.",
                        });
                    }
                });
            } else {
                this.setState({
                    error: true,
                    loaderOverlayResponse: false,
                    currentLibelle: "Erreur",
                    currentText: "Votre mot de passe actuel n'est pas le bon.",
                });
            }
        } else {
            this.setState({
                error: true,
                loaderOverlayResponse: false,
                currentLibelle: "Erreur formulaire",
                currentText: "Les deux mots de passe ne sont pas identiques.",
            });
        }
    }

    editOldPassword = (text) => {
        this.oldPassword = text;
    };

    editNewPassword = (text) => {
        this.newPassword = text;
    };

    editSamePassword = (text) => {
        this.samePassword = text;
    };

    dialogPopup = (ico, title, text) => {
        return (
            <Overlay isVisible={this.state.visible} overlayStyle={styles.overlay_padding} fullScreen={true} animationType="slide">
                <View style={styles.container_flex_1}>
                    <View style={styles.container_title}>
                        <Text style={styles.text_title_dialog}>{title}</Text>
                    </View>
                    {this.state.loaderOverlayResponse ? (
                        <View style={styles.view_title}>
                            <ActivityIndicator size="large" color="#008080" />
                        </View>
                    ) : (
                        <View style={styles.container_flex_1}>
                            <Animatable.View animation="slideInLeft" style={styles.container_button_animation}>
                                <View style={styles.ico_dialog}>{this.state.error ? <FontAwesome5 name="exclamation-triangle" color="white" size={70} /> : <FontAwesome5 name="check-circle" color="white" size={70} />}</View>
                            </Animatable.View>
                            <Animatable.View animation="slideInRight" style={styles.container_button_animation}>
                                <View style={styles.text_dialog_popup}>
                                    <Text style={styles.text_dialog}>{text}</Text>
                                </View>
                            </Animatable.View>
                            <Button buttonStyle={styles.button_overlay_accept} title="OK" onPress={() => this.setState({ visible: false })} />
                        </View>
                    )}
                </View>
            </Overlay>
        );
    };

    render() {
        return (
            <View style={styles.view_form}>
                <ScrollView style={styles.container_flex_1}>
                    <View style={styles.view_input}>
                        <Input placeholder="Mot de passe actuelle" rightIcon={{ type: "font-awesome", name: "unlock" }} style={styles.text_input} secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.editOldPassword(text)} />
                        <Input placeholder="Nouveau Mot de Passe" rightIcon={{ type: "font-awesome", name: "lock" }} style={styles.text_input} secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.editNewPassword(text)} />
                        <Input placeholder="Saisir à nouveau" rightIcon={{ type: "font-awesome", name: "lock" }} style={styles.text_input} secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.editSamePassword(text)} />
                    </View>
                </ScrollView>
                <View style={styles.view_button}>
                    <Button containerStyle={styles.button_container} buttonStyle={styles.button_style} title="Valider" onPress={() => this.valider(this.newPassword, this.oldPassword, this.samePassword)} />
                </View>
                {this.dialogPopup(this.state.currentIco, this.state.currentLibelle, this.state.currentText)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#008080",
    },
    container_button_animation: {
        flex: 1,
    },
    container_title: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#008080",
        height: 60,
    },
    container_flex_1: {
        flex: 1,
    },
    view_title: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    view_form: {
        flex: 1,
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
        alignItems: "flex-end",
        justifyContent: "flex-end",
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
    text_title_dialog: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    text_footer: {
        color: "#05375a",
        fontSize: 22,
        marginTop: 20,
    },
    text_button: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    text_input: {
        color: "#05375a",
    },
    text_overlay: {
        marginBottom: 20,
        fontSize: 15,
    },
    text_dialog: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
    },
    button_style: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 50,
        backgroundColor: "#008080",
    },
    button_container: {
        width: "100%",
    },
    button_overlay_accept: {
        borderRadius: 50,
        backgroundColor: "#008080",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
    },
    button_overlay_refuse: {
        borderRadius: 50,
        backgroundColor: "#b22222",
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
    },
    imageOverlay: {
        height: 70,
        width: 70,
    },
    overlay_padding: {
        padding: 0,
    },
    ico_dialog: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#008080",
        marginVertical: 10,
        marginBottom: 5,
    },
    text_dialog_popup: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#008080",
        marginVertical: 10,
        marginTop: 5,
        padding: 15,
    },
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
    };
};

export default connect(mapStateToProps, { passwordAction })(Password);
