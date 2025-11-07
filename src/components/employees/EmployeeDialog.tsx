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
    employee_name: "",
    name_as_per_aadhar: "",
    date_of_birth: "",
    gender: "Male",
    marital_status: "Single",
    mobile_number: "",
    father_name: "",
    husband_name: "",
    pf_opted: false,
    pf_basic_amount: "",
    previous_pf_account_no: "",
    uan_number: "",
    bank_account_no: "",
    ifsc_code: "",
    name_as_per_bank: "",
    pan_number: "",
    aadhar_number: "",
    international_employee: false,
    physically_handicapped: false,
    date_of_joining: "",
    emergency_mobile_number: "",
    permanent_address: "",
    department: "",
    designation: "",
    location: "",
    email: "",
    salary: undefined,
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        employee_id: "",
        employee_name: "",
        name_as_per_aadhar: "",
        date_of_birth: "",
        gender: "Male",
        marital_status: "Single",
        mobile_number: "",
        father_name: "",
        husband_name: "",
        pf_opted: false,
        pf_basic_amount: "",
        previous_pf_account_no: "",
        uan_number: "",
        bank_account_no: "",
        ifsc_code: "",
        name_as_per_bank: "",
        pan_number: "",
        aadhar_number: "",
        international_employee: false,
        physically_handicapped: false,
        date_of_joining: "",
        emergency_mobile_number: "",
        permanent_address: "",
        department: "",
        designation: "",
        location: "",
        email: "",
        salary: undefined,
      });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Basic Information</h3>
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
                  <Label htmlFor="employee_name">Employee Name *</Label>
                  <Input
                    id="employee_name"
                    value={formData.employee_name}
                    onChange={(e) => handleChange("employee_name", e.target.value)}
                    required
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
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    required
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
                  <Label htmlFor="marital_status">Marital Status *</Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(value) => handleChange("marital_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact & Family Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Contact & Family Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Mobile Number *</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => handleChange("mobile_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_mobile_number">Emergency Mobile Number *</Label>
                  <Input
                    id="emergency_mobile_number"
                    value={formData.emergency_mobile_number}
                    onChange={(e) => handleChange("emergency_mobile_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father Name *</Label>
                  <Input
                    id="father_name"
                    value={formData.father_name}
                    onChange={(e) => handleChange("father_name", e.target.value)}
                    required
                  />
                </div>
                {formData.marital_status === "Married" && formData.gender === "Female" && (
                  <div className="space-y-2">
                    <Label htmlFor="husband_name">Husband Name</Label>
                    <Input
                      id="husband_name"
                      value={formData.husband_name}
                      onChange={(e) => handleChange("husband_name", e.target.value)}
                    />
                  </div>
                )}
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

            {/* PF & Bank Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">PF & Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pf_opted">PF Opted *</Label>
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
                {formData.pf_opted && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pf_basic_amount">PF Basic Amount</Label>
                      <Select
                        value={formData.pf_basic_amount}
                        onValueChange={(value) => handleChange("pf_basic_amount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Actual Basic">Actual Basic</SelectItem>
                          <SelectItem value="15000">15000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previous_pf_account_no">Previous PF A/C No.</Label>
                      <Input
                        id="previous_pf_account_no"
                        value={formData.previous_pf_account_no}
                        onChange={(e) => handleChange("previous_pf_account_no", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uan_number">UAN Number</Label>
                      <Input
                        id="uan_number"
                        value={formData.uan_number}
                        onChange={(e) => handleChange("uan_number", e.target.value)}
                      />
                    </div>
                  </>
                )}
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
              </div>
            </div>

            {/* Identity Documents */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan_number">PAN Number *</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => handleChange("pan_number", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar_number">Aadhar Card Number *</Label>
                  <Input
                    id="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={(e) => handleChange("aadhar_number", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_joining">Date of Joining (DOJ) *</Label>
                  <Input
                    id="date_of_joining"
                    type="date"
                    value={formData.date_of_joining}
                    onChange={(e) => handleChange("date_of_joining", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary || ""}
                    onChange={(e) => handleChange("salary", e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="international_employee">International Employee *</Label>
                  <Select
                    value={formData.international_employee ? "true" : "false"}
                    onValueChange={(value) => handleChange("international_employee", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physically_handicapped">Physically Handicapped *</Label>
                  <Select
                    value={formData.physically_handicapped ? "true" : "false"}
                    onValueChange={(value) => handleChange("physically_handicapped", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
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
