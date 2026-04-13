import React from "react";

import LHeader from "../components/LHeader";
import LFooter from "../components/LFooter";
import LTabs from "../components/LTabs";

function LandingPage() {
  return (
    <div className="bg-blue-50">
      <LHeader />
      <LTabs />
      <LFooter />
    </div>
  );
}

export default LandingPage;
