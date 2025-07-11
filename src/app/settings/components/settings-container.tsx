'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SETTINGS } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type SettingsContainerProps = {
  settings: SETTINGS;
  onSave: (updatedSettings: Partial<SETTINGS>) => void;
};

const settingsSchema = z.object({
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsContainer({ settings, onSave }: SettingsContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: settings.businessName || '',
      businessAddress: settings.businessAddress || '',
      businessPhone: settings.businessPhone || '',
      businessEmail: settings.businessEmail || '',
    },
  });

  const [logoPreview, setLogoPreview] = useState(settings.businessLogo ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = (data: SettingsFormValues) => {
    onSave({ ...settings, ...data });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 p-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Business Settings</h2>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={logoPreview} alt="Business Logo" />
            <AvatarFallback>{settings.businessName?.charAt(0) ?? 'B'}</AvatarFallback>
          </Avatar>
          <div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Edit Logo
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" {...register('businessName')} />
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea id="businessAddress" {...register('businessAddress')} />
          </div>

          <div>
            <Label htmlFor="businessPhone">Business Phone</Label>
            <Input id="businessPhone" {...register('businessPhone')} />
          </div>

          <div>
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input id="businessEmail" {...register('businessEmail')} />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
