import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React from 'react';
>>>>>>> f187c96139bc99a2ecc67014ba9ca9264a5a3f35
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { PetFlowColors } from '@/constants/petflow';
<<<<<<< HEAD
import { getProfile } from '@/lib/profile-storage';
import type { UserType } from '@/types/profile';

export default function TabLayout() {
  const [userType, setUserType] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    getProfile().then((p) => setUserType(p.userType ?? 'tutor'));
  }, []);

  const isClinica = userType === 'clinica';
  const activeColor = isClinica ? PetFlowColors.blue : PetFlowColors.primary;

=======

export default function TabLayout() {
>>>>>>> f187c96139bc99a2ecc67014ba9ca9264a5a3f35
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
<<<<<<< HEAD
        tabBarActiveTintColor: activeColor,
=======
        tabBarActiveTintColor: PetFlowColors.primary,
>>>>>>> f187c96139bc99a2ecc67014ba9ca9264a5a3f35
        tabBarInactiveTintColor: PetFlowColors.textMuted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: PetFlowColors.border,
          paddingTop: 4,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
<<<<<<< HEAD
        name="veterinarians"
        options={{
          title: 'Equipe',
          href: isClinica ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Meus Pets',
          href: isClinica ? null : undefined,
=======
        name="pets"
        options={{
          title: 'Meus Pets',
>>>>>>> f187c96139bc99a2ecc67014ba9ca9264a5a3f35
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Lembretes',
<<<<<<< HEAD
          href: isClinica ? null : undefined,
=======
>>>>>>> f187c96139bc99a2ecc67014ba9ca9264a5a3f35
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
