import { getFirestore, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { SurveyDocument, SurveySubmission } from '@/types/survey';
import DashboardClient from '@/components/dashboard/dashboard-client';

// This is a temporary solution. In a real app, you'd want to initialize this only once.
if (!getApps().some(app => app.name === 'admin-rsc')) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount),
        }, 'admin-rsc');
    }
}
const db = getFirestore(getApps().find(app => app.name === 'admin-rsc'));

// Helper to convert Firestore Timestamps to serializable strings in a deeply nested object
function convertTimestamps<T>(obj: T): T {
  if (obj instanceof Timestamp) {
    return new Date(obj.toMillis()) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps) as any;
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertTimestamps((obj as any)[key]);
      }
    }
    return newObj as T;
  }
  return obj;
}


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
     // Convert Firestore Timestamps to Dates, which are serializable
    return JSON.parse(JSON.stringify(convertTimestamps(surveyList)));
  } catch (error) {
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
