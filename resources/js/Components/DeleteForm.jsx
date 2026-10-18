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
            <button type="submit" disabled={processing} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
            </button>
        </form>
    );
}
