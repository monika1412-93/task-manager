import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { Button   } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { IconFolderCode, IconCircleCheck , IconPlaystationX   } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import { Table, TableHeader,TableBody,TableRow, TableCell,TableHead  } from "@/Components/ui/table"
import { createColumnHelper } from "@tanstack/react-table"
import { useTable } from "@tanstack/react-table"
import { features } from "./data-table-features"
import {useState, useEffect, useRef } from "react";
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


const Tasks = ({ auth, header, tasks, flash, query }) => {
    const columnHelper = createColumnHelper();
    const [successMessage, setSuccessMessage] = useState(flash.success || '');
    const [errorMessage, setErrorMessage] = useState(flash.error || '');
    const [allTasks, setAllTasks] = useState(tasks?.data || []);
    const { data, setData, get, processing, errors  } = useForm({query: query || ''});
    const [isFilterActive, setIsFilterActive] = useState(query && query.trim() !== '');
    
    const successTimeout = useRef(null);
    const errorTimeout = useRef(null);

    useEffect(() => {
        const showFlashMessages = (currentFlash) => {
            if (currentFlash?.success) {
                clearTimeout(successTimeout.current);
                setSuccessMessage(currentFlash.success);

                successTimeout.current = setTimeout(() => {
                    setSuccessMessage('');
                    successTimeout.current = null;
                }, 5000);
            }

            if (currentFlash?.error) {
                clearTimeout(errorTimeout.current);
                setErrorMessage(currentFlash.error);

                errorTimeout.current = setTimeout(() => {
                    setErrorMessage('');
                    errorTimeout.current = null;
                }, 5000);
            }
        };
        showFlashMessages(flash);

        return () => {
            clearTimeout(successTimeout.current);
            clearTimeout(errorTimeout.current);
        };
    }, [flash.success, flash.error]);

    const columns = columnHelper.columns([
        
        columnHelper.accessor("title", {
            header: "Title",
            cell: (info) => {
                    return (
                        <div className={`max-w-sm `}>
                            {info.getValue()}
                        </div>
                    );
            }
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => {
                const status = info.getValue();
                let statusClass = "";
                let statusText = "";

                switch (status) {
                    case "pending":
                        statusClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
                        statusText = "Pending";
                        break;
                    case "in_progress":
                        statusClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
                        statusText = "In Progress";
                        break;
                    case "completed":
                        statusClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
                        statusText = "Completed";
                        break;
                    default:
                        statusClass = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
                        statusText = "Unknown";
                }
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {statusText}
                    </span>
                );
            }
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
                    <Button className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white dark:text-white-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-blue-900 focus:bg-blue-700 dark:hover:text-white   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-blue-800 transition ease-in-out duration-150" variant="outline" size="sm" render={<Link href={`/tasks/${info.row.original.id}`}>View</Link>} />        
                    <Button className="inline-flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-800 border border-transparent rounded-md font-semibold text-xs text-white dark:text-white-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-purple-900 focus:bg-purple-700 dark:hover:text-white   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-purple-800 transition ease-in-out duration-150" variant="outline" size="sm" render={<Link href={`/tasks/${info.row.original.id}/edit`}>Edit</Link>} />        
                    <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="destructive" size="sm" className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</Button>}>
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
                                <AlertDialogAction render={<DeleteForm routeName="tasks.destroy" routeParams={{ id: info.row.original.id }} handleSuccess={() => {router.visit(route('tasks.index'));}} handleError={() => {}}  className="space-y-6">
                                </DeleteForm>}>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        }),       
    ])
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const table = useTable({
        features,
        data: allTasks,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
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

    const submit = (e) => {
        e.preventDefault();
        get(route('tasks.index'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={header}
        >
           
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 overflow-hidden ">
                {allTasks.length > 0 || isFilterActive ? (
                    <div className="flex  content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex items-center p-6 text-gray-900 dark:text-gray-100">Manage Tasks</div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Button className="rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase border-transparent"  variant="outline" size="sm" render={<Link href="/tasks/create">+ Add Task</Link>} />
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
                {console.log("successMessage", successMessage)}
                { successMessage && (
                    <div transition="linear" timing="ease-in-out" duration="5000" className="mt-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success! </strong>
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}
                { errorMessage && (
                    <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                {(allTasks.length > 0 || isFilterActive) && (
                    <>
                        <div>
                            <div className="flex justify-content-end pt-4 w-full max-w-sm">
                                <form method="GET" onSubmit={submit}  className="flex items-center w-full max-w-sm justify-content-end">
                                    <Input
                                        type="text"
                                        name="query"

                                        placeholder="Filter Tasks..."
                                        value={data?.query}
                                        onChange={(e) => setData({...data, query: e.target.value})}
                                        className="max-w-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                                    />
                                    <button type="submit" className="ml-2 inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                        Filter
                                    </button>
                                </form>
                            </div>
                        </div>
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
                                    {isFilterActive && allTasks.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                No tasks found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4 text-gray-900 dark:text-gray-100">
                            {tasks.prev_page_url  ? (
                                <Button className="border rounded uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:text-gray-900 dark:hover:text-gray  transition ease-in-out duration-150" variant="outline" size="sm" render={<Link href={tasks.prev_page_url }>Previous</Link>}   >
                                </Button>
                            ) : ( <Button className="border rounded uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:text-gray-900 dark:hover:text-gray  transition ease-in-out duration-150" variant="outline" size="sm" disabled   >
                                    Previous
                                </Button>
                            )}

                            {tasks.next_page_url ? (
                                    <Button className="border rounded uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:text-gray-900 dark:hover:text-gray  transition ease-in-out duration-150" variant="outline" size="sm" render={<Link href={tasks.next_page_url } >Next</Link>} >
                                    </Button>
                            ) : ( <Button className="border rounded uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:text-gray-900 dark:hover:text-gray  transition ease-in-out duration-150" variant="outline" size="sm" disabled>
                                    Next
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}


export default Tasks;