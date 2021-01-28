App = {
    loading: false,
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    contracts: {},
    loadWeb3: async () => {

        if(typeof web3!== undefined) {
            App.web3Provier = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        }
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                console.log("liad");
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },

    loadAccount : async () => {
        App.account = web3.eth.accounts[0];
        web3.eth.defaultAccount = web3.eth.accounts[0];
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3Provier);
        App.todoList = await App.contracts.TodoList.deployed();
    },

    createTask: async () => {
        App.setLoading(true);
        const content = $("#newTask").val();
        await App.todoList.createTask(content);
        window.location.reload();
    },

    render: async () => {
        if (App.loading) {
            return
          }
      
          // Update app loading state
          App.setLoading(true);
      
          // Render Account
          $('#account').html(App.account);

          await App.renderTasks();
      
          // Update loading state
          App.setLoading(false);
    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        const address = await App.todoList.address;
        console.log(address);
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
          // Fetch the task data from the blockchain
          const task = await App.todoList.tasks(i)
          const taskId = task[0].toNumber()
          const taskContent = task[1]
          const taskCompleted = task[2]
    
          // Create the html for the task
          const $newTaskTemplate = $taskTemplate.clone()
          $newTaskTemplate.find('.content').html(taskContent)
          $newTaskTemplate.find('input')
                          .prop('name', taskId)
                          .prop('checked', taskCompleted)
                          .on('click', App.toggleCompleted)
    
          // Put the task in the correct list
          if (taskCompleted) {
            $('#completedTaskList').append($newTaskTemplate)
          } else {
            $('#taskList').append($newTaskTemplate)
          }
    
          // Show the task
          $newTaskTemplate.show()
        }
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      }
}   

$(()=> {
    $(window).load( ()=>{
        App.load()
    })
})