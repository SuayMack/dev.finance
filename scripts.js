/*
   const Modal = {
      open(){
         //Abrir modal
         //Adicionar a class active ao modal
         document.querySelector('.modal-overlay').classList.add('active');
      },
      close(){
         //Fechar modal
         //Remover a classe active ao modal
         document.querySelector('.modal-overlay').classList.remove('active');
      }
   }
*/

function modal(){
   let element = document.querySelector('.modal-overlay');
   element.classList.toggle('active');
}

const Storage = {
   get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
   },

   set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
   }
}

const Transaction = {
   all: Storage.get(),

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
      Transaction.all.forEach(transaction => {
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
      tr.innerHTML = DOM.innerHtmlTransaction(transaction, index)
      tr.dataset.index = index

      DOM.transactionsContainer.appendChild(tr)
   },

   innerHtmlTransaction(transaction, index){
      const CSSclass = transaction.amount > 0 ? "income" : "expense"

      const amount = Utils.formatCurrency(transaction.amount)

      const html = `         
         <td class="description">${transaction.description}</td>
         <td class="${CSSclass}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação.">
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
   formatAmount(value){
      //value = Number(value.replace(/\,\./g, "")) * 100
      value = Number(value) * 100
      return value
   },

   formatDate(date) {
      const splittedtDate = date.split("-")
      return `${splittedtDate[2]}/${splittedtDate[1]}/${splittedtDate[0]}`
   },

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

   

   validateFields(){
      const {description, amount, date} = Form.getValues()
      if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){                 
         throw (Swal.fire({
            icon: 'error',
            title: '',
            text: 'Por favor, preencha todos os campos!',
            
          }))                       
      }
   },

   formatValues(){
      let {description, amount, date} = Form.getValues() 
      amount = Utils.formatAmount(amount)
      date = Utils.formatDate(date)
      return {
         description,
         amount,
         date
      }
   },

   clearFields(transaction){
      Form.description.value = ""
      Form.amount.value = ""
      Form.date.value = ""
   },

   submit(event){
      //verificar se todas informações foram preenchidas
      event.preventDefault()      

      try {
         Form.validateFields()
         //formatar os dados para salvar
         const transaction = Form.formatValues()
         //salvar
         Transaction.add(transaction)
         //apagar os dados do formulário
         Form.clearFields()
         //Fechar modal
         modal()
      }catch (error){
         swal({
            title:`${error.message}`,
            icon: "error",
         })
      }      
   }
}

const App = {
   init() {
      Transaction.all.forEach(DOM.addTransaction)      
      DOM.updateBalance()
      Storage.set(Transaction.all)
   },
   reload() {
      DOM.clearTransactions()
      App.init()
   },
}

App.init()



