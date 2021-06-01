import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { connect } from "react-redux";
import { listeEmailAction } from "../redux/actions/listeEmailAction";
import { pointingAction } from "../redux/actions/pointingHorsLigneAction";
import * as Animatable from "react-native-animatable";
import { traduction } from "../locale/local";
class About extends React.Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setOptions({ title: "Niva - " + traduction("TITLE_ABOUT", this.props.langue) });
    }

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="bounceIn" style={styles.container_header}>
                    <View style={styles.container_logo}>
                        <View style={styles.container_ico}>
                            <Image style={styles.image_top_body} source={require("../image/logo_niva.png")} />
                        </View>
                    </View>
                </Animatable.View>
                <View style={styles.container_body}>
                    <Animatable.View animation="bounceIn" delay={300} style={styles.text_body}>
                        <FlatList data={traduction("LIST_ABOUT", this.props.langue)} renderItem={({ item }) => <Text style={styles.text_about}>{item.text}</Text>} />
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
    },
    container_logo: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    container_ico: {
        justifyContent: "center",
        alignItems: "center",
    },
    text_about: {
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

export default connect(mapStateToProps, { listeEmailAction, pointingAction })(About);
