import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Verify Email</h1>
                    <p className="text-muted-foreground">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we just
                        emailed to you? If you didn't receive the email, we will
                        gladly send you another.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <p className="text-center text-sm font-medium text-green-600">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </p>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {processing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Resend Verification Email
                    </Button>

                    <div className="text-center">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm text-muted-foreground underline hover:text-foreground"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
