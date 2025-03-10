'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isValid, parse } from 'date-fns';
import { toast } from 'sonner';

import CustomInputField from '@/components/shared/CustomInputField';
import CustomButton from '@/components/shared/CustomButton';
import { CustomDatePicker } from '../shared/CustomDatePicker';
import { useRegisterNewStudent } from '@/@core/hooks/useStudentData';

// Define the form schema
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  dateOfBirth: z.string().refine(
    (date) => {
      if (!date) return false;
      const parsed = parse(date, 'MM/dd/yyyy', new Date());
      return (
        isValid(parsed) &&
        parsed < new Date() &&
        parsed > new Date('1900-01-01')
      );
    },
    {
      message: 'Please enter a valid date of birth',
    },
  ),
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
  const { registerNewStudent, isRegistering } = useRegisterNewStudent();

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

  const onSubmit = async (formData: FormData) => {
    try {
      // Parse and reformat the date from MM/dd/yyyy to YYYY-MM-DD
      const parsedDate = parse(formData.dateOfBirth, 'MM/dd/yyyy', new Date());
      const formattedDob = format(parsedDate, 'yyyy-MM-dd');

      // Build the request body as required by the API
      const requestBody: any = {
        student: {
          ssid: formData.ssid,
          student_first_name: formData.firstName,
          student_last_name: formData.lastName,
          student_dob: formattedDob,
        },
        card_number: formData.cardNumber,
      };

      const response = await registerNewStudent(requestBody as any);
      if (response.status === 201 || response.status === 200) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        'Error registering new student. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Prevent form submission on Enter key
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mb-4">
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

      <div className="relative">
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => {
            const parsedDate = field.value
              ? parse(field.value, 'MM/dd/yyyy', new Date())
              : null;
            const validDate =
              parsedDate && isValid(parsedDate) ? parsedDate : null;
            return (
              <CustomDatePicker
                label="Date of Birth"
                placeholder="Select date of birth"
                value={validDate}
                onChange={(date) => {
                  if (date) {
                    field.onChange(format(date, 'MM/dd/yyyy'));
                  } else {
                    field.onChange('');
                  }
                }}
                error={errors.dateOfBirth?.message}
              />
            );
          }}
        />
      </div>

      <Controller
        name="ssid"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Student's School Number (SSID)"
            placeholder="Enter school number"
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
            placeholder="Enter card number"
            value={field.value}
            onChange={field.onChange}
            error={errors.cardNumber?.message}
          />
        )}
      />

      <CustomButton
        type="submit"
        text={isRegistering ? 'Registering...' : 'Continue'}
        disabled={isRegistering}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3"
      />
    </form>
  );
};

export default AddStudentForm;
