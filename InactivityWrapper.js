import React,{useRef} from 'react';
import {View, PanResponder} from 'react-native';
import { supabase } from './supabase';

const TIMEOUT=1800000;

export const InactivityWrapper =({children})=>{
  const timer=useRef(null);

  const resetTimer=()=>{
    if(timer.current) clearTimeout(timer.current);
    timer.current=setTimeout(()=>{
      console.log('User Inactive, Signing Out!');
      supabase.auth.signOut();
    },TIMEOUT);
  };

  const panResponder=useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:()=>{
        resetTimer();
        return false;
      },
    })
  ).current;

  React.useEffect(()=>{
    resetTimer();
    return () => clearTimeout(timer.current);
  },[]);
  return (
    <View style={{flex:1}} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};