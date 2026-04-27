import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData.name, formData.email, formData.password, formData.role);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join FlowApprove today</p>
        </div>

        {error && <div className="bg-destructive/20 border border-destructive text-destructive p-3 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-background/50 border border-border rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all-smooth"
              required 
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-background/50 border border-border rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all-smooth"
              required 
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="bg-background/50 border border-border rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all-smooth"
              required 
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-medium text-foreground">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="bg-background/50 border border-border rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all-smooth [&>option]:bg-background"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-glow bg-primary text-primary-foreground p-3.5 rounded-xl font-semibold mt-4 transition-all-smooth"
          >
            Create Account
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
