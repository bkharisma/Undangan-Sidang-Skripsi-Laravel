import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2, FileText } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingProp {
    app_logo_url: string | null;
    app_name: string | null;
}

export default function Login() {
    const { setting } = usePage().props as { setting: SettingProp | null };
    const appName = setting?.app_name || 'Undangan Sidang';
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    {setting?.app_logo_url ? (
                        <img src={setting.app_logo_url} alt={appName} className="mx-auto h-24 w-24 object-contain" />
                    ) : (
                        <FileText className="mx-auto h-16 w-16 text-primary" />
                    )}
                    <h1 className="mt-4 text-2xl font-bold">{appName}</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoFocus
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </form>
            </div>
        </div>
    );
}
