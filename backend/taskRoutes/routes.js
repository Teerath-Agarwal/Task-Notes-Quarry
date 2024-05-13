import connection from "../database/config";

function getByUsr(req, res) {
    connection.query(
        `SELECT id, title, task, completed, deadline, priority FROM Tasks WHERE user='${req.body.user}'`,
        (err, results) => {
        if (err){
            res.status(403).send({
                verdict: 'Error fetching tasks',
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