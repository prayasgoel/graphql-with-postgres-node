var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const queryExecutor = require('../config/query_executor');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input UserInput {
    name: String
    age: Int
    profession: String
  }

  type User {
    id: ID!
    name: String
    age: Int
    profession: String
  }

  type Query {
    getUser(id: ID): [User]
  }

  type Mutation {
    createuser(user: UserInput): User
    updateUser(id: ID!, user: UserInput): User
  }
`);


class User {
    constructor({ id, name, age, profession }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.profession = profession;
    }
}


var getUser = async function (args) {
    //if get if in input then respond with that particular data
    if (!args.id) {
        let res = await queryExecutor.runQuery(`SELECT * from "user";`);
        let users = [];
        for (let row of res.rows) users.push(new User(row));
        return users;
    }
    let res = await queryExecutor.runQuery(`SELECT * from "user" where id = ${parseFloat(args.id)}`);
    console.log(res);
    return [new User(res.rows[0])];
}


var saveUser = async function (args) {
    let reqObj = args.input
    let query = {
        text: `insert into "user"(name, age, profession)  values($1, $2, $3) returning *;`,
        values: [
            reqObj.name,
            reqObj.age,
            reqObj.profession
        ]
    }
    let res = await queryExecutor.runQuery(query);
    return new User(res.rows[0]);
}


var updateUser = async function (args) {
    let reqObj = args.input
    let query = {
        text: `update "user" set "name" = $1, age = $2, profession = $3 where id = $4 returning *;`,
        values: [
            reqObj.name,
            reqObj.age,
            reqObj.profession,
            args.id
        ]
    }
    let res = await queryExecutor.runQuery(query);
    return new User(res.rows[0]);
}

var root = {
    getUser: getUser,
    createMessage: saveUser,
    updateMessage: updateUser,
};


module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
})