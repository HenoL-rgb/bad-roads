import messaging from '@react-native-firebase/messaging';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import Form from '../components/Form';
import ErrorModal from '../components/modals/ErrorModal';
import { ModalRefProps } from '../components/modals/Modal';
import { useAppSelector } from '../hooks/redux-hooks';
import { IError } from '../navigation/AppWrapper';
import { AuthStack, authScreens } from '../navigation/AuthContainer';
import { useRegisterMutation } from '../store/api/auth.api';

type Props = NativeStackScreenProps<AuthStack, authScreens.Register>;

export default function Register({ navigation }: Props) {
  const theme = useAppSelector(state => state.themeReducer);
  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };
  const textStyle = { color: theme.colors.text };
  const modalRef = useRef<ModalRefProps>(null);

  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState<string>('Error');

  const onSubmit = async (data: { email: string; password: string }) => {
    const notificationsToken = await messaging().getToken();

    register({ ...data, email: data.email.toLowerCase(), notificationsToken })
      .unwrap()
      .catch((error: IError) => {
        setError(error.data.message);
        modalRef.current?.setActive(true);
      });
  };

  return (
    <View style={{ ...styles.wrapper, ...backgroundStyle }}>
      <Text style={[styles.title, textStyle]}>Register</Text>
      <Form onSubmit={onSubmit} isLoading={isLoading} mode="register" />
      <View style={styles.linkWrapper}>
        <Text style={textStyle}>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate(authScreens.Login)}>
          <Text style={[styles.link, textStyle]}>Login</Text>
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
