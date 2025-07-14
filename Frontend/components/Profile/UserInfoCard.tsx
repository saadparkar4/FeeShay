import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import AuthContext from '@/context/AuthContext';

interface UserInfoCardProps {
  onSwitchRole?: () => void;
}

export default function UserInfoCard({ onSwitchRole }: UserInfoCardProps) {
  const { userRole, setUserRole } = useContext(AuthContext);
  
  const handleSwitchRole = () => {
    const newRole = userRole === 'freelancer' ? 'client' : 'freelancer';
    setUserRole(newRole);
    onSwitchRole?.();
  };
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentSecondary]}
            style={styles.cameraGradient}
          >
            <Ionicons name="camera" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.userName}>Sarah Johnson</Text>
      
      
      <LinearGradient
        colors={userRole === 'freelancer' 
          ? [COLORS.accentSecondary, COLORS.accent]
          : [COLORS.accentTertiary, COLORS.accent]
        }
        style={styles.roleTag}
      >
        <Text style={styles.roleText}>
          {userRole === 'freelancer' ? '✨ Freelancer' : '💼 Client'}
        </Text>
      </LinearGradient>
      
      <TouchableOpacity style={styles.switchButton} onPress={handleSwitchRole}>
        <LinearGradient
          colors={[COLORS.accentTertiary, COLORS.accentSecondary]}
          style={styles.switchGradient}
        >
          <Ionicons name="repeat" size={16} color="white" />
          <Text style={styles.switchText}>
            Switch to {userRole === 'freelancer' ? 'Client' : 'Freelancer'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: COLORS.background,
    margin: 16,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: `${COLORS.secondary}33`,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  cameraGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 140,
    right: 100,
    backgroundColor: COLORS.accentTertiary,
    borderRadius: 12,
    padding: 2,
  },
  roleTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  roleText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 8,
  },
  switchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  switchText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});