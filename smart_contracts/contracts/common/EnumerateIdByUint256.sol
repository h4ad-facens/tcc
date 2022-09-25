// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract EnumerateIdByUint256 {
    /// @dev O erro emitido quando o usuário tenta acessar um index fora do tamanho da lista
    error IndexOfUintOutOfBounds();

    /// @dev A estrutura usada para mapear e atuar como uma lista de IDs
    using EnumerableSet for EnumerableSet.UintSet;

    /// @dev O mapeamento de quais IDs estão associados a um uint256
    mapping(uint256 => EnumerableSet.UintSet) internal _uint256ToIds;

    /// @dev Retorna a contagem de quantos IDs estão associados a um certo uint256
    function _getCountByUint256(uint256 targetUint256) internal view returns (uint256) {
        return _uint256ToIds[targetUint256].length();
    }

    /// @dev Retorna o ID associado a um especifico uint256 e indice
    function _getIdByUint256AndIndex(uint256 targetUint256, uint256 index) internal view returns (uint256) {
        EnumerableSet.UintSet storage userSet = _uint256ToIds[targetUint256];

        if ((index + 1) > userSet.length()) revert IndexOfUintOutOfBounds();

        return _uint256ToIds[targetUint256].at(index);
    }

    /// @dev Adiciona um novo ID a um uint256
    function _addIdToUint256(uint256 id, uint256 targetUint256) internal {
        _uint256ToIds[targetUint256].add(id);
    }
}
