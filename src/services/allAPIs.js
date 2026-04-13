import { serverURL } from "./serverURL";
import commonAPI from "./commonAPI";

// items
export const viewItem = async () =>{
    return await commonAPI('GET', `${serverURL}/api/getitems`,{},{})
}

export const addNewItem = async (reqBody) =>{
    return await commonAPI('POST', `${serverURL}/api/additem`,reqBody,{})
}

// customers
export const viewCustomers = async () =>{
    return await commonAPI('GET', `${serverURL}/api/getcustomers`,{},{})
}

export const addNewCustomer = async (reqBody) =>{
    return await commonAPI('POST', `${serverURL}/api/addcustomer`,reqBody,{})
}

// invoice
export const viewInvoice = async () =>{
    return await commonAPI('GET', `${serverURL}/api/getinvoice`,{},{})
}

export const createInvoice = async (reqBody) =>{
    return await commonAPI('POST', `${serverURL}/api/addinvoice`,reqBody,{})
}