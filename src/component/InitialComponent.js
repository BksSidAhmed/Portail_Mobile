import React from "react";
import { View, Text, StyleSheet } from "react-native";

class InitialComponent extends React.Component {
    render() {
        return (
            <View style = {styles.container}>
                <View style = {styles.circle}>
                    <Text style = {styles.initialText}>MM</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin : 10,
        marginBottom : 15
    },
    circle : {
        width: 50,
        height: 50,
        borderRadius: 150/2,
        backgroundColor: '#376092',
        justifyContent: 'center',
        alignItems : 'center',
    },
    initialText : {       
        color : "#fff"
    }

});

export default InitialComponent;
