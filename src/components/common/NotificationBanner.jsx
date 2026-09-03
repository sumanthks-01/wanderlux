// ============================================================
// NotificationBanner.jsx — Non-intrusive top banner for
// geolocation permission request, API key warnings, etc.
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ICONS = {
  info:    { icon: Info,         color: 'text-blue-400',   bg: 'bg-blue-500/10',  border: 'border-blue-500/20' },
  warning: { icon: AlertCircle,  color: 'text-amber-400',  bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  success: { icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-500/10', border: 'border-green-500/20' },
  location:{ icon: MapPin,       color: 'text-primary-400',bg: 'bg-primary-500/10',border: 'border-primary-500/20' },
};

const NotificationBanner = ({ type = 'info', message, action, actionLabel, onDismiss }) => {
  const { icon: Icon, color, bg, border } = ICONS[type] || ICONS.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg} border ${border} backdrop-blur-sm`}
        role="alert"
        aria-live="polite"
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} aria-hidden="true" />

        <p className="flex-1 text-sm text-slate-300">{message}</p>

        {action && actionLabel && (
          <button
            onClick={action}
            className="btn btn-sm btn-primary flex-shrink-0 text-xs"
            aria-label={actionLabel}
          >
            {actionLabel}
          </button>
        )}

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;
