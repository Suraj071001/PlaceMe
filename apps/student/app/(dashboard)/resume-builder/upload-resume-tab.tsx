import { Upload, FileText, Eye } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";

export function UploadResumeTab() {
    return (
        <div className="space-y-6">
            <Card className="border-dashed border-2 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-gray-500 mb-2">Drag and drop your file here, or click to browse</p>
                    <p className="text-sm text-gray-400 mb-6">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]">
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg font-medium">Recently Uploaded</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100/50 rounded flex items-center justify-center text-indigo-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">John_Doe_Resume.pdf</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">239.3 KB</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs text-gray-500">Uploaded on 3/6/2026</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
