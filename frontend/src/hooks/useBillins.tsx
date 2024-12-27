import { useCallback, useEffect, useState } from "react";
import { Billing } from "../types/BillingType";
import { Invoice } from "../types/InvoiceType";
import { Pagination } from "../types/PaginationInterface";

const useBillings = (page: number, limit: number, searchQuery: string) => {

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const baseUrl = "http://localhost:3003/api/billings";

    const fetchBillings = useCallback(async () => {
        let url = `${baseUrl}?page=${page}&limit=${limit}`;

        if (searchQuery) {
            url = `${baseUrl}/search?name=${encodeURIComponent(searchQuery)}&code=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`;
        }

        try{
            const response = await fetch(url);
            if(!response.ok){
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: ["Error desconocido"],
                });
            }

            const date = await response.json();

            if(Array.isArray(date.data)){
                setInvoices(date.data);
                setPagination(date.meta);
            } else {
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: [
                        "La respuesta de la API no contiene un array en la propiedad 'data'",
                    ],
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log('Error ==>>', err)
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: ["Error desconocido"],
                });
            } else {
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: ["Error desconocido"],
                });
            }
        } finally {
            setLoading(false);
        }
    },[baseUrl, page, limit, searchQuery]);

    useEffect(() => {
        fetchBillings();
    }, [fetchBillings]);

    const saveBilling = useCallback(async (billing: Billing) => {
        setLoading(true);
        setError(null);
        try {
            const url = baseUrl;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(billing),
            });
            const savedBilling = await response.json();
            if(!response.ok){
                setError(savedBilling)
                return;
            }

            fetchBillings();
            return savedBilling
        } catch (error) {
            if(error instanceof Error){
                setError(error);
            }else{
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: ["Error desconocido"],
                });
            }
            console.log('Error', error)
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBilling = useCallback(async (billing: Invoice) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/${billing._id}`, {
                method: "DELETE",
            });

            const deletedBilling = await response.json();
            if(!response.ok){
                setError(deletedBilling);
                return;
            }

            fetchBillings();
            return deletedBilling;
        } catch (error) {
            if(error instanceof Error){
                setError(error);
            }else{
                setError({
                    success: false,
                    message: "Error al cargar los productos",
                    errors: ["Error desconocido"],
                });
            }
            console.log('Error', error)
        } finally {
            setLoading(false);
        }
    }, []);

    const signInvoice = useCallback(async (file: File, password: string, _id:string) => {
        setLoading(true);
        setError(null);
        console.log('file',file);
        console.log('password',password);
        console.log('_id',_id);
        try {
            const url = `${baseUrl}/sign`;
            const formData = new FormData();
            formData.append("password", password);
            formData.append("p12File", file);
            formData.append("invoiceId", _id);

            console.log('formData',formData.getAll);
            const response = await fetch(url, {
              method: "POST",
              headers: {
                // No es necesario establecer Content-Type, el navegador lo hará automáticamente
              },
              body: formData,
            });
            const signedInvoice = await response.json();
            if(!response.ok){
                setError(signedInvoice);
                return;
            }

        } catch (error) {
            if(error instanceof Error){
                setError(error);
            }else{
                setError({
                    success: false,
                    message: "Error al firmar la factura",
                    errors: ["Error desconocido"],
                });
            }
            console.log('Error', error)
        } finally {
            setLoading(false);
        }
    }, []);

    const sendSri = useCallback(async (_id:string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/sendSri/${_id}`);

            const sriResponse = await response.json();
            if(!response.ok){
                setError(sriResponse);
                return;
            }

            fetchBillings();
            return sriResponse;
        } catch (error) {
            if(error instanceof Error){
                setError(error);
            }else{
                setError({
                    success: false,
                    message: "Error al enviar la factura al SRI",
                    errors: ["Error desconocido"],
                });
            }
            console.log('Error', error)
        } finally {
            setLoading(false);
        }
    }, []);

    const dowloadXML = useCallback(async (_id:string, claveAcceso:string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/downloadXML/${_id}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${claveAcceso}.xml`;
            a.click();
        } catch (error) {
            if(error instanceof Error){
                setError(error);
            }else{
                setError({
                    success: false,
                    message: "Error al descargar el archivo",
                    errors: ["Error desconocido"],
                });
            }
            console.log('Error', error)
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        invoices,
        loading,
        error,
        pagination,
        saveBilling,
        deleteBilling,
        signInvoice,
        dowloadXML
    }
}

export default useBillings;