import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const colors = Colors.light;

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pandals">
        <NativeTabs.Trigger.Label>Pandals</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="building.columns" md="temple_hindu" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="emergency">
        <NativeTabs.Trigger.Label>Emergency</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cross.case.fill" md="emergency" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
