import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function homemodel1(){
  return(
    <View style={styles.mod1homecont}>
      <Text>Will be deployed soon, stay tuned!</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  mod1homecont:{ flex:1, alignItems: 'center',backgroundColor:'#1A1F2B'},
});

