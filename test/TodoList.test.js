const { assert } = require("chai");

const TodoList = artifacts.require("TodoList")

contract('todoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();
    });

    it('deploys successfully', async () => {
        const address = await this.todoList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it('lists tasks', async () => {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(taskCount);
 
        assert.equal(taskCount.toNumber(), task[0].toNumber());
        assert.equal(task.content, 'learn solidity');
        assert.equal(task.completed, false);
    })
})