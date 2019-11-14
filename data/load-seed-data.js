const client = require('../lib/client');
// import our seed data:
const todos = require('./todos');
const users = require('./users');

run();

async function run() {

    try {
        await client.connect();

        const savedUser = await Promise.all(
            users.map(async user => {
                const result = await client.query(`
                INSERT INTO users (email, hash, display_name)
                VALUES ($1, $2, $3)
                RETURNING *;
                `,
                [user]);
                return result.row[0];
            })
        );

        await Promise.all(
            todos.map(todo => {
                const user = savedUser.find(user => {
                    return user.id === todo.users;
                });
                return client.query(`
                    INSERT INTO todos (task, complete, users_id)
                    VALUES ($1, $2, $3);
                `,
                [todo.task, todo.complete, user.id]);
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}
