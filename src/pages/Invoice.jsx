import React, { useEffect } from "react";
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Select,
} from "flowbite-react";
import { useState } from "react";

import { FaEye } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import {
  createInvoice,
  viewCustomers,
  viewInvoice,
  viewItem,
} from "../services/allAPIs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdDelete } from "react-icons/md";
function Invoice() {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([]);
  const [lineItems, setLineItems] = useState([
    {
      itemId: "",
      quantity: 1,
      price: 0,
      lineTotal: 0,
    },
  ]);

  const getInvoices = async () => {
    try {
      const response = await viewInvoice();
      setInvoices(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const getCustomers = async () => {
    try {
      const response = await viewCustomers();
      setCustomers(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const getItems = async () => {
    try {
      const response = await viewItem();
      setItems(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  const handleItemChange = (index, itemId) => {
    const selectedItem = items.find((i) => i._id === itemId);
    const updated = [...lineItems];
    updated[index].itemId = itemId;
    updated[index].price = selectedItem.price;
    updated[index].lineTotal = updated[index].quantity * selectedItem.price;
    setLineItems(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...lineItems];
    updated[index].quantity = qty;
    updated[index].lineTotal = qty * updated[index].price;
    setLineItems(updated);
  };

  const deleteLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const addLineItems = () => {
    setLineItems([
      ...lineItems,
      { itemId: "", quantity: 1, price: 0, lineTotal: 0 },
    ]);
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

  const discountPercent = selectedCustomer
    ? customers.find((c) => c._id === selectedCustomer)?.discount || 0
    : 0;

  const total = subtotal - (subtotal * discountPercent) / 100;

  function onCloseModal() {
    setOpenAddModal(false);
    setSelectedCustomer("");
    setLineItems([{ itemId: "", quantity: 1, price: 0, lineTotal: 0 }]);
  }

  const saveInvoice = async () => {
    if (!selectedCustomer || selectedCustomer === "") {
    alert("Please select a customer before saving the invoice.");
    return; 
  }

  if (!lineItems || lineItems.length === 0) {
    alert("Please add at least one item before saving the invoice.");
    return;
  }

  const invalidRow = lineItems.find(li => !li.itemId || li.itemId === "");
  if (invalidRow) {
    alert("All rows must have a valid item selected before saving the invoice.");
    return;
  }
    const reqBody = {
      customerId: selectedCustomer,
      lineItems: lineItems.map((li) => ({
        itemId: li.itemId,
        quantity: li.quantity,
        price: li.price,
        lineTotal: li.lineTotal,
      })),
      subtotal,
      discount: discountPercent,
      total,
      date: new Date().toISOString(),
    };

    try {
      const response = await createInvoice(reqBody);
      console.log(response.data);
      if (response.status == 201) {
        alert(response.data.message);
      } else {
        alert("Something went wrong");
      }
      getInvoices();

      setOpenAddModal(false);
      setSelectedCustomer("");
      setLineItems([{ itemId: "", quantity: 1, price: 0, lineTotal: 0 }]);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedInvoice) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Billy Invoice", 14, 20);

    doc.setFontSize(11);
    doc.text(`Invoice ID: ${selectedInvoice.invoiceId}`, 14, 30);
    doc.text(
      `Date: ${new Date(selectedInvoice.date).toLocaleDateString()}`,
      14,
      40,
    );
    doc.text(`Customer: ${selectedInvoice.customer.customerName}`, 14, 50);

    const tableData = selectedInvoice.lineItems.map((li) => [
      li.item.itemName,
      li.quantity,
      li.item.price,
      li.lineTotal,
    ]);
    autoTable(doc, {
      head: [["Item Name", "Quantity", "Price", "Line Total"]],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 12,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${selectedInvoice.subtotal}`, 14, finalY);
    doc.text(`Discount: ${selectedInvoice.discount} %`, 14, finalY + 10);
    doc.text(`Total: ${selectedInvoice.total}`, 14, finalY + 20);

    doc.save(`Invoice_${selectedInvoice.invoiceId}.pdf`);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="bg-blue-50 ">
      <Button onClick={() => setOpenAddModal(true)} className="mx-auto mr-100">
        <MdOutlinePostAdd className="h-6 w-4" />
      </Button>
      <div className="mx-auto w-1/2 mt-10">
        <Table hoverable className="">
          <TableHead>
            <TableHeadCell>Invoice ID</TableHeadCell>
            <TableHeadCell>Customer</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Total</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Details</span>
            </TableHeadCell>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice._id}
                className="bg-white "
              >
                <TableCell className="whitespace-nowrap  ">
                  {invoice.invoiceId}{" "}
                </TableCell>
                <TableCell>{invoice.customer.customerName} </TableCell>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString()}{" "}
                </TableCell>
                <TableCell>{invoice.total} </TableCell>
                <TableCell>
                  <Button
                    color="transparent"
                    className="p-0 bg-transparent hover:bg-transparent focus:ring-0"
                    onClick={() => handleView(invoice)}
                  >
                    <FaEye className="h-9 w-4 text-blue-600 hover:text-blue-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* view Modal */}
      <Modal
        dismissible
        show={openModal}
        position="center"
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader>Billy Invoice </ModalHeader>
        {openModal && selectedInvoice && (
          <ModalBody>
            <div className="space-y-6">
              <div className="flex justify-between">
                <p>Inovoice Id : {selectedInvoice.invoiceId} </p>
                <p>
                  Date :{new Date(selectedInvoice.date).toLocaleDateString()}
                </p>
              </div>
              <p>Cutomer Name : {selectedInvoice.customer.customerName} </p>

              <div>
                <Table>
                  <TableHead>
                    <TableRow  >
                      <TableHeadCell>Item name</TableHeadCell>
                      <TableHeadCell>Quantity</TableHeadCell>
                      <TableHeadCell>Price</TableHeadCell>
                      <TableHeadCell>Line Total</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {selectedInvoice.lineItems.map((li, index) => (
                      <TableRow className="bg-white ">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900">
                          {li.item.itemName}
                        </TableCell>
                        <TableCell>{li.quantity} </TableCell>
                        <TableCell>{li.item.price}</TableCell>
                        <TableCell>{li.lineTotal} </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className=" mt-5">
                  <p className="mt-2">
                    {" "}
                    <span className="font-medium text-shadow-md  ">
                      subtotal :
                    </span>{" "}
                    {selectedInvoice.subtotal}{" "}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium text-shadow-md ">
                      Discount :
                    </span>{" "}
                    {selectedInvoice.discount} %
                  </p>
                  <p className="mt-2">
                    <span className="font-medium text-shadow-md ">Total :</span>{" "}
                    {selectedInvoice.total}{" "}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button className="bg-blue-600" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button className="bg-blue-400" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* add New Invoice */}
      <Modal
        show={openAddModal}
        dismissible
        position="center"
        size="4xl"
        onClose={onCloseModal}
        popup
      >
        <ModalHeader className="my-5 ml-5">Billy Invoice </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <div className="w-3/4 flex items-center">
                <div className=" block mr-2">
                  <Label htmlFor="countries">Customer Name :</Label>
                </div>
                <Select
                  id="countries"
                  className="w-1/2"
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option disabled value="">
                    Choose Customers
                  </option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {" "}
                      {customer.customerName}{" "}
                    </option>
                  ))}
                </Select>
              </div>
              <p>Date :{new Date().toLocaleDateString()}</p>
            </div>

            <div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Item name</TableHeadCell>
                    <TableHeadCell>Quantity</TableHeadCell>
                    <TableHeadCell>Price</TableHeadCell>
                    <TableHeadCell>Line Total</TableHeadCell>
                    <TableHeadCell>
                      <span className="sr-only">Delete</span>
                    </TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  {lineItems.map((li, index) => (
                    <TableRow
                      className="bg-white "
                      key={index}
                    >
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
                        <Select
                          value={li.itemId}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Choose Item
                          </option>
                          {items.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.itemName}
                            </option>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          value={li.quantity}
                          min="1"
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>{li.price}</TableCell>
                      <TableCell>{li.lineTotal} </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => deleteLineItem(index)}
                          className="bg-transparent"
                        >
                          <MdDelete className="text-red-600 h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Button onClick={addLineItems} className="mx-auto block">
                        Add New Line
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mx-auto ml-10">
                <p className="mt-2">
                  {" "}
                  <span className="font-medium text-shadow-md">
                    subtotal :
                  </span>{" "}
                  {subtotal}
                </p>
                <p className="mt-2">
                  <span className="font-medium text-shadow-md ">
                    Discount :
                  </span>{" "}
                  {discountPercent} %
                </p>
                <p className="mt-2">
                  <span className="font-medium text-shadow-md ">Total :</span>{" "}
                  {total}
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-blue-600" onClick={saveInvoice}>
            Save Invoice
          </Button>
          <Button className="bg-blue-400" onClick={onCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Invoice;
