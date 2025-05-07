import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";

export function BranchCard({ branch }) {
  return (
    <Card className="w-[400px] pt-0 overflow-hidden">
      <img
        src={branch.coverImage}
        alt="Branch Image"
        className="w-full h-48 object-cover mb-4"
      />
      <CardHeader>
        <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">
          {branch.name}
        </CardTitle>
        <CardDescription>
          {branch.address.street}, {branch.address.city}, {branch.address.state}{" "}
          {branch.address.zipCode}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <span className="font-bold">Phone:</span> {branch.phone}
        </p>
        <p>
          <span className="font-bold">Status:</span> {branch.status}
        </p>
      </CardContent>
      <CardFooter>
        {branch.openingHours.map((oh) => (
          <div key={oh._id}>
            <p className="capitalize">
              <span className="font-bold">Days:</span> {oh.days.join(", ")}
            </p>
            <p>
              <span className="font-bold">From:</span> {oh.from}{" "}
              <span className="font-bold">To:</span> {oh.to}
            </p>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

BranchCard.propTypes = {
  branch: PropTypes.object.isRequired,
};
