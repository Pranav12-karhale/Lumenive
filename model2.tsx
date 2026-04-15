import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Homemodel2(){
  return(
    <View style={styles.mod2back}>
      <Text style={{paddingTop:90, fontSize:35, fontWeight:'bold',color:'white'}}>will be deployed soon!</Text>
    </View>
  );
};

const styles=StyleSheet.create({
  mod2back:{flex:1, justifyContent:'center',alignItems:'center',backgroundColor:'black'},
});