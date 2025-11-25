import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import EmployeeDialog from "@/components/employees/EmployeeDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Employee {
  id: string;
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  employee_name?: string; // Keep for backward compatibility
  date_of_joining: string;
  mobile_number: string;
  email?: string;
  designation?: string;
  gender: string;
  status?: string;
  work_mode?: string;
  date_of_birth: string;
  highest_qualification?: string;
  father_name: string;
  emergency_mobile_number: string;
  emergency_contact_person_name?: string;
  current_location?: string;
  permanent_address: string;
  pf_opted: boolean;
  previous_pf_account_no?: string;
  uan_number?: string;
  name_as_per_aadhar: string;
  bank_account_no: string;
  ifsc_code: string;
  name_as_per_bank: string;
  pan_number: string;
  aadhar_number: string;
  marital_status: string;
  husband_name?: string;
  pf_basic_amount?: string;
  international_employee: boolean;
  physically_handicapped: boolean;
  department?: string;
  location?: string;
  salary?: number;
  share_token?: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchQuery) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (emp) => {
        const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`.toLowerCase();
        return (
          emp.employee_id?.toLowerCase().includes(query) ||
          fullName.includes(query) ||
          emp.mobile_number.includes(query)
        );
      }
    );
    setFilteredEmployees(filtered);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedEmployees(new Set());
  };

  const toggleEmployeeSelection = (id: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmployees(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select employees to delete",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedEmployees.size} employee(s)?`)) return;

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .in("id", Array.from(selectedEmployees));

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedEmployees.size} employee(s) deleted successfully`,
      });
      setDeleteMode(false);
      setSelectedEmployees(new Set());
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (employee: Partial<Employee>) => {
    try {
      if (selectedEmployee) {
        const { error } = await supabase
          .from("employees")
          .update(employee as any)
          .eq("id", selectedEmployee.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("employees")
          .insert([employee as any]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      }
      setDialogOpen(false);
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  const downloadTemplate = () => {
    const template = [
      {
        "Employee ID": "",
        "First Name*": "",
        "Last Name*": "",
        "Date of Joining* (YYYY-MM-DD)": "",
        "Mobile No*": "",
        "Email ID": "",
        "Designation": "",
        "Gender* (Male/Female/Other)": "",
        "Status* (Active/Inactive/Active Contractual)": "Active",
        "Work Mode (WFO/WFH/Hybrid)": "",
        "Birth Date* (YYYY-MM-DD)": "",
        "Highest Qualification": "",
        "Father's Name*": "",
        "Emergency Contact No.*": "",
        "Emergency Contact Person Name*": "",
        "Current Location*": "",
        "Permanent Address*": "",
        "PF Opted (YES/NO)*": "",
        "Previous PF A/C No.": "",
        "UAN no. if any": "",
        "Name as per Aadhar*": "",
        "Bank Account No.*": "",
        "IFSC Code*": "",
        "Name as per Bank Records*": "",
        "PAN No.*": "",
        "Aadhar Card No.*": "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Template");
    XLSX.writeFile(wb, "employee_template.xlsx");

    toast({
      title: "Success",
      description: "Template downloaded successfully",
    });
  };

  const validateEmployee = (emp: any, rowIndex: number): string[] => {
    const errors: string[] = [];
    const row = rowIndex + 2; // +2 because Excel starts at 1 and has header row

    if (!emp["First Name*"]) errors.push(`Row ${row}: First Name is required`);
    if (!emp["Last Name*"]) errors.push(`Row ${row}: Last Name is required`);
    if (!emp["Date of Joining* (YYYY-MM-DD)"]) errors.push(`Row ${row}: Date of Joining is required`);
    if (!emp["Mobile No*"]) errors.push(`Row ${row}: Mobile No is required`);
    if (!emp["Gender* (Male/Female/Other)"]) errors.push(`Row ${row}: Gender is required`);
    if (!emp["Status* (Active/Inactive/Active Contractual)"]) errors.push(`Row ${row}: Status is required`);
    if (!emp["Birth Date* (YYYY-MM-DD)"]) errors.push(`Row ${row}: Birth Date is required`);
    if (!emp["Father's Name*"]) errors.push(`Row ${row}: Father's Name is required`);
    if (!emp["Emergency Contact No.*"]) errors.push(`Row ${row}: Emergency Contact No. is required`);
    if (!emp["Emergency Contact Person Name*"]) errors.push(`Row ${row}: Emergency Contact Person Name is required`);
    if (!emp["Current Location*"]) errors.push(`Row ${row}: Current Location is required`);
    if (!emp["Permanent Address*"]) errors.push(`Row ${row}: Permanent Address is required`);
    if (!emp["PF Opted (YES/NO)*"]) errors.push(`Row ${row}: PF Opted is required`);
    if (!emp["Name as per Aadhar*"]) errors.push(`Row ${row}: Name as per Aadhar is required`);
    if (!emp["Bank Account No.*"]) errors.push(`Row ${row}: Bank Account No. is required`);
    if (!emp["IFSC Code*"]) errors.push(`Row ${row}: IFSC Code is required`);
    if (!emp["Name as per Bank Records*"]) errors.push(`Row ${row}: Name as per Bank Records is required`);
    if (!emp["PAN No.*"]) errors.push(`Row ${row}: PAN No. is required`);
    if (!emp["Aadhar Card No.*"]) errors.push(`Row ${row}: Aadhar Card No. is required`);

    // Validate date formats
    const dobNorm = normalizeDateCell(emp["Birth Date* (YYYY-MM-DD)"]);
    if (!dobNorm) {
      errors.push(`Row ${row}: Invalid Birth Date. Use YYYY-MM-DD or a valid Excel date (e.g., 33005)`);
    }
    const dojNorm = normalizeDateCell(emp["Date of Joining* (YYYY-MM-DD)"]);
    if (!dojNorm) {
      errors.push(`Row ${row}: Invalid Date of Joining. Use YYYY-MM-DD or a valid Excel date (e.g., 33005)`);
    }

    // Validate mobile number format (10 digits)
    if (emp["Mobile No*"] && !/^\d{10}$/.test(String(emp["Mobile No*"]))) {
      errors.push(`Row ${row}: Mobile No must be 10 digits`);
    }
    
    // Validate emergency mobile number format (10 digits)
    if (emp["Emergency Contact No.*"] && !/^\d{10}$/.test(String(emp["Emergency Contact No.*"]))) {
      errors.push(`Row ${row}: Emergency Contact No. must be 10 digits`);
    }

    return errors;
    };

    // Convert Excel serial or various string formats to 'YYYY-MM-DD'
    const excelSerialToDate = (serial: number): string => {
      if (!isFinite(serial)) return '';
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + Math.round(serial) * 24 * 60 * 60 * 1000);
      return date.toISOString().slice(0, 10);
    };

    const normalizeDateCell = (input: any): string | null => {
      if (input === null || input === undefined) return null;
      // Date instance
      if (input instanceof Date && !isNaN(input.getTime())) {
        return input.toISOString().slice(0, 10);
      }
      // Numbers (Excel serial)
      if (typeof input === 'number' && isFinite(input)) {
        return excelSerialToDate(input);
      }
      // Strings
      const str = String(input).trim();
      if (!str) return null;
      // Try YYYY-MM-DD directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
      // Replace letter O with zero for numeric-like serials (e.g., '33OO5')
      if (/^[0-9O]+$/.test(str)) {
        const fixed = str.replace(/O/g, '0');
        if (/^\d{3,6}$/.test(fixed)) {
          return excelSerialToDate(Number(fixed));
        }
      }
      // Handle common separators
      const m = str.match(/^(\d{1,4})[\/-](\d{1,2})[\/-](\d{1,4})$/);
      if (m) {
        let y: number, mo: number, d: number;
        const a = m[1].length === 4 ? [Number(m[1]), Number(m[2]), Number(m[3])] : [Number(m[3]), Number(m[2]), Number(m[1])];
        [y, mo, d] = a;
        if (y >= 1900 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
          const mm = String(mo).padStart(2, '0');
          const dd = String(d).padStart(2, '0');
          return `${y}-${mm}-${dd}`;
        }
      }
      return null;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

      if (jsonData.length === 0) {
        toast({
          title: "Error",
          description: "The uploaded file is empty",
          variant: "destructive",
        });
        return;
      }

      // Validate all rows and collect errors
      const dataWithErrors = jsonData.map((emp: any, index: number) => {
        const errors = validateEmployee(emp, index);
        return {
          ...emp,
          "Errors": errors.length > 0 ? errors.join("; ") : ""
        };
      });

      // Check if there are any errors
      const hasErrors = dataWithErrors.some((row: any) => row["Errors"]);

      if (hasErrors) {
        // Download the same file with errors column
        const ws = XLSX.utils.json_to_sheet(dataWithErrors);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employee Data with Errors");
        XLSX.writeFile(wb, "employee_upload_errors.xlsx");

        const errorCount = dataWithErrors.filter((row: any) => row["Errors"]).length;
        toast({
          title: "Validation Failed",
          description: `${errorCount} row(s) have errors. File downloaded with error details.`,
          variant: "destructive",
        });
        return;
      }

      // Convert to employee format and insert
      const employees = jsonData.map((emp: any) => {
        const firstName = String(emp["First Name*"] || "");
        const lastName = String(emp["Last Name*"] || "");
        
        return {
          employee_id: emp["Employee ID"]?.toString() || undefined,
          first_name: firstName,
          last_name: lastName,
          employee_name: `${firstName} ${lastName}`.trim(), // Combine for backward compatibility
          date_of_joining: normalizeDateCell(emp["Date of Joining* (YYYY-MM-DD)"]) || "",
          mobile_number: String(emp["Mobile No*"] || ""),
          email: emp["Email ID"] ? String(emp["Email ID"]) : undefined,
          designation: emp["Designation"] ? String(emp["Designation"]) : undefined,
          gender: String(emp["Gender* (Male/Female/Other)"] || ""),
          status: String(emp["Status* (Active/Inactive/Active Contractual)"] || "Active"),
          work_mode: emp["Work Mode (WFO/WFH/Hybrid)"] ? String(emp["Work Mode (WFO/WFH/Hybrid)"]) : undefined,
          date_of_birth: normalizeDateCell(emp["Birth Date* (YYYY-MM-DD)"]) || "",
          highest_qualification: emp["Highest Qualification"] ? String(emp["Highest Qualification"]) : undefined,
          father_name: String(emp["Father's Name*"] || ""),
          emergency_mobile_number: String(emp["Emergency Contact No.*"] || ""),
          emergency_contact_person_name: String(emp["Emergency Contact Person Name*"] || ""),
          current_location: String(emp["Current Location*"] || ""),
          permanent_address: String(emp["Permanent Address*"] || ""),
          pf_opted: String(emp["PF Opted (YES/NO)*"] || "").toUpperCase() === "YES",
          previous_pf_account_no: emp["Previous PF A/C No."] ? String(emp["Previous PF A/C No."]) : undefined,
          uan_number: emp["UAN no. if any"] ? String(emp["UAN no. if any"]) : undefined,
          name_as_per_aadhar: String(emp["Name as per Aadhar*"] || ""),
          bank_account_no: String(emp["Bank Account No.*"] || ""),
          ifsc_code: String(emp["IFSC Code*"] || ""),
          name_as_per_bank: String(emp["Name as per Bank Records*"] || ""),
          pan_number: String(emp["PAN No.*"] || ""),
          aadhar_number: String(emp["Aadhar Card No.*"] || ""),
          marital_status: "Single", // Default value
          international_employee: false,
          physically_handicapped: false,
          department: undefined,
          location: undefined,
          salary: undefined,
        };
      });

      const { error } = await supabase.from("employees").insert(employees);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${employees.length} employees uploaded successfully`,
      });
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    // Reset file input
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Employees</h2>
          <p className="text-muted-foreground mt-1">
            Manage your employee records
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={downloadTemplate} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload Template
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Search Employees</CardTitle>
          <div className="flex gap-2">
            {deleteMode ? (
              <>
                <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                  Delete Selected ({selectedEmployees.size})
                </Button>
                <Button onClick={toggleDeleteMode} variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={toggleDeleteMode} variant="outline" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Employee ID, Name, or Mobile Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No employees found matching your search."
                  : "No employees found. Click 'Add Employee' to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {deleteMode && <TableHead className="w-12"></TableHead>}
                    <TableHead>Employee ID</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>DOJ</TableHead>
                    {!deleteMode && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      {deleteMode && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedEmployees.has(employee.id)}
                            onChange={() => toggleEmployeeSelection(employee.id)}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        {employee.employee_id || "N/A"}
                      </TableCell>
                      <TableCell>{employee.first_name || "N/A"}</TableCell>
                      <TableCell>{employee.last_name || "N/A"}</TableCell>
                      <TableCell>{employee.mobile_number}</TableCell>
                      <TableCell>{employee.email || "N/A"}</TableCell>
                      <TableCell>{employee.status || "Active"}</TableCell>
                      <TableCell>
                        {new Date(employee.date_of_joining).toLocaleDateString()}
                      </TableCell>
                      {!deleteMode && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(employee)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(employee.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSave={handleSave}
      />
    </div>
  );
};

export default Employees;
