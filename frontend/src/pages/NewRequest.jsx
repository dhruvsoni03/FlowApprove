import { useState } from 'react';
import { useRequestStore } from '../store/requestStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NewRequest = () => {
  const [formData, setFormData] = useState({ type: 'leave', title: '', description: '', amount: '' });
  const { createRequest } = useRequestStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, amount: formData.amount ? Number(formData.amount) : undefined };
    const res = await createRequest(data);
    if (res.success) {
      navigate('/');
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-6">Create New Request</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Request Type</label>
            <div className="grid grid-cols-3 gap-4">
              {['leave', 'expense', 'general'].map(t => (
                <div 
                  key={t}
                  onClick={() => setFormData({...formData, type: t})}
                  className={`p-4 rounded-xl text-center cursor-pointer capitalize border transition-all-smooth ${formData.type === t ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-white/10 bg-black/20 hover:border-white/30'}`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              placeholder="E.g., Annual Leave, Laptop Repair"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors min-h-[120px] resize-y"
              placeholder="Provide details..."
              required 
            />
          </div>

          {formData.type === 'expense' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Amount ($)</label>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
                placeholder="0.00"
                min="0"
                step="0.01"
                required 
              />
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-lg font-semibold mt-4 transition-all-smooth shadow-lg shadow-primary/20"
          >
            Submit Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default NewRequest;
