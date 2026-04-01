import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trash2, PencilLine, X } from "lucide-react";

const icons = {
  add:    { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  edit:   { icon: PencilLine,  color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-500/10"  },
  delete: { icon: Trash2,      color: "text-red-500",     bg: "bg-red-50 dark:bg-red-500/10"        },
};

const messages = {
  add:    "Transaction added successfully.",
  edit:   "Transaction updated successfully.",
  delete: "Transaction deleted.",
};

export default function Toast({ type, onClose }) {
  const { icon: Icon, color, bg } = icons[type] || icons.add;

  // Auto-dismiss after 3s
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl min-w-[240px]"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
          <Icon size={16} className={color} />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">
          {messages[type]}
        </p>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
