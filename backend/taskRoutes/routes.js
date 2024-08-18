import connection from "../database/config.js";

function getByUsr(req, res) {
    connection.query(
        `SELECT id, title, task, completed, deadline, priority FROM Tasks WHERE user='${req.body.user}'`,
        (err, results) => {
        if (err){
            res.status(403).send({
                verdict: `Error fetching tasks: ${err}`,
                success: false,
            });
            return;
        }
        res.status(200).send({
            result: results,
            success: true,
        });
    });
}

function putByUsr(req, res) {
    const { user, title = "", task, completed = 0, deadline = "1970-01-01", priority = 0  }  = req.body;
    connection.query(`
        INSERT INTO Tasks (user, title, task, completed, deadline, priority)
        VALUES (
            '${user}', '${title}', '${task}', '${completed}', '${deadline}', '${priority}');`, 
        (err, result) => {
        if (err){
            res.status(403).send({
                verdict: `Error creating new task: ${err}`,
                success: false,
            });
            return;
        }
        res.status(200).send({
            verdict: result,
            success: true,
        });
    });
}

function updtById(req, res) {
    const taskId = parseInt(req.params.id);
    connection.query(
        `SELECT user FROM Tasks WHERE id='${taskId}'`,
        (err, result) => {
        if (err){
            res.status(403).send({
                verdict: `Error fetching task: ${err}`,
                success: false,
            });
            return;
        }
        if (result.length == 0) {
            res.status(500).send({
                verdict: `Error: Task with ID - ${taskId} does not exist`,
                success: false,
            });
            return;
        }
        if (result[0].user != req.body.user){
            res.status(403).send({
                verdict: 'Access denied. Unauthorized request.',
                success: false,
            });
            return;
        }

        let query_params = '';
        let keys = ['title', 'task', 'completed', 'deadline', 'priority'];

        keys.forEach(key => {
            if (req.body[key] !== undefined) {
                query_params += `${key} = '${req.body[key]}', `;
            }
        });

        query_params = query_params.slice(0, -2);
        connection.query(
            `UPDATE Tasks SET ${query_params} WHERE id='${taskId}'`,
            (err, result) => {
            if (err){
                res.status(403).send({
                    verdict: `Error updating task: ${err}`,
                    success: false,
                });
                return;
            }
            res.status(200).send({
                verdict: result,
                success: true,
            });
        });
    });

}

function deleteById(req, res) {
    const taskId = parseInt(req.params.id);
    connection.query(
        `SELECT user FROM Tasks WHERE id='${taskId}'`,
        (err, result) => {
        if (err){
            res.status(403).send({
                verdict: `Error fetching task: ${err}`,
                success: false,
            });
            return;
        }
        if (result.length == 0) {
            res.status(500).send({
                verdict: `Error: Task with ID - ${taskId} does not exist`,
                success: false,
            });
            return;
        }
        if (result[0].user != req.body.user){
            res.status(403).send({
                verdict: 'Access denied. Unauthorized request.',
                success: false,
            });
            return;
        }
        connection.query(
            `DELETE FROM Tasks WHERE id='${taskId}'`,
            (err, result) => {
            if (err){
                res.status(403).send({
                    verdict: `Error deleting task: ${err}`,
                    success: false,
                });
                return;
            }
            res.status(200).send({
                verdict: result,
                success: true,
            });
        });
    });
}

export { getByUsr, putByUsr, updtById, deleteById }