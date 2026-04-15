import React, { useEffect, useState } from 'react';
import { supabase } from './supabase.tsx';

import { Text } from 'react-native';

const DispName=()=>{
const [usrname,setUsrname]=useState<string>('');

  useEffect(() => {
const fetchuser=async()=>{
  const {data:{user},error}=await supabase.auth.getUser();
  if(error || !user){
    console.error("can't find username ! ",error);
    setUsrname("Guest");
  }
  else{
    console.log("user found :: ",user);
    setUsrname(user.user_metadata.name);
  }
}
fetchuser();
},[]);
return (
<Text style={{fontSize:40,color:'white',paddingTop:120,fontFamily:'cursive',fontWeight:"bold"}}>
  Welcome ,{usrname}
</Text>
);
  }

  export default DispName;