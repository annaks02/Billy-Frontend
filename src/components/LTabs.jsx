import React from "react";
import { TabItem, Tabs } from "flowbite-react";
import { FaTags } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import Invoice from "../pages/Invoice";
import Customers from "../pages/Customers";
import Items from "../pages/Items";

function LTabs() {
  return (
    <div>
      <Tabs
        aria-label="Tabs with icons"
        variant="underline"
        className="justify-center"
      >
        <TabItem active title="Items" icon={FaTags}>
          <Items />
        </TabItem>
        <TabItem title="Customers" icon={FaUsers}>
          <Customers />
        </TabItem>
        <TabItem  title="Invoice" icon={FaFileInvoiceDollar}>
          <Invoice />
        </TabItem>
      </Tabs>
    </div>
  );
}

export default LTabs;
