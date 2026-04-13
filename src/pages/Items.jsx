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
import { CgPlayListAdd } from "react-icons/cg";
import { addNewItem, viewItem } from "../services/allAPIs";
function Items() {
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    price: "",
  });

  const getItems = async () => {
    try {
      const response = await viewItem();
      setItems(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
  };

  const addItem = async () => {
     if (!newItem.itemName || newItem.itemName.trim() === "") {
    alert("Please enter a Item name.");
    return;
  }

  if (newItem.price === "" || isNaN(newItem.price)) {
    alert("Please enter a valid price");
    return;
  }
    const reqBody = newItem;
    try {
      const response = await addNewItem(reqBody);
      console.log(response);
      alert(response.data);
    } catch (err) {
      console.log("Error" + err);
    }
    getItems();
    setOpenModal(false);
    setNewItem({ itemName: "", price: "" });
    console.log(newItem);
  };

  function onCloseModal() {
    setOpenModal(false);
    setNewItem({ itemName: "", price: "" });
  }

  useEffect(() => {
    getItems();
  }, []);
  return (
    <div>
      <Button onClick={() => setOpenModal(true)} className="mx-auto mr-100">
        <CgPlayListAdd />
      </Button>
      <div className="mx-auto w-1/2 mt-10">
        <Table hoverable className="">
          <TableHead>
            <TableRow>
              <TableHeadCell>Product Name</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.itemName}
                </TableCell>
                <TableCell>{item.price}</TableCell>
                
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
              Add New Items
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="itemName">Item Name</Label>
              </div>
              <TextInput
                id="itemName"
                placeholder="Saree"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="price">Price</Label>
              </div>
              <TextInput
                id="price"
                type="number"
                placeholder="5000"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                required
              />
            </div>

            <div className="w-full">
              <Button onClick={addItem}>Add Item</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Items;
