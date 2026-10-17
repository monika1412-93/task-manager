import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Button   } from "@/components/ui/button";
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import { Table, TableHeader,TableBody,TableRow, TableCell,TableHead  } from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"


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
        }),
        columnHelper.accessor("created_at", {
            header: "Created At",
        }),
        columnHelper.accessor("actions", {
            header: "Actions",
            cell: (info) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" render={<a href={`/tasks/${info.row.original.id}`}>View</a>} />        
                    <Button variant="outline" size="sm" render={<a href={`/tasks/${info.row.original.id}/edit`}>Edit</a>} />        
                    <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="destructive" size="sm">Delete</Button>}>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this task.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction >
                                <Link href={`/tasks/${info.row.original.id}/delete`} method="delete" as="button" className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                Continue
                                </Link>
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


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={header}
        >
           
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {tasks.length > 0 ? (
                    <div className="flex content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Manage Tasks</div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Button className="rounded" variant="outline" size="sm" render={<a href="/tasks/create">+ Add Task</a>} />
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
                    <div className="mt-6 p-2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg text-gray-900 dark:text-gray-100">
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
                )}
            </div>
        </AuthenticatedLayout>
    );
}


export default Tasks;