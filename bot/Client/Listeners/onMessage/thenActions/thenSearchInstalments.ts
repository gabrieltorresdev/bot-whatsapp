import sendInstalmentsMessage from "../Message/SendIntalmentsMessage";

const thenSearchInstalments = async (infos: any) => {
  const { chatInfos, resSearchInstalments, client, step } = infos;
  const errorSearchInstalments =
    resSearchInstalments.Message || resSearchInstalments === 400;

  switch (step) {
    case 1:
      if (errorSearchInstalments) {
        await client.reply(
          chatInfos.id,
          "*Não há acordos disponíveis para a oferta selecionada.*",
          chatInfos.msgId
        );
      } else {
        // Se for sucesso, mostra os tipos de parcelamento disponíveis para a oferta.
        const instalments = resSearchInstalments.instalments;
        for (let i = 0; i < instalments.length; i++) {
          await sendInstalmentsMessage(infos, instalments[i]);
        }
      }
      break;
    case 2:
      if (errorSearchInstalments) {
        await client.reply(
          chatInfos.id,
          "*Ocorreu um erro desconhecido, tente novamente mais tarde.*",
          chatInfos.msgId
        );
      } else {
        // Se for sucesso, mostra 
        const instalments = resSearchInstalments.instalments;
        await sendInstalmentsMessage(infos, instalments[infos.instalmentId]);
      }
      break;
    case 3:
      if (errorSearchInstalments) {
        await client.reply(
          chatInfos.id,
          "*Ocorreu um erro desconhecido, tente novamente mais tarde.*",
          chatInfos.msgId
        );
      } else {
        // Se for sucesso, mostra 
        await sendInstalmentsMessage(infos);
      }
      break;
  }
};
export default thenSearchInstalments;
