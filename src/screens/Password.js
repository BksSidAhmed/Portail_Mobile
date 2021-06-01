import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, Input, Overlay } from "react-native-elements";
import { getToken, postEditPassword } from "../api";
import { connect } from "react-redux";
import { passwordAction } from "../redux/actions/passwordAction";
import { traduction } from "../locale/local";

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.oldPassword = "";
        this.newPassword = "";
        this.samePassword = "";
        this.state = {
            loader_button_send_request: false,
            disable_buttons_send_request: false,
            visible_modal_error_unknown: false,
            visible_modal_response_edit_password: false,
            text_modal_response_edit_password: "",
            error_input_old_password: "",
            error_input_new_password_1: "",
            error_input_new_password_2: "",
            error: false,
        };
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setOptions({ title: "Niva - " + traduction("TITLE_PASSWORD", this.props.langue) });
    }

    valider(newPassword, oldPassword, samePassword) {
        if (oldPassword !== "") {
            if (newPassword !== "") {
                if (samePassword !== "") {
                    if (newPassword === samePassword) {
                        if (this.props.password === this.oldPassword) {
                            this.setState({
                                error: false,
                                loader_button_send_request: true,
                                disable_buttons_send_request: true,
                            });
                            getToken(this.props.email, this.props.password).then((token) => {
                                if (token[0] === 200) {
                                    postEditPassword(token[1].token, this.props.email, newPassword, oldPassword).then((data) => {
                                        if (data[0] === 200) {
                                            this.setState({
                                                text_modal_response_edit_password: data[1].message,
                                                loader_button_send_request: false,
                                                disable_buttons_send_request: false,
                                                visible_modal_response_edit_password: true,
                                            });
                                            this.oldPassword = "";
                                            this.newPassword = "";
                                            this.samePassword = "";
                                            this.props.passwordAction(newPassword);
                                        } else {
                                            this.setState({
                                                error: true,
                                                text_modal_response_edit_password: traduction("ERROR_UNKNOWN", this.props.langue),
                                                loader_button_send_request: false,
                                                disable_buttons_send_request: false,
                                                visible_modal_error_unknown: true,
                                            });
                                        }
                                    });
                                } else {
                                    this.setState({
                                        loader_button_send_request: false,
                                        disable_buttons_send_request: false,
                                        visible_modal_error_unknown: true,
                                    });
                                }
                            });
                        } else {
                            this.setState({
                                error_input_old_password: traduction("BAD_PASSWORD", this.props.langue),
                            });
                        }
                    } else {
                        this.setState({
                            error_input_new_password_1: traduction("ERROR_SAME_PASSWORD", this.props.langue),
                            error_input_new_password_2: traduction("ERROR_SAME_PASSWORD", this.props.langue),
                        });
                    }
                } else {
                    this.setState({ error_input_new_password_2: traduction("ERROR_INPUT_NEW_1", this.props.langue) });
                }
            } else {
                this.setState({ error_input_new_password_1: traduction("ERROR_INPUT_NEW_2", this.props.langue) });
            }
        } else {
            this.setState({
                error_input_old_password: traduction("ERROR_INPUT_OLD_PASSWORD", this.props.langue),
            });
        }
    }

    editOldPassword = (text) => {
        this.oldPassword = text;
        if (text !== "") {
            this.setState({ error_input_old_password: "" });
        } else {
            this.setState({ error_input_old_password: traduction("ERROR_INPUT_OLD_PASSWORD", this.props.langue) });
        }
    };

    editNewPassword = (text) => {
        this.newPassword = text;
        if (text !== "") {
            this.setState({ error_input_new_password_1: "" });
        } else {
            this.setState({ error_input_new_password_1: traduction("ERROR_INPUT_NEW_1", this.props.langue) });
        }
    };

    editSamePassword = (text) => {
        this.samePassword = text;
        if (text !== "") {
            this.setState({ error_input_new_password_2: "" });
        } else {
            this.setState({ error_input_new_password_2: traduction("ERROR_INPUT_NEW_2", this.props.langue) });
        }
    };

    _toggleOverlay = (selector) => {
        if (selector === "error-unknown") {
            this.setState({ visible_modal_error_unknown: !this.state.visible_modal_error_unknown });
        }
        if (selector === "response-edit-password") {
            this.setState({ visible_modal_response_edit_password: !this.state.visible_modal_response_edit_password });
        }
    };

    _renderModal = (selector) => {
        if (selector === "error-unknown") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{traduction("ERROR_UNKNOWN", this.props.langue)}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={traduction("CLOSE", this.props.langue)} onPress={() => this._toggleOverlay("error-unknown")} />
                    </View>
                </View>
            );
        }
        if (selector === "response-edit-password") {
            return (
                <View style={styles.view_overlay}>
                    <Text style={styles.text_overlay}>{this.state.text_modal_response_edit_password}</Text>
                    <View style={styles.view_button_overlay}>
                        <Button buttonStyle={styles.button_overlay_refuse} title={traduction("CLOSE", this.props.langue)} onPress={() => this.setState({ visible_modal_response_edit_password: false })} />
                    </View>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={styles.view_form}>
                <ScrollView style={styles.container_flex_1}>
                    <View style={styles.view_input}>
                        <Input
                            placeholder={traduction("INPUT_OLD", this.props.langue)}
                            rightIcon={{ type: "font-awesome", name: "unlock" }}
                            errorMessage={this.state.error_input_old_password}
                            style={styles.text_input}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={(text) => this.editOldPassword(text)}
                            value={this.oldPassword}
                        />
                        <Input
                            placeholder={traduction("INPUT_NEW_1", this.props.langue)}
                            rightIcon={{ type: "font-awesome", name: "lock" }}
                            errorMessage={this.state.error_input_new_password_1}
                            style={styles.text_input}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={(text) => this.editNewPassword(text)}
                            value={this.newPassword}
                        />
                        <Input
                            placeholder={traduction("INPUT_NEW_2", this.props.langue)}
                            rightIcon={{ type: "font-awesome", name: "lock" }}
                            errorMessage={this.state.error_input_new_password_2}
                            style={styles.text_input}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={(text) => this.editSamePassword(text)}
                            value={this.samePassword}
                        />
                    </View>
                </ScrollView>
                <View style={styles.view_button}>
                    <Button
                        containerStyle={styles.button_container}
                        buttonStyle={styles.button_style}
                        disabled={this.state.disable_buttons_send_request}
                        loading={this.state.loader_button_send_request}
                        loadingProps={styles.loader_password}
                        title={traduction("VALIDATE", this.props.langue)}
                        titleStyle={styles.text_button_validate}
                        onPress={() => this.valider(this.newPassword, this.oldPassword, this.samePassword)}
                    />
                </View>
                <Overlay isVisible={this.state.visible_modal_error_unknown} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("error-unknown")}
                </Overlay>
                <Overlay isVisible={this.state.visible_modal_response_edit_password} overlayStyle={styles.overlay_margin_10}>
                    {this._renderModal("response-edit-password")}
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
        borderRadius: 0,
        backgroundColor: "white",
        elevation: 5,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    text_button_validate: {
        color: "black",
    },
    button_container: {
        width: "100%",
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
    overlay_margin_10: {
        margin: 10,
    },
    loader_password: {
        color: "#31859C",
    },
});

const mapStateToProps = (state) => {
    return {
        email: state.emailReducer.email,
        password: state.passwordReducer.password,
        langue: state.langueReducer.langue,
    };
};

export default connect(mapStateToProps, { passwordAction })(Password);
