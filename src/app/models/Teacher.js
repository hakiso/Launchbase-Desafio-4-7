const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
        SELECT teachers.*, count(students) AS total_members
        FROM teachers
        LEFT JOIN students ON (students.teacher_id = teachers.id )
        GROUP BY teachers.id
        ORDER BY total_members DESC`, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
        INSERT INTO teachers (
            avatar_url,
            name,
            birth,
            graduation,
            schooling,
            services,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `

    const values = [
        data.avatar_url,
        data.name,
        date(data.birth).iso,
        data.graduation,
        data.schooling,
        data.services,
        date(Date.now()).iso
    ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

        callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
        SELECT * 
        FROM teachers 
        WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT teachers.*, count(students) AS total_members
        FROM teachers
        LEFT JOIN students ON (students.teacher_id = teachers.id )
        WHERE teachers.name ILIKE '%${filter}%'
        OR teachers.services ILIKE '%${filter}%'
        GROUP BY teachers.id
        ORDER BY total_members DESC`, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
        UPDATE teachers SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            graduation=($4),
            schooling=($5),
            services=($6)
        WHERE id = $7
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.graduation,
            data.schooling,
            data.services,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM teachers WHERE id = $1`, [id], function(err,results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM teachers
            ) AS total`

        

        if ( filter ) {
            filterQuery  = `${query}
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.services ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM teachers
                ${filterQuery}
            )as total`  
        }

        query = `
        SELECT teachers.*, ${totalQuery}, count(students) AS total_members 
        FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        ${filterQuery}
        GROUP BY teachers.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results) {
            if (err) throw 'Database Error!'

            callback(results.rows)
        })
    }
}