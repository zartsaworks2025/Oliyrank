'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { prisma } from '@/app/lib/prisma';


const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Ism kamida 2 ta harfdan iborat boʻlishi kerak.' }),
    email: z.string().email({ message: 'Email notoʻgʻri formatda.' }),
    password: z.string().min(6, { message: 'Parol kamida 6 ta belgidan iborat boʻlishi kerak.' }),
});

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Notoʻgʻri email yoki parol.';
                default:
                    return 'Tizim xatosi yuz berdi.';
            }
        }
        throw error;
    }
}

export async function register(prevState: State, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Maʼlumotlarni toʻldirishda xatolik.',
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                message: 'Bu email allaqachon roʻyxatdan oʻtgan.',
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

    } catch {
        return {
            message: 'Maʼlumotlar bazasida xatolik: Foydalanuvchi yaratilmadi.',
        };
    }

    // Successful registration - could redirect or auto-login
    // For now we will return success to let UI handle redirect to signin
    return { message: 'Muvaffaqiyatli roʻyxatdan oʻtdingiz! Kirishingiz mumkin.' };
}

export async function logout() {
    await signOut({ redirectTo: '/' });
}

