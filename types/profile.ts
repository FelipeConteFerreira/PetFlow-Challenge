export type TutorProfile = {
  name: string;
  email: string;
  city: string;
  avatarEmoji: string;
  notifyDayBefore: boolean;
  notifyWeekBefore: boolean;
  defaultReminderTime: string;
  vetName: string;
  vetPhone: string;
  emergencyName: string;
  emergencyPhone: string;
};

export const DEFAULT_PROFILE: TutorProfile = {
  name: '',
  email: '',
  city: '',
  avatarEmoji: '🐾',
  notifyDayBefore: true,
  notifyWeekBefore: false,
  defaultReminderTime: '09:00',
  vetName: '',
  vetPhone: '',
  emergencyName: '',
  emergencyPhone: '',
};

export const AVATAR_OPTIONS = ['🐾', '🐕', '🐈', '😊', '🌿', '💚'];
