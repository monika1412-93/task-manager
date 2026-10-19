import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { format } from "date-fns"

import {
  Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldLegend
} from "@/Components/ui/field"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent} from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"


export default function Create({ auth, header, task }) {

    let initialValue = {
        title: '',
        description: '',
        status: 'pending',
        due_date: '',
    };

    if (task) {
        initialValue = {
            title: task.title || '',    
            description: task.description || '',
            status: task.status || 'pending',
            due_date: task?.due_date ? task.due_date.slice(0, 10) : '',
        };
    }

    const { data, setData, post, put, processing, errors, reset  } = useForm(initialValue);
    
    const [clientErrors, setClientErrors] = useState({});

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
    ];

    const [date, setDate] = useState(task?.due_date ? new Date(task.due_date.slice(0, 10) + 'T00:00:00') : undefined);

    const validateForm = () => {
        const newErrors = {};

        if (!data.title.trim()) {
            newErrors.title = "Title is required.";
        } else if (data.title.length > 255) {
            newErrors.title = "Title cannot exceed 255 characters.";
        }
        if(!data.description.trim()) {
            newErrors.description = "Description is required.";
        }
        else if (data.description.length > 5000) {
            newErrors.description =
                "Description cannot exceed 5000 characters.";
        }

        if (data.due_date && Number.isNaN(Date.parse(data.due_date))) {
            newErrors.due_date = "Please enter a valid due date.";
        }
        else if (data.due_date && new Date(data.due_date) < new Date()  && !task) {
            newErrors.due_date = "Due date cannot be in the past.";
        }
        console.log("Client-side validation errors:", newErrors);
        setClientErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const submit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            let url = '/tasks/create';
            if (task) {
                url = `/tasks/${task.id}`;
                put(url, {
                    onSuccess: () => {
                        console.log("Form submitted successfully.");
                    },
                    onError: (errors) => {
                        setClientErrors(errors);
                        console.log("Server-side validation errors:", errors);
                    },
                });
                return;
            }
            post(url, {
                onSuccess: () => {
                    console.log("Form submitted successfully.");
                },
                onError: (errors) => {
                    setClientErrors(errors);
                    console.log("Server-side validation errors:", errors);
                },
            });
       }
    }

    return (
        <AuthenticatedLayout  user={auth.user} header={header}>
             <div className=" max-w-xl mx-auto sm:px-6 lg:px-8 p-10">
                <div className="mb-10 flex content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">{task ? 'Edit Task' : 'Create A New Task'}</div>
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                         <Link href="/tasks" className="text-blue-500 hover:text-blue-700">&larr; Back to Tasks</Link>
                    </div>
                </div>
                <Card className="p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg ">
                    <CardContent>
                        <form onSubmit={submit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>{task ? 'Edit Task' : 'Create A New Task'}</FieldLegend>
                                    <FieldDescription>
                                        Please fill out the form below to create a new task. Make sure to provide a title and description for the task, and set a due date if applicable.
                                    </FieldDescription>
                                    <Field>
                                        <FieldLabel htmlFor="title">Title</FieldLabel>
                                        <Input id="title" type="text" maxLength={255} value={data.title} placeholder="Title" onChange={(e) => setData('title', e.target.value)} />
                                        {clientErrors.title && <p className="text-red-500 text-sm mt-1">{clientErrors.title}</p>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="description">Description</FieldLabel>
                                        <FieldDescription>Enter task description below.</FieldDescription>
                                        <Textarea id="description" maxLength={5000} placeholder="Type your message here." value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                        {clientErrors.description && <p className="text-red-500 text-sm mt-1">{clientErrors.description}</p>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="status">
                                            Status
                                        </FieldLabel>
                                        <Select items={statusOptions} onValueChange={(value) => setData('status', value)} value={data.status}>
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                                <SelectGroup>
                                                    {statusOptions.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field >
                                        <FieldLabel htmlFor="due_date">Due Date</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger render={<Button variant="outline" id="due_date" className="justify-start font-normal">{data.due_date ? format(data.due_date, "PPP") : <span>Pick a date</span>}</Button>} />
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(selectedDate) => {
                                                        setDate(selectedDate);
                                                        setData(
                                                            "due_date",
                                                            selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                                                        );
                                                }}
                                                defaultMonth={date}
                                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md border p-3 shadow-md text-sm"
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        {clientErrors.due_date && <p className="text-red-500 text-sm mt-1">{clientErrors.due_date}</p>}
                                    </Field> 
                                </FieldSet>
                                <Field orientation="horizontal">
                                    <Button className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150" variant="outline" type="submit">Submit</Button>
                                    <Button  type="button" onClick={() => {reset(); setClientErrors({}); setDate(undefined); }} className="ml-2 border uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:text-gray-900 dark:hover:text-gray  transition ease-in-out duration-150" variant="outline">
                                        Reset
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
