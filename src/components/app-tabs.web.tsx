import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { getCopy, useAppContent } from '@/content/app-content';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  const { content } = useAppContent();
  const { config } = content;
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>{getCopy(config, 'tabHome', 'Home')}</TabButton>
          </TabTrigger>
          <TabTrigger name="pandals" href="/pandals/index" asChild>
            <TabButton>{getCopy(config, 'tabPandals', 'Pandals')}</TabButton>
          </TabTrigger>
          <TabTrigger name="nearby" href="/nearby" asChild>
            <TabButton>{getCopy(config, 'tabNearby', 'Nearby')}</TabButton>
          </TabTrigger>
          <TabTrigger name="emergency" href="/emergency" asChild>
            <TabButton>{getCopy(config, 'tabEmergency', 'Emergency')}</TabButton>
          </TabTrigger>
          <TabTrigger name="about" href="/about" asChild>
            <TabButton>{getCopy(config, 'tabAbout', 'About')}</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { content } = useAppContent();
  const { config } = content;
  const colors = Colors.light;

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          {config.displayName}
        </ThemedText>

        {props.children}

        <ExternalLink href={config.socialLinks.facebook} asChild>
          <Pressable style={styles.externalPressable} accessibilityRole="link">
            <ThemedText type="link">Bidhannagar Police</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
