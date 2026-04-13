import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
   switch (status) {
      case "confirmed":
         return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "pending":
         return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
         return <XCircle className="w-6 h-6 text-red-600" />;
      case "completed":
         return <CheckCircle className="w-6 h-6 text-blue-600" />;
      default:
         return <AlertCircle className="w-6 h-6 text-gray-600" />;
   }
};
