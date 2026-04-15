import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import EncryptedStorage from 'react-native-encrypted-storage';

const SecureStorageAdapter={
  getItem: (key:string) =>{
    return EncryptedStorage.getItem(key);
  },
  setItem: (key:string, value:string) =>{
    return EncryptedStorage.setItem(key, value);
  },
  removeItem: (key:string) =>{
    return EncryptedStorage.removeItem(key);
  },
};

const supabaseUrl = 'https://bigjhjdoakmepicusvgw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZ2poamRvYWttZXBpY3Vzdmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzUxMTcsImV4cCI6MjA4MjIxMTExN30.8Hi3AcSaJe94BdyMAEzOahON1Ux1WV9WbGDSJ787qyk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});