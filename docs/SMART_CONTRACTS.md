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

- proposalId: A identificação da propsota
- timestamp: A data de quando isso foi criado
- bidderAddress: O endereço do usuário que fez o lance

Dispute:

- proposalId: A identificação da proposta
- timestamp: A data de quando isso começou
- proposalCreatorAddress: O endereço do contratante
- bidderAddress: O endereço do licitante (freelancer)
- mediatorAddress?: Começará nulo, será decidido pelo licitante e o contratante.
- splitBidderShare?: Começará nulo, será a parcela que irá para o licitante, o restante de 100%, irá para o contratante.

## Contratos

### Propostas

Ações que poderão ser feitas com esse contrato:

- `getCountOfProposals`: Retorna a contagem total de propostas.

[//]: # (Talvez não seja necessário porque eu usarei a estrutura de dados https://docs.openzeppelin.com/contracts/4.x/api/utils#EnumerableMap)

[//]: # (- `getIndexOfProposalByAddress`: Retorna o indice de uma proposta na lista pelo endereço da proposta.)

- `getCountOfProposalsByUser`: Retorna a contagem de propostas de um usuário pelo endereço dele
- `getProposalIdByIndexByUser`: Retorna o ID de uma proposta pelo indice filtrado por usuário.
- `getProposalById`: Retorna as informações de uma proposta.
- `getStatusOfProposal`: Retorna o status de uma proposta.

[//]: # (Talvez não seja necessário porque eu usarei a estrutura de dados https://docs.openzeppelin.com/contracts/4.x/api/utils#EnumerableMap)

[//]: # (- `getIndexOfMyProposalByAddress`: Retorna o indice de uma proposta pelo endereço da proposta.)

- `createProposal`: Cria uma nova proposta.
  - Ao criar, deve ser alterado o status da proposta para `WAITING_BID`.
  - Ao criar, deve garantir que o valor depositado na proposta seja maior que zero.
- `cancelProposal`: Cancela uma proposta.
  - Ao cancelar, deve checar se o status da proposta está em `WAITING_BID`. 
  - Ao cancelar, deve ser alterado o status da proposta para `CANCELLED`.
- `setProposalStatus`: Altera o status de uma proposta.
  - Apenas os contratos de Lances e Disputas podem realizar essa ação.

### Lances

Ações que poderão ser feitas com esse contrato:

- `getBidsByProposalId`: Retorna a lista de endereços dos lances.
- `getMyBids`: Retorna a lista de endereços dos lances que o meu usuário já fez.
- `createBid`: Cria um novo lance para uma proposta.
  - Ao criar, se certificar que a proposta existe.
  - Ao criar, a proposta precisa estar com o status `WAITING_BID`.
- `selectBid`: Seleciona um lance enviado para uma proposta.
  - Ao selecionar, deve ser alterado o status da proposta para `IN_DEVELOPMENT`.
- `getSelectedBidByProposalId`: Retorna qual lance foi selecionado para uma proposta.
- `cancelBid`: Remove um lance de uma proposta.
  - Ao cancelar, se certificar que o lance existe.
  - Ao cancelar, o status deve ser apenas `WAITING_BID` ou `CANCELLED`.
- `claimPayment`: Pega o pagamento que recebeu de uma proposta como freelancer.
- `transferPayment`: Realiza o pagamento de uma proposta como contrante.
  - Ao transferir, o status da proposta deve ser `IN_DEVELOPMENT`.
  - Ao transferir, se certificar que quem está chamando é o dono da proposta (contrante).
  - Ao transferir, o status da proposta deve ser marcado como `FINISHED`.
- `transferPaymentByDistribution`: Realiza o pagamento por distribuição.
  - Ao transferir, o status da proposta deve ser `IN_DISPUTE_DISTRIBUTION`.
  - Ao transferir, olhar o contrato de disputas para obter a distribuição.
  - Ao transferir, o status da proposta deve ser marcado como `FINISHED`.

### Disputas

Ações que poderão ser feitas com esse contrato:

- `createDispute`: Cria uma disputa para uma proposta.
  - Ao criar, se certificar que a proposta existe.
  - Ao criar, deve ser alterado o status da proposta para `IN_DISPUTE`.
- `selectMediator`: Seleciona um mediador para a proposta.
  - Ao selecionar, é necessário que ambos (contrante e freelancer) selecionem o mesmo mediador para passar para o status de `IN_DISPUTE_DISTRIBUTION`.
- `setDistribution`: Define a distribuição dos valores para cada envolvido.
  - Ao definir, o status da proposta precisa estar como `IN_DISPUTE_DISTRIBUTION`.
  - Ao definir, deve ser alterado o status da proposta para `FINISHED`.
  - Ao definir, realizar a transfêrencia dos valores de acordo com a distribuição no contrato de Lances.
- `getDispute`: Retorna as informações da disputa, assim como, da distribuição.
