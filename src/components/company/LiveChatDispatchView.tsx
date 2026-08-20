import React, { useState } from 'react';
import { 
  Send, 
  Radio, 
  User as UserIcon, 
  Users, 
  Clock, 
  CheckCheck, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Phone, 
  Search,
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, InAppMessage } from '../../types';

interface LiveChatDispatchViewProps {
  companyUsers: User[];
}

export const LiveChatDispatchView: React.FC<LiveChatDispatchViewProps> = ({ companyUsers }) => {
  const { 
    currentUser, 
    currentTenant, 
    messages, 
    sendMessage, 
    showToast,
    currentDutySession
  } = useApp();

  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all_team');
  const [inputText, setInputText] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Filter only employees of current company
  const fieldEmployees = companyUsers.filter(u => u.role === 'employee');

  const filteredEmployees = fieldEmployees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (emp.department && emp.department.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const selectedEmployee = fieldEmployees.find(e => e.id === selectedRecipientId);

  // Filter messages for current conversation
  const tenantMessages = messages.filter(m => m.tenantId === currentTenant.id);

  const activeThreadMessages = tenantMessages.filter(m => {
    if (selectedRecipientId === 'all_team') {
      return m.recipientId === 'all_team' || m.type === 'announcement';
    }
    return (
      (m.senderId === selectedRecipientId && (m.recipientId === currentUser.id || m.recipientId === 'admin_ops')) ||
      (m.senderId === currentUser.id && m.recipientId === selectedRecipientId) ||
      (m.recipientId === selectedRecipientId)
    );
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const recipientName = selectedRecipientId === 'all_team' 
      ? 'All Field Operations Team' 
      : selectedEmployee?.fullName || 'Field Employee';

    sendMessage(inputText.trim(), selectedRecipientId, recipientName);
    setInputText('');
    showToast(`📤 Message dispatched to ${recipientName}`);
  };

  const handleQuickDispatch = (templateText: string) => {
    const recipientName = selectedRecipientId === 'all_team' 
      ? 'All Field Operations Team' 
      : selectedEmployee?.fullName || 'Field Employee';

    sendMessage(templateText, selectedRecipientId, recipientName);
    showToast(`⚡ Quick dispatch alert sent!`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row h-[680px]">
      
      {/* LEFT ROSTER PANEL */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Field Dispatch
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {fieldEmployees.length} Field Agents
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search field team..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Channels / Roster list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          
          {/* Broadcast Channel */}
          <button
            onClick={() => setSelectedRecipientId('all_team')}
            className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between ${
              selectedRecipientId === 'all_team'
                ? 'bg-emerald-600/20 border border-emerald-500/40 text-white'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>📢 All Team Broadcast</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  Send alerts to all active agents
                </p>
              </div>
            </div>
          </button>

          {/* Individual Employees */}
          {filteredEmployees.map(emp => {
            const isSelected = selectedRecipientId === emp.id;
            const empMessages = tenantMessages.filter(m => m.senderId === emp.id || m.recipientId === emp.id);
            const lastMsg = empMessages[empMessages.length - 1];

            return (
              <button
                key={emp.id}
                onClick={() => setSelectedRecipientId(emp.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                    : 'hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {emp.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-slate-950" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{emp.fullName}</span>
                      {lastMsg && (
                        <span className="text-[9px] text-slate-500">{lastMsg.timestamp}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {emp.employeeCode || emp.designation || 'Field Agent'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT CONVERSATION PANEL */}
      <div className="flex-1 flex flex-col bg-slate-900">
        
        {/* Chat header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
              {selectedRecipientId === 'all_team' ? '📢' : (selectedEmployee?.fullName.slice(0, 2).toUpperCase() || 'EMP')}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {selectedRecipientId === 'all_team' ? 'All Team Broadcast Channel' : selectedEmployee?.fullName}
                {selectedRecipientId !== 'all_team' && (
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-normal">
                    GPS Duty Active
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedRecipientId === 'all_team' 
                  ? 'Official announcements reach all field agents immediately'
                  : `${selectedEmployee?.department || 'Field Ops'} • ${selectedEmployee?.phone || '+91 98765 00000'}`
                }
              </p>
            </div>
          </div>

          {selectedRecipientId !== 'all_team' && selectedEmployee?.phone && (
            <a
              href={`tel:${selectedEmployee.phone}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </a>
          )}
        </div>

        {/* Rapid Canned Dispatch Bar */}
        <div className="p-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Rapid Dispatch:
          </span>
          <button
            onClick={() => handleQuickDispatch('📍 Priority: Please proceed to the next assigned client location immediately.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-slate-700"
          >
            📍 Proceed to Site
          </button>
          <button
            onClick={() => handleQuickDispatch('✅ Please complete GPS geofence check-in and upload site proof photo.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-slate-700"
          >
            ✅ Submit GPS Check-In
          </button>
          <button
            onClick={() => handleQuickDispatch('🧾 Reminder: Submit your daily fuel & travel expense bills before 6:00 PM.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-slate-700"
          >
            🧾 Fuel Bill Reminder
          </button>
          <button
            onClick={() => handleQuickDispatch('⚠️ Weather update: Moderate traffic and rain reported in your area. Drive safely.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-slate-700"
          >
            ⚠️ Drive Safe Alert
          </button>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeThreadMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No messages in this channel yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Type an official directive below or click a rapid dispatch template to communicate with field team.
              </p>
            </div>
          ) : (
            activeThreadMessages.map(msg => {
              const isMine = msg.senderId === currentUser.id || msg.senderRole === 'company_owner' || msg.senderRole === 'company_hr';
              const isAnnouncement = msg.type === 'announcement' || msg.recipientId === 'all_team';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-300">{msg.senderName}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : isAnnouncement
                        ? 'bg-amber-950/80 border border-amber-800 text-amber-200 rounded-bl-xs'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={
              selectedRecipientId === 'all_team'
                ? "Broadcast official announcement to all field agents..."
                : `Type direct message to ${selectedEmployee?.fullName || 'employee'}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
