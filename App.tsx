import * as React from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, Linking, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from './supabase';
import { InactivityWrapper } from './InactivityWrapper';
import { NavigationContainer } from '@react-navigation/native';
import Video from 'react-native-video';
import Homemodel1 from './model1.tsx';
import Homemodel2 from './model2.tsx';
import DispName from './DispName.tsx';

export type RootStackParamList = {
  GetS: undefined;
  Auth: undefined;
};

type GetStartedProps = NativeStackScreenProps<RootStackParamList, 'GetS'>;

function GetStarted({ navigation }: GetStartedProps) {
  return (
    <ScrollView style={styles.scrlmain}>
      <View style={styles.mainpg}>
        <View style={styles.titlebar}>
          <View style={styles.nameorg}>
            <Image
              source={require('./assets/lumentitle.png')}
              style={styles.titimg}
              resizeMode="none"
            />
          </View>
        </View>
        <View style={styles.getstart}>
          <Text style={styles.initabout}>You will gain hands-on experience</Text>
          <Text style={styles.initabout}>with new projects and innovations,</Text>
          <Text style={styles.initabout}>exploring their development process &</Text>
          <Text style={styles.initabout}>the underlying mathematical principles</Text>
        </View>
        <View style={styles.getstartbtncont}>
          <Text style={styles.getstarttext}>Get Started with Lumenive</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Auth')}
            style={styles.getstartbtn}
          >
            <Text style={styles.getstartbtntext}>hello</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function AuthScr() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loginIdentity, setLoginIdentity] = React.useState(''); // Username OR Email
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLoginIdentity('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleAuthAction = async () => {
    setLoading(true);
    let error = null;

    try {
      if (isLogin) {
        if (!loginIdentity || !password) {
          throw new Error('Please enter your username/email and password.');
        }

        let loginEmail = loginIdentity;

        if (!loginIdentity.includes('@')) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('name', loginIdentity)
            .single();

          if (profileError || !data) {
            throw new Error('Username not found. Please try your email.');
          }
          loginEmail = data.email;
        }
        const response = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        if (response.error) {
          error = response.error;
        }
      } else {
        if (!email || !password || !username) {
          throw new Error('All fields (Email, Username, Password) are mandatory.');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { name: username },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                name: username,
                email: email
              }
            ]);

          if (profileError) {
            console.log("Profile creation error:", profileError.message);
          }
        }

        Alert.alert('Success', 'Account created! Please check your email.');
      }
    } catch (err: any) {
      error = err;
    }

    setLoading(false);

    if (error) {
      Alert.alert(isLogin ? 'Sign In Failed' : 'Registration Failed', error.message);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    console.log(`Attempting to sign in with ${provider}...`);

    try {
      const redirectUrl = 'lumenive://auth/callback';
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          ...(provider === 'google' ? { queryParams: { prompt: 'select_account' } } : {}),
        },
      });

      console.log('Supabase Response:', data, error);

      if (error) throw error;

      if (data?.url) {
        console.log('Opening URL manually if SDK fails:', data.url);
        const canOpen = await Linking.canOpenURL(data.url);
        if (canOpen) {
          await Linking.openURL(data.url);
        }
      }

    } catch (error: any) {
      console.error('OAuth Error:', error);
      Alert.alert('OAuth Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.scrlAuth} contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.authmainpg}
      >
        <View style={styles.AuthScrLogo}>
          <Image
            source={require('./assets/lumentitle.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.signInTitle}>
            {isLogin ? 'Sign In to Lumenive' : 'Join Lumenive'}
          </Text>
        </View>
        <View style={styles.formContainer}>

          {isLogin ? (
            <>
              <Text style={styles.label}>USERNAME OR EMAIL</Text>
              <TextInput
                style={styles.inputdata}
                placeholder="Username or name@example.com"
                placeholderTextColor="#666"
                value={loginIdentity}
                onChangeText={setLoginIdentity}
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.inputdata}
                placeholder="name@example.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.inputdata}
                placeholder="Choose a username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          )}
          { }
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <FontAwesome name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInBtn} onPress={handleAuthAction} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <Text style={styles.signInBtnText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.createAccountText}>
                {isLogin ? 'Create Account' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuth('google')}>
              <FontAwesome name="google" size={24} color="#FFF" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuth('github')}>
              <FontAwesome name="github" size={24} color="#FFF" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

function HomeScr({ navigation }: any) {

  return (
    <View style={styles.homecontback}>
      <Video
        source={require('./assets/Homescrback.mp4')}
        style={styles.homeback}
        muted={true}
        repeat={false}
        resizeMode="cover"
        rate={1.0}
        onError={(e) => { console.log('Video Error:', e) }}
      />
      <DispName />
      <View style={styles.modelbtncont}>
        <TouchableOpacity style={styles.btntomodel1} onPress={() => navigation.navigate('Homemod1')}>
          <Text style={{ color: 'white', fontSize: 20, letterSpacing: 3 }}>model  1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btntomodel1} onPress={() => navigation.navigate('Homemod2')}>
          <Text style={{ color: 'white', fontSize: 20, letterSpacing: 3 }}>model  2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btntomodel1} onPress={() => { }}>
          <Text style={{ color: 'white', fontSize: 20, letterSpacing: 3 }}>model  3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PublicStack = createNativeStackNavigator<RootStackParamList>();
const PrivateStack = createNativeStackNavigator();

function PublicLayout() {
  return (
    <PublicStack.Navigator initialRouteName="GetS"
      screenOptions={{ headerShown: false }}>
      <PublicStack.Screen name="GetS" component={GetStarted} />
      <PublicStack.Screen name="Auth" component={AuthScr} />
    </PublicStack.Navigator>
  );
}

function PrivateLayout() {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen name="Home" component={HomeScr} />
      <PrivateStack.Screen name="Homemod1" component={Homemodel1} />
      <PrivateStack.Screen name="Homemod2" component={Homemodel2} />
    </PrivateStack.Navigator>
  );
}
export default function AppScr({ }) {
  const [session, setSession] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      }
      else {
        setSession(null);
      }
      setIsLoading(false);
    });

    const handleDeepLink = async (url: string | null) => {
      if (!url) {
        return;
      }
      try {
        const regex = /[?&#]code=([^&]+)/;
        const codematch = url.match(regex);
        const code = codematch ? codematch[1] : null;

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.log("Exchange error : ", error);
            Alert.alert("code (session) exchange error");
          }
          else {
            console.log("session Exchange successful");
            if (data.session) {
              setSession(data.session);
            }
          }
          return;
        }
        if (url.includes('access_token') || url.includes('refresh_token')) {
          console.log('url includes token');

          const getHashParam = (paramName: string) => {
            const regex = new RegExp(`[?&#]${paramName}=([^&]+)`);
            const match = url.match(regex);
            return match ? match[1] : null;
          };

          const access_token = getHashParam('access_token');
          const refresh_token = getHashParam('refresh_token');

          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error("Error setting session from url tokens", error);
              Alert.alert("Session Error", error.message);
            } else if (data.session) {
              setSession(data.session);
            }
          }
        }

      } catch (e) {
        console.log("parsing error : ", e);
      }
    }
    Linking.getInitialURL().then((url) => handleDeepLink(url));
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => { handleDeepLink(url); });

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1A1F2B',
        }}
      >
        <ActivityIndicator size="large" color="#FF998E" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {session && session.user ? (
        <InactivityWrapper>
          <PrivateLayout />
        </InactivityWrapper>
      ) : (
        <PublicLayout />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrlmain: { backgroundColor: '#1A1F2B' },
  mainpg: { backgroundColor: '#1A1F2B', height: '100%', width: '100%', alignItems: 'center' },
  titlebar: { height: 130, width: '100%', backgroundColor: 'black' },
  titimg: { width: '100%', height: 120 },
  nameorg: { width: 500, height: 120, paddingTop: 24 },
  getstart: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center', paddingTop: 100 },
  initabout: { color: 'grey', paddingTop: 20, fontSize: 17, fontFamily: 'monospace', fontWeight: '200' },
  getstarttext: { color: 'white', fontSize: 25, fontWeight: '700', fontFamily: 'monospace', paddingTop: 40, paddingBottom: 20 },
  getstartbtn: { height: 65, width: 100, borderColor: '#FF998E', borderWidth: 0.5, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  getstartbtntext: { color: '#FF998E', fontFamily: 'cursive', fontWeight: 'bold', fontSize: 50 },
  getstartbtncont: { height: 120, width: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center' },
  scrlAuth: { flex: 1, backgroundColor: '#121212' },
  authmainpg: { flex: 1, justifyContent: 'center', padding: 25 },
  AuthScrLogo: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 200, height: 80, marginBottom: 10 },
  signInTitle: { color: "#FF998E", fontWeight: 'bold', fontSize: 22, letterSpacing: 1 },
  formContainer: { width: '100%' },
  label: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 10, letterSpacing: 1 },
  inputdata: { backgroundColor: '#1E1E1E', color: '#FFF', height: 55, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 10 },
  signInBtn: { backgroundColor: '#FF998E', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signInBtnText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { marginHorizontal: 10, color: '#666', fontSize: 12, fontWeight: 'bold' },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  socialBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#1E1E1E', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', gap: 10 },
  socialText: { color: '#FFF', fontWeight: '600' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20, },
  footerText: { color: '#888', fontSize: 14, },
  createAccountText: { color: '#FF998E', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline', },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', height: 55, borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 10, paddingHorizontal: 15, },
  passwordInput: { flex: 1, color: '#FFF', fontSize: 16, height: '100%', },
  eyeIcon: { padding: 10, },
  homeback: { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, zIndex: -1, },
  homecontback: { flex: 1, position: 'relative', alignItems: 'center', gap: 45, },
  btntomodel1: { width: 170, height: 60, borderRadius: 25, backgroundColor: 'black', borderColor: 'white', borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', },
  modelbtncont: { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 45, bottom: 150, }

});