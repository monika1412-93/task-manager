import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Show = ({ auth, header, task }) => {

    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={header}
        >
           
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
               <div className="flex content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">{task.title}</div>
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <a href="/tasks" className="text-blue-500 hover:text-blue-700">
                            &larr; Back to Tasks
                        </a>
                    </div>
                </div>
                <div className="text-gray-900 dark:text-gray-100 p-3 content-between justify-between content-between mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div>Description : {task.description}</div>
                    <div>Status : {task.status}</div>
                    <div>Due Date : {task.due_date}</div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}


export default Show;