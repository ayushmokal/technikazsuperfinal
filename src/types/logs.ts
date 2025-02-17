export interface LogEntry {
  id: string;
  user_email: string;
  action_type: 'create' | 'update' | 'delete';
  entity_type: 'blog' | 'product';
  entity_id: string;
  entity_name: string;
  details: string;
  created_at: string;
}

export interface LogsFilter {
  user_email?: string;
  action_type?: 'create' | 'update' | 'delete';
  entity_type?: 'blog' | 'product';
  dateFrom?: Date;
  dateTo?: Date;
}