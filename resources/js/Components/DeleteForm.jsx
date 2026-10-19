import { useForm } from '@inertiajs/react';

export default function DeleteForm({ routeName, routeParams, className = '' , children, handleSuccess, handleError}) {

    const {
        delete: destroy,
        processing,
        errors,
    } = useForm();


    const deleteService = (e) => {
        e.preventDefault();

        destroy(route(routeName, routeParams), {
            preserveScroll: true,
            onSuccess: () => {
                if (handleSuccess) {
                    handleSuccess();
                }
            },
            onError: () => {
                if (handleError) {
                    handleError();
                }
            }
        });
    };


    return (
        <form onSubmit={deleteService} className={`space-y-6 ${className}`}>
            {children}
            <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-red-800 dark:bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white dark:text-white-800 uppercase tracking-widest hover:bg-red-900 dark:hover:bg-red-900 focus:bg-red-700 dark:focus:bg-red active:bg-red-900 dark:active:bg-red-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                Delete
            </button>
        </form>
    );
}
