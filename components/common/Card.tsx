
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b border-slate-200 ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      {actions && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};
