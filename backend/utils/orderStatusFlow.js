export const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['printing', 'cancelled'],
  printing: ['ready'],
  ready: ['completed'],
  completed: [],
  cancelled: []
};
