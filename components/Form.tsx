import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../utils/colors';
import { useAppSelector } from '../hooks/redux-hooks';
import { useFocusEffect } from '@react-navigation/native';

type FormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading: boolean;
  mode: 'register' | 'login'
};

enum visibilityIcon {
  VISIBLE = 'visibility',
  HIDDEN = 'visibility-off',
}

export default function Form({ onSubmit, isLoading, mode }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPass, setShowPass] = useState(true);
  const theme = useAppSelector(state => state.themeReducer);
  const textStyle = { color: theme.colors.text };

  useFocusEffect(useCallback(() => {
    reset();
  }, [reset]))

  return (
    <View style={styles.wrapper}>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'This field is required'
          },
          pattern:  {
            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            
            message: 'Invalid email'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            placeholderTextColor={textStyle.color}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[styles.emailInput, textStyle]}
          />
        )}
        name="email"
      />
      {errors.email && <Text style={[textStyle, {width: 250, color: colors.red}]}>{errors.email.message}</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: true,
          pattern: mode === 'register' ? {
            value:
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            message:
              'Password should >8 characters & contain at least one uppercase, lowercase letter, one number & special character',
          } : undefined,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={textStyle.color}
              value={value}
              secureTextEntry={showPass}
              style={[styles.input, textStyle]}
            />
            <Pressable
              onPress={() => setShowPass(!showPass)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? colors.eyePress : 'transparent',
                  padding: 5,
                  borderRadius: 30,
                },
              ]}>
              <Icon
                name={showPass ? visibilityIcon.VISIBLE : visibilityIcon.HIDDEN}
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
        )}
        name="password"
      />
      {errors.password && <Text style={[textStyle, {width: 250, color: colors.red}]}>{errors.password.message}</Text>}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [
          { ...styles.submitBtn, opacity: pressed ? 0.8 : 1 },
        ]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.btnText}>Submit</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  inputWrapper: {
    width: 250,
    borderWidth: 1,
    borderColor: colors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    paddingTop: 10,
  },
  emailInput: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    paddingTop: 10,
    width: 250,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
  },
  submitBtn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: colors.blue,
    borderRadius: 5,
    marginTop: 15,
  },
  btnText: {
    fontSize: 16,
    color: colors.white,
  },
  showPassBtn: {},
});
