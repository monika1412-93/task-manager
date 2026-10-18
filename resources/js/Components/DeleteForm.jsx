import { useForm } from '@inertiajs/react';
import { useRef } from "React";

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
        });
    };


    return (
        <form onSubmit={deleteService} className={`space-y-6 ${className}`}>
            {children}
        </form>
    );
}
