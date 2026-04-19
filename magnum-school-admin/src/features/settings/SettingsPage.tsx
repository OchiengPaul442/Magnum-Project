'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { z } from 'zod';
import { FiLogOut, FiMail, FiPhone, FiUser } from 'react-icons/fi';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ErrorState from '@/components/shared/ErrorState';
import { normalizeUserProfile, getProfileInitials } from '@/lib/auth/profile';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useUserProfileStore } from '@/store/useUserProfileStore';
import themeConfig from '@/config/theme';
import {
  handleLogout as handleLogoutRequest,
  updateUserProfile,
} from '@/services/auth/service';

const settingsSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  last_name: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  contact: z.string().trim().min(5, 'Contact is required.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const getDisplayNameParts = (fullName: string) => {
  const parts = fullName.split(' ').filter(Boolean);

  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
};

const SettingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: profileData,
    status: profileStatus,
    error: profileError,
  } = useUserProfileStore((state) => ({
    data: state.data,
    status: state.status,
    error: state.error,
  }));
  const fetchUserProfile = useUserProfileStore(
    (state) => state.fetchUserProfile,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profile = useMemo(
    () => normalizeUserProfile(profileData ?? session?.user),
    [profileData, session?.user],
  );

  const nameParts = getDisplayNameParts(profile?.fullName || '');
  const firstName = profile?.firstName || nameParts.firstName;
  const lastName = profile?.lastName || nameParts.lastName;
  const contact = profile?.contact || '';
  const profileImage = previewUrl || profile?.image || null;
  const initials = getProfileInitials(profile ?? session?.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: profile?.email || session?.user?.email || '',
      contact,
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      first_name: profile.firstName || nameParts.firstName,
      last_name: profile.lastName || nameParts.lastName,
      email: profile.email || session?.user?.email || '',
      contact: profile.contact || '',
    });
  }, [
    nameParts.firstName,
    nameParts.lastName,
    profile,
    reset,
    session?.user?.email,
  ]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleSaveProfile = async (values: SettingsFormValues) => {
    const formData = new FormData();
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    formData.append('email', values.email);
    formData.append('contact', values.contact);

    if (selectedFile) {
      formData.append('user_profile_picture', selectedFile);
    }

    try {
      const response = await updateUserProfile(formData);
      showSuccessToast(
        response?.message || 'Your profile was updated successfully.',
      );
      setSelectedFile(null);
      await fetchUserProfile();
      router.refresh();
    } catch (error) {
      showErrorToast(error, 'Unable to update your profile.');
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      await handleLogoutRequest();
    } catch (error: any) {
      showErrorToast(
        error?.statusMessage || error?.message || error,
        'Unable to log out of the server session.',
      );
    } finally {
      setLogoutDialogOpen(false);
      await signOut({ callbackUrl: themeConfig.signOutUrl });
      setIsLoggingOut(false);
    }
  };

  if (profileStatus === 'failed' && !profileData) {
    return (
      <ErrorState
        title="Unable to Load Settings"
        description={profileError || 'We could not load your profile details.'}
        actionLabel="Retry"
        onActionClick={() => void fetchUserProfile()}
      />
    );
  }

  if (
    (profileStatus === 'idle' || profileStatus === 'loading') &&
    !profileData
  ) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-gray-200/80 bg-white/90 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded-full bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-20 animate-pulse rounded-3xl bg-muted/70" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
              <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
              <div className="h-16 animate-pulse rounded-2xl bg-muted/70 md:col-span-2" />
              <div className="h-16 animate-pulse rounded-2xl bg-muted/70 md:col-span-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-10 animate-pulse rounded-xl bg-muted/70" />
            <div className="h-10 animate-pulse rounded-xl bg-muted/70" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[#533E89]/10 bg-gradient-to-br from-white via-[#fcfbff] to-[#eefcf9] p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#533E89]">
            Account settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Update your profile details
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep your contact information, email address, and profile photo up
            to date. Changes are sent through the authenticated profile update
            endpoint.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#533E89]/10 text-lg font-semibold text-[#533E89] ring-1 ring-[#533E89]/10">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt="Current profile picture"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || <FiUser className="h-6 w-6" />
                  )}
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl text-foreground">
                    {profile?.fullName || session?.user?.name || 'Admin'}
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm">
                    {profile?.email ||
                      session?.user?.email ||
                      'No email on file'}
                  </CardDescription>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-[#533E89]/20 bg-[#533E89]/5 px-4 py-3 text-xs text-muted-foreground">
                {profile?.school?.name ||
                  session?.user?.school?.name ||
                  'No school linked'}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleSaveProfile)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="first_name"
                    className="flex items-center gap-2"
                  >
                    <FiUser className="h-4 w-4" />
                    First name
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="First name"
                    {...register('first_name')}
                  />
                  {errors.first_name?.message ? (
                    <p className="text-sm font-medium text-destructive">
                      {errors.first_name.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="last_name"
                    className="flex items-center gap-2"
                  >
                    <FiUser className="h-4 w-4" />
                    Last name
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Last name"
                    {...register('last_name')}
                  />
                  {errors.last_name?.message ? (
                    <p className="text-sm font-medium text-destructive">
                      {errors.last_name.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <FiMail className="h-4 w-4" />
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    {...register('email')}
                  />
                  {errors.email?.message ? (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contact" className="flex items-center gap-2">
                    <FiPhone className="h-4 w-4" />
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    placeholder="Phone number or contact details"
                    {...register('contact')}
                  />
                  {errors.contact?.message ? (
                    <p className="text-sm font-medium text-destructive">
                      {errors.contact.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-dashed border-[#533E89]/20 bg-[#533E89]/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Profile picture
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload a new avatar image to replace the current one.
                    </p>
                  </div>
                  {selectedFile ? (
                    <p className="text-xs font-medium text-[#0f766e]">
                      Selected: {selectedFile.name}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <Input
                      id="user_profile_picture"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(event) => {
                        setSelectedFile(event.target.files?.[0] || null);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:w-auto"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    disabled={!selectedFile}
                  >
                    Clear file
                  </Button>
                </div>
              </div>

              <CardFooter className="flex flex-col gap-3 px-0 pb-0 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className={cn('min-w-[160px]', isSubmitting && 'opacity-80')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving changes...' : 'Save changes'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Session summary</CardTitle>
              <CardDescription>
                Current authentication details for this browser session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1 rounded-2xl bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em]">Role</p>
                <p className="font-medium text-foreground">
                  {profile?.userCategory || 'Administrator'}
                </p>
              </div>
              <div className="space-y-1 rounded-2xl bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em]">Contact</p>
                <p className="font-medium text-foreground">
                  {profile?.contact || 'No contact saved'}
                </p>
              </div>
              <div className="space-y-1 rounded-2xl bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em]">School</p>
                <p className="font-medium text-foreground">
                  {profile?.school?.name ||
                    session?.user?.school?.name ||
                    'No school linked'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200/70 bg-red-50/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">Sign out</CardTitle>
              <CardDescription className="text-red-700/80">
                End the current admin session on this device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <FiLogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You will be signed out of your admin session on this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleLogoutConfirm()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
