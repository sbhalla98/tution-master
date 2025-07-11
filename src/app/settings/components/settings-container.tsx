'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import FormInput from '@/components/form-input';
import { SETTINGS } from '@/types';
import { UpdateSettingsRequest } from '@/types/api';
import { useTranslations } from 'next-intl';

type SettingsContainerProps = {
  settings?: SETTINGS | null;
  onSave: (updatedSettings: UpdateSettingsRequest) => void;
};

const settingsSchema = z.object({
  businessAddress: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessName: z.string().optional(),
  businessPhone: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsContainer({ settings, onSave }: SettingsContainerProps) {
  const t = useTranslations('settings');
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      businessAddress: settings?.businessAddress || '',
      businessEmail: settings?.businessEmail || '',
      businessName: settings?.businessName || '',
      businessPhone: settings?.businessPhone || '',
    },
    resolver: zodResolver(settingsSchema),
  });

  const [logoPreview, setLogoPreview] = useState(settings?.businessLogo ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      onSave({ businessLogo: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src={logoPreview} alt="Business Logo" />
          <AvatarFallback>{settings?.businessName?.charAt(0) ?? 'B'}</AvatarFallback>
        </Avatar>
        <div>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            {t('logo.edit')}
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormInput
            name="businessName"
            label={t('businessName.label')}
            placeholder={t('businessName.placeholder')}
            control={form.control}
          />
          <FormInput
            name="businessAddress"
            label={t('businessAddress.label')}
            placeholder={t('businessAddress.placeholder')}
            control={form.control}
          />
          <FormInput
            name="businessPhone"
            label={t('businessPhone.label')}
            placeholder={t('businessPhone.placeholder')}
            control={form.control}
          />
          <FormInput
            name="businessEmail"
            label={t('businessEmail.label')}
            placeholder={t('businessEmail.placeholder')}
            control={form.control}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t('saving') : t('save')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
