import { View, Text, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import Form from '../components/Form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStack } from '../navigation/AuthContainer';
import { Pressable } from 'react-native';
import { useLoginMutation } from '../store/api/auth.api';
import { useAppSelector } from '../hooks/redux-hooks';
import { ModalRefProps } from '../components/modals/Modal';
import ErrorModal from '../components/modals/ErrorModal';
import { IError } from './AppWrapper';

type Props = NativeStackScreenProps<AuthStack, 'Login'>;

export default function Login({ navigation }: Props) {
  const theme = useAppSelector(state => state.themeReducer);
  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };
  const textStyle = { color: theme.colors.text };

  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string>('Error');
  const modalRef = useRef<ModalRefProps>(null);

  const onSubmit = async (data: { email: string; password: string }) => {
    login({ ...data, email: data.email.toLowerCase() }).unwrap().catch((error: IError) => {
      setError(error.data.message);
      modalRef.current?.setActive(true);
    })
  };

  return (
    <View style={{ ...styles.wrapper, ...backgroundStyle }}>
      <Text style={[styles.title, textStyle]}>Login</Text>
      <Form onSubmit={onSubmit} isLoading={isLoading} mode='login' />
      <View style={styles.linkWrapper}>
        <Text style={textStyle}>Dont have an account?</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.link, textStyle]}>Register</Text>
        </Pressable>
      </View>
      <ErrorModal modalRef={modalRef} error={error} />
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
