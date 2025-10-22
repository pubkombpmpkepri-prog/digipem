import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/client'; // Use client for RSC, it gets configured once
import { SurveyDocument, SurveySubmission } from '@/types/survey';
import DashboardClient from '@/components/dashboard/dashboard-client';

async function getSurveyData(): Promise<SurveyDocument[]> {
  try {
    const surveysCol = collection(db, 'surveys');
    const q = query(surveysCol, orderBy('createdAt', 'desc'));
    const surveySnapshot = await getDocs(q);
    const surveyList = surveySnapshot.docs.map((doc) => {
      const data = doc.data() as SurveySubmission;
      return {
        id: doc.id,
        ...data,
      };
    });
    return surveyList;
  } catch (error) {
    // In a real app, you'd want to handle this more gracefully.
    // For this example, we'll log the error and return an empty array.
    // This could happen if Firestore rules are not set up correctly or
    // if the admin user is not properly authenticated on the server-side context (which is complex with client-side auth flow).
    // The client-side guard in layout.tsx is the primary protection here.
    console.error("Error fetching survey data:", error);
    return [];
  }
}

export default async function AdminPage() {
    const surveys = await getSurveyData();
    
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
                    Dashboard Admin
                </h1>
            </div>
            <DashboardClient surveys={surveys} />
        </div>
    );
}

// Ensure dynamic rendering to re-fetch data on each visit
export const dynamic = 'force-dynamic';
