export enum TicketPriority {
  TICKET_LOW_PRIORITY = 'low',
  TICKET_MODERATE_PRIORITY = 'moderate',
  TICKET_HIGH_PRIORITY = 'high',
  TICKET_RISK_PRIORITY = 'risk',
}

export enum TicketStatus {
  TICKET_PENDING_STATUS = 'pending',
  TICKET_IN_PROGRESS_STATUS = 'inprogress',
  TICKET_RESOLVED_STATUS = 'resolved',
  TICKET_REOPENED_STATUS = 'reopened',
}

export enum TicketScope {
  TICKET_MERCHANT_SCOPE = 'merchant',
  TICKET_OPERATION_SCOPE = 'operation',
}

export const TICKET_LOW_PRIORITY = TicketPriority.TICKET_LOW_PRIORITY;
export const TICKET_MODERATE_PRIORITY = TicketPriority.TICKET_MODERATE_PRIORITY;
export const TICKET_HIGH_PRIORITY = TicketPriority.TICKET_HIGH_PRIORITY;
export const TICKET_RISK_PRIORITY = TicketPriority.TICKET_RISK_PRIORITY;

export const TICKET_PENDING_STATUS = TicketStatus.TICKET_PENDING_STATUS;
export const TICKET_IN_PROGRESS_STATUS = TicketStatus.TICKET_IN_PROGRESS_STATUS;
export const TICKET_RESOLVED_STATUS = TicketStatus.TICKET_RESOLVED_STATUS;
export const TICKET_REOPENED_STATUS = TicketStatus.TICKET_REOPENED_STATUS;

export const TICKET_MERCHANT_SCOPE = TicketScope.TICKET_MERCHANT_SCOPE;
export const TICKET_OPERATION_SCOPE = TicketScope.TICKET_OPERATION_SCOPE;