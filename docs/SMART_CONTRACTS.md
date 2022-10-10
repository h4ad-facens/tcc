# Smart Contracts

Aqui ficará documentado o que será planejado e criado para os Smart Contracts da aplicação.

## Funcionalidades

### Todos

- Listar todos as propostas
- Listar os meus lances
- Listar as minhas propostas
- Listar as disputas
- Reinvindicar fundos de uma disputa

### Freelancer

- Dar um lance
- Retirar meu lance

### Contratante

- Criar proposta
- Entrar em disputa
- Enviar pagamento
- Cancelar proposta
- Selecionar mediador
- Definir distribuição

## Definições

Proposta:

- title: Título
- description: Descrição
- value: Valor
- category: Categoria
- contactInfo: Informação de Contato
- createdAt: A data de quando foi criada
- status:
  - `WAITING_BID`: Aguardando lance
  - `IN_DEVELOPMENT`: Em desenvolvimento
  - `CANCELLED`: Cancelada
    - Só é permitido alterar para esse estado de `IN_DEVELOPMENT`.
  - `IN_DISPUTE`: Em disputa
    - Só é permitido alterar para esse estado de `IN_DEVELOPMENT`.
  - `IN_DISPUTE_DISTRIBUTION`: Aguardando distribuição dos valores
    - Só é permitido alterar para esse estado de `IN_DISPUTE`.
  - `FINISHED`: Finalizado
    - Só é permitido alterar para esse estado de `IN_DEVELOPMENT`.
    - Só é permitido alterar para esse estado de `IN_DISPUTE_DISTRIBUTION`.

Lance:

- proposalId: A identificação da proposta
- bidderAddress: O endereço do usuário que fez o lance
- bidPaidAmount: A quantidade paga pelo usuário para fazer a oferta, uma porcentagem do valor da proposta.
- createdAt: A data de quando isso foi criado

Dispute:

- proposalId: A identificação da proposta
- createdAt: A data de quando isso começou
- proposalCreatorAddress: O endereço do contratante
- bidderAddress: O endereço do licitante (freelancer)
- mediatorAddress?: Começará nulo, será decidido pelo licitante e o contratante.
- splitBidderShare?: Começará nulo, será a parcela que irá para o licitante, o restante de 100%, irá para o contratante.

## Contratos

### Propostas

Ações que poderão ser feitas com esse contrato:

- `getCountOfProposals`: Retorna a contagem total de propostas.
- `getCountOfProposalsByUser`: Retorna a contagem de propostas de um usuário pelo endereço dele
- `getProposalIdByUserAndIndex`: Retorna o ID de uma proposta pelo indice filtrado por usuário.
- `getProposalById`: Retorna as informações de uma proposta.
- `getStatusOfProposal`: Retorna o status de uma proposta.
- `createProposal`: Cria uma nova proposta.
  - Ao criar, deve ser alterado o status da proposta para `WAITING_BID`.
  - Ao criar, deve garantir que o valor depositado na proposta seja maior que zero.
- `cancelProposal`: Cancela uma proposta.
  - Ao cancelar, deve checar se o status da proposta está em `WAITING_BID`. 
  - Ao cancelar, deve ser alterado o status da proposta para `CANCELLED`.
- `onBidderSelected`: Deve ser chamado quando um lance for selecionado.
  - Ao ser chamado, verificar se o status está em `WAITING_BID`.
  - Apenas os contratos de Lances e Disputas podem realizar essa ação.
  - Após chamar, o status irá para `IN_DEVELOPMENT`.
- `onCreateDispute`: Move o status de uma proposta no ciclo de disputa.
  - Apenas os contratos de Disputas pode realizar essa ação.
  - Ao ser chamado em `IN_DEVELOPMENT`, o status vai para `IN_DISPUTE`.
- `onMediatorSelected`: Move o status para aguardando distribuição.
  - Apenas os contratos de Disputas pode realizar essa ação.
  - Ao ser chamado em `IN_DISPUTE`, o status vai para `IN_DISPUTE_DISTRIBUTION`.
