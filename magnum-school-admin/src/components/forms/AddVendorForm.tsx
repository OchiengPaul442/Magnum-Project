'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

import CustomInputField from '@/components/shared/CustomInputField';
import CustomButton from '@/components/shared/CustomButton';

import { onboardVendorWithOwner } from '@/services/vendors/service';
import { normalizeUserProfile } from '@/lib/auth/profile';
import { useSession } from 'next-auth/react';
import { useUserProfileStore } from '@/store/useUserProfileStore';

// 1. Define your vendor form schema (fields required by onboarding API, schoolId is hidden)
const formSchema = z.object({
  vendorName: z.string().min(2, {
    message: 'Vendor name must be at least 2 characters.',
  }),
  // schoolId is injected, not shown to user. Use string because session uses UUIDs.
  schoolId: z.string().min(1, {
    message: 'School ID is required.',
  }),
  ownerEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  ownerFirstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  ownerLastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  contact: z.string().min(7, {
    message: 'Contact is required.',
  }),
  nationalId: z.string().min(5, {
    message: 'National ID is required.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddVendorFormProps {
  onSuccess?: () => void;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ onSuccess }) => {
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Resolve schoolId from the loaded profile; do not guess a fallback value.
  const userProfile = useUserProfileStore((state) => state.data);
  const profileStatus = useUserProfileStore((state) => state.status);
  const normalizedProfile = React.useMemo(
    () => normalizeUserProfile(userProfile),
    [userProfile],
  );

  const { data: session } = useSession();
  const sessionProfile = React.useMemo(
    () => normalizeUserProfile(session?.user),
    [session],
  );

  const resolvedSchoolId =
    normalizedProfile?.school?.id ?? sessionProfile?.school?.id ?? '';
  const resolvedSchoolName =
    normalizedProfile?.school?.name ?? sessionProfile?.school?.name ?? '';

  const schoolIdReady = Boolean(
    resolvedSchoolId && String(resolvedSchoolId).trim(),
  );

  let infoMessage = '';
  if (schoolIdReady) {
    infoMessage = `Vendor will be onboarded under ${
      resolvedSchoolName || 'your school'
    }.`;
  } else if (
    profileStatus === 'loading' &&
    !sessionProfile?.school?.id &&
    !normalizedProfile?.school?.id
  ) {
    infoMessage =
      'Loading your school profile so the vendor is linked to the correct school.';
  }

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorName: '',
      schoolId: '',
      ownerEmail: '',
      ownerFirstName: '',
      ownerLastName: '',
      contact: '',
      nationalId: '',
    },
  });

  React.useEffect(() => {
    if (!schoolIdReady) {
      return;
    }

    setValue('schoolId', resolvedSchoolId, {
      shouldValidate: true,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [resolvedSchoolId, schoolIdReady, setValue]);

  // 2. Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      if (!schoolIdReady) {
        showErrorToast(
          'Your school profile is still loading. Please try again in a moment.',
        );
        return;
      }

      setIsRegistering(true);
      // Map form fields to API body
      const apiBody = {
        vendor_name: formData.vendorName,
        school_id: formData.schoolId,
        owner_email: formData.ownerEmail,
        owner_first_name: formData.ownerFirstName,
        owner_last_name: formData.ownerLastName,
        contact: formData.contact,
        national_id: formData.nationalId,
      };
      const response = await onboardVendorWithOwner(apiBody);
      // Check for error in response (status or error/message field)
      if (
        response?.status &&
        response.status !== 200 &&
        response.status !== 201
      ) {
        showErrorToast(response?.message || 'Failed to onboard vendor.');
        return;
      }
      if (
        response?.error ||
        response?.message?.toLowerCase().includes('error')
      ) {
        showErrorToast(
          response?.message || response?.error || 'Failed to onboard vendor.',
        );
        return;
      }
      showSuccessToast('Vendor onboarded successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Onboarding error:', err);
      showErrorToast(err, 'Error onboarding new vendor. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Prevent form submission on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 relative"
      onKeyDown={handleKeyDown}
    >
      <div className="rounded-2xl border border-dashed border-[#18806B]/20 bg-[#18806B]/5 px-4 py-3 text-sm text-slate-600">
        {infoMessage}
      </div>

      {/* Vendor Name */}
      <Controller
        name="vendorName"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Vendor Name"
            placeholder="Prime Canteen Services"
            value={field.value}
            onChange={field.onChange}
            error={errors.vendorName?.message}
            containerClassName="mb-0 max-w-none"
          />
        )}
      />

      {/* School ID is hidden and injected automatically */}
      <input type="hidden" {...register('schoolId')} />

      {/* Owner First & Last Name side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mb-4">
        <Controller
          name="ownerFirstName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Owner First Name"
              placeholder="John"
              value={field.value}
              onChange={field.onChange}
              error={errors.ownerFirstName?.message}
              containerClassName="mb-0 max-w-none"
            />
          )}
        />
        <Controller
          name="ownerLastName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Owner Last Name"
              placeholder="Kasaija"
              value={field.value}
              onChange={field.onChange}
              error={errors.ownerLastName?.message}
              containerClassName="mb-0 max-w-none"
            />
          )}
        />
      </div>

      {/* Owner Email */}
      <Controller
        name="ownerEmail"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Owner Email"
            placeholder="kevihed202@boxmach.com"
            value={field.value}
            onChange={field.onChange}
            error={errors.ownerEmail?.message}
            containerClassName="mb-0 max-w-none"
          />
        )}
      />

      {/* Contact */}
      <Controller
        name="contact"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Contact"
            placeholder="0700111222"
            value={field.value}
            onChange={field.onChange}
            error={errors.contact?.message}
            containerClassName="mb-0 max-w-none"
          />
        )}
      />

      {/* National ID */}
      <Controller
        name="nationalId"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="National ID"
            placeholder="CM123456789"
            value={field.value}
            onChange={field.onChange}
            error={errors.nationalId?.message}
            containerClassName="mb-0 max-w-none"
          />
        )}
      />

      <CustomButton
        type="submit"
        text={isRegistering ? 'Registering...' : 'Continue'}
        disabled={isRegistering || !schoolIdReady}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3"
      />
    </form>
  );
};

export default AddVendorForm;
