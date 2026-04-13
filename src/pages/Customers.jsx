import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { IoPersonAddSharp } from "react-icons/io5";
import { addNewCustomer, viewCustomers } from "../services/allAPIs";
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    discount: "",
  });

  const getCustomers = async () => {
    try {
      const response = await viewCustomers();
      setCustomers(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const addCustomer = async () => {
    if (!newCustomer.customerName || newCustomer.customerName.trim() === "") {
      alert("Please enter a customer name.");
      return;
    }

    if (newCustomer.discount === "" || isNaN(newCustomer.discount)) {
      alert("Please enter a valid discount percentage.");
      return;
    }
    const reqBody = newCustomer;
    try {
      const response = await addNewCustomer(reqBody);
      console.log(response);
      if (response.status == 200) {
        alert(response.data);
      } else {
        alert("Something went Wrong");
      }
    } catch (err) {
      console.log("Error" + err);
    }
    getCustomers();
    setOpenModal(false);
    setNewCustomer({ customerName: "", discount: "" });
    console.log(newCustomer);
  };

  function onCloseModal() {
    setOpenModal(false);
    setNewItem({ customerName: "", discount: "" });
  }

  useEffect(() => {
    getCustomers();
  }, []);
  return (
    <div>
      <Button onClick={() => setOpenModal(true)} className="mx-auto mr-100">
        <IoPersonAddSharp />
      </Button>
      <div className="mx-auto w-1/2 mt-10">
        <Table hoverable className="">
          <TableHead>
            <TableHeadCell>Customer Name</TableHeadCell>
            <TableHeadCell>Discount</TableHeadCell>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {customer.customerName}
                </TableCell>
                <TableCell>{customer.discount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        show={openModal}
        dismissible
        position="center"
        size="md"
        onClose={onCloseModal}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add New Customer
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="customerName">
                  Customer Name or Business Name
                </Label>
              </div>
              <TextInput
                id="customerName"
                placeholder="ABC.Co"
                value={newCustomer.customerName}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    customerName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="price">Discount</Label>
              </div>
              <TextInput
                id="price"
                type="number"
                placeholder="10 %"
                value={newCustomer.discount}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, discount: e.target.value })
                }
                required
              />
            </div>

            <div className="w-full">
              <Button onClick={addCustomer}>Add Customer</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Customers;
