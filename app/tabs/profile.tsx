import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileMenuRow } from '@/components/profile-menu-row';
import { PetFlowColors } from '@/constants/petflow';
import { getPets } from '@/lib/pets-storage';
import { clearAllAppData, getProfile } from '@/lib/profile-storage';
import {
  countRemindersToday,
  formatDateBR,
  getDateBadge,
  getNextReminder,
} from '@/lib/reminder-utils';
import { getReminders } from '@/lib/reminders-storage';
import type { TutorProfile } from '@/types/profile';

import packageJson from '../../package.json';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [petCount, setPetCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [nextLabel, setNextLabel] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([getProfile(), getPets(), getReminders()]).then(
      ([prof, pets, reminders]) => {
        setProfile(prof);
        setPetCount(pets.length);
        setReminderCount(reminders.length);
        setTodayCount(countRemindersToday(reminders));
        const next = getNextReminder(reminders);
        if (next) {
          const badge = getDateBadge(next.date);
          setNextLabel(`${next.title} — ${badge || formatDateBR(next.date)}`);
        } else {
          setNextLabel(null);
        }
      }
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const displayName = profile?.name.trim() || 'Tutor';
  const subtitle = [profile?.email, profile?.city].filter(Boolean).join(' · ');

  const callPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
      Alert.alert('Sem telefone', 'Cadastre o número em Editar perfil.');
      return;
    }
    Linking.openURL(`tel:${digits}`);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Apagar todos os dados?',
      'Pets, lembretes e perfil serão removidos deste aparelho. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            await clearAllAppData();
            load();
            Alert.alert('Pronto', 'Todos os dados foram apagados.');
          },
        },
      ]
    );
  };

  const showHelp = () => {
    Alert.alert(
      'Como usar o PetFlow',
      '1. Cadastre seus pets\n2. Crie lembretes de vacinas e medicamentos\n3. Acompanhe tudo na Home\n\nSeus dados ficam salvos apenas neste celular.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Perfil</Text>

        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{profile?.avatarEmoji ?? '🐾'}</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroName}>{displayName}</Text>
            {subtitle ? (
              <Text style={styles.heroSub}>{subtitle}</Text>
            ) : (
              <Text style={styles.heroSubMuted}>Complete seu perfil</Text>
            )}
          </View>
          <Pressable
            style={styles.editChip}
            onPress={() => router.push('/editar-perfil')}>
            <Feather name="edit-2" size={14} color={PetFlowColors.primary} />
            <Text style={styles.editChipText}>Editar</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <Pressable style={[styles.statCard, styles.statGreen]} onPress={() => router.push('/pets')}>
            <MaterialCommunityIcons name="paw" size={20} color="#fff" />
            <Text style={styles.statLabel}>Pets</Text>
            <Text style={styles.statValue}>{petCount}</Text>
          </Pressable>
          <Pressable
            style={[styles.statCard, styles.statOrange]}
            onPress={() => router.push('/reminders')}>
            <Ionicons name="notifications" size={20} color="#fff" />
            <Text style={styles.statLabel}>Lembretes</Text>
            <Text style={styles.statValue}>{reminderCount}</Text>
          </Pressable>
          <View style={[styles.statCard, styles.statBlue]}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.statLabel}>Hoje</Text>
            <Text style={styles.statValue}>{todayCount}</Text>
          </View>
        </View>

        {nextLabel ? (
          <View style={styles.nextCard}>
            <Ionicons name="time-outline" size={18} color={PetFlowColors.primary} />
            <View style={styles.nextText}>
              <Text style={styles.nextTitle}>Próximo cuidado</Text>
              <Text style={styles.nextSub}>{nextLabel}</Text>
            </View>
          </View>
        ) : null}

        {(profile?.vetName || profile?.vetPhone) ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Saúde</Text>
            <View style={styles.menuCard}>
              {profile.vetName ? (
                <Pressable
                  style={styles.vetRow}
                  onPress={() => profile.vetPhone && callPhone(profile.vetPhone)}>
                  <View style={styles.vetIcon}>
                    <MaterialCommunityIcons
                      name="stethoscope"
                      size={20}
                      color={PetFlowColors.primary}
                    />
                  </View>
                  <View style={styles.vetInfo}>
                    <Text style={styles.vetLabel}>Veterinário</Text>
                    <Text style={styles.vetName}>{profile.vetName}</Text>
                    {profile.vetPhone ? (
                      <Text style={styles.vetPhone}>{profile.vetPhone}</Text>
                    ) : null}
                  </View>
                  {profile.vetPhone ? (
                    <Feather name="phone" size={18} color={PetFlowColors.primary} />
                  ) : null}
                </Pressable>
              ) : null}
              {profile.emergencyName || profile.emergencyPhone ? (
                <Pressable
                  style={[styles.vetRow, profile.vetName && styles.vetBorder]}
                  onPress={() =>
                    profile.emergencyPhone && callPhone(profile.emergencyPhone)
                  }>
                  <View style={[styles.vetIcon, styles.vetIconDanger]}>
                    <Ionicons name="medical" size={20} color="#DC2626" />
                  </View>
                  <View style={styles.vetInfo}>
                    <Text style={styles.vetLabel}>Emergência 24h</Text>
                    <Text style={styles.vetName}>
                      {profile.emergencyName || 'Contato de emergência'}
                    </Text>
                    {profile.emergencyPhone ? (
                      <Text style={styles.vetPhone}>{profile.emergencyPhone}</Text>
                    ) : null}
                  </View>
                  {profile.emergencyPhone ? (
                    <Feather name="phone" size={18} color="#DC2626" />
                  ) : null}
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Atalhos</Text>
          <View style={styles.menuCard}>
            <ProfileMenuRow
              icon="edit-2"
              label="Editar perfil"
              subtitle="Nome, vet e notificações"
              onPress={() => router.push('/editar-perfil')}
            />
            <View style={styles.divider} />
            <ProfileMenuRow
              icon="heart"
              label="Meus pets"
              subtitle={`${petCount} cadastrado${petCount !== 1 ? 's' : ''}`}
              onPress={() => router.push('/pets')}
            />
            <View style={styles.divider} />
            <ProfileMenuRow
              icon="bell"
              label="Lembretes"
              subtitle={`${reminderCount} ativo${reminderCount !== 1 ? 's' : ''}`}
              onPress={() => router.push('/reminders')}
            />
            <View style={styles.divider} />
            <ProfileMenuRow
              icon="plus-circle"
              label="Cadastrar pet"
              onPress={() => router.push('/cadastrar-pet')}
            />
            <View style={styles.divider} />
            <ProfileMenuRow
              icon="plus"
              label="Novo lembrete"
              onPress={() => router.push('/cadastrar-lembrete')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App</Text>
          <View style={styles.menuCard}>
            <ProfileMenuRow icon="help-circle" label="Como usar" onPress={showHelp} />
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <View style={styles.aboutIcon}>
                <MaterialCommunityIcons name="paw" size={20} color={PetFlowColors.primary} />
              </View>
              <View>
                <Text style={styles.aboutTitle}>PetFlow</Text>
                <Text style={styles.aboutSub}>
                  Versão {packageJson.version} · Dados no aparelho
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuCard}>
            <ProfileMenuRow
              icon="trash-2"
              label="Apagar todos os dados"
              subtitle="Pets, lembretes e perfil"
              onPress={handleDeleteAll}
              danger
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PetFlowColors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: PetFlowColors.text,
    marginTop: 8,
    marginBottom: 16,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: PetFlowColors.aiBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PetFlowColors.aiBorder,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PetFlowColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PetFlowColors.primary,
  },
  avatarEmoji: { fontSize: 32 },
  heroText: { flex: 1 },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: PetFlowColors.primary,
  },
  heroSub: {
    fontSize: 13,
    color: PetFlowColors.textSecondary,
    marginTop: 4,
  },
  heroSubMuted: {
    fontSize: 13,
    color: PetFlowColors.textMuted,
    marginTop: 4,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PetFlowColors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PetFlowColors.aiBorder,
  },
  editChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: PetFlowColors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 88,
    justifyContent: 'space-between',
  },
  statGreen: { backgroundColor: PetFlowColors.primary },
  statOrange: { backgroundColor: PetFlowColors.orange },
  statBlue: { backgroundColor: PetFlowColors.blue },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: PetFlowColors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: PetFlowColors.border,
    marginBottom: 20,
  },
  nextText: { flex: 1 },
  nextTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: PetFlowColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  nextSub: {
    fontSize: 14,
    fontWeight: '600',
    color: PetFlowColors.text,
    marginTop: 2,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: PetFlowColors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: PetFlowColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PetFlowColors.border,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: PetFlowColors.border,
    marginLeft: 70,
  },
  vetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  vetBorder: {
    borderTopWidth: 1,
    borderTopColor: PetFlowColors.border,
  },
  vetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PetFlowColors.aiBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vetIconDanger: { backgroundColor: '#FEE2E2' },
  vetInfo: { flex: 1 },
  vetLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: PetFlowColors.textMuted,
    textTransform: 'uppercase',
  },
  vetName: {
    fontSize: 15,
    fontWeight: '700',
    color: PetFlowColors.text,
    marginTop: 2,
  },
  vetPhone: {
    fontSize: 13,
    color: PetFlowColors.primary,
    marginTop: 2,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  aboutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PetFlowColors.aiBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutTitle: { fontSize: 15, fontWeight: '700', color: PetFlowColors.text },
  aboutSub: { fontSize: 12, color: PetFlowColors.textSecondary, marginTop: 2 },
});
