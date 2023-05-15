import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';

type FormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

enum visibilityIcon {
  VISIBLE = 'visibility',
  HIDDEN = 'visibility-off',
}

export default function Form({ onSubmit }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPass, setShowPass] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.emailInput}
          />
        )}
        name="email"
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={showPass}
              style={styles.input}
            />
            <Pressable onPress={() => setShowPass(!showPass)} style={({pressed}) => [
              {
                backgroundColor: pressed ? 'rgba(236, 236, 236, 0.288)' : 'transparent',
                padding: 5,
                borderRadius: 30,
              }
            ]}>
              <Icon
                name={showPass ? visibilityIcon.VISIBLE : visibilityIcon.HIDDEN}
                size={20}
                color="white"
              />
            </Pressable>
          </View>
        )}
        name="password"
      />
      {errors.password && <Text>This is required.</Text>}

      <Pressable onPress={handleSubmit(onSubmit)} style={({pressed}) => [
        {...styles.submitBtn,
        }
      ]}>
        <Text style={styles.btnText}>Submit</Text>
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
    borderColor: '#ffffffa2',
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
    borderColor: '#ffffffa2',
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
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginTop: 15,
  },
  btnText: {
    fontSize: 16,
    color: '#ffffff',
  },
  showPassBtn: {
    
  }
});
