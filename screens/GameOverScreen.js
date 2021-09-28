import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';
import Colors from '../constants/colors';

const GameOverScreen = props => {
    return (
        <View style={styles.screen}>
            <TitleText>
                The Game is Over!
            </TitleText>
            <View style={styles.imageContainer}>
                <Image 
                    // local image: source={require('../assets/success.png')} 
                    source={{uri: 'https://cdn.pixabay.com/photo/2016/05/05/23/52/mountain-summit-1375015_960_720.jpg'}}
                    style={styles.image} 
                    resizeMode='cover' 
                />
            </View>
            <View style={styles.resultContainer}>
                <BodyText style={styles.resultText}>
                    Your phone needed <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to guess the number <Text style={styles.highlight}>{props.userNumber}</Text>.
                </BodyText>
            </View>
            <MainButton onPress={props.onRestart}>
                NEW GAME
            </MainButton>
        </View>
    );
};

export default GameOverScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    imageContainer: {
        borderRadius: 150,
        borderWidth: 3,
        borderColor: 'black',
        width: 300,
        height: 300,
        overflow: 'hidden',
        marginVertical: 30
    },

    image: {
        width: '100%',
        height: '100%'
    },

    resultContainer: {
        marginHorizontal: 50,
        marginVertical: 25
    },

    resultText: {
        textAlign: 'center',
        fontSize: 20
    },

    highlight: {
        color: Colors.primary,
        fontFamily: 'open-sans-bold'
    }
});