'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";

export default function ThankYouMessage() {
    
    const handleReset = () => {
        window.location.reload();
    }

    return (
        <Card className="text-center animate-in fade-in-50 duration-500">
            <CardHeader>
                <div className="mx-auto w-fit rounded-full bg-green-100 p-4">
                    <PartyPopper className="h-12 w-12 text-green-600"/>
                </div>
                <CardTitle className="font-headline text-3xl text-primary mt-4">Terima Kasih!</CardTitle>
                <CardDescription className="text-lg">
                    Data survei Anda telah berhasil disimpan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Partisipasi Anda sangat berarti untuk membantu memetakan dan meningkatkan digitalisasi pendidikan.</p>
                <Button onClick={handleReset}>Isi Survei Lagi</Button>
            </CardContent>
        </Card>
    );
}
