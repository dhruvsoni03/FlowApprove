import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRequestStore } from '../store/requestStore';
import { Bell, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications, addRealtimeNotification, updateRealtimeRequest } = useRequestStore();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Setup Socket.io
    const socket = io('https://flowapprove-y2ye.onrender.com');
    if (user) {
      socket.emit('join', user.id);
      
      socket.on('notification', (notif) => {
        addRealtimeNotification(notif);
      });

      socket.on('new_request', (req) => {
        updateRealtimeRequest(req);
      });

      socket.on('request_updated', (req) => {
        updateRealtimeRequest(req);
      });
    }

    return () => socket.disconnect();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="glass sticky top-0 z-50 flex justify-between items-center p-4">
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        <Link to="/">FlowApprove</Link>
      </div>
      
      <div className="flex items-center gap-6">
        {user.role === 'employee' && (
          <Link to="/new-request" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all-smooth hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            + New Request
          </Link>
        )}
        
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-destructive w-3 h-3 rounded-full animate-pulse"></span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl p-4 flex flex-col gap-3 max-h-96 overflow-y-auto z-50 border border-white/10">
              <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications</p>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className={`p-3 rounded-lg text-sm ${n.read ? 'opacity-70' : 'bg-primary/10 border border-primary/30'}`}>
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-white/20 pl-6">
          <div className="flex flex-col text-right">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
