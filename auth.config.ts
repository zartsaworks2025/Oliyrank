import type { NextAuthConfig } from 'next-auth';

const isRole = (value: unknown): value is "USER" | "ADMIN" | "ANALYST" =>
    value === "USER" || value === "ADMIN" || value === "ANALYST";

const isStatus = (value: unknown): value is "ACTIVE" | "INACTIVE" =>
    value === "ACTIVE" || value === "INACTIVE";

export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isInactive = auth?.user?.status === "INACTIVE";
            const isAuthRoute =
                nextUrl.pathname === '/signin' || nextUrl.pathname === '/signup';
            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            const isUserRoute =
                nextUrl.pathname.startsWith('/profile') ||
                nextUrl.pathname.startsWith('/settings') ||
                nextUrl.pathname.startsWith('/bookmarks');

            if (isInactive) {
                return Response.redirect(new URL('/signin', nextUrl));
            }

            if (isAdminRoute) {
                if (!isLoggedIn) return false;
                if (auth?.user?.role !== 'ADMIN') {
                    return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (isUserRoute) {
                return isLoggedIn;
            }

            if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL('/', nextUrl));
            }

            return true;
        },
        jwt({ token, user }) {
            if (user?.role) token.role = user.role;
            if (user?.status) token.status = user.status;
            return token;
        },
        session({ session, token }) {
            if (session.user && isRole(token.role)) {
                session.user.role = token.role;
            }
            if (session.user && isStatus(token.status)) {
                session.user.status = token.status;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
