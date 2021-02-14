// const Modal = {
//    open(){
//       //Abrir modal
//       //Adicionar a class active ao modal
//       document.querySelector('.modal-overlay').classList.add('active');
//    },
//    close(){
//       //Fechar modal
//       //Remover a classe active ao modal
//       document.querySelector('.modal-overlay').classList.remove('active');
//    }
// }

function modal(){
   let element = document.querySelector('.modal-overlay');
   element.classList.toggle('active');
}

const Transaction = {
   all: [
      {
         description: 'Luz',
         amount: -50035,
         date: '23/01/2021',
      },
      {
         description: 'Website',
         amount: 500035,
         date: '23/01/2021',
      },
      {
         description: 'Internet',
         amount: -20031,
         date: '23/01/2021',
      },
      {
         description: 'App',
         amount: 500000,
         date: '23/01/2021',
      },
   ],

   add(transaction){
      Transaction.all.push(transaction)
      App.reload()
   },


   remove(index) {
      Transaction.all.splice(index, 1)
      App.reload()
   },

   incomes(){
      let income = 0;
      //para cada transação, 
      Transaction.all.forEach((transaction) => {
         //se a transação for maior que zero
         if(transaction.amount > 0 ){
            //somar a variável
            income += transaction.amount
         }
      })
      //e retorar a variável
      return income
   },

   expenses(){
      let expense = 0;
      //para cada transação, 
      Transaction.all.forEach(transaction => {
         //se a transação for menor que zero
         if(transaction.amount < 0 ){
            //somar a variável
            expense += transaction.amount
         }
      })
      //e retorar a variável
      return expense
   },

   total(){
      //somar entradas - saídas
      return Transaction.incomes() + Transaction.expenses()
   }

}

const DOM = {
   transactionsContainer: document.querySelector('#data-table tbody'),

   addTransaction(transaction, index){
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHtmlTransaction(transaction)

      DOM.transactionsContainer.appendChild(tr)
   },

   innerHtmlTransaction(transaction){
      const CSSclass = transaction.amount > 0 ? "income" : "expense"

      const amount = Utils.formatCurrency(transaction.amount)

      const html = `         
         <td class="description">${transaction.description}</td>
         <td class="${CSSclass}">- R$ ${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
            <img src="./assets/minus.svg" alt="Remover transação.">
         </td>
      `
      return html
   },

   updateBalance(){
      document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
      document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
      document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
   },

   clearTransactions() {
      DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
   formatCurrency(value){
      const signal = Number(value) < 0 ? "-" : ""

      value = String(value).replace(/\D/g, "")

      value = Number(value) / 100

      value = value.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"
      })

      return (signal + value)
   }
}

const Form = {
   description: document.querySelector('input#description'),
   amount: document.querySelector('input#amount'),
   date: document.querySelector('input#date'),

   getValues(){
      return {
         description: Form.description.value,
         amount: Form.amount.value,
         date: Form.date.value,
      }
   },

   formatData(){
      console.log('formatar os dados')
   },

   validateFields(){
      const {description, amount, date} = Form.getValues()

      if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
         throw new Error()
      }
      console.log(description)
   },

   submit(event){
      event.preventDefault()
      //verificar se todas informações forem preenchidas

      try {
         Form.validateFields()
         //formatar os dados para salvar
         //Form.formatData()
         //salvar
         //apagar os dados do formulário
         //modal feche
         //Atualizar a aplicação
      }catch (error){
         swal({
            title:'Por favor, preencha todos os campos',
            icon: "error",
         })
      }      
   },
}

const App = {
   init() {
      Transaction.all.forEach(transation => {
         DOM.addTransaction(transation)
      })
      
      DOM.updateBalance()

   },
   reload(){
      DOM.clearTransactions()
      App.init()
   }
}

App.init()



