import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Switch, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useExposure } from 'react-native-exposure-notification-service';

import { colors, text } from 'theme';
import { PrivacyLink } from 'components/views/privacy-notice';
import { Markdown } from 'components/atoms/markdown';
import { Spacing } from 'components/atoms/spacing';
import { Scrollable } from 'components/templates/scrollable';
import { useApplication } from 'providers/context';

export const Metrics = () => {
  const { t } = useTranslation();
  const { configure } = useExposure();
  const [enabled, setEnabled] = useState(false);
  const { setContext } = useApplication();

  useEffect(() => {
    SecureStore.getItemAsync('analyticsConsent')
      .then(consent => {
        if (consent) {
          setEnabled(consent === 'true');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const toggleSwitch = async () => {
    if (enabled) {
      setEnabled(false);
      setContext({ analyticsConsent: false });
      SecureStore.setItemAsync('analyticsConsent', String(false), {});
    } else {
      setEnabled(true);
      setContext({ analyticsConsent: true });
      SecureStore.setItemAsync('analyticsConsent', String(true), {});
    }
    configure();
  };

  return (
    <Scrollable heading={t('metrics:title')}>
      <Markdown style={{}}>{t('metrics:info')}</Markdown>
      <Spacing s={16} />
      <PrivacyLink />
      <Spacing s={32} />
      <View style={styles.row}>
        <Text style={styles.label}>{t('metrics:share')}</Text>
        <Switch
          trackColor={{
            false: colors.darkGray,
            true: colors.main
          }}
          thumbColor={colors.white}
          onValueChange={toggleSwitch}
          value={enabled}
          style={styles.switch}
        />
      </View>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    ...text.largeBold,
    flex: 1
  },
  switch: {
    alignSelf: 'flex-end'
  }
});
