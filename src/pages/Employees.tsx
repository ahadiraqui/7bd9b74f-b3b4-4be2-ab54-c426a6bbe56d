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
import { Plus, Pencil, Trash2, Search, Link2, Copy } from "lucide-react";
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

  const copyShareLink = (shareToken: string) => {
    const link = `${window.location.origin}/employee-update/${shareToken}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Success",
      description: "Share link copied to clipboard",
    });
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
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Employees</CardTitle>
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
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>DOJ</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
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
                            onClick={() =>
                              employee.share_token &&
                              copyShareLink(employee.share_token)
                            }
                            title="Copy Share Link"
                          >
                            <Link2 className="h-4 w-4" />
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
