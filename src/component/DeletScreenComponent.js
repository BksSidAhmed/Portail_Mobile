
import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';
// import Colors from '../../constants/Colors'
// import Icon from '../../components/Icon';

class DeletScreenComponent extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            modalVisible : false
        }
    }
    render(){
        return(
            <>
            <Button onPress={() => this.setState( { modalVisible : true})}
              buttonStyle={styles.buttonStyle}
              // icon={
              //   <Icon name={"creditCard"} width="80" height="80" fill={Colors.tabIconSelected} />
              // }
            />
            {/* <Button onPress={() => this.setState( { modalVisible : true})}
              buttonStyle={styles.buttonStyle}
              // icon={
              //   <Icon name={"creditCard"} width="80" height="80" fill={Colors.tabIconSelected} />
              // }
            /> */}
            <View>
              <Modal
                backdropOpacity={0.3}
                isVisible={this.state.modalVisible}
                onBackdropPress={() => this.setState( { modalVisible : false})}
                style={styles.contentView}
              >
                <View style={styles.content}>
                  <Text style={styles.contentTitle}>Hi 👋!</Text>
                  <Text>Hello from Overlay!</Text>
                </View>
              </Modal>
            </View>
          </>
        );
    }

}

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'white',
      paddingTop : 50,
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 17,
      borderTopLeftRadius: 17,
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
    contentView: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    buttonStyle: {
        height: '100%',
        width: 170,
    }
  });

export default DeletScreenComponent

