import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Laptop } from "lucide-react";
import LaptopDialog from "@/components/laptop/LaptopDialog";

export interface LaptopRecord {
  id: string;
  employeeName: string;
  laptopBrand: string;
  laptopModel: string;
  serialNumber: string;
  assignedDate: string;
  returnDate?: string;
  status: "in" | "out";
  condition: string;
  remarks?: string;
}

const LaptopInOut = () => {
  const [laptops, setLaptops] = useState<LaptopRecord[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopRecord | null>(null);

  const handleAdd = () => {
    setSelectedLaptop(null);
    setDialogOpen(true);
  };

  const handleEdit = (laptop: LaptopRecord) => {
    setSelectedLaptop(laptop);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setLaptops(laptops.filter((laptop) => laptop.id !== id));
    }
  };

  const handleSave = (laptop: LaptopRecord) => {
    if (selectedLaptop) {
      setLaptops(laptops.map((l) => (l.id === laptop.id ? laptop : l)));
    } else {
      setLaptops([...laptops, { ...laptop, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Laptop className="h-6 w-6 md:h-8 md:w-8" />
            Laptop IN/OUT
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Track laptop assignments and returns
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Laptop Records</CardTitle>
        </CardHeader>
        <CardContent>
          {laptops.length === 0 ? (
            <div className="text-center py-12">
              <Laptop className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No records found. Click "Add Record" to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Serial No.</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laptops.map((laptop) => (
                      <TableRow key={laptop.id}>
                        <TableCell className="font-medium">
                          {laptop.employeeName}
                        </TableCell>
                        <TableCell>{laptop.laptopBrand}</TableCell>
                        <TableCell>{laptop.laptopModel}</TableCell>
                        <TableCell>{laptop.serialNumber}</TableCell>
                        <TableCell>{laptop.assignedDate}</TableCell>
                        <TableCell>{laptop.returnDate || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={laptop.status === "out" ? "default" : "secondary"}
                          >
                            {laptop.status === "out" ? "Out" : "In"}
                          </Badge>
                        </TableCell>
                        <TableCell>{laptop.condition}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(laptop)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(laptop.id)}
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

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {laptops.map((laptop) => (
                  <Card key={laptop.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {laptop.employeeName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {laptop.laptopBrand} {laptop.laptopModel}
                          </p>
                        </div>
                        <Badge
                          variant={laptop.status === "out" ? "default" : "secondary"}
                        >
                          {laptop.status === "out" ? "Out" : "In"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Serial No:</span>
                          <span className="font-medium">{laptop.serialNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned:</span>
                          <span className="font-medium">{laptop.assignedDate}</span>
                        </div>
                        {laptop.returnDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Returned:</span>
                            <span className="font-medium">{laptop.returnDate}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium">{laptop.condition}</span>
                        </div>
                        {laptop.remarks && (
                          <div className="pt-2 border-t">
                            <span className="text-muted-foreground">Remarks:</span>
                            <p className="text-sm mt-1">{laptop.remarks}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(laptop)}
                          className="flex-1"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(laptop.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <LaptopDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        laptop={selectedLaptop}
        onSave={handleSave}
      />
    </div>
  );
};

export default LaptopInOut;
