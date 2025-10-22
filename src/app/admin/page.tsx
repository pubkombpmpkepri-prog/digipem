import DashboardClient from '@/components/dashboard/dashboard-client';

export default async function AdminPage() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
                    Dashboard Admin
                </h1>
            </div>
            {/* The DashboardClient component will now fetch its own data */}
            <DashboardClient />
        </div>
    );
}

// Ensure dynamic rendering just in case, but data fetching is now client-side
export const dynamic = 'force-dynamic';
