import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { pointingAction } from "../redux/actions/pointingHorsLigneAction";
import * as Animatable from "react-native-animatable";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { traduction } from "../locale/local";
class Confidential extends React.Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setOptions({ title: "Niva - " + traduction("TITLE_CONFIDENTIAL", this.props.langue) });
    }

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="bounceIn" style={styles.container_header}>
                    <View style={styles.container_logo}>
                        <View style={styles.container_ico}>
                            <FontAwesome5 name="user-lock" size={35} color="#31859C" style={styles.ico_header} />
                        </View>
                    </View>
                </Animatable.View>
                <View style={styles.container_body}>
                    <Animatable.View animation="bounceIn" delay={300}>
                        <TouchableOpacity style={styles.text_body}>
                            <Text style={styles.text_confidential}>{traduction("CONFIDENTIAL_1", this.props.langue)}</Text>
                            <Text style={styles.text_confidential}>{traduction("CONFIDENTIAL_2", this.props.langue)}</Text>
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
        backgroundColor: "white",
    },
    container_header: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
    },
    container_body: {
        flex: 4,
        padding: 10,
    },
    container_logo: {
        flex: 1,
        padding: 20,
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
        fontSize: 17,
    },
    text_body: {
        padding: 20,
        backgroundColor: "white",
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
