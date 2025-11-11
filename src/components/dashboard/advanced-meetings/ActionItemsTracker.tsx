import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  Tag,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

interface ActionItemsTrackerProps {
  meetingId: string;
  participants: Participant[];
  className?: string;
}

export const ActionItemsTracker: React.FC<ActionItemsTrackerProps> = ({
  meetingId,
  participants,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tags: [] as string[]
  });

  // Mock data for demonstration
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Prepare Q3 budget report',
      description: 'Compile financial data and create presentation for Q3 budget review',
      assignee: {
        id: '2',
        name: 'Sarah Chen',
        avatar: undefined
      },
      dueDate: '2025-11-20',
      priority: 'high',
      status: 'in-progress',
      tags: ['finance', 'reporting'],
      createdAt: '2025-11-10',
      updatedAt: '2025-11-11'
    },
    {
      id: '2',
      title: 'Update project documentation',
      description: 'Review and update all project documentation with latest changes',
      assignee: {
        id: '3',
        name: 'Michael Rodriguez',
        avatar: undefined
      },
      dueDate: '2025-11-18',
      priority: 'medium',
      status: 'todo',
      tags: ['documentation', 'process'],
      createdAt: '2025-11-10',
      updatedAt: '2025-11-10'
    },
    {
      id: '3',
      title: 'Schedule client follow-up meeting',
      description: 'Reach out to key clients and schedule follow-up meetings for next week',
      assignee: {
        id: '1',
        name: 'Alex Johnson',
        avatar: undefined
      },
      dueDate: '2025-11-15',
      priority: 'medium',
      status: 'completed',
      tags: ['client', 'meetings'],
      createdAt: '2025-11-10',
      updatedAt: '2025-11-11'
    },
    {
      id: '4',
      title: 'Research new marketing tools',
      description: 'Evaluate and compare different marketing automation tools for Q4',
      assignee: {
        id: '4',
        name: 'Emma Wilson',
        avatar: undefined
      },
      dueDate: '2025-11-25',
      priority: 'low',
      status: 'todo',
      tags: ['marketing', 'research'],
      createdAt: '2025-11-10',
      updatedAt: '2025-11-10'
    }
  ]);

  const getParticipantById = (id: string) => {
    return participants.find(p => p.id === id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'To Do';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && due.getDate() !== today.getDate();
  };

  const filteredItems = actionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && item.status !== 'completed') || 
                      (activeTab === 'completed' && item.status === 'completed');
    
    return matchesSearch && matchesPriority && matchesTab;
  });

  const completedItems = actionItems.filter(item => item.status === 'completed');
  const progressPercentage = actionItems.length > 0 ? (completedItems.length / actionItems.length) * 100 : 0;

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;
    
    const newItemObj: ActionItem = {
      id: `item-${Date.now()}`,
      title: newItem.title,
      description: newItem.description,
      assignee: {
        id: newItem.assigneeId,
        name: getParticipantById(newItem.assigneeId)?.name || 'Unassigned',
        avatar: getParticipantById(newItem.assigneeId)?.avatar
      },
      dueDate: newItem.dueDate,
      priority: newItem.priority,
      status: 'todo',
      tags: newItem.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setActionItems([...actionItems, newItemObj]);
    setNewItem({
      title: '',
      description: '',
      assigneeId: '',
      dueDate: '',
      priority: 'medium',
      tags: []
    });
    setIsAddingItem(false);
  };

  const handleUpdateItem = (id: string, updates: Partial<ActionItem>) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
    setEditingItemId(null);
  };

  const handleDeleteItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  const toggleItemStatus = (id: string) => {
    const item = actionItems.find(i => i.id === id);
    if (!item) return;
    
    const newStatus = item.status === 'completed' ? 'todo' : 'completed';
    handleUpdateItem(id, { status: newStatus });
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Action Items Tracker
          </CardTitle>
          <Badge variant="outline" className="bg-green-900/50 text-green-300 border-green-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Track and manage action items assigned during meetings
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">Overall Progress</h3>
            <span className="text-sm font-medium text-slate-200">{completedItems.length}/{actionItems.length} completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" indicatorClassName="bg-green-500" />
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-400">{completedItems.length} completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500"></div>
              <span className="text-xs text-slate-400">{actionItems.length - completedItems.length} pending</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search action items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddingItem(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'all' ? 'text-green-400 border-b-2 border-green-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('all')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            All Items
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'pending' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'completed' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </Button>
        </div>

        {/* Add New Item Form */}
        {isAddingItem && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-200 mb-3">Add New Action Item</h3>
            <div className="space-y-3">
              <Input
                placeholder="Title"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
              />
              <Input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={newItem.assigneeId}
                  onChange={(e) => setNewItem({...newItem, assigneeId: e.target.value})}
                  className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Assignee</option>
                  {participants.map(participant => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
                
                <Input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                />
                
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({...newItem, priority: e.target.value as any})}
                  className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingItem(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddItem}
                  className="gap-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Item
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>No action items found</p>
              <p className="text-sm mt-1">Create your first action item to get started</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const assignee = getParticipantById(item.assignee.id);
              return (
                <div 
                  key={item.id} 
                  className="p-4 rounded-lg border bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => toggleItemStatus(item.id)}
                      className="mt-1"
                    >
                      {getStatusIcon(item.status)}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-medium ${item.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-slate-400 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(item.priority)}`}
                          >
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </Badge>
                          
                          {isOverdue(item.dueDate) && item.status !== 'completed' && (
                            <Badge variant="outline" className="text-xs bg-red-900/20 text-red-400 border-red-700">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {assignee && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                            <span className="text-sm text-slate-300">{assignee.name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-400">
                            Due {formatDate(item.dueDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-slate-500" />
                          <div className="flex gap-1">
                            {item.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Edit Form */}
                  {editingItemId === item.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="space-y-3">
                        <Input
                          placeholder="Title"
                          defaultValue={item.title}
                          className="bg-slate-800/50 border-slate-700 text-slate-200"
                        />
                        <Input
                          placeholder="Description"
                          defaultValue={item.description}
                          className="bg-slate-800/50 border-slate-700 text-slate-200"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <select
                            defaultValue={item.assignee.id}
                            className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
                          >
                            {participants.map(participant => (
                              <option key={participant.id} value={participant.id}>
                                {participant.name}
                              </option>
                            ))}
                          </select>
                          
                          <Input
                            type="date"
                            defaultValue={item.dueDate}
                            className="bg-slate-800/50 border-slate-700 text-slate-200"
                          />
                          
                          <select
                            defaultValue={item.priority}
                            className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingItemId(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            className="gap-2"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Update Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};