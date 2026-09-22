import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PujaGuideModal({ visible, onClose }: Props) {
  const [selectedPage, setSelectedPage] = useState<1 | 2>(1);
  const screenWidth = Dimensions.get('window').width;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.headerTitle}>Official Puja Guide</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
              size={24}
              tintColor="#424242"
            />
          </Pressable>
        </View>

        {/* Tab switch between Guide 1 and 2 */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setSelectedPage(1)}
            style={[styles.tab, selectedPage === 1 && styles.activeTab]}>
            <Text style={[styles.tabText, selectedPage === 1 && styles.activeTabText]}>
              Guide Map 1
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedPage(2)}
            style={[styles.tab, selectedPage === 2 && styles.activeTab]}>
            <Text style={[styles.tabText, selectedPage === 2 && styles.activeTabText]}>
              Guide Map 2
            </Text>
          </Pressable>
        </View>

        <ScrollView
          maximumZoomScale={3}
          minimumZoomScale={1}
          contentContainerStyle={styles.scrollContent}>
          <Image
            source={
              selectedPage === 1
                ? require('@/assets/images/puja_guide_1.jpg')
                : require('@/assets/images/puja_guide_2.jpg')
            }
            style={[styles.image, { width: screenWidth, height: screenWidth * 1.4 }]}
            contentFit="contain"
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  closeBtn: {
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: '#F7F7F9',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#EAEAEF',
  },
  activeTab: {
    backgroundColor: '#3595FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#616161',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  image: {
    backgroundColor: '#FAFAFA',
  },
});
