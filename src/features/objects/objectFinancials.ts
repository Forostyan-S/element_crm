import type { ObjectMaterialItem, ObjectWorkItem, Transaction } from '../../types';

export interface ObjectFinancials {
  workCost: number;
  materialCost: number;
  markup: number;
  total: number;
  paid: number;
  remaining: number;
  profit: number;
}

export function calculateObjectFinancials(
  workItems: ObjectWorkItem[],
  materialItems: ObjectMaterialItem[],
  transactions: Transaction[],
): ObjectFinancials {
  const workCost = workItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const materialCost = materialItems.reduce((sum, item) => sum + item.quantity * item.purchase_price, 0);
  const markup = materialItems.reduce((sum, item) => sum + item.quantity * item.markup, 0);
  const total = workCost + materialCost + markup;
  const paid = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    workCost,
    materialCost,
    markup,
    total,
    paid,
    remaining: Math.max(0, total - paid),
    profit: paid - materialCost - expenses,
  };
}
