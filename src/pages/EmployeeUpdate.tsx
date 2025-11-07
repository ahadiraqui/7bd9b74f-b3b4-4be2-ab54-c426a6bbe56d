import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/pages/Employees";

const EmployeeUpdate = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    fetchEmployee();
  }, [shareToken]);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("share_token", shareToken)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Invalid share link",
          variant: "destructive",
        });
        return;
      }

      setEmployee(data);
      setFormData(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("employees")
        .update(formData)
        .eq("share_token", shareToken);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your information has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>This employee update link is invalid or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Update Your Information</CardTitle>
            <CardDescription>
              Please review and update your employee information below. Fields marked with * cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh] pr-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employee ID *</Label>
                      <Input value={formData.employee_id || "N/A"} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Employee Name *</Label>
                      <Input value={formData.employee_name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Name as per Aadhar *</Label>
                      <Input value={formData.name_as_per_aadhar} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Input value={formData.date_of_birth} disabled />
                    </div>
                  </div>
                </div>

                {/* Contact Information (Editable) */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile_number">Mobile Number</Label>
                      <Input
                        id="mobile_number"
                        value={formData.mobile_number}
                        onChange={(e) => handleChange("mobile_number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_mobile_number">Emergency Mobile Number</Label>
                      <Input
                        id="emergency_mobile_number"
                        value={formData.emergency_mobile_number}
                        onChange={(e) => handleChange("emergency_mobile_number", e.target.value)}
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="permanent_address">Permanent Address</Label>
                      <Textarea
                        id="permanent_address"
                        value={formData.permanent_address}
                        onChange={(e) => handleChange("permanent_address", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details (Editable) */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_account_no">Bank Account No.</Label>
                      <Input
                        id="bank_account_no"
                        value={formData.bank_account_no}
                        onChange={(e) => handleChange("bank_account_no", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc_code">IFSC Code</Label>
                      <Input
                        id="ifsc_code"
                        value={formData.ifsc_code}
                        onChange={(e) => handleChange("ifsc_code", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_as_per_bank">Name as per Bank Records</Label>
                      <Input
                        id="name_as_per_bank"
                        value={formData.name_as_per_bank}
                        onChange={(e) => handleChange("name_as_per_bank", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* PF Details (View Only) */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">PF Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PF Opted</Label>
                      <Input value={formData.pf_opted ? "Yes" : "No"} disabled />
                    </div>
                    {formData.pf_opted && (
                      <>
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
                  </div>
                </div>

                {/* Identity Documents (View Only) */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Identity Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PAN Number *</Label>
                      <Input value={formData.pan_number} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Aadhar Card Number *</Label>
                      <Input value={formData.aadhar_number} disabled />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    Update Information
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeUpdate;
