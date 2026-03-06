import { FileEdit } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";

export function GenerateResumeTab() {
    return (
        <Card className="min-h-[400px] flex items-center justify-center bg-gray-50/30">
            <CardContent className="flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                    <FileEdit className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Resume</h3>
                <p className="text-gray-500 max-w-md">
                    This feature is currently under development. Soon you will be able to automatically generate a professional resume from your profile data.
                </p>
            </CardContent>
        </Card>
    );
}
