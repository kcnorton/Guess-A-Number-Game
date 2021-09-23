import React from 'react';
import { View, StyleSheet } from 'react-native';

// because of the spread operator, we can merge our styles
// this allows us to overwrite any Card styles with props styles
const Card = props => {
    return <View style={{...styles.card, ...props.style}}>{props.children}</View>
};

export default Card;

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black', // shadow properties ONLY work on iOS
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.26,
        shadowRadius: 6,
        elevation: 5, // elevation only works on Android, w/ default properties
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    }
});