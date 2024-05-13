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
    const { user, title = "", task, completed = false, deadline = "1970-01-01", priority = 0  }  = req.body;

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