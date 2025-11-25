import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/pages/Employees";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Partial<Employee>) => void;
}

const EmployeeDialog = ({
  open,
  onOpenChange,
  employee,
  onSave,
}: EmployeeDialogProps) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    employee_id: "",
    first_name: "",
    last_name: "",
    date_of_joining: "",
    mobile_number: "",
    email: "",
    designation: "",
    gender: "Male",
    status: "Active",
    work_mode: "",
    date_of_birth: "",
    highest_qualification: "",
    father_name: "",
    emergency_mobile_number: "",
    emergency_contact_person_name: "",
    current_location: "",
    permanent_address: "",
    pf_opted: false,
    previous_pf_account_no: "",
    uan_number: "",
    name_as_per_aadhar: "",
    bank_account_no: "",
    ifsc_code: "",
    name_as_per_bank: "",
    pan_number: "",
    aadhar_number: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        employee_id: "",
        first_name: "",
        last_name: "",
        date_of_joining: "",
        mobile_number: "",
        email: "",
        designation: "",
        gender: "Male",
        status: "Active",
        work_mode: "",
        date_of_birth: "",
        highest_qualification: "",
        father_name: "",
        emergency_mobile_number: "",
        emergency_contact_person_name: "",
        current_location: "",
        permanent_address: "",
        pf_opted: false,
        previous_pf_account_no: "",
        uan_number: "",
        name_as_per_aadhar: "",
        bank_account_no: "",
        ifsc_code: "",
        name_as_per_bank: "",
        pan_number: "",
        aadhar_number: "",
      });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine first and last name for backward compatibility
    const dataToSave = {
      ...formData,
      employee_name: `${formData.first_name || ""} ${formData.last_name || ""}`.trim(),
    };
    onSave(dataToSave);
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in all the required employee details below. Fields marked with * are mandatory.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employment Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => handleChange("employee_id", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_joining">Date of Joining *</Label>
                  <Input
                    id="date_of_joining"
                    type="date"
                    value={formData.date_of_joining}
                    onChange={(e) => handleChange("date_of_joining", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Mobile No *</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => handleChange("mobile_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Active Contractual">Active Contractual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work_mode">Work Mode</Label>
                  <Select
                    value={formData.work_mode}
                    onValueChange={(value) => handleChange("work_mode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WFO">Work From Office</SelectItem>
                      <SelectItem value="WFH">Work From Home</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Employee Personal Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Employee Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Birth Date *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highest_qualification">Highest Qualification</Label>
                  <Input
                    id="highest_qualification"
                    value={formData.highest_qualification}
                    onChange={(e) => handleChange("highest_qualification", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father's Name *</Label>
                  <Input
                    id="father_name"
                    value={formData.father_name}
                    onChange={(e) => handleChange("father_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_mobile_number">Emergency Contact No. *</Label>
                  <Input
                    id="emergency_mobile_number"
                    value={formData.emergency_mobile_number}
                    onChange={(e) => handleChange("emergency_mobile_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_person_name">Emergency Contact Person Name *</Label>
                  <Input
                    id="emergency_contact_person_name"
                    value={formData.emergency_contact_person_name}
                    onChange={(e) => handleChange("emergency_contact_person_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_location">Current Location *</Label>
                  <Input
                    id="current_location"
                    value={formData.current_location}
                    onChange={(e) => handleChange("current_location", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="permanent_address">Permanent Address *</Label>
                  <Textarea
                    id="permanent_address"
                    value={formData.permanent_address}
                    onChange={(e) => handleChange("permanent_address", e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Employee Bank & ID Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Employee Bank & ID Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pf_opted">PF Opted (YES/NO) *</Label>
                  <Select
                    value={formData.pf_opted ? "true" : "false"}
                    onValueChange={(value) => handleChange("pf_opted", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previous_pf_account_no">Previous PF A/C No.</Label>
                  <Input
                    id="previous_pf_account_no"
                    value={formData.previous_pf_account_no}
                    onChange={(e) => handleChange("previous_pf_account_no", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uan_number">UAN no. if any</Label>
                  <Input
                    id="uan_number"
                    value={formData.uan_number}
                    onChange={(e) => handleChange("uan_number", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_as_per_aadhar">Name as per Aadhar *</Label>
                  <Input
                    id="name_as_per_aadhar"
                    value={formData.name_as_per_aadhar}
                    onChange={(e) => handleChange("name_as_per_aadhar", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_no">Bank Account No. *</Label>
                  <Input
                    id="bank_account_no"
                    value={formData.bank_account_no}
                    onChange={(e) => handleChange("bank_account_no", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc_code">IFSC Code *</Label>
                  <Input
                    id="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={(e) => handleChange("ifsc_code", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_as_per_bank">Name as per Bank Records *</Label>
                  <Input
                    id="name_as_per_bank"
                    value={formData.name_as_per_bank}
                    onChange={(e) => handleChange("name_as_per_bank", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan_number">PAN No. *</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => handleChange("pan_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar_number">Aadhar Card No. *</Label>
                  <Input
                    id="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={(e) => handleChange("aadhar_number", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {employee ? "Update" : "Add"} Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
