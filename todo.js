//elementleri seçme
const form = document.querySelector("#todo-form") //tüm form button ve input barındırır.
const todoInput = document.querySelector("#todo") //input kısmı
const todoList= document.querySelector(".list-group") //li'lerin olduğu liste.
const firstCardBody = document.querySelectorAll(".card-body")[0] //birinci card-body
const secondCardBody = document.querySelectorAll(".card-body")[1] //ikinci card-body
const filter = document.querySelector("#filter") // arama inputu
const clearButton = document.querySelector("#clear-todos") // tümünü sil butonu.

eventListeners()

function eventListeners(){
    form.addEventListener("submit",addTodo)
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI)
    secondCardBody.addEventListener("click",deleteTodo)
    filter.addEventListener("keyup",filterTodos)
    clearButton.addEventListener("click",clearAllTodos)
}
function clearAllTodos(e){
    if(confirm("Tümünü silmek istediğinizden eminmisiniz?")){
        //Arayüzden Silme
        while(todoList.firstElementChild != null){
            todoList.firstElementChild.remove()
        }
        //Storage'dan silme
        localStorage.removeItem("todos")//todos keyinin tüm valuelarını sil.
        
    }
}
function filterTodos(e){//Todoları arama.
    const filterValue = e.target.value.toLowerCase() //Aranan kelimeyi aldık
    const listItems = document.querySelectorAll(".list-group-item")
        //Todoların olduğu tüm li-leri seçtik. 'All'!

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase()//listItem'in text değerini aldık

        //batuhan.indexOf("ba") => ba'nın geçtiği ilk yerin indexini döndürür.
        //aranan ifade yoksa -1 sonucunu döner

        if(text.indexOf(filterValue) === -1){//Bulunamadı ise
            //Bulunamayanları  görünmez yap
            listItem.setAttribute("style","display : none !important")
        }
        else{
            //Bulunanları göster.
            listItem.setAttribute("style","display : block")
        }

    })


}

function deleteTodoFromStorage(deleteTodo){//Todoları Storage'dan silme
    let todos = getTodosFromStorage()
    todos.forEach(function(todo,index){
        if(todo===deleteTodo){
            todos.splice(index,1) // Şartın sağlandığı indexden itibaren 1 tane sil.
        }

        localStorage.setItem("todos",JSON.stringify(todos))//key,todos dizisindeki değerleri JSON olarak kaydet.
    })
}

function deleteTodo(e){//İkona basıldığında todoları UI'dan silmek.
    if(e.target.className==="fa fa-remove"){
            e.target.parentElement.parentElement.remove() //fa fa-remove elementi,a elementinin ve o da li elementinin içerisinde,liste elemanını silmek için li'yi silmeliyiz.
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent) //li'nin Text'ini Storage'dan siler.
            showAlert("success","Todo Silindi!")

    }
}

function loadAllTodosToUI(e){
     //Sayfa yüklendiğinde localstoragedaki 
    //todoları yükle ve yazdır
    let  todos = getTodosFromStorage()

    todos.forEach(function(todo){
        addTodoToUI(todo)
    })
}

function getTodosFromStorage(){ 
    let todos 
    if(localStorage.getItem("todos")===null)
    {
        todos=[]
    }else{
        todos=JSON.parse(localStorage.getItem("todos"))//key'i todos olan JSON verileri parse et çek,todos dizisine yaz
    }
    return todos //todos dizisini döndür.
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage()
    todos.push(newTodo)
    localStorage.setItem("todos",JSON.stringify(todos))//key,todos dizisindeki değerleri JSON olarak kaydet.
}

function showAlert(type,message){
    const alert = document.createElement("div")
    alert.className=`alert alert-${type}`
    alert.textContent=message

    firstCardBody.appendChild(alert)

    //settimeout ile bir süre sonra silinmesi sağlandı.

    setTimeout(function(){
        alert.remove()
    },1500) //1.5 saniye bekle

}

function addTodoToUI(newTodo){
    /*<li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>*/

    

    //list item oluşturma

    const listItem = document.createElement("li")
    listItem.className="list-group-item d-flex justify-content-between"
    //Text Node Ekleme
    listItem.appendChild(document.createTextNode(newTodo))
    //link oluşturma
    const link = document.createElement("a")
    link.href="#"
    link.className="delete-item"
    link.innerHTML="<i class = 'fa fa-remove'></i>"

    //linki listItem'a ekleme
    listItem.appendChild(link)

    //ListItem'ı (yani bir todo'yu) todoList'e ekleme
    todoList.appendChild(listItem)
    todoInput.value=""
}

function addTodo(e){ //event
   let todos = getTodosFromStorage()
   const newTodo =  todoInput.value.trim()
   let contains = false
    
    todos.forEach(function(todo){
        if(todo.indexOf(newTodo) != -1){
            contains = true
        }
    })

   if(newTodo===""){
    showAlert("danger","Todo boş olamaz,lütfen bir todo ekleyin!")
    }else if(contains){
        showAlert("danger","Bu Todo zaten mevcut! ")
    }
    else{
        addTodoToUI(newTodo)
        addTodoToStorage(newTodo)
        showAlert("success","Todo Eklendi!")
}
   
   e.preventDefault()
}