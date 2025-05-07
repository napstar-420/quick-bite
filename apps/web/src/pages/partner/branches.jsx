import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePartner } from "../../hooks/usePartner";
import { BranchCard } from "../../components/partner/branch-card";
import { Link } from "react-router-dom";
import config from "../../config";

export default function PartnerBranchesManagement() {
  const { branches } = usePartner();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Branches</h1>
          <p className="text-muted-foreground">
            Manage your restaurant branches and locations
          </p>
        </div>
          <Button asChild>
            <Link to={config.ROUTES.PARTNER_BRANCH_NEW}>
              <Plus className="mr-2 h-4 w-4" /> Add New Branch
            </Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {branches?.map((branch) => (
          <BranchCard key={branch._id} branch={branch} />
        ))}
      </div>
    </div>
  );
}
