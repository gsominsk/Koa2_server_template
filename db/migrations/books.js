const database = require('./../../modules/Database');

const sql = `
create table if not exists books
(
\tid int auto_increment,

\ttitle varchar(256) not null,
\tdate timestamp default current_timestamp not null,
\tautor text null,
\tdescription text null,
\timage varchar(1024) null,

\tcreated timestamp default current_timestamp null,
\tupdated timestamp default null null,
\tdeleted timestamp default null null,

\tconstraint books_pk
\t\tprimary key (id)
);
`;

module.exports = () => database.query(sql);