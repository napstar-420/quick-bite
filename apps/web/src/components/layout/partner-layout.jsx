import React from "react";
import PartnerSidebar from "../../components/partner/sidebar";
import PartnerHeader from "../partner/header.jsx";
import { Outlet } from "react-router-dom";

export default function PartnerLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <PartnerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PartnerHeader />
        <main className="flex-1 overflow-y-auto p-4"><Outlet /></main>
      </div>
    </div>
  );
}
