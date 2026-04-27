import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRequestStore } from '../store/requestStore';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { requests, fetchRequests, dashboardSummary, fetchDashboard, approveRequest, rejectRequest } = useRequestStore();

  useEffect(() => {
    fetchRequests();
    fetchDashboard(user.role);
  }, [user]);

  const stats = [
    { label: 'Total', value: dashboardSummary?.total || dashboardSummary?.totalRequests || dashboardSummary?.totalProcessed || 0, icon: <FileText className="w-6 h-6 text-blue-400" />, color: 'border-blue-500' },
    { label: 'Pending', value: dashboardSummary?.pending || dashboardSummary?.pendingApprovals || dashboardSummary?.pendingRequests || 0, icon: <Clock className="w-6 h-6 text-yellow-400" />, color: 'border-yellow-500' },
    ...(user.role === 'employee' ? [
      { label: 'Approved', value: dashboardSummary?.approved || 0, icon: <CheckCircle className="w-6 h-6 text-green-400" />, color: 'border-green-500' },
      { label: 'Rejected', value: dashboardSummary?.rejected || 0, icon: <XCircle className="w-6 h-6 text-red-400" />, color: 'border-red-500' }
    ] : [])
  ];

  const handleAction = async (id, action) => {
    const comment = prompt(`Enter comment for ${action}:`);
    if (action === 'approve') await approveRequest(id, comment);
    else await rejectRequest(id, comment);
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    approved: 'bg-green-500/20 text-green-300 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/50'
  };

  const getSLA = (createdAt) => {
    const hours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
    if (hours > 24) return <span className="text-red-400 text-xs flex items-center gap-1"><Activity className="w-3 h-3"/> Delayed {hours}h</span>;
    return <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/> On track</span>;
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your approvals today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className={`glass-panel p-6 rounded-xl border-l-4 ${stat.color} flex items-center justify-between hover:-translate-y-1 transition-transform cursor-default`}
          >
            <div>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-full">{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-xl overflow-hidden mt-4">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Recent Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold rounded-tl-xl">Title</th>
                <th className="p-4 font-semibold">Type</th>
                {user.role !== 'employee' && <th className="p-4 font-semibold">Requester</th>}
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">SLA</th>
                <th className="p-4 font-semibold">Status</th>
                {user.role !== 'employee' && <th className="p-4 font-semibold rounded-tr-xl">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-muted-foreground">No requests found.</td></tr>
              ) : (
                requests.map((req, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                    key={req._id} 
                    className="border-b border-border/50 hover:bg-white/5 transition-all-smooth group"
                  >
                    <td className="p-4 font-medium text-foreground">{req.title}</td>
                    <td className="p-4 capitalize"><span className="px-2.5 py-1.5 bg-muted rounded-md text-xs font-semibold text-muted-foreground">{req.type}</span></td>
                    {user.role !== 'employee' && <td className="p-4 text-muted-foreground font-medium">{req.userId?.name || 'Unknown'}</td>}
                    <td className="p-4 font-medium text-foreground">{req.amount ? `$${req.amount.toLocaleString()}` : '-'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{format(new Date(req.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="p-4">{req.status === 'pending' ? getSLA(req.createdAt) : '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[req.status]}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    {user.role !== 'employee' && (
                      <td className="p-4">
                        {req.status === 'pending' && (
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAction(req._id, 'approve')} className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg transition-colors shadow-sm" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAction(req._id, 'reject')} className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors shadow-sm" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
