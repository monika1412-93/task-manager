import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Button   } from "@/Components/ui/button";
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import { Table, TableHeader,TableBody,TableRow, TableCell,TableHead  } from "@/Components/ui/table"
import { createColumnHelper } from "@tanstack/react-table"
import { useTable } from "@tanstack/react-table"
import { features } from "./data-table-features"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import DeleteForm from '@/Components/DeleteForm';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/Components/ui/empty"


const Tasks = ({ auth, header, tasks }) => {

    const columnHelper = createColumnHelper();

    const columns = columnHelper.columns([
        
        columnHelper.accessor("title", {
            header: "Title",
        }),
        columnHelper.accessor("status", {
            header: "Status",
        }),
        columnHelper.accessor("due_date", {
            header: "Due Date",
            cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString("en-US",{
                year: "numeric",
                month: "long",
                day: "numeric",}) : "N/A",
        }),
        columnHelper.accessor("created_at", {
            header: "Created At",
            cell: (info) => new Date(info.getValue()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        }),
        columnHelper.accessor("actions", {
            header: "Actions",
            cell: (info) => (
                <div className="flex gap-2 ">
                    <Button variant="outline" size="sm" render={<Link href={`/tasks/${info.row.original.id}`}>View</Link>} />        
                    <Button variant="outline" size="sm" render={<Link href={`/tasks/${info.row.original.id}/edit`}>Edit</Link>} />        
                    <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="destructive" size="sm">Delete</Button>}>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg text-gray-900 dark:text-gray-100">
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this task.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900 border border-gray-300 py-2 px-4 rounded focus:ring-blue-500">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction render={<DeleteForm routeName="tasks.destroy" routeParams={{ id: info.row.original.id }} handleSuccess={() => {}} handleError={() => {}}  className="space-y-6">
                            </DeleteForm>}>
                                
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        }),       
    ])

    const table = useTable({
        features,
        data: tasks,
        columns,
    })

    const handleDeleteTask = (taskId) => {
        fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Remove the task from the UI
                setTasks(tasks.filter(task => task.id !== taskId));
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });

    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={header}
        >
           
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 overflow-hidden ">
                {tasks.length > 0 ? (
                    <div className="flex  content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Manage Tasks</div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Button className="rounded" variant="outline" size="sm" render={<Link href="/tasks/create">+ Add Task</Link>} />
                        </div>
                    </div> )
                    : (

                        <Empty className="bg-white dark:bg-gray-800 overflow-hidden text-gray-900 dark:text-gray-100 shadow-sm sm:rounded-lg mt-10">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                <IconFolderCode />
                                </EmptyMedia>
                                <EmptyTitle>No Tasks Yet</EmptyTitle>
                                <EmptyDescription>
                                    You haven't created any tasks yet. Get started by creating
                                    your first task.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent className="flex-row justify-center gap-2">
                                <Button variant="outline" render={<a href="/tasks/create">Create Task</a>} />
                                <Button render={<a href="/dashboard">Back to Dashboard</a>} />
                            </EmptyContent>
                            <Button variant="link" className="text-muted-foreground" size="sm" nativeButton={false} render={<a href="#">Learn More <ArrowUpRightIcon /></a>} />
                        </Empty> )
                }

                {tasks.length > 0 && (
                    <>
                        <div className="mt-6 mb-3 overflow-hidden p-2 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg text-gray-900 dark:text-gray-100">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded" >
                                    {columns.map((column) => (
                                        <TableHead key={column.id}>
                                            {column.header}
                                        </TableHead>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                <table.FlexRender cell={cell} />
                                            </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4 text-gray-900 dark:text-gray-100">
                            <Button variant="outline"  size="sm" onClick={() => table.previousPage()}  disabled={!table.getCanPreviousPage()}  >
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}


export default Tasks;