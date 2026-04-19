type ProfileRecord = Record<string, unknown>;

export interface NormalizedUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  contact: string;
  image: string | null;
  userCategory: string;
  school: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
}

const isRecord = (value: unknown): value is ProfileRecord => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const resolveProfileRecord = (value: unknown): ProfileRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const candidates: Array<ProfileRecord | null> = [
    isRecord(value.user_data) ? value.user_data : null,
    isRecord(value.userData) ? value.userData : null,
    isRecord(value.data) ? value.data : null,
    isRecord(value.user) ? value.user : null,
    isRecord(value.profile) ? value.profile : null,
    value,
  ];

  return candidates.find(Boolean) ?? null;
};

const readString = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const readFirstString = (record: ProfileRecord, keys: string[]) => {
  for (const key of keys) {
    const value = readString(record[key]);
    if (value) {
      return value;
    }
  }

  return null;
};

const resolveSchool = (value: unknown) => {
  if (!isRecord(value)) {
    return null;
  }

  const rawId = value.id ?? value.school_id ?? value.schoolId;
  const id =
    readFirstString(value, ['id', 'school_id', 'schoolId']) ||
    (typeof rawId === 'number' || typeof rawId === 'string'
      ? String(rawId)
      : '') ||
    '';
  const name =
    readFirstString(value, ['name', 'school_name', 'schoolName']) ||
    readString(value.name) ||
    '';
  const address = readFirstString(value, ['address', 'school_address']);

  if (!id && !name && !address) {
    return null;
  }

  return {
    id,
    name,
    address: address || null,
  };
};

export const normalizeUserProfile = (
  value: unknown,
): NormalizedUserProfile | null => {
  const record = resolveProfileRecord(value);
  if (!record) {
    return null;
  }

  const firstName = readFirstString(record, ['first_name', 'firstName']) || '';
  const lastName = readFirstString(record, ['last_name', 'lastName']) || '';
  const fullName =
    readFirstString(record, ['full_name', 'fullName', 'name']) ||
    [firstName, lastName].filter(Boolean).join(' ').trim() ||
    '';
  const email = readFirstString(record, ['email', 'user_email']) || '';
  const contact =
    readFirstString(record, ['contact', 'user_contact', 'phone', 'mobile']) ||
    '';
  const image =
    readFirstString(record, [
      'user_profile_picture',
      'picture',
      'image',
      'avatar',
    ]) || null;
  const userCategory =
    readFirstString(record, ['user_category', 'userCategory', 'role']) || '';
  const rawId = record.id ?? record.user_id ?? record.userId;
  const id =
    readFirstString(record, ['id', 'user_id', 'userId']) ||
    (typeof rawId === 'number' || typeof rawId === 'string'
      ? String(rawId)
      : email || fullName
        ? String(record.email ?? record.name ?? '')
        : '');

  return {
    id,
    firstName,
    lastName,
    fullName: fullName || email || '',
    email,
    contact,
    image,
    userCategory,
    school: resolveSchool(record.school),
  };
};

export const getProfileDisplayName = (value: unknown) => {
  const profile = normalizeUserProfile(value);
  return profile?.fullName || profile?.email || 'Admin';
};

export const getProfileEmail = (value: unknown) => {
  const profile = normalizeUserProfile(value);
  return profile?.email || '';
};

export const getProfileInitials = (value: unknown) => {
  const displayName = getProfileDisplayName(value);
  const parts = displayName.split(' ').filter(Boolean);

  return parts
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const getProfileImage = (value: unknown) => {
  const profile = normalizeUserProfile(value);
  return profile?.image || null;
};

export const getProfileContact = (value: unknown) => {
  const profile = normalizeUserProfile(value);
  return profile?.contact || '';
};
