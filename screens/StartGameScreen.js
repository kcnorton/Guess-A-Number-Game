import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, Alert, Dimensions } from 'react-native';

import Card from '../components/Card';
import Input from '../components/Input';
import NumberContainer from '../components/NumberContainer';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import Colors from '../constants/colors';

const StartGameScreen = props => {

    // validating user input for numbers only
    // because keyboardType is not compatible with Android
    const [enteredValue,setEnteredValue] = useState('');

    // handling whether or not the user has confirmed a number to start a new game
    const [confirmed, setConfirmed] = useState(false);

    // if confirmed, save input number as the number with which to start the game
    const [selectedNumber, setSelectedNumber] = useState('');

    const [buttonWidth, setButtonWidth] = useState(Dimensions.get('window').width / 4);

    useEffect(() => {
        const updateLayout = () => {
            setButtonWidth(Dimensions.get('window').width / 4);
        };
    
        // makes sure our dimensions are recalculated and re-rendered when screen changes
        Dimensions.addEventListener('change', updateLayout);

        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        };
    });

    const numberInputHandler = inputText => {
        // use a regular expression to replace anything that is Not a number
        // with an empty string, globally, not just the first hit
        setEnteredValue(inputText.replace(/[^0-9]/g, ''));
    };

    const resetInputHanlder = () => {
        setEnteredValue('');
        setConfirmed(false);
    };

    const confirmInputHanlder = () => {
        const chosenNumber = parseInt(enteredValue);
        if(isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
            Alert.alert(
                'Invalid number!', 
                'Number has to be a number between 1 and 99', 
                [{text: 'Okay', style: 'destructive', onPress: resetInputHanlder}]
            );
            // do not continue
            return;
        }
        setConfirmed(true);
        setSelectedNumber(chosenNumber);
        // the ordering of these three state changes here is irrelevant
        // these changes are queued to be executed the next time they are rendered
        setEnteredValue('');
        Keyboard.dismiss();
    };

    let confirmedOutput;

    if(confirmed) {
        confirmedOutput = (
            <Card style={styles.summaryContainer}>
                <BodyText>You selected</BodyText>
                <NumberContainer>{selectedNumber}</NumberContainer>
                <MainButton onPress={() => props.onStartGame(selectedNumber)}>
                    START GAME
                </MainButton>
            </Card>
        );
    }

    // TouchableWithoutFeedback keyboard dismiss is compatible with iOS
    // it is automatic on Android
    return (
        <ScrollView>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={30}>
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                    <View style={styles.screen}>
                        <TitleText style={styles.title}>Start New Game</TitleText>
                        <Card style={styles.inputContainer}>
                            <BodyText>Select a Number</BodyText>
                            <Input 
                                style={styles.input} 
                                blurOnSubmit 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                keyboardType='number-pad' 
                                maxLength={2} 
                                onChangeText={numberInputHandler}
                                value={enteredValue}
                            />
                            <View style={styles.buttonContainer}>
                                <View style={{width: buttonWidth}}><Button title="Reset" onPress={resetInputHanlder} color={Colors.accent} /></View>
                                <View style={{width: buttonWidth}}><Button title="Confirm" onPress={confirmInputHanlder} color={Colors.primary} /></View>
                            </View>
                        </Card>
                        {confirmedOutput}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default StartGameScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        marginVertical: 10
    },

    inputContainer: {
        width: '80%',
        maxWidth: '95%',
        minWidth: 300,
        alignItems: 'center'
    },

    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },

        // button: {
        //     // width: '40%'
        //     width: Dimensions.get('window').width / 3.5
        // },

    input: {
        width: 50,
        textAlign: 'center'
    },

    summaryContainer: {
        marginTop: 20,
        alignItems: 'center'
    }
});