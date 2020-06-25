import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Inquiry {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  // vetor que registra as transações
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let totalIncome = 0;
    let totalOutcome = 0;

    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.value;
      } else {
        totalOutcome += transaction.value;
      }
    });

    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    // criar uma instância da classe 'Transaction'
    const newTransaction = new Transaction({ title, value, type });
    // registrar transação no array
    this.transactions.push(newTransaction);
    // retornar a transação registrada
    return newTransaction;
  }
}

export default TransactionsRepository;
