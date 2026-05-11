import React from 'react';
import { BookOpen, ShieldCheck, FileText, Settings, Users, Server } from 'lucide-react';

export const ManualView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div className={`max-w-4xl mx-auto py-8 px-6 transition-colors ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
      <h1 className={`text-3xl font-serif font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
        Platform Manual
      </h1>
      
      <p className="text-lg mb-8 leading-relaxed">
        Welcome to the Information Engineering Department Knowledge Base. This manual provides
        an overview of platform features, the roles, access levels, and supported categories.
      </p>

      <section className="mb-10">
        <h2 className={`text-2xl font-semibold mb-4 border-b pb-2 ${isDarkMode ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-800"}`}>
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { icon: FileText, title: "Rich Article Editing", desc: "Write documentation easily with the built-in rich text editor featuring auto-pagination." },
             { icon: Users, title: "Role-based Workflows", desc: "Multi-tier approval workflows depending on your department and role." },
             { icon: Settings, title: "Category Management", desc: "Dedicated spaces organized by group: Infra, Cloud, Data, App Dev, Security, and Governance." },
             { icon: Server, title: "API Integration", desc: "Easily integrate our KB entries into external portals via the secure API endpoints." }
           ].map((feature, idx) => (
             <div key={idx} className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center gap-3 mb-2">
                   <feature.icon className="w-5 h-5 text-blue-500" />
                   <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm opacity-80">{feature.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className={`text-2xl font-semibold mb-4 border-b pb-2 ${isDarkMode ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-800"}`}>
          Categories
        </h2>
        <p className="mb-4">
          Articles are organized across the following approved taxonomy:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>IT Operations:</strong> Network, Cloud & Hybrid</li>
          <li><strong>Data & Storage:</strong> Databases, DR/BCP</li>
          <li><strong>Engineering:</strong> Dev Structure, DevOps, API Catalog</li>
          <li><strong>Security:</strong> Security, Change Mgmt</li>
          <li><strong>Governance:</strong> Policies & SOPs, Audit Logs</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className={`text-2xl font-semibold mb-4 border-b pb-2 ${isDarkMode ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-800"}`}>
          Access Levels & Tags
        </h2>
        <div className="space-y-4">
           <div>
             <h3 className="font-bold mb-1">Public</h3>
             <p className="text-sm">Visible to any authenticated user in the system. Ideal for general guidelines, open API docs, and standard operating procedures.</p>
           </div>
           <div>
             <h3 className="font-bold mb-1">Internal</h3>
             <p className="text-sm">Restricted to users within specific operational teams (e.g., DevOps, Security). Used for infrastructure details and internal playbooks.</p>
           </div>
           <div>
             <h3 className="font-bold mb-1">Confidential</h3>
             <p className="text-sm">Strictly limited to Managers and Department Heads. Used for sensitive security architecture, audit logs, and compliance findings.</p>
           </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className={`text-2xl font-semibold mb-4 border-b pb-2 ${isDarkMode ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-800"}`}>
          Role Privileges
        </h2>
        <div className="space-y-4 text-sm">
           <p><strong>IED Head:</strong> Full access to all categories, audit trails, and user management. Can publish directly anywhere.</p>
           <p><strong>DevOps & Infra Manager:</strong> Can publish directly to operational categories (Network, Cloud, DB, etc.) and view audit logs.</p>
           <p><strong>Sec & Comp. Manager:</strong> Can publish directly to Security and Policy categories. Can view audit logs.</p>
           <p><strong>DevOps Engineer / Security Analyst:</strong> Can create drafts. Articles require manager review before becoming published.</p>
           <p><strong>Viewer:</strong> Read-only access based on the article's access level. Cannot create or edit articles.</p>
        </div>
      </section>

    </div>
  );
};