- `onSelectDistribution`: É chamado quando uma distribuição é feita.
  - Apenas os contratos de Disputas pode realizar essa ação.
  - Envia os pagamentos corretos para os endereços certos.
  - Ao finalizar, o status vai para `FINISHED`.
- `onPaymentTransferred`: Finaliza uma proposta.
  - Apenas os contratos de Lances e Disputas podem realizar essa ação.
  - Ao finalizar, o status vai para `FINISHED`.
  - Ao finalizar, o valor da proposta depositado é enviado para quem ganhou o lance.

### Lances

Ações que poderão ser feitas com esse contrato:

- `getBidById`: Retorna as informações de um lance pelo ID.
- `getCountOfBidsByProposalId`: Retorna a contagem de lances por proposta.
- `getBidIdByProposalIdAndIndex`: Retorna as informações sobre um lance feito para uma proposta no index.
- `getCountOfMyBids`: Retorna a contagem de lances que eu já fiz.
- `getCountOfBidsByUser`: Retorna a quantidade de lances feitos por cada usuário.
- `getBidIdByUserAndIndex`: Retorna um lance que um usuário fez pelo índice.
- `createBid`: Cria um novo lance para uma proposta.
  - Ao criar, se certificar que a proposta existe.
  - Ao criar, a proposta precisa estar com o status `WAITING_BID`.
- `selectBid`: Seleciona um lance enviado para uma proposta.
  - Ao selecionar, deve ser alterado o status da proposta para `IN_DEVELOPMENT`.
- `getSelectedBidIdByProposalId`: Retorna qual lance foi selecionado para uma proposta.
- `cancelBid`: Remove um lance de uma proposta.
  - Ao cancelar, se certificar que o lance existe.
  - Ao cancelar, o status por ser qualquer um contanto que o lance dele não tenha sido escolhido.
  - Ao cancelar, devolver o valor depositado.
- `transferPayment`: Realiza o pagamento de uma proposta como contrante.
  - Ao transferir, o status da proposta deve ser `IN_DEVELOPMENT`.
  - Ao transferir, se certificar que quem está chamando é o dono da proposta (contrante).
  - Ao transferir, o status da proposta deve ser marcado como `FINISHED`.
- `onSelectDistribution`: Ao terminar de distribuir, retornar o lance do usuário.
  - Apenas o contrato de proposta pode chamar esse método.
  - Ao transferir, o status da proposta deve estar como `FINISHED`.

### Disputas

Ações que poderão ser feitas com esse contrato:

- `createDispute`: Cria uma disputa para uma proposta.
  - Ao criar, se certificar que a proposta existe.
  - Ao criar, deve ser alterado o status da proposta para `IN_DISPUTE`.
  - Ao criar, associar essa disputa com o criador e com o bidder.
- `selectMediator`: Seleciona um mediador para a proposta.
  - Ao selecionar, é necessário que ambos (contrante e freelancer) selecionem o mesmo mediador para passar para o status de `IN_DISPUTE_DISTRIBUTION`.
- `selectDistribution`: Define a distribuição dos valores para cada envolvido.
  - Ao definir, o status da proposta precisa estar como `IN_DISPUTE_DISTRIBUTION`.
  - Ao definir, deve ser alterado o status da proposta para `FINISHED`.
  - Ao definir, realizar a transferência dos valores de acordo com a distribuição no contrato de Lances.
- `getDisputeById`: Retorna as informações da disputa, assim como, da distribuição.
- `getCountOfDisputes`: Retorna a quantidade de disputas criadas.
- `getCountOfDisputesByUser`: Retorna a contagem de disputas criadas por/para um usuário.
- `getDisputeIdByUserAddressAndIndex`: Retorna a identificação de uma disputa pelo endereço do usuário e um índice.
- `getDisputeIdByProposalId`: Retorna a identificação de uma disputa pela identificação da proposta.
