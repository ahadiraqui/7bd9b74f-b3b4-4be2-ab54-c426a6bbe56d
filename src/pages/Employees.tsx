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
  employee_name: string;
  name_as_per_aadhar: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  mobile_number: string;
  father_name: string;
  husband_name?: string;
  pf_opted: boolean;
  pf_basic_amount?: string;
  previous_pf_account_no?: string;
  uan_number?: string;
  bank_account_no: string;
  ifsc_code: string;
  name_as_per_bank: string;
  pan_number: string;
  aadhar_number: string;
  international_employee: boolean;
  physically_handicapped: boolean;
  date_of_joining: string;
  emergency_mobile_number: string;
  permanent_address: string;
  department?: string;
  designation?: string;
  location?: string;
  email?: string;
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
      (emp) =>
        emp.employee_id?.toLowerCase().includes(query) ||
        emp.employee_name.toLowerCase().includes(query) ||
        emp.mobile_number.includes(query)
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
        "Employee Name*": "",
        "Name as per Aadhar*": "",
        "Date Of Birth* (YYYY-MM-DD)": "",
        "Gender* (Male/Female/Other)": "",
        "Marital Status* (Single/Married/Divorced/Widowed)": "",
        "Mobile Number*": "",
        "Father Name*": "",
        "Husband Name (For Married Female)": "",
        "PF Opted (YES/NO)*": "",
        "PF Basic Amount": "",
        "Previous PF A/C No.": "",
        "UAN Number": "",
        "Bank Account No.*": "",
        "IFSC Code*": "",
        "Name as per Bank*": "",
        "PAN Number*": "",
        "Aadhar Number*": "",
        "International Employee (YES/NO)*": "",
        "Physically Handicapped (YES/NO)*": "",
        "DOJ* (YYYY-MM-DD)": "",
        "Emergency Mobile Number*": "",
        "Permanent Address*": "",
        "Department": "",
        "Designation": "",
        "Location": "",
        "Email": "",
        "Salary": "",
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

    if (!emp["Employee Name*"]) errors.push(`Row ${row}: Employee Name is required`);
    if (!emp["Name as per Aadhar*"]) errors.push(`Row ${row}: Name as per Aadhar is required`);
    if (!emp["Date Of Birth* (YYYY-MM-DD)"]) errors.push(`Row ${row}: Date of Birth is required`);
    if (!emp["Gender* (Male/Female/Other)"]) errors.push(`Row ${row}: Gender is required`);
    if (!emp["Marital Status* (Single/Married/Divorced/Widowed)"]) errors.push(`Row ${row}: Marital Status is required`);
    if (!emp["Mobile Number*"]) errors.push(`Row ${row}: Mobile Number is required`);
    if (!emp["Father Name*"]) errors.push(`Row ${row}: Father Name is required`);
    if (!emp["PF Opted (YES/NO)*"]) errors.push(`Row ${row}: PF Opted is required`);
    if (!emp["Bank Account No.*"]) errors.push(`Row ${row}: Bank Account No. is required`);
    if (!emp["IFSC Code*"]) errors.push(`Row ${row}: IFSC Code is required`);
    if (!emp["Name as per Bank*"]) errors.push(`Row ${row}: Name as per Bank is required`);
    if (!emp["PAN Number*"]) errors.push(`Row ${row}: PAN Number is required`);
    if (!emp["Aadhar Number*"]) errors.push(`Row ${row}: Aadhar Number is required`);
    if (!emp["International Employee (YES/NO)*"]) errors.push(`Row ${row}: International Employee is required`);
    if (!emp["Physically Handicapped (YES/NO)*"]) errors.push(`Row ${row}: Physically Handicapped is required`);
    if (!emp["DOJ* (YYYY-MM-DD)"]) errors.push(`Row ${row}: Date of Joining is required`);
    if (!emp["Emergency Mobile Number*"]) errors.push(`Row ${row}: Emergency Mobile Number is required`);
    if (!emp["Permanent Address*"]) errors.push(`Row ${row}: Permanent Address is required`);

    // Validate date formats (DOB and DOJ)
    const dobNorm = normalizeDateCell(emp["Date Of Birth* (YYYY-MM-DD)"]);
    if (!dobNorm) {
      errors.push(`Row ${row}: Invalid Date Of Birth. Use YYYY-MM-DD or a valid Excel date (e.g., 33005)`);
    }
    const dojNorm = normalizeDateCell(emp["DOJ* (YYYY-MM-DD)"]);
    if (!dojNorm) {
      errors.push(`Row ${row}: Invalid Date of Joining. Use YYYY-MM-DD or a valid Excel date (e.g., 33005)`);
    }

    // Validate mobile number format (10 digits)
    if (emp["Mobile Number*"] && !/^\d{10}$/.test(String(emp["Mobile Number*"]))) {
      errors.push(`Row ${row}: Mobile Number must be 10 digits`);
    }
    
    // Validate emergency mobile number format (10 digits)
    if (emp["Emergency Mobile Number*"] && !/^\d{10}$/.test(String(emp["Emergency Mobile Number*"]))) {
      errors.push(`Row ${row}: Emergency Mobile Number must be 10 digits`);
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
      const employees = jsonData.map((emp: any) => ({
        employee_id: emp["Employee ID"]?.toString() || undefined,
        employee_name: String(emp["Employee Name*"] || ""),
        name_as_per_aadhar: String(emp["Name as per Aadhar*"] || ""),
        date_of_birth: normalizeDateCell(emp["Date Of Birth* (YYYY-MM-DD)"]) || "",
        gender: String(emp["Gender* (Male/Female/Other)"] || ""),
        marital_status: String(emp["Marital Status* (Single/Married/Divorced/Widowed)"] || ""),
        mobile_number: String(emp["Mobile Number*"] || ""),
        father_name: String(emp["Father Name*"] || ""),
        husband_name: emp["Husband Name (For Married Female)"] ? String(emp["Husband Name (For Married Female)"]) : undefined,
        pf_opted: String(emp["PF Opted (YES/NO)*"] || "").toUpperCase() === "YES",
        pf_basic_amount: emp["PF Basic Amount"] ? String(emp["PF Basic Amount"]) : undefined,
        previous_pf_account_no: emp["Previous PF A/C No."] ? String(emp["Previous PF A/C No."]) : undefined,
        uan_number: emp["UAN Number"] ? String(emp["UAN Number"]) : undefined,
        bank_account_no: String(emp["Bank Account No.*"] || ""),
        ifsc_code: String(emp["IFSC Code*"] || ""),
        name_as_per_bank: String(emp["Name as per Bank*"] || ""),
        pan_number: String(emp["PAN Number*"] || ""),
        aadhar_number: String(emp["Aadhar Number*"] || ""),
        international_employee: String(emp["International Employee (YES/NO)*"] || "").toUpperCase() === "YES",
        physically_handicapped: String(emp["Physically Handicapped (YES/NO)*"] || "").toUpperCase() === "YES",
        date_of_joining: normalizeDateCell(emp["DOJ* (YYYY-MM-DD)"]) || "",
        emergency_mobile_number: String(emp["Emergency Mobile Number*"] || ""),
        permanent_address: String(emp["Permanent Address*"] || ""),
        department: emp["Department"] ? String(emp["Department"]) : undefined,
        designation: emp["Designation"] ? String(emp["Designation"]) : undefined,
        location: emp["Location"] ? String(emp["Location"]) : undefined,
        email: emp["Email"] ? String(emp["Email"]) : undefined,
        salary: emp["Salary"] ? parseFloat(String(emp["Salary"])) : undefined,
      }));

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
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
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
                      <TableCell>{employee.employee_name}</TableCell>
                      <TableCell>{employee.mobile_number}</TableCell>
                      <TableCell>{employee.email || "N/A"}</TableCell>
                      <TableCell>{employee.department || "N/A"}</TableCell>
                      <TableCell>{employee.designation || "N/A"}</TableCell>
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
