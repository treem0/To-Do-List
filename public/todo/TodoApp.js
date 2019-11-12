import Component from '../Component.js';
import Header from '../common/Header.js';
import Loading from '../common/Loading.js';
import AddTodo from './AddTodo.js';
import TodoList from './TodoList.js';
import { getTodos, addTodo, updateTodo, removeTodo } from '../services/todo-api.js';

class TodoApp extends Component {

    async onRender(dom) {
        const header = new Header({ title: 'My Todos' });
        dom.prepend(header.renderDOM());
        
        const main = dom.querySelector('main');
        const error = dom.querySelector('.error');

        const loading = new Loading({ loading: true });
        dom.appendChild(loading.renderDOM());

        const addToDo = new AddTodo({
            onAdd: async todo => {
                loading.update({ loading: true });
                error.textContent = '';
    
        // initial todo load:
        try {
            const saved = await addTodo(todo);

            const todos = this.state.todos;
            todos.push(saved);

            addTodo.update({ todos });
            
        }
        catch (err) {
            // display error...
            console.log(err);
        }
        finally {
            loading.update({ loading: false });
        }

    }
});

main.appendChild(addTodo.renderDOM());

const todoList = new TodoList({
    todos: [],
    onUpdate: async todo => {
        loading.update({ loading: true });
        error.textContent = '';

        try {
            const updated = await updateTodo(todo);

            const todos = this.state.todos;

            const index = todos.indexOf(todo);
            todos.splice(index, 1, updated);

            todoList.update({ todos });
        }
        catch (err) {
            console.log(err);
        }
        finally {
            loading.update({ loading: false });
        }
    },
})

    renderHTML() {
        return /*html*/`
            <div>
                <!-- header goes here -->
                <!-- show errors: -->
                <p class="error"></p>
                <main>
                    <!-- add todo goes here -->
                    <!-- todo list goes here -->
                </main>
            </div>
        `;
    }
}

export default TodoApp;