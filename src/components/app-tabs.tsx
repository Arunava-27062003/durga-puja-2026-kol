import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { getCopy, useAppContent } from '@/content/app-content';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const colors = useTheme();
  const { content } = useAppContent();
  const { config } = content;
  const configuredSettingsLabel = getCopy(config, 'tabAbout', 'Settings');
  const settingsLabel = configuredSettingsLabel === 'About' ? 'Settings' : configuredSettingsLabel;

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelVisibilityMode="labeled"
      backBehavior="history"
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.text },
      }}>
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
        <NativeTabs.Trigger.Label>{settingsLabel}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
