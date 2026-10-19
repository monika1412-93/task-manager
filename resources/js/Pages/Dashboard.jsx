import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {  Card, CardContent,  CardDescription, CardHeader,  CardTitle} from "@/Components/ui/card"
export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-2 text-gray-900 dark:text-gray-100">Welcome, {auth.user.name}!</div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-5 max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100   overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-100 ">Tasks</CardTitle>
                                <CardDescription>Manage your tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>View, create, and manage your tasks. </div>
                                    <div><a href="/tasks"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right preview-icon"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></a></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
