import { Client } from '@open-wa/wa-automate';
import { ChatInfo } from '../main';
import { SearchInstalmentsService } from '../services/api/SearchInstalmentsService';

import { ManageChat } from '../services/ManageChatService';

import resetStepFunction from './ResetStepFunction';
import stepZeroFunction from './Step0Function';

async function stepTwoFunction(client: Client, info: ChatInfo) {
	const { chatId, messageId, content, chatFound, type } = info;
	const { updateChat } = new ManageChat();
	switch (type) {
		case 'buttons_response':
			if (content === 'reset') return await stepZeroFunction(client, info);
			const cpf = chatFound.cpf;
			const offerId = content;
			const { execute } = new SearchInstalmentsService();
			const { instalments, error } = await execute({ cpf, offerId });
			if (instalments) {
				const step = 3;
				await updateChat({ chatId, cpf, step });
				await client.sendText(chatId, 'Em quantas parcelas você deseja pagar esse acordo?');
				for (const instalment of instalments) {
					const num = instalment.instalment;
					let text =
						`${num != 1 ? `${num}x de ` : ''}` +
						`R$ ${instalment.values[0].total}` +
						`${num == 1 ? ' à vista' : ''}`;
					let button = [ { id: `${instalment.id}_${offerId}`, text: text } ];
					await client.sendButtons(chatId, '⠀ㅤ', button, '');
				}
			} else {
				return await client.reply(
					chatId,
					error.Message || 'Ocorreu um erro desconhecido!\nPor favor, tente novamente.',
					messageId
				);
			}
			break;
		default:
			await resetStepFunction(client, info);
			break;
	}
}

export default stepTwoFunction;
