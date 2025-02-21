'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomInputField from '@/components/shared/CustomInputField';
import CustomButton from '@/components/shared/CustomButton';

// 1. Define your form schema
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  // If you want to keep a date picker, use type="date" below and
  // remove the placeholder or note that it might not appear in some browsers.
  dateOfBirth: z.string().min(1, {
    message: 'Date of birth is required.',
  }),
  ssid: z.string().min(1, {
    message: 'School number (SSID) is required.',
  }),
  cardNumber: z.string().min(1, {
    message: 'Card number is required.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddStudentFormProps {
  onSuccess?: () => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      ssid: '',
      cardNumber: '',
    },
  });

  // 2. Handle form submission
  const onSubmit = (data: FormData) => {
    console.log(data);
    if (onSuccess) onSuccess();
  };

  // 3. Render form fields using react-hook-form's Controller
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // spacing between form elements
      className="space-y-6"
    >
      {/* First & Last Name side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Student's First Name"
              placeholder="Jane"
              value={field.value}
              onChange={field.onChange}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Student's Last Name"
              placeholder="Doe"
              value={field.value}
              onChange={field.onChange}
              error={errors.lastName?.message}
            />
          )}
        />
      </div>

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Date of Birth"
            // Using type="text" so the placeholder shows exactly as in the screenshot
            // If you want a native date picker, switch to type="date"
            type="text"
            placeholder="05/07/2009"
            value={field.value}
            onChange={field.onChange}
            error={errors.dateOfBirth?.message}
          />
        )}
      />

      <Controller
        name="ssid"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Student's School Number (SSID)"
            placeholder="Namulindwa Lisa"
            value={field.value}
            onChange={field.onChange}
            error={errors.ssid?.message}
          />
        )}
      />

      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Card Number"
            placeholder="ADC 556 5678035"
            value={field.value}
            onChange={field.onChange}
            error={errors.cardNumber?.message}
          />
        )}
      />

      <CustomButton
        type="submit"
        onClick={() => null}
        text="Continue"
        className="w-full bg-purple-700 hover:bg-purple-800"
      />
    </form>
  );
};

export default AddStudentForm;
