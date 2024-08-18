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
    connection.query(
        `SELECT * FROM Tasks WHERE id='${req.body.id}'`,
        (err, result) => {
        if (err){
            res.status(403).send({
                verdict: `Error fetching task: ${err}`,
                success: false,
            });
            return;
        }
        var task = result[0];
        if (task.user != req.body.user){
            res.status(403).send({
                verdict: 'Access denied. Unauthorized request.',
                success: false,
            });
            return;
        }
        Object.keys(req.body).forEach(key => {
            task.key = req.body.key;
        })
        connection.query(
            `UPDATE Tasks SET
            title = '${task.title}', task = '${task.task}', completed = '${task.completed}', deadline = '${task.deadline}', priority = '${task.priority}'
            WHERE id='${task.id}'`,
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
    connection.query(
        `SELECT user FROM Tasks WHERE id='${req.body.id}'`,
        (err, result) => {
        if (err){
            res.status(403).send({
                verdict: `Error fetching task: ${err}`,
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
            `DELETE FROM Tasks WHERE id='${req.body.id}'`,
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