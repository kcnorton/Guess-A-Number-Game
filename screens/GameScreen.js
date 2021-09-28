import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Dimensions, View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';

// outside functional component GameScreen because it is not re-created on every re-rendering of the component
// does not rely on any objects in GameScreen
// generates random number
const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randNum = Math.floor(Math.random() * (max-min)) + min;

    if (randNum === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return randNum;
    }
};

const renderListItem = (listLength, itemData) => (
    <View style={styles.listItem}>
        <BodyText>#{listLength - itemData.index}</BodyText>
        <BodyText>{itemData.item}</BodyText>
    </View>
);

const GameScreen = props => {

    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    // keeping a list of guesses
    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
    // const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
    const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);


    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    // similar to array destructuring
    // pulled out these constants from props
    const { userChoice, onGameOver } = props;

    useEffect(() => {
        const updateLayout = () => {
            // setAvailableDeviceWidth(Dimensions.get('window').width);
            setAvailableDeviceHeight(Dimensions.get('window').height);
        };

        Dimensions.addEventListener('change',updateLayout);

        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        };
    });

    // executed after every render cycle if the dependencies have changed
    useEffect(() => {
        if (currentGuess == props.userChoice) {
            props.onGameOver(pastGuesses.length);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = direction => {
        if ((direction === 'lower' && currentGuess < props.userChoice) || (direction === 'higher' && currentGuess > props.userChoice)) {
            Alert.alert('Don\'t lie!', 'You know that this is wrong...', [{text: 'Sorry!', style: 'cancel'}]);
            return;
        }
        if (direction === 'lower') {
            // update max boundary
            currentHigh.current = currentGuess;
        } else {
            currentLow.current = currentGuess + 1;
        }
        const nextNum = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNum);
        // setRounds(currRounds => currRounds + 1);
        setPastGuesses(currPastGuesses => [nextNum.toString(), ...currPastGuesses])
    };

    if(availableDeviceHeight < 500) {
        return (
            <View style={styles.screen}>
                <TitleText>
                    Opponent's Guess
                </TitleText>
                <View style={styles.controls}>
                    <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                        <Ionicons name='md-remove' size={24} color='white' />
                    </MainButton>
                    <NumberContainer>
                        {currentGuess}
                    </NumberContainer>
                    <MainButton onPress={nextGuessHandler.bind(this, 'higher')}>
                        <Ionicons name='md-add' size={24} color='white' />
                    </MainButton>
                </View>
                <View style={styles.listContainer}>
                    <FlatList 
                        keyExtractor={(item) => item} 
                        data={pastGuesses} 
                        renderItem={renderListItem.bind(this, pastGuesses.length)} 
                        contentContainerStyle={styles.list}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <TitleText>
                Opponent's Guess
            </TitleText>
            <NumberContainer>
                {currentGuess}
            </NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                    <Ionicons name='md-remove' size={24} color='white' />
                </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'higher')}>
                    <Ionicons name='md-add' size={24} color='white' />
                </MainButton>
            </Card>
            <View style={styles.listContainer}>
                {/*<ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess,index) => (renderListItem(guess, pastGuesses.length - index)))}
    </ScrollView>*/}
                <FlatList 
                    keyExtractor={(item) => item} 
                    data={pastGuesses} 
                    renderItem={renderListItem.bind(this, pastGuesses.length)} 
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').height > 600 ? 20 : 5, // if height is greater than 600px then set to 20 otherwise 5
        width: 400,
        maxWidth: '90%'
    },

    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center'
    },  

    listContainer: {
        // width: '60%',
        width: Dimensions.get('window').width > 350 ? '60%' : '80%',
        flex: 1 // ensures scrollview works on android
    },

    list: {
        // alignItems: 'center',
        justifyContent: 'flex-end',
        flexGrow: 1
    },

    listItem: {
        borderColor: '#ccc',
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
});