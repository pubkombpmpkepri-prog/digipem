import SurveyPage from '@/components/survey/survey-page';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Survei Digitalisasi Pembelajaran
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bantu kami memetakan tingkat kesiapan digital sekolah Anda.
        </p>
      </header>
      <Card className="shadow-2xl shadow-primary/10">
        <CardContent className="p-4 sm:p-8">
          <SurveyPage />
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SekolahDigital. All rights reserved.</p>
      </footer>
    </div>
  );
}
