import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import Form from '../components/Form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStack } from '../navigation/AuthContainer';
import { Pressable } from 'react-native';
import { useLoginMutation } from '../store/api/auth.api';

type Props = NativeStackScreenProps<AuthStack, 'Login'>;

export default function Login({ navigation }: Props) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [login, {isLoading}] = useLoginMutation();

  const onSubmit = async (data: { email: string; password: string }) => {
    const response = await login({...data, email: data.email.toLowerCase()});
  };

  return (
    <View style={{ ...styles.wrapper, ...backgroundStyle }}>
      <Text style={styles.title}>Login</Text>
      <Form onSubmit={onSubmit} />
      <View style={styles.linkWrapper}>
        <Text>Dont have an account?</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 25,
    fontSize: 18,
  },
  linkWrapper: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
  },
  link: {
    fontWeight: '700',
    borderBottomWidth: 1,
    borderColor: '#ffffff',
  },
});
