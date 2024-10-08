// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SimpleTest {
	event Deposit(address indexed _from, bytes32 indexed _id, uint _value);

	function doAnEvent() public {
		emit Deposit(address(this), blockhash(block.number), block.number);
	}
}
