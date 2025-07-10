/**
 * Reusable Confirmation Modal Component
 * 
 * A beautiful animated modal that can be used for various confirmation scenarios
 * Features:
 * - Customizable icon, title, and message
 * - Optional preview card for displaying additional info
 * - Animated entrance and exit
 * - Gradient buttons matching app design
 * - Flexible action handlers
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/Colors';

interface PreviewData {
  avatar?: string;
  title: string;
  subtitle?: string;
  rating?: {
    value: number;
    count: number;
  };
  customContent?: React.ReactNode;
}

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColors?: [string, string];
  confirmText?: string;
  cancelText?: string;
  preview?: PreviewData;
  showCancelButton?: boolean;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  icon = 'checkmark-circle',
  iconColors = [COLORS.accent, COLORS.accentSecondary],
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  preview,
  showCancelButton = true,
}: ConfirmationModalProps) {
  const [modalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, modalAnimation]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: modalAnimation,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* Icon */}
            <LinearGradient
              colors={iconColors}
              style={styles.modalIcon}
            >
              <Ionicons name={icon} size={32} color="white" />
            </LinearGradient>

            {/* Title */}
            <Text style={styles.modalTitle}>{title}</Text>
            
            {/* Message */}
            <Text style={styles.modalMessage}>{message}</Text>

            {/* Preview Section */}
            {preview && (
              <View style={styles.previewContainer}>
                {preview.customContent ? (
                  preview.customContent
                ) : (
                  <View style={styles.previewContent}>
                    {preview.avatar && (
                      <Image source={{ uri: preview.avatar }} style={styles.previewAvatar} />
                    )}
                    <View style={styles.previewInfo}>
                      <Text style={styles.previewTitle}>{preview.title}</Text>
                      {preview.subtitle && (
                        <Text style={styles.previewSubtitle}>{preview.subtitle}</Text>
                      )}
                      {preview.rating && (
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={14} color={COLORS.warning} />
                          <Text style={styles.ratingText}>
                            {preview.rating.value} ({preview.rating.count} reviews)
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8}>
              <LinearGradient
                colors={iconColors}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            {showCancelButton && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  previewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.accent}08`,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${COLORS.accent}20`,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  previewSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    marginBottom: 12,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});