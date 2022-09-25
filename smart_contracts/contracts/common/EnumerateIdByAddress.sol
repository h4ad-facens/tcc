// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract EnumerateIdByAddress {
    /// @dev O erro emitido quando o usuário tenta acessar um index fora do tamanho da lista
    error IndexOfAddressOutOfBounds();

    /// @dev A estrutura usada para mapear e atuar como uma lista de IDs
    using EnumerableSet for EnumerableSet.UintSet;

    /// @dev O mapeamento de quais IDs estão associados a um endereço
    mapping(address => EnumerableSet.UintSet) internal _addressToIds;

    /// @dev Retorna a contagem de quantos IDs estão associados a um certo endereço
    function _getCountByAddress(address targetAddress) internal view returns (uint256) {
        return _addressToIds[targetAddress].length();
    }

    /// @dev Retorna o ID associado a um especifico endereço e indice
    function _getIdByAddressAndIndex(address targetAddress, uint256 index) internal view returns (uint256) {
        EnumerableSet.UintSet storage userSet = _addressToIds[targetAddress];

        if ((index + 1) > userSet.length()) revert IndexOfAddressOutOfBounds();

        return _addressToIds[targetAddress].at(index);
    }

    /// @dev Adiciona um novo ID a um endereço
    function _addIdToAddress(uint256 id, address targetAddress) internal {
        _addressToIds[targetAddress].add(id);
    }
}
