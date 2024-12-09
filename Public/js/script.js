
BaseApi="https://todobackendfullstack.onrender.com";
ML_Model_Url="https://16.171.135.223:5001";


function GetBackfFromTodo(){
    document.getElementById("PageTwo").style.display="block";
    document.getElementById("ThirdPage").style.display="none";

}

function GetBackFromBuilder(){
    document.getElementById("PageTwo").style.display="block";
    document.getElementById("Project-Builder").style.display="none";

}


// SignUp -(BE Done -Tested) -(FE Done -Tested) -(bcrypted) -(DB done)
async function Signup(){
    const username=document.getElementById("SignUpUsername").value;
    const password=document.getElementById("SignUpPassword").value;
    const name=document.getElementById("name").value;


    
    if (name.length < 3 || name.length > 50) {
        alert('Name must be atleast 3 character long.');
        return;
    }
    if (username.length < 3 || username.length > 50) {
        alert('Username must be atleast 3 character long.');
        return;
    }
    if (password.length < 3 || password.length > 50) {
        alert('Password must be atleast 3 character long.');
        return;
    }

    // console.log(`${username} ${password} ${name} point 1`);
    try{
        await axios.post(`${BaseApi}/signup`,{username,password,name});
        alert("Welcome! You are now Signed Up");
        // console.log("Reached till point 2")
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
async function Signin() {
    const username = document.getElementById("SignInUsername").value;
    const password = document.getElementById("SignInPassword").value;

    if (username && password) {
        try {
            const response = await axios.post(`${BaseApi}/signin`, { username, password });

            if (!response.data || !response.data.token) {
                alert("Bad Credentials");
                return;
            }

            // Store the token in localStorage
            localStorage.setItem("token", response.data.token);

            // Check if token is correctly set
            if (!localStorage.getItem("token")) {
                console.error("Token was not set in localStorage.");
                alert("Can't sign you in. Please try again.");
                return;
            }

            // Update the UI for successful login
            const heading = document.getElementById("Heading");
            const formClass = document.getElementById("Form-Class");
            const pageTwo = document.getElementById("PageTwo");

            if (heading) heading.style.display = "none";
            if (formClass) formClass.style.display = "none";
            if (pageTwo) pageTwo.style.display = "block";

            alert("You have been signed in successfully");
        } catch (err) {
            console.error("The error is:", err);
            alert("Error signing in. Please try again.");
        }
    } else {
        alert("Enter a valid username and password");
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
    document.getElementById("PageTwo").style.display="none";
    document.getElementById("Project-Builder").style.display="block";
    
    // 
    document.getElementById("priority-btn").addEventListener("click", async (event) => {
        event.preventDefault();
        const task = document.getElementById("task").value;

        try{
            const recommendpriority = await fetch(`${ML_Model_Url}/recommendpriority` , {
                method : "POST",
                headers : {"Content-Type" : "application/json" },
                body:JSON.stringify({task})
            });

            const resultpriority = await recommendpriority.json();
            document.getElementById("priority").textContent = resultpriority.priority || resultpriority.error;
        }catch(error){
            console.error("Error:" , error);
            document.getElementById("priority").textContent = "An error occured.";
        }
    }); 

// 
    document.getElementById("roadmap-btn").addEventListener("click", async (event) => {
        event.preventDefault();
        const task = document.getElementById("task").value;
        try{
            const recommendroadmap = await fetch(`${ML_Model_Url}/recommendroadmap` , {
                method : "POST",
                headers : {"Content-Type" : "application/json" },
                body:JSON.stringify({task})
            });

            const resultroadmap = await recommendroadmap.json()
            document.getElementById("roadmap").textContent = resultroadmap.roadmap || resultroadmap.error;
        }catch(error){
            console.error("Error:" , error);
            document.getElementById("priority").textContent = "An error occured.";
        }
    });

// 


// 
document.getElementById("priority-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const task = document.getElementById("task").value;

    try{
        const recommendpriority = await fetch(`${ML_Model_Url}/recommendpriority` , {
            method : "POST",
            headers : {"Content-Type" : "application/json" },
            body:JSON.stringify({task})
        });

        const resultpriority = await recommendpriority.json();
        document.getElementById("priority").textContent = resultpriority.priority || resultpriority.error;
    }catch(error){
        console.error("Error:" , error);
        document.getElementById("priority").textContent = "An error occured.";
    }
});

// 
document.getElementById("roadmap-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const task = document.getElementById("task").value;
    try{
        const recommendroadmap = await fetch(`${ML_Model_Url}/recommendroadmap` , {
            method : "POST",
            headers : {"Content-Type" : "application/json" },
            body:JSON.stringify({task})
        });

        const resultroadmap = await recommendroadmap.json()
        document.getElementById("roadmap").textContent = resultroadmap.roadmap || resultroadmap.error;
    }catch(error){
        console.error("Error:" , error);
        document.getElementById("priority").textContent = "An error occured.";
    }
});

// 

document.getElementById("module-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const task = document.getElementById("task").value;
    try{
        const recommendmodule = await fetch(`${ML_Model_Url}/recommendmodule` , {
            method : "POST",
            headers : {"Content-Type" : "application/json" },
            body:JSON.stringify({task})
        });

        const resultmodule = await recommendmodule.json()
        document.getElementById("module").textContent = resultmodule.module || resultmodule.error;
    }catch(error){
        console.error("Error:" , error);
        document.getElementById("module").textContent = "An error occured.";
    }
});

// 
document.getElementById("ask-query-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const task = document.getElementById("task").value;
    const query = document.getElementById("query").value;

    try {
        const response = await fetch(`${ML_Model_Url}/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task, query })
        });

        const result = await response.json();
        document.getElementById("response").textContent = result.recommendation || result.error;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("response").textContent = "An error occurred.";
    }
});

    
}
