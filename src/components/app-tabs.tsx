import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { getCopy, useAppContent } from '@/content/app-content';

export default function AppTabs() {
  const colors = Colors.light;
  const { content } = useAppContent();
  const { config } = content;

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{getCopy(config, 'tabHome', 'Home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pandals">
        <NativeTabs.Trigger.Label>{getCopy(config, 'tabPandals', 'Pandals')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="building.columns" md="temple_hindu" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="nearby">
        <NativeTabs.Trigger.Label>{getCopy(config, 'tabNearby', 'Nearby')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="map.fill" md="location_on" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="emergency">
        <NativeTabs.Trigger.Label>{getCopy(config, 'tabEmergency', 'Emergency')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cross.case.fill" md="emergency" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Label>{getCopy(config, 'tabAbout', 'About')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="info.circle" md="info" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
