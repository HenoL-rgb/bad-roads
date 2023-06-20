import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Form from '../components/Form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStack } from '../navigation/AuthContainer';
import { Pressable } from 'react-native';
import { useRegisterMutation } from '../store/api/auth.api';
import { useAppSelector } from '../hooks/redux-hooks';

type Props = NativeStackScreenProps<AuthStack, 'Register'>;

export default function Register({ navigation }: Props) {
  const theme = useAppSelector(state => state.themeReducer);
  const backgroundStyle = {
    backgroundColor: theme.colors.background
  };
  const textStyle = {color: theme.colors.text}

  const [register, {isLoading}] = useRegisterMutation();

  const onSubmit = async (data: { email: string; password: string }) => {
    await register({...data, email: data.email.toLowerCase()});
  };

  return (
    <View style={{ ...styles.wrapper, ...backgroundStyle }}>
      <Text style={[styles.title, textStyle]}>Register</Text>
      <Form onSubmit={onSubmit} isLoading={isLoading}/>
      <View style={styles.linkWrapper}>
        <Text style={textStyle}>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, textStyle]}>Login</Text>
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
