
BaseApi="http://localhost:3000"


// SignUp -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function Signup(){
    const username=document.getElementById("SignUpUsername").value;
    const password=document.getElementById("SignUpPassword").value;
    const name=document.getElementById("name").value;

    try{
        await axios.post(`${BaseApi}/signup`,{username,password,name});
        alert("Welcome! You are now Signed Up");
    }
    catch(err){
        console.log("The error is : ",err);
        alert("There was a problem signing You Up");
    }
    // Erased After Use 
    document.getElementById("SignUpUsername").value="";
    document.getElementById("SignUpPassword").value="";
    document.getElementById("name").value="";
}

// SignIn -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done) -(JWT) - (Second page called)
async function Signin(){
    const username=document.getElementById("SignInUsername").value;
    const password=document.getElementById("SignInPassword").value;

    try{
        const response = await axios.post(`${BaseApi}/signin`,{username,password});
        if(!response.data){
            alert("Bad Credentials");
        }
        else{
            const heading = document.getElementById("Heading");
            const formClass = document.getElementById("Form-Class");
            const pageTwo = document.getElementById("PageTwo");
            
            if(heading){
                heading.style.display="none";
            }
            else{
                console.error("heading not found.");
            }
            if(formClass){
                formClass.style.display="none";
            }
            else{
                console.error("formClass not found.");
            }            
            if(pageTwo){
                pageTwo.style.display="block";
            }
            else{
                console.error("pagetwo not found.");
            }

            localStorage.setItem("token", response.data.token);
            alert("You have been signed in successfully");
            // Display Second Page  
        }
        //function to display second part of the page declared
    }
    catch(err){
        console.log("The error is ",err);
        alert("Error signing in. Please try again.");
    }
    

}
// Done Working on  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function calltodo(){
    document.getElementById("PageTwo").style.display="none";
    document.getElementById("ThirdPage").style.display="block";
    fetchcontent();
}
// Done Working as it Should  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function AddTodoButton(){
    const description =document.getElementById("InputTodo").value.trim();

    if (!description) {
        alert("Please enter a description for the todo");
        return;
    }

    try{
       const response= await axios.post(`${BaseApi}/addtodo`,{description},{headers:{token:localStorage.getItem("token")}})
    //    console.log(response.data.todo);
        document.getElementById("InputTodo").value="";
        DisplayTodo(response.data.todo);
    }
    catch(err){
        console.error("The error is :",err);
    }
}

// --------------------------------------------------------------------------------------------------------------

//Dynamic Html -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function DisplayTodo(todo){
        const TodoContainer=document.getElementById("Todo-Container");

        // Div For Particular Todos
        const Div=document.createElement("div");
        Div.classList.add("todo-item");
        Div.setAttribute("data-id",todo._id);

        // Textarea 
        const textarea=document.createElement("textarea");
        textarea.classList.add("displaytodotextarea");
        textarea.setAttribute("id","displaytodotextarea");
        textarea.value=todo.description
        textarea.disabled=false; // Initially disable editing
        textarea.onclick=()=>EnableEdit(textarea);
        Div.appendChild(textarea);

        // Radio Button to mark that todo is completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("CompleteButton");
        checkbox.onclick = () => MarkedCompleted(todo._id, Div,textarea);
        console.log(todo._id);
        Div.appendChild(checkbox);
        

        // Delete Button to delete a todo 
        const deletebutton = document.createElement("img");
        deletebutton.src="images/TodoApp-img/delete.png";
        deletebutton.classList.add("DeleteTodoButton");
        deletebutton.setAttribute("id","DeleteTodoButton");
        deletebutton.onclick=()=>DeleteTodo(todo._id,Div);
        Div.appendChild(deletebutton);


    // Appended All to the TodoContainer
        TodoContainer.appendChild(Div);

}
// Function to mark todo completed -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function MarkedCompleted(todoId, Div,textarea) {
    console.log(todoId);
    try {
        const response = await axios.put(`${BaseApi}/completed/${todoId}`, {}, {
            headers: { token: localStorage.getItem("token") }
        });
        
        
        console.log(response.data);
        Div.style.backgroundColor="#50d300"
        textarea.style.backgroundColor = "#50d300"; 
    } catch (err) {
        console.error("Error updating todo status:", err);
    }
}

// Function to delete a todo  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function DeleteTodo(todoId, Div) {
    try {
        await axios.delete(`${BaseApi}/deletetodo/${todoId}`, {
            headers: { token: localStorage.getItem("token") }
        });

        // Remove the todo from the UI
        Div.remove();
    } catch (err) {
        console.error("Error deleting todo:", err);
    }
}

// Function to enable editing the todo description  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
function EnableEdit(textarea) {
    textarea.disabled = false; // Enable editing
    textarea.focus(); // Focus the textarea for immediate editing

    const existingSaveButton = textarea.parentElement.querySelector(".save-btn");
    if (existingSaveButton) {
        return; // If the save button already exists, don't create a new one
    }
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.classList.add("save-btn");
    saveButton.onclick= () => saveTodoUpdate(textarea);
    // saveButton.remove();

    textarea.parentElement.appendChild(saveButton);

    // Add a save button when the user starts editing

}

// Function to save the updated todo  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function saveTodoUpdate(textarea) {
    const todoId = textarea.parentElement.getAttribute("data-id");
    const description = textarea.value.trim();

    if (!description) {
        alert("Todo description cannot be empty!");
        return;
    }

    try {
        // Send the updated todo to the backend
         await axios.put(`${BaseApi}/updatetodo/${todoId}`, { description: description }, {
            headers: { token: localStorage.getItem("token") }
        });

        // Update the UI with the new description and remove the save button
        textarea.value = description;
        const saveButton = textarea.parentElement.querySelector(".save-btn");
        saveButton.remove(); // Remove the save button after saving
    } catch (err) {
        console.log("Error saving todo update:", err);
        alert("Failed to update todo. Please try again.");
    }
}

// Logout Button  -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
function Logout(){
    console.log("button is active");
    localStorage.removeItem("token");
    window.location.reload();
}


// Fetch Todo each time the user enters todo displays
async function fetchcontent(){
    const token=localStorage.getItem("token");
    try{
        const response= await axios.get(`${BaseApi}/fetchcontent`,{headers:{token:token}});
        const todos=response.data.response;
        console.log(typeof todos);
        console.log(todos);
        const TodoContainer=document.getElementById("Todo-Container");
        TodoContainer.innerHTML="";

        todos.forEach(u => {
            DisplayTodo(u)
        });
    }
    catch(error){
        console.error("The error ",error);
        alert("Unable to fetch your data");
    }
    




}
    


// Yet to be created
async function callprojectbuilder(){

}