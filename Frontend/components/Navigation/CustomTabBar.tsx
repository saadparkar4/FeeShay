import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          switch (route.name) {
            case '(home)':
              return isFocused ? 'home' : 'home-outline';
            case '(proposals)':
              return isFocused ? 'document' : 'document-outline';
            case '(messages)':
              return isFocused ? 'chatbubble' : 'chatbubble-outline';
            case '(profile)':
              return isFocused ? 'person' : 'person-outline';
            default:
              return 'help-outline';
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            {isFocused ? (
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name={getIconName()} size={20} color="white" />
              </LinearGradient>
            ) : (
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName()} size={20} color={COLORS.textSecondary} />
              </View>
            )}
            <Text style={[
              styles.label,
              { color: isFocused ? COLORS.accent : COLORS.textSecondary }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradient: {
    width: 34,
    height: 34,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});