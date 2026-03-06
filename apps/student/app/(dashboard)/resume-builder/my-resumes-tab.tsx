import { Plus, Trash2, FileText, Eye } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";

export function MyResumesTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar with Resume List */}
            <div className="md:col-span-1">
                <Card className="h-full min-h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                        <CardTitle className="text-base font-semibold">My Resumes (1)</CardTitle>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {/* Active Resume Card */}
                            <div className="flex items-start justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-100 cursor-pointer">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 shrink-0">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">John_Doe_Resume.pdf</p>
                                        <p className="text-xs text-gray-500 mt-1">239.3 KB</p>
                                        <p className="text-xs text-gray-400">3/6/2026</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Preview Area */}
            <div className="md:col-span-2">
                <Card className="h-full min-h-[500px] flex items-center justify-center">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <Eye className="w-16 h-16 text-gray-300 mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resume Selected</h3>
                        <p className="text-sm text-gray-500">Select a resume from the list to preview it</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
