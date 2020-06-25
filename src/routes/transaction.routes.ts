import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

// criar um repositório de transações
const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactionList = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    const inquiry = {
      transactions: transactionList,
      balance,
    };

    return response.json(inquiry);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    // receber 'title', 'value' e 'type' do corpo da requisição
    const { title, value, type } = request.body;

    // em caso de retirada, verificar se há saldo
    if (type === 'outcome') {
      const balance = transactionsRepository.getBalance();
      if (balance.total < value) {
        throw new Error('Saldo insuficiente');
      }
    }

    // instanciar o serviço de criação de transação, passando o repositório como parâmetro
    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
    );
    // acionar o serviço para criar a transação
    const transaction = createTransactionService.execute({
      title,
      value,
      type,
    });
    // retornar a transação registrada
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
