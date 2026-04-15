import React,{useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert, ActivityIndicator,Image
} from 'react-native';
import {API_URL} from './secret_pass.ts';

export default function Homemodel1() {
const [inputX, setInputX] = useState('');
const [inputY, setInputY] = useState('');
const [choice, setChoice] = useState('');
const [imageUri, setImsgeUri] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const handleCalc=async()=>{
 setLoading(true);
 setImsgeUri(null);

 try{
   const datax=inputX.trim().split(/\s+/).map(Number);
   const datay=inputY.trim().split(/\s+/).map(Number);
   const choiceVal=parseInt(choice);

   const response=await fetch(API_URL,{
     method: 'POST',
     headers:{
       'Content-Type': 'application/json',
     },
     body:JSON.stringify({
       datax:datax,
       datay:datay,
       choice_1:choiceVal,
     }),
   });
   if(!response.ok){
     throw new Error('network was not ok ! ');
   }
   const result=await response.json();
   const uri=`data:image/png;base64,${result.image_base64}`;
   setImsgeUri(uri);
 }catch(e){
   console.error('error fetching plot',e);
   Alert.alert('Error Fetching Plot');
 }finally{
   setLoading(false);
 }
};
  return(
  <View style={styles.mod1back}>
    <TextInput
      style={styles.inputdata}
    placeholder="input data X"
    value={inputX}
    onChangeText={setInputX}
    keyboardType="numeric"
    />
    <TextInput
      style={styles.inputdata}
    placeholder="input data Y"
    value={inputY}
    onChangeText={setInputY}
    keyboardType="numeric"
    />
    <TextInput
      style={styles.inputdata}
    placeholder="enter choice ( default to 1 - ( Y on X ) )"
    value={choice}
    onChangeText={setChoice}
    keyboardType="numeric"
    maxLength={1}
    />
    <TouchableOpacity style={styles.genpltbtn} onPress={handleCalc}><Text>Generate plot</Text></TouchableOpacity>
    {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop:20}} />}

    {imageUri && (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Result:</Text>
        <Image
          source={{ uri: imageUri }}
          style={styles.graphImage}
          resizeMode="contain"
        />
      </View>
    )}
  </View>
);
};

const styles=StyleSheet.create({
mod1back:{flex:1, justifyContent:'center',backgroundColor:'black'},
  inputdata:{backgroundColor:'white', gap:20},
  genpltbtn:{backgroundColor:'white', borderRadius:10,},
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  graphImage: {
    width: 300,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
});
