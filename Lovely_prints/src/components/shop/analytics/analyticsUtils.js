export const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

export const groupSalesByHour = (orders) => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    amount: 0,
  }));

  orders.forEach((o) => {
    if (!o.isPaid || !isToday(o.createdAt)) return;

    const hour = new Date(o.createdAt).getHours();
    hours[hour].amount += Number(o.totalPrice || 0);
  });

  return hours;
};

export const calculateStats = (orders) => {
  const todayOrders = orders.filter(o => isToday(o.createdAt));

  return {
    totalRevenue: todayOrders
      .filter(o => o.isPaid)
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0),

    paidOrders: todayOrders.filter(o => o.isPaid).length,
    unpaidOrders: todayOrders.filter(o => !o.isPaid).length,
    completed: todayOrders.filter(o => o.status === "completed").length,
    cancelled: todayOrders.filter(o => o.status === "cancelled").length,
  };
};
