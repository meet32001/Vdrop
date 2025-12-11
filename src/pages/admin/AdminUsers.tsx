import { Users } from "lucide-react";

const AdminUsers = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-navy">All Users</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-navy/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-navy" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Users List Loading...</h3>
        <p className="text-gray-500">View all your registered customers here.</p>
      </div>
    </div>
  );
};

export default AdminUsers;
