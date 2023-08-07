import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import languagesList from '../../utils/translations/languagesList';
import { useAppSelector } from '../../hooks/redux-hooks';
import i18next from 'i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function Languages() {
  const { colors: theme } = useAppSelector(state => state.themeReducer);
  const [currentLng, setCurrentLgn] = useState<string>(i18next.language);

  function changeLng(lng: string) {
    i18next.changeLanguage(lng);
    setCurrentLgn(lng);
    EncryptedStorage.setItem('lng', lng);
  }

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.card }]}>
      <FlatList
        data={Object.keys(languagesList)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item]}
            onPress={() => changeLng(item)}>
            <Text style={[styles.text, { color: theme.text }]}>
              {languagesList[item].nativeName}
            </Text>
            {currentLng === item && (
              <Icon name="check" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  text: {
    fontSize: 17,
  },
});
